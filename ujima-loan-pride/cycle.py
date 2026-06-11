"""CYCLE learning engine for prototype metrics and improvements.

CYCLE tracks feedback metrics, generates weekly insights, and requires a
human approval gate before any improvement is marked as deployed.
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


CYCLE_EVENTS: List[Dict[str, Any]] = []
CYCLE_IMPROVEMENTS: List[Dict[str, Any]] = []


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def record_cycle_event(
    decision: str,
    csat: Optional[float] = None,
    repayment_on_time: Optional[bool] = None,
    escalated: Optional[bool] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    event = {
        "decision": decision,
        "csat": csat,
        "repayment_on_time": repayment_on_time,
        "escalated": bool(escalated if escalated is not None else decision == "ESCALATED"),
        "timestamp": _now(),
    }
    if metadata:
        event["metadata"] = metadata
    CYCLE_EVENTS.append(event)
    return event


def get_cycle_metrics() -> Dict[str, Any]:
    total = len(CYCLE_EVENTS)
    csat_values = [float(e["csat"]) for e in CYCLE_EVENTS if e.get("csat") is not None]
    repayment_values = [e for e in CYCLE_EVENTS if e.get("repayment_on_time") is not None]
    escalations = [e for e in CYCLE_EVENTS if e.get("escalated")]

    return {
        "applications_tracked": total,
        "csat_average": round(sum(csat_values) / len(csat_values), 2) if csat_values else None,
        "repayment_rate": round(
            sum(1 for e in repayment_values if e["repayment_on_time"]) / len(repayment_values),
            2,
        ) if repayment_values else None,
        "escalation_rate": round(len(escalations) / total, 2) if total else 0,
    }


def generate_weekly_insights() -> Dict[str, Any]:
    metrics = get_cycle_metrics()
    insights: List[str] = []

    if metrics["applications_tracked"] == 0:
        insights.append("No application outcomes have been recorded this week.")
    if metrics["csat_average"] is not None and metrics["csat_average"] < 4:
        insights.append("CSAT is below target; review message clarity and dignity-filter language.")
    if metrics["repayment_rate"] is not None and metrics["repayment_rate"] < 0.85:
        insights.append("Repayment rate is below target; test tighter harvest-aligned schedules.")
    if metrics["escalation_rate"] > 0.35:
        insights.append("Escalation rate is high; review Guardian thresholds and Scout evidence quality.")
    if not insights:
        insights.append("CYCLE metrics are within the prototype target range.")

    return {
        "period": "weekly",
        "generated_at": _now(),
        "metrics": metrics,
        "insights": insights,
        "human_approval_required_before_deployment": True,
    }


def propose_cycle_improvement(summary: str, approved_by: Optional[str] = None) -> Dict[str, Any]:
    status = "deployed" if approved_by else "pending_human_approval"
    improvement = {
        "summary": summary,
        "status": status,
        "approved_by": approved_by,
        "created_at": _now(),
        "deployed_at": _now() if approved_by else None,
    }
    CYCLE_IMPROVEMENTS.append(improvement)
    return improvement


def get_cycle_improvements() -> List[Dict[str, Any]]:
    return [entry.copy() for entry in CYCLE_IMPROVEMENTS]


def clear_cycle_state() -> None:
    CYCLE_EVENTS.clear()
    CYCLE_IMPROVEMENTS.clear()

