"""TRAIL definitions for Ujima agents.

TRAIL is the explainability contract each agent must expose:
- T: Task the agent performs
- R: Reasoning evidence it should consider
- A: Action it may take
- I: Intervention or human handoff rule
- L: Log fields required for auditability
"""

from __future__ import annotations

from typing import Dict


TRAIL_DEFINITIONS: Dict[str, Dict[str, str]] = {
    "Scout": {
        "T": "Identify financial context, stress signals, literacy gaps, and repayment timing.",
        "R": "Use income pattern, savings behavior, SACCO history, purpose, seasonal calendar, and member text.",
        "A": "Produce a plain-language profile summary and repayment recommendation.",
        "I": "Pause messaging and alert Guardian when sensitive debt or school-fee stress appears.",
        "L": "Log member summary, stress signals, literacy gaps, recommendation, and timestamp.",
    },
    "Guardian": {
        "T": "Make a fair triage decision: APPROVED, ESCALATED, or DECLINED.",
        "R": "Use cash flow, loan size, savings, membership history, existing loans, and risk flags only.",
        "A": "Return decision, score, reason, dignity-filtered message, and escalation context.",
        "I": "Escalate for human review when amount, score, risk flags, or sensitive context require it.",
        "L": "Log decision, reason, score, risk flags, counterfactual, and timestamp.",
    },
    "Hunter": {
        "T": "Prepare a concise briefing for escalated applications.",
        "R": "Use Scout analysis, Guardian decision, profile details, seasonal context, and counterfactuals.",
        "A": "Create a human officer packet without approving or declining.",
        "I": "Route the case to an officer familiar with the member context.",
        "L": "Log briefing reason, routing focus, counterfactual, and timestamp.",
    },
}


def get_trail_definitions() -> Dict[str, Dict[str, str]]:
    """Return a copy of the TRAIL definitions for API responses."""
    return {agent: fields.copy() for agent, fields in TRAIL_DEFINITIONS.items()}

