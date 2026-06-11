"""Ujima Loan Pride — Guardrails, triggers, and workflow flags.

This module implements the workflow behaviors requested in the task spec.

Important:
- This is an in-memory implementation for the prototype.
- In production, persist state in a compliant store.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Any, Dict, Optional


BANNED_DENIAL_WORDS = {
    # From spec: never include these in denial messaging
    "unreliable",
    "risky",
    "untrustworthy",
    # Extra common variants (best-effort)
    "unreliable/",
}



SENSITIVE_KEYWORDS = {
    "loan_shark": re.compile(r"\blo(an)?\s*shark\b", re.IGNORECASE),
    "no_money_school_fees": re.compile(r"\bno\s+money\s+for\s+school\s+fees\b", re.IGNORECASE),
}


@dataclass
class ApplyState:
    # Workflow flags requested as explicit behaviors
    scout_pause_all_messages: bool = False  # *#700#
    guardian_human_takeover: bool = False   # *#733#
    full_system_pause: bool = False         # *#799#

    # SMS pacing simulation
    sms_count_today: int = 0
    sms_date_utc: Optional[str] = None

    # Additional context passed between agents
    member_text: str = ""
    last_updated: str = field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


class InMemoryWorkflowStore:
    def __init__(self) -> None:
        self._store: Dict[str, ApplyState] = {}

    def get(self, key: str) -> ApplyState:
        if key not in self._store:
            self._store[key] = ApplyState()
        return self._store[key]


WORKFLOW_STORE = InMemoryWorkflowStore()


def normalize_member_key(payload: Dict[str, Any]) -> str:
    """Return a stable key for tracking state.

    Prototype approach:
    - prefer member phone or member_id if present
    - else fallback to (name + location + loan_amount)
    """
    member_id = str(payload.get("member_id", "")).strip()
    if member_id:
        return member_id

    phone = str(payload.get("phone", "")).strip()
    if phone:
        return phone

    name = str(payload.get("name", "")).strip() or "unknown"
    location = str(payload.get("location", "")).strip() or "unknown"
    loan_amount = str(payload.get("loan_amount_kes", "")).strip() or "0"
    return f"{name}|{location}|{loan_amount}"


def detect_triggers(member_text: str) -> Dict[str, bool]:
    hits = {
        "loan_shark": bool(SENSITIVE_KEYWORDS["loan_shark"].search(member_text or "")),
        "no_money_school_fees": bool(
            SENSITIVE_KEYWORDS["no_money_school_fees"].search(member_text or "")
        ),
    }
    return hits


def update_state_from_member_text(state: ApplyState, member_text: str) -> ApplyState:
    triggers = detect_triggers(member_text)

    # Scout: Alert Guardian if member mentions "loan shark"
    if triggers["loan_shark"]:
        # Translate to requested workflow flags.
        # We don\'t have real SMS; mark that human takeover/pause is required.
        state.guardian_human_takeover = True

    # Scout: SMS *#700# to pause all messages
    if triggers["loan_shark"]:
        state.scout_pause_all_messages = True

    # Scout: When member SMS contains "No money for school fees" trigger Guardian
    # We represent as updated member_text; guardian will receive this context.

    state.member_text = member_text or ""
    state.last_updated = datetime.now(timezone.utc).isoformat()
    return state


def enforce_sms_rate_limit(state: ApplyState, max_per_day: int = 3) -> bool:
    """Return True if allowed to send another SMS, otherwise False."""
    today_utc = datetime.now(timezone.utc).date().isoformat()
    if state.sms_date_utc != today_utc:
        state.sms_date_utc = today_utc
        state.sms_count_today = 0

    if state.sms_count_today >= max_per_day:
        return False

    state.sms_count_today += 1
    state.last_updated = datetime.now(timezone.utc).isoformat()
    return True


def dignity_filter_denial_message(text: str) -> str:
    """Remove banned words / phrases from denial messages.

    Best-effort filter for prototype.
    """
    if not text:
        return text

    out = text
    for w in ["unreliable", "risky", "untrustworthy"]:
        out = re.sub(rf"\b{re.escape(w)}\b", "[redacted]", out, flags=re.IGNORECASE)
    return out


def build_trigger_context(state: ApplyState, payload: Dict[str, Any]) -> Dict[str, Any]:
    """Context blob to pass from Scout to Guardian."""
    # Requested context fields when "No money for school fees" appears
    triggers = detect_triggers(payload.get("member_text", ""))

    ctx: Dict[str, Any] = {}
    if triggers["no_money_school_fees"]:
        ctx = {
            "child_age": payload.get("child_age"),
            "next_harvest_date": payload.get("next_harvest_date"),
            "current_savings": payload.get("savings_balance_kes"),
        }
    return ctx

