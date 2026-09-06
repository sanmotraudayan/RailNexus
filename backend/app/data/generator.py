import json
import random
from datetime import datetime, timedelta

def generate_synthetic_data():
    random.seed(42)
    
    corridors = [
        "NDLS-CNB (New Delhi - Kanpur Central)",
        "HWH-KGP (Howrah - Kharagpur)",
        "CSMT-PUNE (Mumbai CSMT - Pune)",
        "MAS-JTJ (Chennai Central - Jolarpettai)",
        "SBC-MYS (KSR Bengaluru - Mysuru)"
    ]
    
    departments = ["Engineering", "Traction", "S&T"]
    
    # 1. Users
    users = [
        {"id": "usr-1", "name": "Rajesh Sharma", "email": "planner@railnexus.gov.in", "role": "Railway Planner", "department": "Operations"},
        {"id": "usr-2", "name": "Amit Kumar", "email": "eng.lead@railnexus.gov.in", "role": "Engineering", "department": "Engineering"},
        {"id": "usr-3", "name": "Suresh Verma", "email": "traction.lead@railnexus.gov.in", "role": "Traction", "department": "Traction"},
        {"id": "usr-4", "name": "Priya Patel", "email": "st.lead@railnexus.gov.in", "role": "S&T", "department": "S&T"},
        {"id": "usr-5", "name": "Vikram Singh", "email": "supervisor@railnexus.gov.in", "role": "Maintenance Supervisor", "department": "Operations"},
        {"id": "usr-6", "name": "Admin System", "email": "admin@railnexus.gov.in", "role": "Administrator", "department": "IT"}
    ]
    
    # 2. Assets (25 assets)
    assets = []
    asset_types = {
        "Engineering": ["Switch Expansion Joint", "Turnout 1:12", "Rail Joint Track", "Ballast Bed", "Concrete Sleeper Section"],
        "Traction": ["OHE Cantilever Assembly", "Substation Transformer", "Neutral Section Insulator", "Contact Wire Segment", "Feeder Line"],
        "S&T": ["Point Machine 143B", "Axle Counter Track Circuit", "Color Light Signal #4", "Automatic Block Signaling Unit", "Interlocking Relay Panel"]
    }
    
    asset_counter = 1
    for dept, types in asset_types.items():
        for t in types:
            for corridor in corridors[:3]:
                assets.append({
                    "id": f"AST-{asset_counter:03d}",
                    "name": f"{t} ({corridor.split(' ')[0]})",
                    "type": t,
                    "department": dept,
                    "location": f"KM {random.randint(10, 400)}+{random.randint(100, 900)}m",
                    "corridor": corridor,
                    "criticality": random.choice(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
                    "condition": random.choice(["Good", "Fair", "Degraded", "Poor"]),
                    "last_maintenance": (datetime.now() - timedelta(days=random.randint(10, 90))).strftime("%Y-%m-%d"),
                    "next_maintenance": (datetime.now() + timedelta(days=random.randint(1, 14))).strftime("%Y-%m-%d"),
                    "availability": f"{random.randint(85, 99)}%",
                    "open_defects": random.randint(0, 3)
                })
                asset_counter += 1

    # 3. Maintenance Tasks (60 tasks)
    tasks = []
    task_templates = {
        "Engineering": [
            ("Rail Defect Ultrasonic Flaw Detection (USFD)", "CRITICAL", 3.0),
            ("Deep Screening of Ballast Bed", "HIGH", 4.0),
            ("Turnout Renewal & Tamping", "HIGH", 3.5),
            ("Joint De-stressing & Fastener Tightening", "MEDIUM", 2.0),
            ("Sleeper Replacement & Alignment", "MEDIUM", 2.5)
        ],
        "Traction": [
            ("OHE Height & Stagger Inspection", "HIGH", 2.0),
            ("Contact Wire Wear Measurement & Replacement", "CRITICAL", 3.5),
            ("Substation Breaker Servicing", "HIGH", 2.5),
            ("Tree Trimming near Live Traction Lines", "LOW", 1.5),
            ("Cantilever & Insulator Washing", "MEDIUM", 2.0)
        ],
        "S&T": [
            ("Track Circuit Voltage Balancing & Testing", "HIGH", 1.5),
            ("Point Machine Overhaul & Lubrication", "CRITICAL", 2.5),
            ("Signal LED Aspect Replacement", "MEDIUM", 1.0),
            ("Axle Counter Reset System Calibration", "CRITICAL", 2.0),
            ("Optical Fiber Cable Maintenance", "LOW", 3.0)
        ]
    }
    
    resources_list = [
        "Track Tamping Machine CSM 09-32",
        "OHE Tower Wagon (RU-04)",
        "S&T Testing Van & Multi-meter Rig",
        "10T Rail Crane",
        "Ballast Cleaner Machine",
        "Engineering Gang #4 (12 Workers)",
        "Traction OHE Maintenance Squad B"
    ]

    now = datetime.now()
    for i in range(1, 61):
        dept = random.choice(departments)
        template, criticality, duration = random.choice(task_templates[dept])
        matching_asset = random.choice([a for a in assets if a["department"] == dept])
        
        pref_start_hour = random.choice([2, 3, 9, 11, 14, 22, 23])
        pref_date = (now + timedelta(days=random.randint(0, 3))).strftime("%Y-%m-%d")
        deadline = (now + timedelta(days=random.randint(1, 5))).strftime("%Y-%m-%d %H:%M")
        
        severity = random.choice(["CRITICAL", "HIGH", "MEDIUM", "LOW"])
        urgency = random.choice(["CRITICAL", "HIGH", "MEDIUM", "LOW"])
        
        tasks.append({
            "id": f"TSK-{i:04d}",
            "title": f"{template} at {matching_asset['location']}",
            "asset_id": matching_asset["id"],
            "asset_name": matching_asset["name"],
            "department": dept,
            "corridor": matching_asset["corridor"],
            "location": matching_asset["location"],
            "task_type": template,
            "severity": severity,
            "criticality": criticality,
            "urgency": urgency,
            "duration": duration,
            "required_resources": random.sample(resources_list, k=random.randint(1, 2)),
            "preferred_window": f"{pref_date} {pref_start_hour:02d}:00 - {(pref_start_hour + int(duration)):02d}:00",
            "deadline": deadline,
            "priority_score": random.randint(40, 98),
            "priority_level": random.choice(["CRITICAL", "HIGH", "MEDIUM", "LOW"]),
            "priority_explanation": f"{criticality} priority task due to defect severity in high-density corridor section {matching_asset['corridor'].split(' ')[0]}.",
            "status": random.choice(["PENDING", "APPROVED", "SCHEDULED", "IN_PROGRESS"]),
            "historical_failures": random.randint(0, 5),
            "asset_availability_impact": f"{random.randint(5, 25)}%"
        })

    # 4. Trains (35 trains)
    trains = []
    train_types = ["Vande Bharat Express", "Rajdhani Express", "Shatabdi Express", "Superfast Mail", "Goods Freight Train", "Container Freight"]
    for i in range(1, 36):
        ttype = random.choice(train_types)
        is_passenger = "Freight" not in ttype
        corridor = random.choice(corridors[:3])
        dep_hour = random.randint(0, 23)
        arr_hour = (dep_hour + random.randint(2, 6)) % 24
        
        trains.append({
            "id": f"TRN-{12000 + i}",
            "number": f"{12000 + i}",
            "name": f"{ttype} {i}",
            "type": ttype,
            "is_passenger": is_passenger,
            "corridor": corridor,
            "departure": f"{dep_hour:02d}:{random.choice([0,15,30,45]):02d}",
            "arrival": f"{arr_hour:02d}:{random.choice([0,15,30,45]):02d}",
            "priority": "HIGH" if "Vande Bharat" in ttype or "Rajdhani" in ttype else ("MEDIUM" if is_passenger else "LOW"),
            "conflict_status": "NONE"
        })

    # 5. Block Availability (20 blocks)
    blocks = []
    for i in range(1, 21):
        corridor = random.choice(corridors[:3])
        start_h = random.choice([1, 2, 10, 13, 23])
        dur = random.choice([2.0, 3.0, 4.0])
        b_date = (now + timedelta(days=random.randint(0, 3))).strftime("%Y-%m-%d")
        
        blocks.append({
            "id": f"BLK-{i:03d}",
            "corridor": corridor,
            "section": f"Km {random.randint(50, 150)} - Km {random.randint(151, 250)}",
            "date": b_date,
            "start": f"{start_h:02d}:00",
            "end": f"{(start_h + int(dur)):02d}:00",
            "duration": dur,
            "availability": random.choice(["AVAILABLE", "PARTIALLY_AVAILABLE", "OCCUPIED"]),
            "existing_tasks": [],
            "train_conflict": False
        })

    # 6. Notifications
    notifications = [
        {"id": "notif-1", "title": "Critical Defect Detected", "message": "High-urgency USFD defect flagged on NDLS-CNB corridor KM 142+300m", "type": "CRITICAL", "timestamp": "10 mins ago", "read": False},
        {"id": "notif-2", "title": "Block Window Conflict", "message": "Overlap detected between Freight Train #12015 and S&T Block #BLK-004", "type": "WARNING", "timestamp": "35 mins ago", "read": False},
        {"id": "notif-3", "title": "Optimization Run Completed", "message": "Weekly block plan optimization run successfully generated 14 co-located block proposals.", "type": "INFO", "timestamp": "2 hours ago", "read": True}
    ]

    # 7. Audit Logs
    audit_logs = [
        {"id": "aud-1", "user": "Rajesh Sharma", "role": "Railway Planner", "action": "OPTIMIZATION_EXECUTED", "module": "Optimization", "description": "Ran CP-SAT solver for NDLS-CNB Corridor weekly schedule.", "timestamp": (now - timedelta(minutes=45)).strftime("%Y-%m-%d %H:%M:%S")},
        {"id": "aud-2", "user": "Amit Kumar", "role": "Engineering", "action": "MAINTENANCE_CREATED", "module": "Maintenance Requests", "description": "Created new critical USFD defect task TSK-0012.", "timestamp": (now - timedelta(hours=3)).strftime("%Y-%m-%d %H:%M:%S")}
    ]

    return {
        "users": users,
        "assets": assets,
        "maintenance_tasks": tasks,
        "trains": trains,
        "blocks": blocks,
        "notifications": notifications,
        "audit_logs": audit_logs
    }

if __name__ == "__main__":
    data = generate_synthetic_data()
    with open("seed_data.json", "w") as f:
        json.dump(data, f, indent=2)
    print("Seed data generated successfully!")
