# RailNexus — AI-Powered Intelligent Block Planning for Indian Railways

> **Prototype Environment — SIH 2026 Demonstration**  
> *Disclaimer: RailNexus is a decision-support prototype powered by synthetic seed data and deterministic scheduling simulation engines. It is not connected to live Indian Railways production systems or identity providers.*

---

## 📌 Problem Statement
Indian Railways handles thousands of passenger and freight trains daily alongside critical track, overhead equipment (OHE), and signaling maintenance. Currently, block planning across Engineering (TMS), Traction (TDMS), and S&T (SMS) departments suffers from manual coordination delays, line capacity loss, and train detentions.

## 💡 Solution
**RailNexus** provides an intelligent decision-support system based on three core principles:
1. **AI determines WHAT needs attention first** (Explainable Priority Engine).
2. **Optimization determines WHEN & HOW work should be scheduled** (Deterministic Constraint-Aware Scheduler).
3. **Human planner makes the final operational decision** (Planner Approvals & Audit Governance).

---

## 🏗️ System Architecture & Technology Stack

```
   [ React 18 + TypeScript + Vite + Tailwind CSS ]
                       │ (REST APIs)
                       ▼
            [ FastAPI (Python 3.13) ]
          ┌────────────┴────────────┐
          ▼                         ▼
 [ AI Priority Engine ]   [ Constraint-Aware Scheduler ]
          │                         │
          └────────────┬────────────┘
                       ▼
       [ Persistent JSON Seed Datastore ]
```

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Indian Railways Operational Theme), Lucide Icons.
- **Backend**: Python 3.13, FastAPI, Uvicorn.
- **Datastore**: Persistent JSON Prototype Datastore (`seed_data.json` write-back persistence across sessions).
- **Optimization Engine**: Deterministic Constraint-Aware Greedy Scheduler (hard constraint enforcement and multi-department co-location packing).
- **AI Priority Engine**: Multi-factor explainable scoring model with natural language breakdown.

---

## ⚙️ Core Workflows

1. **Department Maintenance Requisition**:
   - Engineers submit requests via TMS/TDMS/SMS entry forms.
   - Request is persisted to backend datastore and automatically scored by the Priority Engine.
2. **AI Priority Scoring**:
   - Scores tasks on 6 weighted factors: Asset Criticality (25%), Defect Severity (20%), Urgency (20%), Historical Failures (10%), Deadline Proximity (15%), and Availability Impact (10%).
3. **Multi-Department Block Optimization**:
   - Groups co-located Engineering, Traction, and S&T tasks into shared possession windows.
   - Enforces train conflict avoidance and section availability constraints.
4. **Human Approval Workflow**:
   - Operational Planners review AI-recommended plans (`AI_RECOMMENDED`).
   - Planner issues `APPROVE`, `MODIFY`, or `REJECT` decision with timestamped operational comments and audit logging.
5. **What-If Scenario Simulation**:
   - Simulates emergency defects, block unavailability, or priority changes against live data without mutating approved production plans.

---

## 👥 Role-Based Access Control (6 Roles)

| Role | Key Permissions | Primary Screens |
| :--- | :--- | :--- |
| **Railway Planner / Operations Manager** | Global Planning, Optimization, Approvals, What-If, Reports | `/dashboard`, `/optimization`, `/approvals`, `/whatif`, `/reports` |
| **Engineering** | Request Maintenance, Priority Visibility, Assigned Blocks, Work Status | `/dashboard`, `/maintenance`, `/assets`, `/work-status` |
| **Traction** | Request OHE Maintenance, Priority Visibility, Assigned Blocks, Work Status | `/dashboard`, `/maintenance`, `/assets`, `/work-status` |
| **S&T** | Request Signal Maintenance, Priority Visibility, Assigned Blocks, Work Status | `/dashboard`, `/maintenance`, `/assets`, `/work-status` |
| **Maintenance Supervisor** | Assigned Task Execution, Start/Pause/Complete Work, Report Delays/Issues, Resources | `/assigned-tasks`, `/work-status`, `/resources` |
| **Administrator** | User Administration, Role Governance, Department Metadata, System Status, Audit Logs | `/users`, `/roles`, `/departments`, `/system-status`, `/settings`, `/audit` |

---

## 🚀 Local Development Setup

### 1. Backend API Server
```bash
cd backend
python -m uvicorn app.main:app --reload --port 8000
```
- Interactive API Docs: `http://localhost:8000/docs`

### 2. Frontend Development Server
```bash
cd frontend
npm install
npm run dev
```
- Open application in browser: `http://localhost:5173`

---

## 🧪 Demonstration Credentials (Prototype Login)

- **Railway Planner**: Select role `Railway Planner / Operations Manager`
- **Engineering**: Select role `Engineering`
- **Traction**: Select role `Traction`
- **S&T**: Select role `S&T`
- **Supervisor**: Select role `Maintenance Supervisor`
- **Administrator**: Select role `Administrator`

---

## 📄 Prototype Disclaimers & Limitations
- All data presented (train schedules, block windows, track assets, and defect logs) is synthetic.
- Datastore uses persistent JSON file storage for demonstration reliability.
- Optimization uses a deterministic constraint-aware scheduling algorithm.
- No live connection to CRIS, FOIS, ICMS, or production Indian Railways infrastructure.

