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

# Ensure required collections exist in DB
if "plans" not in DB:
    DB["plans"] = [
        { "id": "PLN-001", "block_id": "BLK-003", "corridor": "NDLS-CNB", "date": "2026-09-07", "departments": ["Engineering", "S&T"], "explanation": "Co-located Engineering and S&T tasks in shared possession window.", "status": "AI_RECOMMENDED" },
        { "id": "PLN-002", "block_id": "BLK-008", "corridor": "HWH-KGP", "date": "2026-09-08", "departments": ["Traction"], "explanation": "OHE maintenance scheduled during low-traffic window.", "status": "AI_RECOMMENDED" },
        { "id": "PLN-003", "block_id": "BLK-012", "corridor": "CSMT-PUNE", "date": "2026-09-09", "departments": ["Engineering", "Traction", "S&T"], "explanation": "All three departments co-located for maximum block utilization.", "status": "PENDING_APPROVAL" },
    ]

if "approvals" not in DB:
    DB["approvals"] = []

if "audit_logs" not in DB:
    DB["audit_logs"] = []

def save_db():
    try:
        with open(DATA_PATH, "w") as f:
            json.dump(DB, f, indent=2)
    except Exception as e:
        print(f"Error persisting datastore: {e}")

# Audit log helper
from datetime import datetime

def log_audit_event(user: str, role: str, action: str, module: str, entity_id: str, description: str):
    audit_entry = {
        "id": f"AUD-{len(DB.get('audit_logs', []))+1:04d}",
        "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        "user": user or "System User",
        "role": role or "SYSTEM",
        "action": action,
        "module": module,
        "entity_id": entity_id,
        "description": description
    }
    DB["audit_logs"].insert(0, audit_entry)
    save_db()
    return audit_entry


@app.get("/")
def root():
    return {
        "status": "Prototype Environment — SIH 2026",
        "service": "RailNexus API",
        "datastore": "Persistent JSON Prototype Datastore (Seed Data)",
        "optimization_engine": "Deterministic Constraint-Aware Scheduler"
    }


# ── Auth ──
@app.post("/api/auth/login")
def login(payload: dict):
    role = payload.get("role", "planner")
    user = next((u for u in DB["users"] if u["role"].lower().replace(" ", "_").replace("/", "_") == role or u["role"].lower().startswith(role[:4])), DB["users"][0])
    log_audit_event(user["name"], user["role"], "LOGIN", "AUTH", user["id"], f"User logged in with role {user['role']}")
    return {"token": "proto-jwt-token", "user": user}


# ── Users ──
@app.get("/api/users")
def get_users():
    return DB["users"]

@app.put("/api/users/{user_id}/status")
def update_user_status(user_id: str, payload: dict):
    for u in DB["users"]:
        if u["id"] == user_id:
            u["status"] = payload.get("status", u.get("status", "ACTIVE"))
            log_audit_event("Admin", "Administrator", "USER_STATUS_CHANGE", "ADMIN", user_id, f"User status changed to {u['status']}")
            return u
    return {"error": "User not found"}


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
    task_id = payload.get("id") or f"TSK-{len(DB['maintenance_tasks'])+1:04d}"
    payload["id"] = task_id
    if "status" not in payload:
        payload["status"] = "PENDING_APPROVAL"
    
    # Check if task already exists to prevent duplicate insertion
    existing = next((t for t in DB["maintenance_tasks"] if t["id"] == task_id), None)
    if existing:
        return existing

    # Compute priority using AI Priority Engine
    try:
        from app.services.priority_engine import compute_priority
        priority_res = compute_priority(payload)
        payload["priority_score"] = priority_res["priority_score"]
        payload["priority_level"] = priority_res["priority_level"]
        payload["priority_explanation"] = priority_res["priority_reason"]
    except Exception as e:
        print(f"Error computing priority on creation: {e}")
        
    DB["maintenance_tasks"].insert(0, payload)
    user_name = payload.get("submitted_by", "Department Officer")
    dept = payload.get("department", "Engineering")
    log_audit_event(user_name, dept, "CREATE_MAINTENANCE_REQUEST", "MAINTENANCE", task_id, f"Created task: {payload.get('title')}")
    save_db()
    return payload

@app.put("/api/maintenance/{task_id}")
def update_maintenance(task_id: str, payload: dict):
    for i, t in enumerate(DB["maintenance_tasks"]):
        if t["id"] == task_id:
            DB["maintenance_tasks"][i].update(payload)
            log_audit_event(payload.get("user", "Officer"), payload.get("role", "Engineer"), "UPDATE_TASK_STATUS", "MAINTENANCE", task_id, f"Updated task status to {payload.get('status')}")
            save_db()
            return DB["maintenance_tasks"][i]
    return {"error": "not found"}

@app.post("/api/maintenance/{task_id}/work-status")
def update_work_status(task_id: str, payload: dict):
    action = payload.get("action", "UPDATE") # START, PAUSE, RESUME, COMPLETE, REPORT_DELAY, REPORT_ISSUE
    user_name = payload.get("user", "Supervisor")
    role = payload.get("role", "Maintenance Supervisor")
    notes = payload.get("notes", "")

    status_map = {
        "START": "IN_PROGRESS",
        "PAUSE": "PAUSED",
        "RESUME": "IN_PROGRESS",
        "COMPLETE": "COMPLETED",
        "REPORT_DELAY": "DELAYED",
        "REPORT_ISSUE": "ISSUE_REPORTED"
    }
    
    new_status = status_map.get(action, payload.get("status", "IN_PROGRESS"))
    
    for i, t in enumerate(DB["maintenance_tasks"]):
        if t["id"] == task_id:
            DB["maintenance_tasks"][i]["status"] = new_status
            if notes:
                DB["maintenance_tasks"][i]["work_notes"] = notes
            log_audit_event(user_name, role, f"WORK_{action}", "SUPERVISOR", task_id, f"Work action {action} applied to {task_id}. Notes: {notes}")
            save_db()
            return DB["maintenance_tasks"][i]
    return {"error": "Task not found"}


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
    
    log_audit_event("AI Engine", "SYSTEM", "PRIORITY_ANALYSIS", "PRIORITY", task_id, f"Calculated priority score: {result['priority_score']} ({result['priority_level']})")
    save_db()
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
    log_audit_event("AI Engine", "SYSTEM", "PRIORITY_ANALYSIS_ALL", "PRIORITY", "ALL", f"Analyzed priorities for {len(results)} tasks")
    save_db()
    return {"count": len(results), "results": results}


# ── Optimization Engine ──
@app.post("/api/optimization/run")
def run_optimization(payload: dict):
    """Run constraint-aware optimization for block planning."""
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
    
    # Save plan to DB["plans"] list if generated
    if result.get("block_plans"):
        for bp in result["block_plans"]:
            if not any(p["id"] == bp["block_id"] or p.get("block_id") == bp["block_id"] for p in DB["plans"]):
                plan_item = {
                    "id": f"PLN-{len(DB['plans'])+1:03d}",
                    "block_id": bp["block_id"],
                    "corridor": bp["corridor"],
                    "date": bp["date"],
                    "departments": bp["departments"],
                    "explanation": bp["explanation"],
                    "status": "AI_RECOMMENDED",
                    "tasks": bp["tasks"],
                }
                DB["plans"].append(plan_item)
                
    log_audit_event("Optimization Engine", "SYSTEM", "OPTIMIZATION_RUN", "OPTIMIZATION", corridor or "ALL", f"Ran optimization for {plan_type} plan: {result['metrics']['tasks_scheduled']} tasks scheduled")
    save_db()
    return result


# ── Plans ──
@app.get("/api/plans")
def get_plans():
    return DB.get("plans", [])

@app.post("/api/plans")
def create_plan(payload: dict):
    plan_id = f"PLN-{len(DB.get('plans', []))+1:03d}"
    payload["id"] = plan_id
    payload["status"] = "AI_RECOMMENDED"
    if "plans" not in DB:
        DB["plans"] = []
    DB["plans"].append(payload)
    save_db()
    return payload


# ── Approvals ──
@app.post("/api/approvals")
def create_approval(payload: dict):
    if "approvals" not in DB:
        DB["approvals"] = []

    approval = {
        "id": f"APR-{len(DB['approvals'])+1:03d}",
        "plan_id": payload.get("plan_id"),
        "action": payload.get("action"),  # APPROVE, MODIFY, REJECT
        "user": payload.get("user", "Unknown Officer"),
        "role": payload.get("role", "Operations"),
        "comment": payload.get("comment", ""),
        "timestamp": payload.get("timestamp") or datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    }
    DB["approvals"].insert(0, approval)
    
    # Update plan status in DB["plans"]
    for p in DB.get("plans", []):
        if p["id"] == payload.get("plan_id") or p.get("block_id") == payload.get("plan_id"):
            if payload["action"] == "APPROVE":
                p["status"] = "APPROVED"
            elif payload["action"] == "REJECT":
                p["status"] = "REJECTED"
            elif payload["action"] == "MODIFY":
                p["status"] = "MODIFIED"
    
    log_audit_event(approval["user"], approval["role"], f"PLAN_{approval['action']}", "APPROVALS", approval["plan_id"], f"Action {approval['action']} taken on plan {approval['plan_id']}. Comment: {approval['comment']}")
    save_db()
    return approval

@app.get("/api/approvals")
def get_approvals():
    return DB.get("approvals", [])


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
            "corridor": corridor or (tasks[0]["corridor"] if tasks else ""),
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
    
    log_audit_event(payload.get("user", "Planner"), "Planner", "WHAT_IF_SIMULATION", "WHAT_IF", event or "CUSTOM", f"Executed what-if simulation for event: {event}")
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
    return DB.get("audit_logs", [])