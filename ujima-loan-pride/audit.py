"""Prototype audit logging for agent decisions."""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


AUDIT_LOGS: List[Dict[str, Any]] = []


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def record_audit_event(
    agent: str,
    decision: str,
    reason: str,
    counterfactual: Optional[Dict[str, Any]] = None,
    metadata: Optional[Dict[str, Any]] = None,
) -> Dict[str, Any]:
    """Record an audit event with the required assignment fields."""
    event = {
        "agent": agent,
        "decision": decision,
        "reason": reason,
        "timestamp": _now(),
        "counterfactual": counterfactual or {},
    }
    if metadata:
        event["metadata"] = metadata
    AUDIT_LOGS.append(event)
    return event


def get_audit_logs() -> List[Dict[str, Any]]:
    return [entry.copy() for entry in AUDIT_LOGS]


def clear_audit_logs() -> None:
    AUDIT_LOGS.clear()

