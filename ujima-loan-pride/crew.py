"""
Ujima Loan Pride - Crew Orchestration
Coordinates agents and tasks for loan processing
"""

import json
from crewai import Crew, Process
from agents import create_scout_agent, create_guardian_agent, create_hunter_agent
from tasks import create_scout_task, create_guardian_task, create_hunter_task
from profiles import format_profile_for_agent


class UjimaLoanPrideCrew:
    """Orchestrates the Ujima Loan Pride multi-agent system"""
    
    def __init__(self, llm):
        """Initialize crew with language model"""
        self.llm = llm
        self.scout_agent = create_scout_agent(llm)
        self.guardian_agent = create_guardian_agent(llm)
        self.hunter_agent = create_hunter_agent(llm)
    
    def process_application(self, member_profile):
        """
        Process a single member application through all agents sequentially.
        
        Args:
            member_profile (dict): Member profile data
            
        Returns:
            dict: Application result with scout output, guardian decision, and hunter briefing if escalated
        """
        member_name = member_profile.get("name", "Unknown")
        profile_text = format_profile_for_agent(member_profile)
        
        # Step 1: Scout Agent analyzes profile
        scout_task = create_scout_task(self.scout_agent, profile_text)
        scout_crew = Crew(
            agents=[self.scout_agent],
            tasks=[scout_task],
            process=Process.sequential,
            verbose=False,
        )
        
        scout_result = scout_crew.kickoff()
        scout_output = str(scout_result)
        
        # Parse scout output to extract JSON
        scout_json = self._extract_json(scout_output)
        
        # Step 2: Guardian Agent reviews and decides
        guardian_task = create_guardian_task(self.guardian_agent, scout_output)
        guardian_crew = Crew(
            agents=[self.guardian_agent],
            tasks=[guardian_task],
            process=Process.sequential,
            verbose=False,
        )
        
        guardian_result = guardian_crew.kickoff()
        guardian_output = str(guardian_result)
        
        # Parse guardian output to extract JSON
        guardian_json = self._extract_json(guardian_output)
        decision = guardian_json.get("decision", "UNKNOWN") if guardian_json else "UNKNOWN"
        
        # Step 3: Hunter Agent briefing (only if escalated)
        hunter_output = None
        if decision == "ESCALATED":
            hunter_task = create_hunter_task(self.hunter_agent, scout_output, guardian_output, profile_text)
            hunter_crew = Crew(
                agents=[self.hunter_agent],
                tasks=[hunter_task],
                process=Process.sequential,
                verbose=False,
            )
            hunter_result = hunter_crew.kickoff()
            hunter_output = str(hunter_result)
        
        return {
            "member_name": member_name,
            "member_profile": member_profile,
            "scout_output": scout_output,
            "scout_json": scout_json,
            "guardian_output": guardian_output,
            "guardian_json": guardian_json,
            "decision": decision,
            "hunter_output": hunter_output,
        }
    
    @staticmethod
    def _extract_json(text):
        """Extract JSON from text output"""
        try:
            # Try to find JSON in the text
            start_idx = text.find("{")
            end_idx = text.rfind("}") + 1
            
            if start_idx >= 0 and end_idx > start_idx:
                json_str = text[start_idx:end_idx]
                return json.loads(json_str)
        except (json.JSONDecodeError, ValueError):
            pass
        
        return None
