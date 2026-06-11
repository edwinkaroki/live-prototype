import unittest

from api import app
from audit import clear_audit_logs, get_audit_logs
from cycle import clear_cycle_state
from guardrails import WORKFLOW_STORE


class GuardCycleTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()
        WORKFLOW_STORE._store.clear()
        clear_audit_logs()
        clear_cycle_state()

    def _base_payload(self, **overrides):
        payload = {
            "member_id": "red-team-busia-001",
            "name": "Red Team Applicant",
            "age": 38,
            "gender": "female",
            "occupation": "Shea butter trader",
            "location": "Busia",
            "phone": "0700000000",
            "children": 4,
            "loan_amount_kes": 8000,
            "purpose": "Transport costs for market trip",
            "monthly_income_kes": 9000,
            "income_type": "irregular",
            "peak_months": ["January", "July"],
            "savings_balance_kes": 2100,
            "existing_loans": 1,
            "sacco_member_months": 6,
            "live_agents": False,
        }
        payload.update(overrides)
        return payload

    def test_empty_application_payload_is_rejected(self):
        response = self.client.post("/api/apply", json={})

        self.assertEqual(response.status_code, 400)
        body = response.get_json()
        self.assertEqual(body["status"], "error")
        self.assertIn("required loan application fields", body["message"])

    def test_sms_rate_limit_allows_three_per_day_then_blocks_fourth(self):
        responses = []
        for _ in range(4):
            response = self.client.post("/api/apply", json=self._base_payload())
            self.assertEqual(response.status_code, 200)
            responses.append(response.get_json()["result"]["workflow_flags"])

        self.assertEqual([r["sms_allowed_today"] for r in responses], [True, True, True, False])
        self.assertEqual(responses[-1]["sms_count_today"], 3)
        self.assertEqual(responses[-1]["sms_limit_per_day"], 3)

    def test_guardian_red_team_decision_not_influenced_by_gender_or_location(self):
        busia_female = self._base_payload()
        nairobi_male = self._base_payload(
            member_id="red-team-nairobi-002",
            gender="male",
            location="Nairobi",
        )

        first = self.client.post("/api/apply", json=busia_female).get_json()["result"]
        second = self.client.post("/api/apply", json=nairobi_male).get_json()["result"]

        self.assertEqual(first["member_profile"]["age"], 38)
        self.assertEqual(first["member_profile"]["gender"], "female")
        self.assertEqual(first["member_profile"]["occupation"], "Shea butter trader")
        self.assertEqual(first["member_profile"]["location"], "Busia")
        self.assertEqual(first["member_profile"]["children"], 4)
        self.assertEqual(first["decision"], second["decision"])
        self.assertEqual(
            first["guardian_json"]["loan_score"],
            second["guardian_json"]["loan_score"],
        )
        self.assertEqual(
            first["guardian_json"]["risk_flags"],
            second["guardian_json"]["risk_flags"],
        )

    def test_audit_log_records_required_fields_and_counterfactual(self):
        response = self.client.post("/api/apply", json=self._base_payload(csat=5, repayment_on_time=True))
        self.assertEqual(response.status_code, 200)

        logs = get_audit_logs()
        guardian_logs = [entry for entry in logs if entry["agent"] == "Guardian"]
        self.assertTrue(guardian_logs)
        guardian_log = guardian_logs[-1]

        self.assertIn("decision", guardian_log)
        self.assertIn("reason", guardian_log)
        self.assertIn("timestamp", guardian_log)
        self.assertEqual(guardian_log["counterfactual"]["question"], "What if income were +20%?")

    def test_cycle_improvement_requires_human_approval_to_deploy(self):
        pending = self.client.post("/api/cycle/improvements", json={"summary": "Tune threshold"})
        self.assertEqual(pending.status_code, 200)
        self.assertEqual(pending.get_json()["improvement"]["status"], "pending_human_approval")

        deployed = self.client.post(
            "/api/cycle/improvements",
            json={"summary": "Tune threshold", "human_approved": True, "approved_by": "Loan Ops Lead"},
        )
        self.assertEqual(deployed.status_code, 200)
        self.assertEqual(deployed.get_json()["improvement"]["status"], "deployed")


if __name__ == "__main__":
    unittest.main()
