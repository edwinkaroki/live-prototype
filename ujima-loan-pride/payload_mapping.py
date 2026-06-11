"""Map frontend application payloads into the MEMBER_PROFILES-compatible shape.

CrewAI prompts and format_profile_for_agent() expect a specific dictionary shape.

Prototype note:
- This performs best-effort mapping.
- In production, validate strictly (Pydantic) and use a contract schema.
"""

from __future__ import annotations

from typing import Any, Dict


def map_application_to_profile(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Convert /api/apply payload to internal member_profile dict."""

    # Children fields
    children = payload.get("children", payload.get("num_children", payload.get("children_count", 0)))
    child_ages = payload.get("child_ages", payload.get("children_ages", []))

    # Loan purpose
    purpose = payload.get("purpose", payload.get("loan_purpose", ""))

    # Income fields
    income_type = payload.get("income_type", payload.get("incomePattern", "irregular"))
    peak_months = payload.get("peak_months", payload.get("peakMonths", []))
    monthly_income_kes = payload.get("monthly_income_kes", payload.get("monthlyIncomeKes", payload.get("income_kes", 0)))

    profile: Dict[str, Any] = {
        "name": payload.get("name", "Unknown"),
        "age": payload.get("age", payload.get("member_age", 0)),
        "gender": payload.get("gender", payload.get("sex", "")),
        "occupation": payload.get("occupation", "Unknown"),
        "location": payload.get("location", "Unknown"),
        "loan_amount_kes": int(payload.get("loan_amount_kes", payload.get("loanAmountKes", payload.get("loan_amount", 0))) or 0),
        "purpose": purpose,
        "children": int(children or 0),
        "child_ages": child_ages if isinstance(child_ages, list) else [],
        "monthly_income_kes": int(monthly_income_kes or 0),
        "income_type": income_type,
        "peak_months": peak_months if isinstance(peak_months, list) else [],
        "savings_balance_kes": int(payload.get("savings_balance_kes", payload.get("savings", 0)) or 0),
        "existing_loans": int(payload.get("existing_loans", payload.get("existingLoans", 0)) or 0),
        "sacco_member_months": int(payload.get("sacco_member_months", payload.get("member_months", payload.get("membership_months", 0)) ) or 0),
        # Optional SMS trigger text for ambush rules
        "member_text": payload.get("member_text", payload.get("message_text", "")),
    }

    return profile

