"""
Ujima Loan Pride - Task Definitions
Defines tasks for Scout, Guardian, and Hunter agents
"""

from crewai import Task
import json


def create_scout_task(scout_agent, member_profile_text):
    """
    Scout Task - Analyze member financial profile
    """
    return Task(
        description=f"""Analyze this member's financial profile and prepare a plain-language summary:

{member_profile_text}

Your analysis must include:
1. Income pattern assessment (seasonal/daily/irregular)
2. Harvest cycle alignment check
3. Financial stress signals (e.g., school fees timing, loan purpose)
4. Financial literacy gaps (e.g., emergency savings, debt management)
5. Recommended repayment schedule based on income patterns
6. A warm, plain-language summary for the next officer

IMPORTANT: Speak like a trusted community elder, not a bank manager.
Always consider Kenyan harvest cycles: maize (March-May, Oct-Nov), matooke (Mar-Apr, Sep-Oct), school fees (Jan, May, Sep).

Return your analysis in this JSON format:
{{
  "member_name": "",
  "income_pattern": "",
  "harvest_alignment": "",
  "stress_signals": [],
  "literacy_gaps": [],
  "recommended_repayment_schedule": "",
  "scout_summary": ""
}}""",
        agent=scout_agent,
        expected_output="A JSON object with member analysis and recommendations",
    )


def create_guardian_task(guardian_agent, scout_output):
    """
    Guardian Task - Loan triage decision
    """
    return Task(
        description=f"""Review the Scout Agent's analysis and make a loan triage decision.

Scout Analysis:
{scout_output}

Your task:
1. Calculate a loan score (0-100) based on income vs. loan amount, savings behavior, and SACCO membership
2. Identify risk flags (if any)
3. Apply the RANK constraints:
   - AUTO APPROVE: Loan ≤ KES 15,000 AND Score ≥ 70 AND < 2 risk flags
   - ESCALATE: Loan > KES 15,000 OR Score 50-69 OR 2+ risk flags  
   - DECLINE: Score < 50 AND strong repayment concerns
4. Before deciding, ask: "Would a formal employee with identical cash flow be approved?" If yes, approve the applicant.

CRITICAL: Never use the words "unreliable", "risky", or "untrustworthy" in your output.

Return your decision in this JSON format:
{{
  "decision": "APPROVED|ESCALATED|DECLINED",
  "loan_score": 0,
  "risk_flags": [],
  "denial_reason": "",
  "approval_message": "",
  "escalation_context": ""
}}

Always include either approval_message (if approved), denial_reason (if declined), or escalation_context (if escalated).""",
        agent=guardian_agent,
        expected_output="A JSON object with loan decision and score",
    )


def create_hunter_task(hunter_agent, scout_output, guardian_output, member_profile_text):
    """
    Hunter Task - Prepare briefing packet for escalated applications
    Only executed if decision is ESCALATED
    """
    return Task(
        description=f"""Prepare a concise officer briefing packet for this escalated application.

Member Profile:
{member_profile_text}

Scout Analysis:
{scout_output}

Guardian Assessment:
{guardian_output}

Create a briefing packet that includes:
1. MEMBER SUMMARY (name, occupation, location, key context)
2. INCOME EVIDENCE (monthly income, type, peak months, patterns)
3. RISK FLAG EXPLANATIONS (what do the flags mean? Are they genuine concerns?)
4. HARVEST CALENDAR CONTEXT (when does member earn? When are expenses due?)
5. COUNTERFACTUAL ANALYSIS (What if income were 20% higher? Would this change the decision?)
6. CROSS-SELL OPPORTUNITIES:
   - School fees savings account
   - Emergency savings plan
   - Drought insurance
   - Agricultural advisory program

Format as readable text, NOT JSON.
Keep it under 300 words—readable in under 2 minutes.
Be warm and professional, reflecting Ujima SACCO's mission to serve informal traders fairly.""",
        agent=hunter_agent,
        expected_output="A formatted text briefing packet (not JSON)",
    )
