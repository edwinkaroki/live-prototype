"""Application orchestration helpers for /api/apply.

This is where we wire Guardrails triggers to the agent system.

Prototype behavior:
- Detect trigger keywords from member_text.
- Maintain in-memory per-member workflow flags.
- Return flags alongside the agent outputs.
"""

from __future__ import annotations

from typing import Any, Dict, Tuple

from guardrails import (
    WORKFLOW_STORE,
    normalize_member_key,
    update_state_from_member_text,
    build_trigger_context,
    enforce_sms_rate_limit,
)


def apply_ambush_logic(member_profile: Dict[str, Any], request_payload: Dict[str, Any]) -> Tuple[Dict[str, Any], Dict[str, Any]]:
    """Update workflow state based on member text and prepare context for Guardian.

    Returns:
      (state_dict, trigger_context)
    """

    key = normalize_member_key({
        "member_id": request_payload.get("member_id"),
        "phone": request_payload.get("phone"),
        "name": member_profile.get("name"),
        "location": member_profile.get("location"),
        "loan_amount_kes": member_profile.get("loan_amount_kes"),
    })

    state = WORKFLOW_STORE.get(key)

    member_text = request_payload.get("member_text") or request_payload.get("message_text") or member_profile.get("member_text") or ""

    update_state_from_member_text(state, member_text)
    sms_allowed = enforce_sms_rate_limit(state)

    trigger_ctx = build_trigger_context(state, {
        **request_payload,
        **member_profile,
        "member_text": member_text,
        "savings_balance_kes": member_profile.get("savings_balance_kes"),
    })

    # Return a serializable snapshot
    state_dict = {
        "scout_pause_all_messages": state.scout_pause_all_messages,
        "guardian_human_takeover": state.guardian_human_takeover,
        "full_system_pause": state.full_system_pause,
        "sms_count_today": state.sms_count_today,
        "sms_date_utc": state.sms_date_utc,
        "sms_allowed_today": sms_allowed,
        "sms_limit_per_day": 3,
        "last_updated": state.last_updated,
        "member_text": state.member_text,
    }

    return state_dict, trigger_ctx

