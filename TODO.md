# Ujima Loan Pride — Implementation TODO

## Plan approval: YES

### Step 1 — Add backend endpoint for real applications
- [ ] Implement `POST /api/apply` in `ujima-loan-pride/api.py`
- [ ] Map incoming form payload to a `member_profile` dict compatible with `crew.py`
- [ ] Run `UjimaLoanPrideCrew.process_application()` for a single applicant
- [ ] Return scout JSON, guardian JSON, decision, and hunter briefing (if escalated)

### Step 2 — Implement Guardrails + trigger/state layer (ambush workflow)
- [ ] Add `apply_state` in-memory store (per member/session) for pauses, SMS counts, and human takeover
- [ ] Implement keyword triggers:
  - [ ] If member text mentions “loan shark” → set takeover/pause + pass to Guardian with context
  - [ ] If member text contains “No money for school fees” → include context fields when calling Guardian
- [ ] Implement workflow flags:
  - [x] Scout/Guardian/Hunter workflow flags scaffolding created in `guardrails.py` (*#700# / *#733# / *#799#*)
  - [ ] Scout sends `pause_all_messages` behavior flag (*#700#*)
  - [ ] Guardian sends human takeover flag (*#733#*)
  - [ ] Hunter/Guardian sends full system pause flag (*#799#*)
- [ ] Enforce output dignity filter (no denial messages containing banned words)

- [ ] Ensure decision value matches existing `crew.py` logic (`ESCALATED`)

### Step 3 — Update AI prompts/outputs to include spec markers
- [ ] Ensure Scout JSON includes fields for: rank calibration, trail memory architecture, hunt handoff trigger, and literacy gaps (as required)
- [ ] Ensure Guardian JSON includes explicit rank-calibration + risk flags + handoff trigger
- [ ] Ensure Hunter briefing references the handoff context

### Step 4 — Frontend: add `/apply` page with real form + “Apply Loan” buttons wired
- [ ] Create `ujima-landing/src/components/LoanApplicationForm.jsx`
- [ ] Add route `/apply` in `ujima-landing/src/App.jsx`
- [ ] Wire `Hero.jsx` “Apply for a Loan” button to navigate to `/apply`
- [ ] Wire `CTA.jsx` “Start Loan Application” button to navigate to `/apply`
- [ ] (Optional) Wire `Navbar.jsx` “Apply Now” to `/apply`

### Step 5 — Frontend integration with backend
- [ ] Form submits to `POST /api/apply`
- [ ] Render the returned assessment exactly like demo cards (scout/guardian/hunter)
- [ ] Handle loading/error states

### Step 6 — Testing
- [ ] Run backend and frontend
- [ ] Test approve/escalate/deny paths
- [ ] Verify trigger keyword behaviors and workflow flags appear in response

### Step 7 — Document usage
- [ ] Update `ujima-loan-pride/README.md` with `/apply` API contract and example payload

