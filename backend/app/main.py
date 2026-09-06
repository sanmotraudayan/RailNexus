from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os

app = FastAPI(title="RailNexus Prototype API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load seed data
DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "seed_data.json")
with open(DATA_PATH, "r") as f:
    DB = json.load(f)


@app.get("/")
def root():
    return {"status": "Prototype Environment — SIH 2026", "service": "RailNexus API"}


# ── Auth ──
@app.post("/api/auth/login")
def login(payload: dict):
    role = payload.get("role", "planner")
    user = next((u for u in DB["users"] if u["role"].lower().replace(" ", "_").replace("/", "_") == role or u["role"].lower().startswith(role[:4])), DB["users"][0])
    return {"token": "proto-jwt-token", "user": user}


# ── Users ──
@app.get("/api/users")
def get_users():
    return DB["users"]


# ── Assets ──
@app.get("/api/assets")
def get_assets(department: str | None = None):
    items = DB["assets"]
    if department:
        items = [a for a in items if a["department"].lower() == department.lower()]
    return items

@app.get("/api/assets/{asset_id}")
def get_asset(asset_id: str):
    return next((a for a in DB["assets"] if a["id"] == asset_id), {"error": "not found"})


# ── Maintenance Tasks ──
@app.get("/api/maintenance")
def get_maintenance(department: str | None = None, status: str | None = None):
    items = DB["maintenance_tasks"]
    if department:
        items = [t for t in items if t["department"].lower() == department.lower()]
    if status:
        items = [t for t in items if t["status"].lower() == status.lower()]
    return items

@app.get("/api/maintenance/{task_id}")
def get_maintenance_task(task_id: str):
    return next((t for t in DB["maintenance_tasks"] if t["id"] == task_id), {"error": "not found"})

@app.post("/api/maintenance")
def create_maintenance(payload: dict):
    task_id = f"TSK-{len(DB['maintenance_tasks'])+1:04d}"
    payload["id"] = task_id
    payload["status"] = "PENDING"
    DB["maintenance_tasks"].append(payload)
    return payload

@app.put("/api/maintenance/{task_id}")
def update_maintenance(task_id: str, payload: dict):
    for i, t in enumerate(DB["maintenance_tasks"]):
        if t["id"] == task_id:
            DB["maintenance_tasks"][i].update(payload)
            return DB["maintenance_tasks"][i]
    return {"error": "not found"}


# ── Trains ──
@app.get("/api/trains")
def get_trains():
    return DB["trains"]


# ── Blocks ──
@app.get("/api/blocks")
def get_blocks():
    return DB["blocks"]

@app.get("/api/blocks/{block_id}")
def get_block(block_id: str):
    return next((b for b in DB["blocks"] if b["id"] == block_id), {"error": "not found"})


# ── Priority Engine ──
@app.post("/api/priority/analyze")
def analyze_priority(payload: dict):
    """AI Priority Engine — explainable weighted scoring."""
    task_id = payload.get("task_id")
    task = next((t for t in DB["maintenance_tasks"] if t["id"] == task_id), None)
    if not task:
        return {"error": "Task not found"}

    from app.services.priority_engine import compute_priority
    result = compute_priority(task)
    
    # Update task in DB
    for i, t in enumerate(DB["maintenance_tasks"]):
        if t["id"] == task_id:
            DB["maintenance_tasks"][i]["priority_score"] = result["priority_score"]
            DB["maintenance_tasks"][i]["priority_level"] = result["priority_level"]
            DB["maintenance_tasks"][i]["priority_explanation"] = result["priority_reason"]
    
    return result

@app.post("/api/priority/analyze-all")
def analyze_all_priorities():
    from app.services.priority_engine import compute_priority
    results = []
    for i, task in enumerate(DB["maintenance_tasks"]):
        result = compute_priority(task)
        DB["maintenance_tasks"][i]["priority_score"] = result["priority_score"]
        DB["maintenance_tasks"][i]["priority_level"] = result["priority_level"]
        DB["maintenance_tasks"][i]["priority_explanation"] = result["priority_reason"]
        results.append(result)
    return {"count": len(results), "results": results}


# ── Optimization Engine ──
@app.post("/api/optimization/run")
def run_optimization(payload: dict):
    """Run CP-SAT optimization for block planning."""
    from app.services.optimization_engine import run_optimization as optimize
    corridor = payload.get("corridor")
    plan_type = payload.get("plan_type", "weekly")
    
    tasks = DB["maintenance_tasks"]
    blocks = DB["blocks"]
    trains = DB["trains"]
    
    if corridor:
        tasks = [t for t in tasks if t["corridor"] == corridor]
        blocks = [b for b in blocks if b["corridor"] == corridor]
        trains = [tr for tr in trains if tr["corridor"] == corridor]
    
    result = optimize(tasks, blocks, trains, plan_type)
    return result


# ── Plans ──
PLANS = []

@app.get("/api/plans")
def get_plans():
    return PLANS

@app.post("/api/plans")
def create_plan(payload: dict):
    plan_id = f"PLN-{len(PLANS)+1:03d}"
    payload["id"] = plan_id
    payload["status"] = "AI_RECOMMENDED"
    PLANS.append(payload)
    return payload


# ── Approvals ──
APPROVALS = []

@app.post("/api/approvals")
def create_approval(payload: dict):
    approval = {
        "id": f"APR-{len(APPROVALS)+1:03d}",
        "plan_id": payload.get("plan_id"),
        "action": payload.get("action"),  # APPROVE, MODIFY, REJECT
        "user": payload.get("user"),
        "role": payload.get("role"),
        "comment": payload.get("comment", ""),
        "timestamp": payload.get("timestamp", ""),
    }
    APPROVALS.append(approval)
    
    # Update plan status
    for p in PLANS:
        if p["id"] == payload.get("plan_id"):
            if payload["action"] == "APPROVE":
                p["status"] = "APPROVED"
            elif payload["action"] == "REJECT":
                p["status"] = "REJECTED"
            elif payload["action"] == "MODIFY":
                p["status"] = "MODIFIED"
    
    return approval

@app.get("/api/approvals")
def get_approvals():
    return APPROVALS


# ── What-If ──
@app.post("/api/whatif")
def what_if_simulation(payload: dict):
    """Run what-if scenario comparison."""
    from app.services.optimization_engine import run_optimization as optimize
    
    scenario = payload.get("scenario", {})
    corridor = payload.get("corridor")
    
    tasks = [t.copy() for t in DB["maintenance_tasks"]]
    blocks = [b.copy() for b in DB["blocks"]]
    trains = DB["trains"]
    
    if corridor:
        tasks = [t for t in tasks if t["corridor"] == corridor]
        blocks = [b for b in blocks if b["corridor"] == corridor]
        trains = [tr for tr in trains if tr["corridor"] == corridor]
    
    # Baseline
    baseline = optimize(tasks, blocks, trains, "weekly")
    
    # Apply scenario changes
    event = scenario.get("event")
    if event == "new_critical_defect":
        new_task = {
            "id": "TSK-WHATIF",
            "title": scenario.get("title", "Emergency USFD Defect"),
            "department": scenario.get("department", "Engineering"),
            "corridor": corridor or tasks[0]["corridor"] if tasks else "",
            "criticality": "CRITICAL",
            "severity": "CRITICAL",
            "urgency": "CRITICAL",
            "duration": scenario.get("duration", 2.0),
            "priority_score": 98,
            "priority_level": "CRITICAL",
            "status": "PENDING",
            "required_resources": [],
            "deadline": "",
            "asset_availability_impact": "20%",
        }
        tasks.append(new_task)
    elif event == "block_unavailable":
        block_id = scenario.get("block_id")
        blocks = [b for b in blocks if b["id"] != block_id]
    elif event == "priority_change":
        tid = scenario.get("task_id")
        for t in tasks:
            if t["id"] == tid:
                t["priority_level"] = scenario.get("new_priority", "CRITICAL")
                t["priority_score"] = 95
    
    updated = optimize(tasks, blocks, trains, "weekly")
    
    # Compare
    baseline_ids = {a["task_id"] for a in baseline.get("assignments", [])}
    updated_ids = {a["task_id"] for a in updated.get("assignments", [])}
    
    return {
        "baseline": baseline,
        "updated": updated,
        "comparison": {
            "added_tasks": list(updated_ids - baseline_ids),
            "removed_tasks": list(baseline_ids - updated_ids),
            "rescheduled_tasks": list(baseline_ids & updated_ids),
            "baseline_blocks_used": baseline.get("metrics", {}).get("blocks_used", 0),
            "updated_blocks_used": updated.get("metrics", {}).get("blocks_used", 0),
        }
    }


# ── Notifications ──
@app.get("/api/notifications")
def get_notifications():
    return DB["notifications"]


# ── Audit ──
@app.get("/api/audit")
def get_audit():
    return DB["audit_logs"]