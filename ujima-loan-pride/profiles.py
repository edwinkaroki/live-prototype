"""
Ujima Loan Pride - Member Profiles
Mock member data for SACCO loan processing demonstration
"""

MEMBER_PROFILES = [
    {
        "name": "Grace Akinyi",
        "age": 42,
        "occupation": "Maize farmer",
        "location": "Kakamega, Western Kenya",
        "loan_amount_kes": 28000,
        "purpose": "School fees for 3 children",
        "children": 3,
        "child_ages": [6, 9, 14],
        "monthly_income_kes": 12000,
        "income_type": "seasonal",
        "peak_months": ["October", "November"],
        "savings_balance_kes": 4500,
        "existing_loans": 0,
        "sacco_member_months": 18
    },
    {
        "name": "Amina Hassan",
        "age": 35,
        "occupation": "Market vendor (vegetables)",
        "location": "Gikomba Market, Nairobi",
        "loan_amount_kes": 12000,
        "purpose": "Stock purchase before Ramadan season",
        "children": 2,
        "child_ages": [4, 8],
        "monthly_income_kes": 18000,
        "income_type": "daily_cash",
        "peak_months": ["March", "April", "September", "October"],
        "savings_balance_kes": 8200,
        "existing_loans": 0,
        "sacco_member_months": 9
    },
    {
        "name": "Zawadi Ochieng",
        "age": 28,
        "occupation": "Shea butter trader",
        "location": "Busia County, Western Kenya",
        "loan_amount_kes": 8000,
        "purpose": "Transport costs for market trip",
        "children": 1,
        "child_ages": [2],
        "monthly_income_kes": 9000,
        "income_type": "irregular",
        "peak_months": ["January", "July"],
        "savings_balance_kes": 2100,
        "existing_loans": 1,
        "sacco_member_months": 6
    }
]


def get_member_profile(name):
    """Retrieve a member profile by name."""
    for profile in MEMBER_PROFILES:
        if profile["name"].lower() == name.lower():
            return profile
    return None


def format_profile_for_agent(profile):
    """Format profile as a readable string for agents."""
    return f"""
Member Profile:
- Name: {profile['name']}
- Age: {profile['age']}
- Occupation: {profile['occupation']}
- Location: {profile['location']}
- Monthly Income: KES {profile['monthly_income_kes']}
- Income Type: {profile['income_type']}
- Peak Income Months: {', '.join(profile['peak_months'])}
- Children: {profile['children']} (ages: {', '.join(map(str, profile['child_ages']))})
- Savings Balance: KES {profile['savings_balance_kes']}
- Existing Loans: {profile['existing_loans']}
- SACCO Member for: {profile['sacco_member_months']} months
- Loan Amount Requested: KES {profile['loan_amount_kes']}
- Loan Purpose: {profile['purpose']}
"""
