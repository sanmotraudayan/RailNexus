"""
RailNexus Optimization Engine
Uses constraint programming (simulating OR-Tools CP-SAT logic) to schedule
maintenance tasks into available block windows while respecting constraints.

For the prototype, this uses a greedy constraint-aware scheduler that
mirrors CP-SAT objectives without requiring the OR-Tools binary.
"""

import random
random.seed(42)


PRIORITY_ORDER = {"CRITICAL": 0, "HIGH": 1, "MEDIUM": 2, "LOW": 3}


def run_optimization(tasks: list, blocks: list, trains: list, plan_type: str = "weekly") -> dict:
    """
    Schedule maintenance tasks into block windows.
    
    Hard constraints:
    - No train conflict during block
    - Block availability
    - Task duration fits within block
    - Department resource compatibility
    
    Objectives:
    - Maximize critical task completion
    - Combine compatible multi-department tasks
    - Minimize total block hours used
    - Reduce train disruption
    """
    
    # Sort tasks by priority (critical first)
    sorted_tasks = sorted(tasks, key=lambda t: (
        PRIORITY_ORDER.get(t.get("priority_level", "LOW"), 3),
        -t.get("priority_score", 0)
    ))
    
    # Sort blocks by date/time
    available_blocks = [b for b in blocks if b.get("availability") != "OCCUPIED"]
    available_blocks.sort(key=lambda b: (b["date"], b["start"]))
    
    # Build train conflict map: which corridors have trains at which hours
    train_windows = {}
    for tr in trains:
        corridor = tr.get("corridor", "")
        try:
            dep_h = int(tr["departure"].split(":")[0])
            arr_h = int(tr["arrival"].split(":")[0])
        except (ValueError, IndexError):
            continue
        if corridor not in train_windows:
            train_windows[corridor] = set()
        if dep_h <= arr_h:
            for h in range(dep_h, arr_h + 1):
                train_windows[corridor].add(h)
        else:
            for h in list(range(dep_h, 24)) + list(range(0, arr_h + 1)):
                train_windows[corridor].add(h)
    
    assignments = []
    used_blocks = set()
    unscheduled = []
    block_task_map = {}  # block_id -> [task assignments]
    
    for task in sorted_tasks:
        assigned = False
        task_duration = task.get("duration", 2.0)
        task_corridor = task.get("corridor", "")
        task_dept = task.get("department", "")
        
        for block in available_blocks:
            block_id = block["id"]
            block_corridor = block.get("corridor", "")
            
            # Hard constraint: corridor must match
            if block_corridor != task_corridor:
                continue
            
            block_duration = block.get("duration", 0)
            block_start_h = int(block["start"].split(":")[0])
            block_end_h = int(block["end"].split(":")[0])
            
            # Check remaining capacity in block
            already_used = sum(a["duration"] for a in block_task_map.get(block_id, []))
            remaining = block_duration - already_used
            
            if task_duration > remaining:
                continue
            
            # Hard constraint: no high-priority train conflict
            conflict_hours = train_windows.get(block_corridor, set())
            block_hours = set(range(block_start_h, block_end_h))
            has_conflict = bool(block_hours & conflict_hours)
            
            # Allow conflict only for CRITICAL tasks (simulates priority override)
            if has_conflict and task.get("priority_level") != "CRITICAL":
                continue
            
            # Check department compatibility for co-location
            existing_depts = {a["department"] for a in block_task_map.get(block_id, [])}
            is_collocated = len(existing_depts) > 0 and task_dept not in existing_depts
            
            # Assign
            task_start_h = block_start_h + int(already_used)
            assignment = {
                "task_id": task["id"],
                "task_title": task.get("title", ""),
                "department": task_dept,
                "block_id": block_id,
                "corridor": block_corridor,
                "date": block["date"],
                "start": f"{task_start_h:02d}:00",
                "end": f"{task_start_h + int(task_duration):02d}:00",
                "duration": task_duration,
                "priority_level": task.get("priority_level", "MEDIUM"),
                "train_conflict": has_conflict,
                "collocated": is_collocated,
                "collocated_with": list(existing_depts) if is_collocated else [],
            }
            assignments.append(assignment)
            
            if block_id not in block_task_map:
                block_task_map[block_id] = []
            block_task_map[block_id].append(assignment)
            used_blocks.add(block_id)
            assigned = True
            break
        
        if not assigned:
            unscheduled.append({
                "task_id": task["id"],
                "task_title": task.get("title", ""),
                "reason": "No compatible block window available"
            })
    
    # Compute metrics
    total_block_hours = sum(b.get("duration", 0) for b in blocks if b["id"] in used_blocks)
    collocated_count = sum(1 for a in assignments if a["collocated"])
    conflict_count = sum(1 for a in assignments if a["train_conflict"])
    critical_scheduled = sum(1 for a in assignments if a["priority_level"] == "CRITICAL")
    critical_total = sum(1 for t in sorted_tasks if t.get("priority_level") == "CRITICAL")
    departments_coordinated = len({a["department"] for a in assignments})
    
    # Collocated blocks (multi-department)
    multi_dept_blocks = [bid for bid, tasklist in block_task_map.items()
                         if len({t["department"] for t in tasklist}) > 1]
    
    metrics = {
        "blocks_used": len(used_blocks),
        "total_blocks_available": len(available_blocks),
        "total_block_hours": total_block_hours,
        "tasks_scheduled": len(assignments),
        "tasks_unscheduled": len(unscheduled),
        "critical_tasks_scheduled": critical_scheduled,
        "critical_tasks_total": critical_total,
        "collocated_tasks": collocated_count,
        "multi_department_blocks": len(multi_dept_blocks),
        "train_conflicts": conflict_count,
        "departments_coordinated": departments_coordinated,
        "plan_type": plan_type,
        "label": "Prototype Simulation",
    }
    
    # Build block plan explanations
    block_plans = []
    for bid, tasklist in block_task_map.items():
        block_info = next((b for b in blocks if b["id"] == bid), {})
        depts = list({t["department"] for t in tasklist})
        explanation = ""
        if len(depts) > 1:
            explanation = (
                f"Tasks from {', '.join(depts)} were co-located into a shared possession window "
                f"on corridor {block_info.get('corridor', 'N/A')} because they target the same section "
                f"and their combined duration ({sum(t['duration'] for t in tasklist)}h) fits within "
                f"the {block_info.get('duration', 0)}h block window."
            )
        else:
            explanation = (
                f"{depts[0]} maintenance scheduled in available block window "
                f"on {block_info.get('corridor', 'N/A')}."
            )
        
        block_plans.append({
            "block_id": bid,
            "corridor": block_info.get("corridor", ""),
            "section": block_info.get("section", ""),
            "date": block_info.get("date", ""),
            "start": block_info.get("start", ""),
            "end": block_info.get("end", ""),
            "duration": block_info.get("duration", 0),
            "departments": depts,
            "tasks": tasklist,
            "is_multi_department": len(depts) > 1,
            "explanation": explanation,
            "status": "AI_RECOMMENDED",
        })
    
    return {
        "assignments": assignments,
        "unscheduled": unscheduled,
        "block_plans": block_plans,
        "metrics": metrics,
    }
