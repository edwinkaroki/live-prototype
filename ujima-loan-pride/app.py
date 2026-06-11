from __future__ import annotations

import os
from pathlib import Path
from dotenv import load_dotenv, set_key
from textual.app import App, ComposeResult
from textual.containers import Horizontal, ScrollableContainer, Vertical
from textual.widgets import Button, Footer, Header, Input, Static
from crew import UjimaLoanPrideCrew
from main import initialize_llm
from profiles import MEMBER_PROFILES


DOTENV_PATH = Path.cwd() / ".env"


class LoanApp(App):
    CSS = """
    #container {
        height: 1fr;
    }
    #sidebar {
        width: 38%;
        min-width: 40;
        padding: 1;
        border: solid gray;
    }
    #output_panel {
        padding: 1;
        border: solid gray;
    }
    #status {
        padding-top: 1;
    }
    """
    TITLE = "Ujima Loan Pride"

    def compose(self) -> ComposeResult:
        yield Header(show_clock=True)
        with Horizontal(id="container"):
            with Vertical(id="sidebar"):
                yield Static("[b]Google Gemini API Key[/b]\nEnter your key and save it before running.", id="key_label")
                yield Input(placeholder="GEMINI_API_KEY", id="api_key")
                yield Button("Save API Key", id="save_key", variant="primary")
                yield Button("Run Assessment", id="run", variant="success")
                yield Static("Ready.", id="status")
            with ScrollableContainer(id="output_view"):
                yield Static("Welcome to Ujima Loan Pride.\n\nPress [b]Run Assessment[/b] to process applications.", id="output_panel")
        yield Footer()

    def on_mount(self) -> None:
        load_dotenv(dotenv_path=str(DOTENV_PATH))
        api_key = os.getenv("GEMINI_API_KEY", "")
        self.query_one("#api_key", Input).value = api_key
        status = "Ready" if api_key else "Enter API key and save it."
        self.query_one("#status", Static).update(status)

    def save_api_key(self, key: str) -> None:
        if not DOTENV_PATH.exists():
            DOTENV_PATH.write_text("")
        set_key(str(DOTENV_PATH), "GEMINI_API_KEY", key)
        load_dotenv(dotenv_path=str(DOTENV_PATH), override=True)
        self.query_one("#status", Static).update("API key saved.")

    def build_result_text(self, results: list[dict]) -> str:
        lines: list[str] = ["[b]Ujima Loan Pride Assessment Results[/b]", ""]
        for result in results:
            profile = result["member_profile"]
            lines.append(f"[b]Member:[/b] {profile['name']} ({profile['occupation']})")
            lines.append(f"Loan Amount: KES {profile['loan_amount_kes']:,}")
            lines.append(f"Decision: {result['decision']}")
            lines.append("[b]Scout Analysis:[/b]")
            scout_json = result.get("scout_json") or {}
            for key, value in scout_json.items():
                lines.append(f"  • {key}: {value}")
            lines.append("[b]Guardian Decision JSON:[/b]")
            guardian_json = result.get("guardian_json") or {}
            for key, value in guardian_json.items():
                lines.append(f"  • {key}: {value}")
            if result.get("hunter_output"):
                lines.append("[b]Hunter Briefing:[/b]")
                lines.append(str(result["hunter_output"]))
            lines.append("".join(["-" * 40, ""]))
        return "\n".join(lines)

    def process_assessment(self) -> str:
        load_dotenv(dotenv_path=str(DOTENV_PATH), override=True)
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY is required to run the assessment.")

        llm = initialize_llm()
        crew = UjimaLoanPrideCrew(llm)
        results: list[dict] = []

        for profile in MEMBER_PROFILES:
            result = crew.process_application(profile)
            results.append(result)

        return self.build_result_text(results)

    async def on_button_pressed(self, event: Button.Pressed) -> None:
        button_id = event.button.id
        if button_id == "save_key":
            api_key = self.query_one("#api_key", Input).value.strip()
            if not api_key:
                self.query_one("#status", Static).update("Please enter a non-empty API key.")
                return
            self.save_api_key(api_key)
            return

        if button_id == "run":
            self.query_one("#status", Static).update("Running assessment... this may take a few minutes.")
            self.query_one("#run", Button).disabled = True
            self.query_one("#save_key", Button).disabled = True
            self.query_one("#output_panel", Static).update("Processing applications...\n")
            self.run_worker(self.process_assessment, callback=self.on_assessment_done)

    def on_assessment_done(self, message) -> None:
        run_button = self.query_one("#run", Button)
        save_button = self.query_one("#save_key", Button)
        run_button.disabled = False
        save_button.disabled = False

        if message.error:
            self.query_one("#status", Static).update("Error occurred during assessment.")
            self.query_one("#output_panel", Static).update(f"[red]Error:[/red] {message.error}")
            return

        self.query_one("#status", Static).update("Assessment complete.")
        self.query_one("#output_panel", Static).update(message.result)


if __name__ == "__main__":
    LoanApp().run()
