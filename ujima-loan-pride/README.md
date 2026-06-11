# 🦁 Ujima Loan Pride — Multi-Agent AI Loan Assessment System

**A fair, transparent, AI-powered loan decision system for Kenyan SACCO informal traders.**

Ujima Loan Pride is a CrewAI multi-agent application designed to help Savings and Credit Cooperative Organizations (SACCOs) serve informal traders—market vendors, subsistence farmers, and small business owners—with fair, bias-free loan assessments.

---

## 📋 Project Overview

### Problem

Informal traders in Kenya face barriers to fair credit access:
- Limited formal income documentation
- Seasonal earning patterns misunderstood by conventional risk models
- Gender and location bias in lending decisions
- Lack of cultural understanding of informal trade cash flows

### Solution

**Ujima Loan Pride** uses a 3-agent CrewAI system to:

1. **Scout Agent**: Understands Kenyan agricultural cycles and informal income patterns
2. **Guardian Agent**: Applies fair lending principles (RANK constraints) without bias
3. **Hunter Agent**: Prepares detailed briefings for human loan officers

The system operates with **RANK constraints**—an ethical guardrail that ensures consistency and fairness.

---

## 🏗️ Architecture

### The Three Agents

#### 🔍 Scout Agent — Financial Literacy Coach

**Role:** Analyze member financial profiles against Kenyan harvest cycles.

**Key Responsibilities:**
- Assess income patterns (seasonal/daily/irregular)
- Map income to harvest cycles:
  - Matooke: March/April, September/October
  - Maize: March–May (long rains), October–November (short rains)
  - School fees pressure: January, May, September
- Identify financial stress signals
- Detect literacy gaps (emergency savings, debt management)
- Recommend repayment schedules aligned with income patterns

**Output:** JSON analysis with member summary and recommendations

---

#### ⚖️ Guardian Agent — Fair Loan Screening Officer

**Role:** Screen for genuine financial risk only—never for demographic factors.

**Key Principles:**
- ❌ NEVER penalize: informal occupations, gender, or rural location
- ❌ NEVER use words: "unreliable", "risky", "untrustworthy"
- ✅ ALWAYS apply: **Formal Employee Fairness Test**
  > Would a formal employee with identical cash flow be approved? If yes, approve this applicant too.

**Decision Rules (RANK Constraints):**

| Scenario | Decision | Criteria |
|----------|----------|----------|
| **Auto Approve** | ✓ APPROVED | Loan ≤ KES 15,000 AND Score ≥ 70 AND < 2 risk flags |
| **Escalate** | ⚠ ESCALATED | Loan > KES 15,000 OR Score 50–69 OR 2+ risk flags |
| **Decline** | ✗ DECLINED | Score < 50 AND strong repayment concerns |

**Output:** JSON decision with loan score (0-100) and risk flags

---

#### 📝 Hunter Agent — Officer Briefing Coordinator

**Role:** Prepare escalated applications for human loan officer review.

**Key Responsibilities:**
- Generate concise briefing packets (< 2 minutes to read)
- Explain risk flags in context
- Provide counterfactual analysis: "What if income were 20% higher?"
- Suggest cross-sell opportunities:
  - School fees savings account
  - Emergency savings plan
  - Drought insurance
  - Agricultural advisory program
- Route applications to officers familiar with relevant sectors

**Output:** Formatted text briefing (not JSON)

---

### Agent Interaction Flow

```
┌──────────────────────────────────┐
│     Member Application           │
└──────────────┬───────────────────┘
               │
               ▼
        ┌─────────────────┐
        │  Scout Agent    │
        │  (Analyze)      │
        └────────┬────────┘
                 │
                 ▼
    ┌────────────────────────┐
    │  Guardian Agent        │
    │  (Decision: A/E/D)     │
    └────────┬───────────────┘
             │
             ├─► APPROVED ───────► ✓ LOAN APPROVED
             │
             ├─► ESCALATED ─┐
             │              │
             │              ▼
             │        ┌──────────────────┐
             │        │  Hunter Agent    │
             │        │  (Briefing)      │
             │        └──────────────────┘
             │              │
             │              ▼
             │        📋 OFFICER BRIEFING
             │
             └─► DECLINED ─────────► ✗ DECLINED
```

---

## 🚀 Installation & Setup

### Prerequisites

- Python 3.10 or higher
- Verify your Python version:

```bash
python --version
```
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Step 1: Clone or Navigate to Project

```bash
cd ujima-loan-pride
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure API Key

Copy `.env.example` to `.env` and add your Google Gemini API key:

```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

Your `.env` file should look like:

```env
GEMINI_API_KEY=your_actual_api_key_here
```

### Step 4: Run the Application

You can run the CLI version:

```bash
python main.py
```

Or launch the app-like UI:

```bash
python app.py
```

The application will process all three member profiles and display:
- ✓ Scout analysis for each member
- ✓ Guardian decision with loan score
- ✓ Hunter briefing packet (if escalated)
- ✓ Summary results table

---

## 📊 Example Output

```
🦁 UJIMA LOAN PRIDE — Multi-Agent Loan Assessment System
Fair lending for Kenyan SACCO informal traders
======================================================================

⚙️  Processing: Grace Akinyi
────────────────────────────────

📋 Scout Agent Analysis
  • Income Pattern: Seasonal (peaks October-November)
  • Harvest Alignment: Strong alignment with maize harvest cycle
  • Recommended Repayment: Quarterly, starting December after harvest

⚖️  Guardian Decision
  • Loan Score: 68/100
  • Risk Flags: Seasonal income concentration
  ⚠ DECISION: ESCALATED
  • Context: Loan exceeds KES 15,000 threshold; seasonal pattern needs officer review

📝 Officer Briefing Packet
[Detailed briefing with harvest calendar context, counterfactual analysis, and cross-sell opportunities]
```

---

## 👥 Mock Member Profiles

The system includes three example members:

### Profile 1: Grace Akinyi

- **Occupation:** Maize farmer (Kakamega, Western Kenya)
- **Monthly Income:** KES 12,000 (seasonal)
- **Loan Request:** KES 28,000 (school fees)
- **SACCO Member Since:** 18 months ago
- **Savings:** KES 4,500
- **Scenario:** Parent struggling with school fees during off-season

### Profile 2: Amina Hassan

- **Occupation:** Market vendor—vegetables (Gikomba Market, Nairobi)
- **Monthly Income:** KES 18,000 (daily cash flow)
- **Loan Request:** KES 12,000 (stock purchase before Ramadan)
- **SACCO Member Since:** 9 months ago
- **Savings:** KES 8,200
- **Scenario:** Trader capitalizing on seasonal buying opportunity

### Profile 3: Zawadi Ochieng

- **Occupation:** Shea butter trader (Busia County)
- **Monthly Income:** KES 9,000 (irregular)
- **Loan Request:** KES 8,000 (transport for market trip)
- **SACCO Member Since:** 6 months ago
- **Existing Loans:** 1
- **Savings:** KES 2,100
- **Scenario:** New trader with limited savings and existing debt

---

## ➕ Adding New Member Profiles

### Option 1: Edit `profiles.py`

Add entries to the `MEMBER_PROFILES` list:

```python
MEMBER_PROFILES = [
    {
        "name": "Your Member Name",
        "age": 35,
        "occupation": "Your Occupation",
        "location": "Your Location, Kenya",
        "loan_amount_kes": 25000,
        "purpose": "Your Purpose",
        "children": 2,
        "child_ages": [5, 10],
        "monthly_income_kes": 15000,
        "income_type": "seasonal|daily_cash|irregular",
        "peak_months": ["January", "July"],
        "savings_balance_kes": 5000,
        "existing_loans": 0,
        "sacco_member_months": 12
    },
    # ... more profiles
]
```

### Option 2: Modify `main.py` Dynamically

```python
from crew import UjimaLoanPrideCrew

new_profile = {
    "name": "John Kipchoge",
    "age": 45,
    # ... other fields
}

crew = UjimaLoanPrideCrew(llm)
result = crew.process_application(new_profile)
```

---

## ⚖️ Ethical Framework & RANK Constraints

### RANK Constraints Explained

**RANK** = Responsible, Accessible, Non-discriminatory, Kenya-aware

1. **Responsible:** Loans sized to proven income and savings capacity
2. **Accessible:** Low barriers to entry (≤ KES 15,000 auto-approved if qualified)
3. **Non-discriminatory:** No bias by gender, occupation type, or location
4. **Kenya-aware:** Respect seasonal income, harvest cycles, cultural norms

### Formal Employee Fairness Test

Every Guardian decision asks: **"Would this applicant be approved if they were a formal employee with identical cash flow?"**

- If YES → Approve the informal trader
- If NO → Escalate or decline with clear reasoning

This ensures informal traders aren't held to unfairly strict standards.

---

## 🏦 How This Maps to Real SACCO Workflows

### Current SACCO Process (Manual)

```
Member Application
    ↓
Loan Officer Reviews
    ↓
Committee Decision
    ↓
Member Notified
```

### Ujima Loan Pride Process (AI-Assisted)

```
Member Application
    ↓
Scout Agent: Financial Analysis (< 1 min)
    ↓
Guardian Agent: Loan Decision (< 1 min)
    ↓
IF ESCALATED:
  Hunter Agent: Officer Briefing Prepared
    ↓
  Human Loan Officer Reviews Brief (5 min)
    ↓
  Officer Makes Final Decision
    ↓
Member Notified
```

### Benefits

- ✓ **Faster screening:** Reduces review time from hours to minutes
- ✓ **Consistent fairness:** RANK constraints applied uniformly
- ✓ **Better decisions:** Officers have comprehensive briefing packets
- ✓ **Bias reduction:** Demographic factors never influence initial scoring
- ✓ **Transparency:** Clear reasoning for approvals, escalations, declines

---

## 🤖 CrewAI Architecture Explanation

### What is CrewAI?

CrewAI is a Python framework that orchestrates multiple AI agents working together to solve complex problems. Each agent:

- Has a specific role and goal
- Possesses backstory and expertise
- Executes assigned tasks
- Can collaborate with other agents
- Maintains conversation memory

### Sequential Process

Ujima Loan Pride uses **sequential processing**:

```python
process=Process.sequential  # Scout → Guardian → Hunter (if needed)
```

Each agent receives the output of the previous agent, enabling contextual decision-making.

### Agent Configuration

```python
Agent(
    role="...",              # The agent's job title
    goal="...",              # What they're trying to achieve
    backstory="...",         # Knowledge and context they bring
    llm=llm,                 # Language model (Gemini 2.5 Flash)
    verbose=True,            # Show thinking process
    allow_delegation=False,   # Don't delegate to other agents
    memory=True              # Remember context across tasks
)
```

---

## 🔧 Tech Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **AI Framework** | CrewAI 0.28.8 | Multi-agent orchestration |
| **LLM** | Google Gemini 2.5 Flash | Natural language reasoning |
| **Language Bindings** | LangChain Google GenAI | Connect CrewAI to Gemini |
| **Configuration** | python-dotenv | Secure API key management |
| **UI/UX** | Rich | Beautiful terminal output |
| **Data Validation** | Pydantic 2.5.3 | Type-safe data structures |

---

## 📁 File Structure

```
ujima-loan-pride/
├── main.py                 # Entry point with Rich terminal UI
├── agents.py               # Scout, Guardian, Hunter agent definitions
├── tasks.py                # Task descriptions for each agent
├── crew.py                 # Crew orchestration and sequential processing
├── profiles.py             # Member profile data and utilities
├── requirements.txt        # Python dependencies
├── .env.example            # Environment variable template
└── README.md              # This file
```

### File Responsibilities

- **main.py:** Display header, process profiles, format output with Rich
- **agents.py:** Define agent roles, goals, backstories, constraints
- **tasks.py:** Create tasks with detailed instructions for each agent
- **crew.py:** Orchestrate agent-task combinations, manage sequential flow
- **profiles.py:** Mock member data and helper functions

---

## 🔐 Ethical Safeguards

### Data Privacy

- ✓ In-memory processing only—no data stored to disk
- ✓ No external APIs except Google Gemini
- ✓ No user data shared with third parties
- ✓ No sensitive information logged

### Fairness Constraints

- ✓ Gender-neutral language in all outputs
- ✓ No demographic-based risk signals
- ✓ Occupation-agnostic assessment
- ✓ Formal Employee Fairness Test in every decision

### Transparency

- ✓ All loan scores show reasoning
- ✓ Risk flags explained contextually
- ✓ Clear escalation criteria
- ✓ Human officers always make final decisions

---

## 🐛 Troubleshooting

### Error: `GEMINI_API_KEY not found`

**Solution:** 
1. Verify `.env` file exists in the project directory
2. Check that `GEMINI_API_KEY=` is present and not empty
3. Ensure no extra spaces: `GEMINI_API_KEY=your_key_here` (not `GEMINI_API_KEY = your_key_here`)

### Error: `ModuleNotFoundError: No module named 'crewai'`

**Solution:**
```bash
pip install -r requirements.txt
```

### Error: `401 Unauthorized` from Gemini API

**Solution:**
1. Verify your API key is valid at [makersuite.google.com](https://makersuite.google.com/app/apikey)
2. Check that the key has no leading/trailing spaces in `.env`
3. Regenerate a new API key if necessary

### Slow Execution

**Note:** First run takes longer due to model loading. Subsequent runs are faster.

---

## 📈 Future Enhancements

- Database integration (optional) for persistence
- Web dashboard for officer review interface
- Mobile-friendly member application form
- Integration with M-Pesa for income verification
- Historical decision logging and bias audits
- Pilot data from real SACCOs

---

## 📚 References & Resources

### SACCO & Kenyan Finance
- [Kenya SASRA Principles](https://www.sasra.go.ke/)
- [FINCA Kenya SACCO Network](https://www.finca.org/)
- [Informal Trade in Kenya](https://www.worldbank.org/en/country/kenya)

### CrewAI
- [CrewAI GitHub](https://github.com/joaomdmoura/crewAI)
- [CrewAI Documentation](https://docs.crewai.com)

### Google Gemini
- [Gemini API Documentation](https://ai.google.dev/docs)
- [Get Your API Key](https://makersuite.google.com/app/apikey)

---

## 👨‍💼 Contributing

This is a demonstration system. To adapt for your SACCO:

1. **Modify harvest cycles** in `agents.py` for your region
2. **Adjust RANK thresholds** in `tasks.py` for your risk appetite
3. **Add member profiles** in `profiles.py` from your actual membership
4. **Customize cross-sells** in Hunter task for your offerings

---

## ⚖️ Disclaimer

**Ujima Loan Pride is a demonstration system.** 

- Agents are not a replacement for human judgment
- Final lending decisions must be made by qualified loan officers
- Compliance with local banking regulations is essential
- Always verify member information through traditional channels
- No personal data should be used without member consent

---

## 📜 License

Open source—available for educational and SACCO adaptation purposes.

---

## 🎯 Contact & Support

Built to serve Kenyan SACCOs and informal traders fairly.

Questions? Review the code comments and agent backstories—they explain the reasoning in detail.

---

**Ujima** (Ubuntu philosophy): *"I am because we are"*

This system exists to strengthen community lending and fair access to credit. 🦁
