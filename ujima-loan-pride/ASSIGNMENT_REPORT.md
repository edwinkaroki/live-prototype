# Ujima Assignment Report

Generated: 2026-06-11

## Files Changed

- `agents.py` - added explicit TRAIL definitions to live agent prompts and normalized prompt text.
- `api.py` - exposed TRAIL, audit, and CYCLE endpoints; added counterfactual audit logging; added CYCLE metric recording and human approval gate; made log-file locking non-fatal.
- `application_flow.py` - wired `enforce_sms_rate_limit()` into the `/api/apply` application flow.
- `payload_mapping.py` - preserved `gender` in the internal profile for red-team testing and transparency.
- `trail.py` - added shared T, R, A, I, L definitions for Scout, Guardian, and Hunter.
- `audit.py` - added prototype audit event store with agent, decision, reason, timestamp, and counterfactual fields.
- `cycle.py` - added prototype CYCLE engine for CSAT, repayment rate, escalation rate, weekly insights, and approval-gated improvements.
- `tests/test_guard_cycle.py` - added focused tests for SMS rate limiting, Busia red-team fairness, audit counterfactuals, and CYCLE approval gating.
- `ASSIGNMENT_REPORT.md` - this report.

## Rubric Status

- RANK: Satisfied for the deterministic demo path. Guardian scoring applies amount, score, and risk-flag thresholds and excludes gender/location from scoring.
- TRAIL: Satisfied. Explicit T, R, A, I, L definitions exist in code, agent prompts, `/api/trail`, `/api/config`, and `/api/apply` responses.
- HUNT: Satisfied for escalations. Hunter briefings remain human-in-the-loop only and include counterfactual context when generated.
- GUARD: Satisfied for this prototype. `enforce_sms_rate_limit()` is called in the application flow, and tests verify the fourth SMS attempt in a day is blocked after the 3 SMS/day limit.
- CYCLE: Satisfied for this prototype. The engine tracks CSAT, repayment rate, escalation rate, emits weekly insights, and blocks improvement deployment unless a named human approval is supplied.

## Remaining Gaps

- State is in memory only. Audit logs, workflow SMS counts, and CYCLE metrics reset when the API process restarts.
- The live CrewAI path depends on LLM output quality; the deterministic demo path has stronger test coverage than live agent responses.
- Repayment and CSAT inputs are accepted when supplied, but there is no production feedback ingestion pipeline yet.
- Human approval is represented by `human_approved` plus `approved_by`; it is not yet backed by authentication or role-based access control.
- Broad `compileall` over the full project was noisy because it traversed `.venv` templates and locked `__pycache__` files. Project-only AST parsing passed.

## Verification

- Passed: `.\\.venv\\Scripts\\python.exe -m unittest discover -s tests -v`
- Passed: project-only AST parse for changed source and test files.
