"""
RailNexus AI Priority Engine
Explainable weighted scoring for maintenance task prioritization.
"""

from datetime import datetime, timedelta

# Weights for priority scoring
WEIGHTS = {
    "asset_criticality": 0.25,
    "defect_severity": 0.20,
    "urgency": 0.20,
    "historical_failures": 0.10,
    "deadline_proximity": 0.15,
    "availability_impact": 0.10,
}

LEVEL_SCORES = {
    "CRITICAL": 100,
    "HIGH": 75,
    "MEDIUM": 50,
    "LOW": 25,
}


def compute_priority(task: dict) -> dict:
    """
    Compute a weighted priority score for a maintenance task.
    Returns score, level, reason, and contributing factors.
    """
    factors = {}

    # 1. Asset criticality
    crit = task.get("criticality", "MEDIUM")
    crit_score = LEVEL_SCORES.get(crit, 50)
    factors["asset_criticality"] = {"value": crit, "score": crit_score, "weight": WEIGHTS["asset_criticality"]}

    # 2. Defect severity
    sev = task.get("severity", "MEDIUM")
    sev_score = LEVEL_SCORES.get(sev, 50)
    factors["defect_severity"] = {"value": sev, "score": sev_score, "weight": WEIGHTS["defect_severity"]}

    # 3. Urgency
    urg = task.get("urgency", "MEDIUM")
    urg_score = LEVEL_SCORES.get(urg, 50)
    factors["urgency"] = {"value": urg, "score": urg_score, "weight": WEIGHTS["urgency"]}

    # 4. Historical failures
    hist = task.get("historical_failures", 0)
    hist_score = min(hist * 20, 100)
    factors["historical_failures"] = {"value": hist, "score": hist_score, "weight": WEIGHTS["historical_failures"]}

    # 5. Deadline proximity
    deadline_str = task.get("deadline", "")
    if deadline_str:
        try:
            deadline = datetime.strptime(deadline_str, "%Y-%m-%d %H:%M")
            hours_remaining = max((deadline - datetime.now()).total_seconds() / 3600, 0)
            if hours_remaining <= 24:
                dl_score = 100
            elif hours_remaining <= 48:
                dl_score = 85
            elif hours_remaining <= 72:
                dl_score = 60
            else:
                dl_score = 30
        except ValueError:
            dl_score = 50
            hours_remaining = 999
    else:
        dl_score = 50
        hours_remaining = 999
    factors["deadline_proximity"] = {"value": f"{hours_remaining:.0f}h remaining", "score": dl_score, "weight": WEIGHTS["deadline_proximity"]}

    # 6. Asset availability impact
    impact_str = task.get("asset_availability_impact", "10%")
    try:
        impact_val = int(impact_str.replace("%", ""))
    except (ValueError, AttributeError):
        impact_val = 10
    impact_score = min(impact_val * 4, 100)
    factors["availability_impact"] = {"value": impact_str, "score": impact_score, "weight": WEIGHTS["availability_impact"]}

    # Weighted total
    total = sum(factors[k]["score"] * factors[k]["weight"] for k in factors)
    total = round(total, 1)

    # Determine level
    if total >= 80:
        level = "CRITICAL"
    elif total >= 60:
        level = "HIGH"
    elif total >= 40:
        level = "MEDIUM"
    else:
        level = "LOW"

    # Build explanation
    top_factors = sorted(factors.items(), key=lambda x: x[1]["score"] * x[1]["weight"], reverse=True)
    top_names = [f.replace("_", " ") for f, _ in top_factors[:3]]
    reason = (
        f"{level} because the task scores {total}/100 driven primarily by "
        f"{top_names[0]} ({top_factors[0][1]['value']}), "
        f"{top_names[1]} ({top_factors[1][1]['value']}), and "
        f"{top_names[2]} ({top_factors[2][1]['value']})."
    )

    return {
        "task_id": task.get("id"),
        "priority_score": total,
        "priority_level": level,
        "priority_reason": reason,
        "contributing_factors": factors,
    }
