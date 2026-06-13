# TODO - Fix dependency conflict (langchain/langsmith)

- [ ] Inspect current requirements.txt (done)
- [ ] Propose compatible version ranges for langchain / langchain-community / langsmith to remove ResolutionImpossible
- [ ] Update ujima-loan-pride/requirements.txt accordingly
- [ ] Re-run pip install -r requirements.txt in a clean venv to verify
- [ ] If still failing, pin langsmith explicitly to a version that satisfies all constraints

