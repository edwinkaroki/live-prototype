"""
Ujima Loan Pride - Main Application
Entry point for the CrewAI multi-agent loan assessment system
"""

import sys

REQUIRED_PYTHON = (3, 10)
if sys.version_info < REQUIRED_PYTHON:
    raise RuntimeError(
        f"Ujima Loan Pride requires Python {REQUIRED_PYTHON[0]}.{REQUIRED_PYTHON[1]} or higher. "
        f"Current version: {sys.version_info.major}.{sys.version_info.minor}"
    )

import os
from dotenv import load_dotenv
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.text import Text
from rich.progress import Progress, SpinnerColumn, TextColumn
import json
from datetime import datetime

from profiles import MEMBER_PROFILES
from crew import UjimaLoanPrideCrew
from crewai import LLM

# Load environment variables
load_dotenv()

console = Console()


def initialize_llm():
    """Initialize Google Gemini LLM"""
    api_key = os.getenv("GEMINI_API_KEY")
    
    if not api_key:
        console.print(
            "[red]✗ Error: GEMINI_API_KEY not found in .env file[/red]"
        )
        raise ValueError("GEMINI_API_KEY environment variable is required")
    
    return LLM(
        model="google/gemini-2.5-flash",
        api_key=api_key,
        temperature=0.3,
    )


def display_header():
    """Display application header"""
    title = "🦁 UJIMA LOAN PRIDE — Multi-Agent Loan Assessment System"
    subtitle = "Fair lending for Kenyan SACCO informal traders"
    
    header_text = Text(title, style="bold cyan", justify="center")
    console.print()
    console.print(header_text)
    console.print(Text(subtitle, style="dim italic", justify="center"))
    console.print(Text("=" * 70, style="dim"))
    console.print()


def display_processing_start(member_name):
    """Display processing start message"""
    console.print(f"\n[bold blue]⚙️  Processing: {member_name}[/bold blue]")
    console.print("[dim]─" * 35 + "[/dim]")


def display_scout_analysis(scout_json):
    """Display Scout Agent analysis"""
    if not scout_json:
        console.print("[yellow]⚠ Scout analysis not available[/yellow]")
        return
    
    console.print("\n[bold magenta]📋 Scout Agent Analysis[/bold magenta]")
    
    # Member overview
    member_name = scout_json.get("member_name", "Unknown")
    income_pattern = scout_json.get("income_pattern", "N/A")
    harvest_alignment = scout_json.get("harvest_alignment", "N/A")
    
    console.print(f"  • Income Pattern: {income_pattern}")
    console.print(f"  • Harvest Alignment: {harvest_alignment}")
    
    # Stress signals
    stress_signals = scout_json.get("stress_signals", [])
    if stress_signals:
        console.print(f"  • Stress Signals: {', '.join(stress_signals)}")
    
    # Literacy gaps
    literacy_gaps = scout_json.get("literacy_gaps", [])
    if literacy_gaps:
        console.print(f"  • Literacy Gaps: {', '.join(literacy_gaps)}")
    
    # Repayment schedule
    repayment = scout_json.get("recommended_repayment_schedule", "N/A")
    console.print(f"  • Recommended Repayment: {repayment}")
    
    # Summary
    summary = scout_json.get("scout_summary", "")
    if summary:
        console.print(f"\n  💭 Scout Summary:\n  {summary[:200]}...")


def display_guardian_decision(guardian_json):
    """Display Guardian Agent decision"""
    if not guardian_json:
        console.print("[yellow]⚠ Guardian decision not available[/yellow]")
        return
    
    decision = guardian_json.get("decision", "UNKNOWN")
    loan_score = guardian_json.get("loan_score", 0)
    risk_flags = guardian_json.get("risk_flags", [])
    
    console.print(f"\n[bold magenta]⚖️  Guardian Decision[/bold magenta]")
    console.print(f"  • Loan Score: {loan_score}/100")
    
    if risk_flags:
        console.print(f"  • Risk Flags: {', '.join(risk_flags)}")
    else:
        console.print("  • Risk Flags: None")
    
    # Decision with color coding
    if decision == "APPROVED":
        decision_text = Text(f"  ✓ DECISION: {decision}", style="bold green")
        approval_msg = guardian_json.get("approval_message", "")
        if approval_msg:
            console.print(f"  • Message: {approval_msg[:150]}...")
    elif decision == "ESCALATED":
        decision_text = Text(f"  ⚠ DECISION: {decision}", style="bold yellow")
        escalation_ctx = guardian_json.get("escalation_context", "")
        if escalation_ctx:
            console.print(f"  • Context: {escalation_ctx[:150]}...")
    else:  # DECLINED
        decision_text = Text(f"  ✗ DECISION: {decision}", style="bold red")
        denial_reason = guardian_json.get("denial_reason", "")
        if denial_reason:
            console.print(f"  • Reason: {denial_reason[:150]}...")
    
    console.print(decision_text)


def display_hunter_briefing(hunter_output):
    """Display Hunter Agent briefing packet"""
    if not hunter_output:
        return
    
    console.print(f"\n[bold magenta]📝 Officer Briefing Packet[/bold magenta]")
    
    # Truncate to reasonable length
    briefing = str(hunter_output)[:800]
    console.print(f"\n{briefing}\n")
    
    panel = Panel(
        "[dim][Briefing packet prepared for loan officer review][/dim]",
        style="dim yellow"
    )
    console.print(panel)


def display_results_table(results):
    """Display summary results table"""
    console.print("\n" + "=" * 70)
    console.print("[bold]📊 SUMMARY RESULTS[/bold]")
    console.print("=" * 70 + "\n")
    
    table = Table(show_header=True, header_style="bold cyan")
    table.add_column("Member Name", style="cyan")
    table.add_column("Occupation", style="cyan")
    table.add_column("Loan Amount (KES)", justify="right", style="cyan")
    table.add_column("Decision", style="cyan")
    
    for result in results:
        profile = result["member_profile"]
        guardian_json = result["guardian_json"]
        
        name = profile["name"]
        occupation = profile["occupation"]
        loan_amount = f"{profile['loan_amount_kes']:,}"
        decision = result["decision"] if result["decision"] else "UNKNOWN"
        
        # Color decision
        if decision == "APPROVED":
            decision_styled = f"[green]{decision}[/green]"
        elif decision == "ESCALATED":
            decision_styled = f"[yellow]{decision}[/yellow]"
        else:
            decision_styled = f"[red]{decision}[/red]"
        
        table.add_row(name, occupation, loan_amount, decision_styled)
    
    console.print(table)


def display_closing():
    """Display closing message"""
    console.print("\n" + "=" * 70)
    console.print("[bold green]✓ Processing complete[/bold green]")
    console.print(f"[dim]Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}[/dim]")
    console.print("=" * 70)
    console.print()


def main():
    """Main application flow"""
    display_header()
    
    try:
        # Initialize LLM
        console.print("[cyan]Initializing CrewAI with Google Gemini 2.5 Flash...[/cyan]")
        llm = initialize_llm()
        console.print("[green]✓ LLM initialized successfully[/green]\n")
        
        # Create crew
        crew = UjimaLoanPrideCrew(llm)
        
        # Process all member profiles
        all_results = []
        
        for profile in MEMBER_PROFILES:
            member_name = profile["name"]
            
            display_processing_start(member_name)
            
            # Process application
            with Progress(
                SpinnerColumn(),
                TextColumn("[progress.description]{task.description}"),
                console=console,
            ) as progress:
                task = progress.add_task(
                    "Processing application through agents...", total=None
                )
                result = crew.process_application(profile)
                progress.stop()
            
            all_results.append(result)
            
            # Display results for this profile
            display_scout_analysis(result["scout_json"])
            display_guardian_decision(result["guardian_json"])
            
            if result["decision"] == "ESCALATED" and result["hunter_output"]:
                display_hunter_briefing(result["hunter_output"])
        
        # Display summary table
        display_results_table(all_results)
        display_closing()
        
        # Return results for programmatic use
        return all_results
    
    except Exception as e:
        console.print(f"\n[red]✗ Error occurred: {str(e)}[/red]")
        console.print("[dim]Please check your GEMINI_API_KEY and internet connection.[/dim]")
        raise


if __name__ == "__main__":
    main()
