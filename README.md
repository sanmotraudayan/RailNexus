# RailNexus — AI-Powered Intelligent Block Planning for Indian Railways

---

## 📌 Executive Summary

**RailNexus** is an enterprise-grade intelligent decision-support platform designed to solve the critical operational bottleneck of railway maintenance block allocation. By harmonizing track maintenance urgency with train schedule impacts, RailNexus optimizes track window allocation to maximize infrastructure safety while minimizing throughput loss and passenger delays.

---

## 🛠️ Key Features & Modules

1. **6-Role Governance System**:
   - `ROLE_OPT`: Sectional Controller / Block Planner (Master Schedule & Optimization)
   - `ROLE_ENG`: Track / Works Engineer (Maintenance Requests & Co-location)
   - `ROLE_SIG`: Signal & Telecom Engineer (S&T Maintenance & Asset Health)
   - `ROLE_TRD`: Traction Distribution / OHE Engineer (Power Block Scheduling)
   - `ROLE_DOM`: Division Operations Manager (Strategic Approvals & What-If Analysis)
   - `ROLE_ADM`: System Administrator (System Governance & Audit Trail)

2. **AI Priority Engine (XAI Scoring)**:
   - Multi-factor risk model: `Urgency (30%)`, `Asset Health (25%)`, `Traffic Impact (25%)`, `Resource Availability (20%)`.
   - Explainable AI breakdown with natural language reasoning for every score.

3. **Intelligent Optimization Engine**:
   - Constraint-based window packing algorithm.
   - Spatial-temporal co-location (grouping Track, S&T, and OHE maintenance into a single block window).
   - Generates actionable co-location savings metrics (% delay reduction, block efficiency gains).

4. **What-If Scenario Simulation**:
   - Interactive conflict resolution comparing Baseline vs Simulated scenarios.
   - Dynamic parameter adjustments (Delay tolerance, Window extension, Co-location priority).
   - Visual before-and-after metric comparison.

5. **Operational Dashboards & Workflow Governance**:
   - Role-specific KPI metrics and action consoles.
   - Approve / Modify / Reject workflow with audit logging.
   - Comprehensive Reports & KPIs comparison module.

---

## 🏗️ Architecture & Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS (Custom Govt. Operations Theme), Lucide Icons.
- **Backend**: Python 3.13, FastAPI, Pydantic v2, Uvicorn.
- **Design System**: Strict Indian Railways Operational Aesthetic (Deep Navy `#0A192F`, Railway Grey `#F4F6F9`, Saffron & Green Accent Stripes).

---

## 🚀 Running the Prototype Locally

### 1. Backend Setup
```bash
cd backend
# Run FastAPI Backend with Uvicorn
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs will be available at: `http://localhost:8000/docs`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
- Application will open at: `http://localhost:5173`

---

## 🧪 Demo Credentials (Prototype Access)

| Role | Username | Password | Access / Primary Screen |
| :--- | :--- | :--- | :--- |
| Block Planner | `planner` | `demo123` | Master Scheduling & Optimization |
| Track Engineer | `engineer` | `demo123` | Maintenance Requests & Priority |
| Signal Engineer | `signal` | `demo123` | S&T Maintenance & Assets |
| Traction Engineer | `ohe` | `demo123` | OHE Power Blocks & Assets |
| Division Manager | `dom` | `demo123` | Strategic Approvals & What-If |
| System Admin | `admin` | `demo123` | Governance & Audit Logs |

---

## 📄 Compliance & Prototype Disclaimer
RailNexus operates purely on synthetic simulation data for demonstration purposes during SIH 2026 evaluation.
