import os
import json
import logging
from datetime import datetime
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from crew import UjimaLoanPrideCrew
from main import initialize_llm
from profiles import MEMBER_PROFILES
from payload_mapping import map_application_to_profile
from guardrails import dignity_filter_denial_message
from application_flow import apply_ambush_logic
from audit import get_audit_logs, record_audit_event
from cycle import (
    generate_weekly_insights,
    get_cycle_improvements,
    propose_cycle_improvement,
    record_cycle_event,
)
from trail import get_trail_definitions


# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Configure logging. On Windows the dev server may already hold api.log, so
# tests/imports fall back to stream logging instead of failing the app import.
log_handlers = [logging.StreamHandler()]
try:
    log_handlers.insert(0, logging.FileHandler('api.log'))
except PermissionError:
    pass

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=log_handlers
)
logger = logging.getLogger(__name__)


@app.before_request
def log_request():
    """Log incoming requests"""
    logger.info(f"Request: {request.method} {request.path}")


@app.after_request
def log_response(response):
    """Log outgoing responses"""
    logger.info(f"Response: {response.status_code}")
    return response


@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint for monitoring"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'service': 'Ujima Loan Pride API'
    }), 200


@app.route('/api/config', methods=['GET'])
def get_config():
    """Get API configuration and available profiles"""
    try:
        return jsonify({
            'status': 'success',
            'profiles': [
                {
                    'id': idx,
                    'name': profile.get('name', 'Unknown'),
                    'occupation': profile.get('occupation', 'Unknown'),
                    'loan_amount_kes': profile.get('loan_amount_kes', 0)
                }
                for idx, profile in enumerate(MEMBER_PROFILES)
            ],
            'trail': get_trail_definitions(),
            'timestamp': datetime.now().isoformat()
        }), 200
    except Exception as e:
        logger.error(f"Error in /api/config: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve configuration',
            'error': str(e)
        }), 500


@app.route('/api/trail', methods=['GET'])
def get_trail():
    """Expose explicit T, R, A, I, L definitions for all agents."""
    return jsonify({
        'status': 'success',
        'trail': get_trail_definitions(),
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/audit', methods=['GET'])
def get_audit():
    """Return prototype audit log entries."""
    return jsonify({
        'status': 'success',
        'audit_logs': get_audit_logs(),
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/cycle/insights', methods=['GET'])
def get_cycle_insights():
    """Return CYCLE metrics and weekly insights."""
    return jsonify({
        'status': 'success',
        'cycle': generate_weekly_insights(),
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/cycle/improvements', methods=['GET', 'POST'])
def cycle_improvements():
    """List or propose CYCLE improvements with a human approval gate."""
    if request.method == 'GET':
        return jsonify({
            'status': 'success',
            'improvements': get_cycle_improvements(),
            'timestamp': datetime.now().isoformat()
        }), 200

    payload = request.get_json() or {}
    summary = payload.get('summary') or 'Review weekly CYCLE insight and update prototype thresholds.'
    approved_by = payload.get('approved_by') if _flag_enabled(payload.get('human_approved')) else None
    improvement = propose_cycle_improvement(summary, approved_by=approved_by)
    return jsonify({
        'status': 'success',
        'improvement': improvement,
        'human_approval_gate': {
            'required': True,
            'passed': bool(approved_by),
            'message': 'Improvement deployed only after named human approval.'
            if approved_by else 'Improvement is pending; no deployment without human approval.',
        },
        'timestamp': datetime.now().isoformat()
    }), 200


@app.route('/api/assess', methods=['POST'])
def assess_loan():
    """
    Main loan assessment endpoint.
    Expects JSON: { "api_key": "your-gemini-api-key" }
    """
    try:
        # Validate request
        if not request.is_json:
            return jsonify({
                'status': 'error',
                'message': 'Request must be JSON'
            }), 400

        data = request.get_json()
        api_key = data.get('api_key', '').strip()

        if not api_key:
            api_key = os.getenv('GEMINI_API_KEY', '').strip()

        if not api_key:
            return jsonify({
                'status': 'error',
                'message': 'GEMINI_API_KEY is required. Provide in request body or .env file',
                'timestamp': datetime.now().isoformat()
            }), 400

        logger.info("Starting loan assessment process...")

        # Initialize LLM with provided API key
        try:
            llm = initialize_llm()
            logger.info("LLM initialized successfully")
        except Exception as e:
            logger.error(f"LLM initialization failed: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Failed to initialize LLM',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }), 500

        # Process applications
        results = []
        try:
            crew = UjimaLoanPrideCrew(llm)
            logger.info(f"Processing {len(MEMBER_PROFILES)} applications...")

            for idx, profile in enumerate(MEMBER_PROFILES, 1):
                try:
                    logger.info(f"Processing application {idx}/{len(MEMBER_PROFILES)}: {profile.get('name')}")
                    result = crew.process_application(profile)
                    results.append(result)
                    logger.info(f"✓ Application {idx} completed")
                except Exception as e:
                    logger.error(f"Error processing application {idx}: {str(e)}")
                    results.append({
                        'member_profile': profile,
                        'decision': 'ERROR',
                        'error': str(e)
                    })

            logger.info(f"Assessment complete: {len(results)} applications processed")

            return jsonify({
                'status': 'success',
                'message': 'Loan assessments completed',
                'results': results,
                'summary': {
                    'total_processed': len(results),
                    'timestamp': datetime.now().isoformat()
                }
            }), 200

        except Exception as e:
            logger.error(f"Error during assessment: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': 'Assessment process failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        logger.error(f"Unexpected error in /api/assess: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Unexpected error occurred',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500


@app.route('/api/assess/<int:profile_id>', methods=['POST'])
def assess_single_loan(profile_id):
    """
    Assess a single loan application by profile ID.
    Expects JSON: { "api_key": "your-gemini-api-key" }
    """
    try:
        if profile_id >= len(MEMBER_PROFILES) or profile_id < 0:
            return jsonify({
                'status': 'error',
                'message': f'Profile ID {profile_id} not found',
                'timestamp': datetime.now().isoformat()
            }), 404

        data = request.get_json() or {}
        api_key = data.get('api_key', '').strip() or os.getenv('GEMINI_API_KEY', '').strip()

        if not api_key:
            return jsonify({
                'status': 'error',
                'message': 'GEMINI_API_KEY is required',
                'timestamp': datetime.now().isoformat()
            }), 400

        logger.info(f"Processing single application: Profile {profile_id}")

        try:
            llm = initialize_llm()
            crew = UjimaLoanPrideCrew(llm)
            profile = MEMBER_PROFILES[profile_id]
            result = crew.process_application(profile)

            logger.info(f"✓ Single application assessment completed for {profile.get('name')}")

            return jsonify({
                'status': 'success',
                'message': 'Single assessment completed',
                'result': result,
                'timestamp': datetime.now().isoformat()
            }), 200

        except Exception as e:
            logger.error(f"Error assessing profile {profile_id}: {str(e)}")
            return jsonify({
                'status': 'error',
                'message': f'Assessment failed for profile {profile_id}',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }), 500

    except Exception as e:
        logger.error(f"Unexpected error in /api/assess/<id>: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Unexpected error occurred',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        }), 500


@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({
        'status': 'error',
        'message': 'Endpoint not found',
        'timestamp': datetime.now().isoformat()
    }), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'status': 'error',
        'message': 'Internal server error',
        'timestamp': datetime.now().isoformat()
    }), 500


def _to_int(value, default=0):
    """Best-effort integer conversion for prototype scoring."""
    try:
        if value in (None, ''):
            return default
        return int(value)
    except (TypeError, ValueError):
        return default


def _flag_enabled(value):
    return str(value).strip().lower() in {'1', 'true', 'yes', 'on'}


def _optional_bool(value):
    if value is None or value == '':
        return None
    return _flag_enabled(value)


def _is_blank(value):
    return value is None or str(value).strip() == ''


def _validate_application_payload(payload):
    required_text_fields = {
        'name': 'Full name',
        'occupation': 'Main work',
        'location': 'Town or county',
        'phone': 'Phone number',
        'purpose': 'Loan purpose',
    }
    required_positive_numbers = {
        'age': 'Age',
        'loan_amount_kes': 'Loan amount',
        'monthly_income_kes': 'Monthly income',
        'sacco_member_months': 'Months as a SACCO member',
    }
    required_zero_or_more_numbers = {
        'savings_balance_kes': 'Savings balance',
        'existing_loans': 'Other active loans',
        'children': 'Number of children',
    }

    missing = [
        label
        for field, label in required_text_fields.items()
        if _is_blank(payload.get(field))
    ]

    invalid = []
    for field, label in required_positive_numbers.items():
        value = payload.get(field)
        if _is_blank(value):
            missing.append(label)
        elif _to_int(value, default=-1) <= 0:
            invalid.append(f'{label} must be greater than 0')

    for field, label in required_zero_or_more_numbers.items():
        value = payload.get(field)
        if _is_blank(value):
            missing.append(label)
        elif _to_int(value, default=-1) < 0:
            invalid.append(f'{label} cannot be negative')

    if missing or invalid:
        details = []
        if missing:
            details.append('Missing: ' + ', '.join(missing))
        details.extend(invalid)
        return details

    return []


def _use_live_agents(payload):
    """Live CrewAI/Gemini is opt-in so the demo form never hangs by default."""
    payload_flag = payload.get('live_agents')
    if payload_flag is not None:
        return _flag_enabled(payload_flag)
    return _flag_enabled(os.getenv('UJIMA_LIVE_AGENTS', 'false'))


def _guardian_decision_for_profile(member_profile):
    """Deterministic Guardian scoring that excludes gender and location."""
    loan_amount = _to_int(member_profile.get('loan_amount_kes'))
    monthly_income = _to_int(member_profile.get('monthly_income_kes'))
    savings = _to_int(member_profile.get('savings_balance_kes'))
    existing_loans = _to_int(member_profile.get('existing_loans'))
    member_months = _to_int(member_profile.get('sacco_member_months'))

    risk_flags = []
    score = 52

    if monthly_income > 0:
        loan_to_income = loan_amount / monthly_income if monthly_income else 0
        if loan_to_income <= 1:
            score += 20
        elif loan_to_income <= 2:
            score += 10
        elif loan_to_income <= 3:
            score -= 5
            risk_flags.append('Requested amount is high compared with monthly income')
        else:
            score -= 20
            risk_flags.append('Requested amount is much higher than monthly income')
    else:
        score -= 15
        risk_flags.append('Monthly income was not provided')

    if savings >= max(1000, loan_amount * 0.2):
        score += 10
    elif savings <= 0:
        score -= 8

    if member_months >= 12:
        score += 10
    elif member_months >= 6:
        score += 5
    else:
        score -= 5
        risk_flags.append('Short SACCO membership history')

    if existing_loans >= 2:
        score -= 15
        risk_flags.append('Several active loans need repayment review')
    elif existing_loans == 1:
        score -= 5

    score = max(0, min(100, score))

    if score < 50 and ('Monthly income was not provided' in risk_flags or existing_loans >= 2):
        decision = 'DECLINED'
    elif loan_amount <= 15000 and score >= 70 and len(risk_flags) < 2:
        decision = 'APPROVED'
    else:
        decision = 'ESCALATED'

    return {
        'decision': decision,
        'loan_score': score,
        'risk_flags': risk_flags,
    }


def _income_counterfactual(member_profile):
    bumped = dict(member_profile)
    original_income = _to_int(member_profile.get('monthly_income_kes'))
    bumped['monthly_income_kes'] = int(round(original_income * 1.2))
    outcome = _guardian_decision_for_profile(bumped)
    return {
        'question': 'What if income were +20%?',
        'original_monthly_income_kes': original_income,
        'counterfactual_monthly_income_kes': bumped['monthly_income_kes'],
        'counterfactual_decision': outcome['decision'],
        'counterfactual_score': outcome['loan_score'],
    }


def _build_demo_application_result(member_profile, state_snapshot, trigger_ctx, live_agent_error=None):
    """Return deterministic agent-style output when live LLM calls are unavailable.

    This keeps the API useful for demos and local development, while preserving
    the same response shape used by the real CrewAI pipeline.
    """
    name = member_profile.get('name') or 'Applicant'
    occupation = member_profile.get('occupation') or 'member'
    location = member_profile.get('location') or 'their area'
    loan_amount = _to_int(member_profile.get('loan_amount_kes'))
    monthly_income = _to_int(member_profile.get('monthly_income_kes'))
    income_type = member_profile.get('income_type') or 'irregular'
    peak_months = member_profile.get('peak_months') or []
    purpose = member_profile.get('purpose') or 'loan support'
    member_text = (member_profile.get('member_text') or '').lower()

    stress_signals = []
    literacy_gaps = []
    guardian_outcome = _guardian_decision_for_profile(member_profile)
    risk_flags = list(guardian_outcome['risk_flags'])
    score = guardian_outcome['loan_score']
    decision = guardian_outcome['decision']

    if 'school' in purpose.lower() or 'school fees' in member_text:
        stress_signals.append('School fees timing pressure')

    if 'loan shark' in member_text:
        stress_signals.append('Member mentioned dangerous debt pressure')
        risk_flags.append('Human officer should review debt pressure before any decision')
        decision = 'ESCALATED'

    if _to_int(member_profile.get('savings_balance_kes')) <= 0:
        literacy_gaps.append('Emergency savings plan')

    if income_type == 'seasonal':
        literacy_gaps.append('Harvest-aligned repayment planning')
    elif income_type == 'daily_cash':
        literacy_gaps.append('Weekly savings habit')
    else:
        literacy_gaps.append('Income tracking for irregular months')

    month_text = ', '.join(peak_months) if peak_months else 'the strongest earning months'
    repayment_schedule = (
        f"Use smaller payments during quiet months, then larger payments around {month_text}."
        if income_type == 'seasonal'
        else "Use steady weekly payments matched to the member's cash flow."
    )

    scout_json = {
        'member_name': name,
        'income_pattern': income_type.replace('_', ' '),
        'harvest_alignment': f"Peak earning period: {month_text}.",
        'stress_signals': stress_signals or ['No urgent stress signal shared'],
        'literacy_gaps': literacy_gaps,
        'recommended_repayment_schedule': repayment_schedule,
        'scout_summary': (
            f"{name} is a {occupation} in {location}. The application should be reviewed "
            f"against real cash flow, not formal employment status."
        ),
    }

    guardian_json = {
        'decision': decision,
        'loan_score': score,
        'risk_flags': risk_flags,
        'denial_reason': '',
        'approval_message': '',
        'escalation_context': '',
    }

    if decision == 'APPROVED':
        guardian_json['approval_message'] = (
            'The request fits the current prototype approval rules for amount, score, and repayment signals.'
        )
    elif decision == 'DECLINED':
        guardian_json['denial_reason'] = dignity_filter_denial_message(
            'The application needs stronger income or repayment evidence before approval.'
        )
    else:
        guardian_json['escalation_context'] = (
            'A loan officer should review the amount, income timing, savings position, and any urgent context.'
        )

    hunter_output = None
    if decision == 'ESCALATED' or state_snapshot.get('guardian_human_takeover'):
        hunter_output = (
            f"Member summary: {name}, {occupation}, {location}.\n"
            f"Income evidence: monthly income KES {monthly_income:,}; income pattern is {income_type.replace('_', ' ')}.\n"
            f"Review focus: {guardian_json['escalation_context']}\n"
            f"Timing context: {scout_json['harvest_alignment']} {repayment_schedule}\n"
            "Officer action: confirm cash-flow evidence, discuss a repayment calendar, and check whether a savings or school-fees plan would help."
        )

    result = {
        'member_name': name,
        'member_profile': member_profile,
        'scout_output': scout_json['scout_summary'],
        'scout_json': scout_json,
        'guardian_output': guardian_json['approval_message'] or guardian_json['escalation_context'] or guardian_json['denial_reason'],
        'guardian_json': guardian_json,
        'decision': decision,
        'hunter_output': hunter_output,
        'agent_mode': 'demo_fallback',
        'trigger_context': trigger_ctx,
        'workflow_flags': state_snapshot,
        'trail': get_trail_definitions(),
        'counterfactual': _income_counterfactual(member_profile),
    }

    if live_agent_error:
        result['live_agent_error'] = live_agent_error

    return result


@app.route('/api/apply', methods=['POST'])
def apply_loan():
    """Apply for a loan using real member-provided payload."""
    try:
        if not request.is_json:
            return jsonify({'status': 'error', 'message': 'Request must be JSON'}), 400

        payload = request.get_json() or {}
        validation_errors = _validate_application_payload(payload)
        if validation_errors:
            return jsonify({
                'status': 'error',
                'message': 'Please complete the required loan application fields before submitting.',
                'errors': validation_errors,
                'timestamp': datetime.now().isoformat()
            }), 400

        member_profile = map_application_to_profile(payload)

        # Ambush workflow triggers (prototype flags + context)
        state_snapshot, trigger_ctx = apply_ambush_logic(member_profile, payload)

        if _use_live_agents(payload):
            api_key = str(payload.get('api_key', '')).strip() or os.getenv('GEMINI_API_KEY', '').strip()
            if not api_key:
                return jsonify({
                    'status': 'error',
                    'message': 'GEMINI_API_KEY is required when live agents are enabled'
                }), 400

            try:
                llm = initialize_llm()
                crew = UjimaLoanPrideCrew(llm)
                result = crew.process_application(member_profile)
                result['agent_mode'] = 'live_crewai'
            except Exception as live_error:
                logger.exception('Live agent processing failed; returning demo fallback result')
                result = _build_demo_application_result(
                    member_profile,
                    state_snapshot,
                    trigger_ctx,
                    live_agent_error=str(live_error),
                )
        else:
            result = _build_demo_application_result(member_profile, state_snapshot, trigger_ctx)

        # Attach workflow flags + trigger context for auditing/UX
        result['workflow_flags'] = state_snapshot
        result['trigger_context'] = trigger_ctx
        result['trail'] = get_trail_definitions()
        result['counterfactual'] = _income_counterfactual(member_profile)

        # Dignity Filter (post-process declined messages if present)
        guardian_json = result.get('guardian_json') or {}
        if guardian_json.get('decision') == 'DECLINED':
            denial_reason = guardian_json.get('denial_reason') or guardian_json.get('denialReason')
            if isinstance(denial_reason, str):
                guardian_json['denial_reason'] = dignity_filter_denial_message(denial_reason)
                result['guardian_json'] = guardian_json

        decision = result.get('decision') or guardian_json.get('decision') or 'UNKNOWN'
        guardian_reason = (
            guardian_json.get('approval_message')
            or guardian_json.get('escalation_context')
            or guardian_json.get('denial_reason')
            or result.get('guardian_output')
            or 'No Guardian reason provided'
        )
        audit_events = [
            record_audit_event(
                'Scout',
                'ANALYZED',
                result.get('scout_output') or 'Scout analysis completed',
                metadata={'member_name': result.get('member_name')},
            ),
            record_audit_event(
                'Guardian',
                decision,
                guardian_reason,
                counterfactual=result['counterfactual'],
                metadata={
                    'member_name': result.get('member_name'),
                    'loan_score': guardian_json.get('loan_score'),
                    'risk_flags': guardian_json.get('risk_flags', []),
                },
            ),
        ]
        if result.get('hunter_output'):
            audit_events.append(record_audit_event(
                'Hunter',
                'BRIEFING_PREPARED',
                'Escalated case prepared for human officer review',
                counterfactual=result['counterfactual'],
                metadata={'member_name': result.get('member_name')},
            ))

        result['audit_events'] = audit_events
        result['cycle_event'] = record_cycle_event(
            decision,
            csat=payload.get('csat'),
            repayment_on_time=_optional_bool(payload.get('repayment_on_time')),
            escalated=(decision == 'ESCALATED') or bool(state_snapshot.get('guardian_human_takeover')),
            metadata={'member_name': result.get('member_name')},
        )

        # Full system pause behavior flag: represent in response
        if state_snapshot.get('full_system_pause'):
            result['system_pause'] = True

        return jsonify({
            'status': 'success',
            'message': 'Loan application processed',
            'result': result,
            'cycle': generate_weekly_insights(),
            'timestamp': datetime.now().isoformat()
        }), 200

    except Exception as e:
        logger.exception('Error in /api/apply')
        return jsonify({'status': 'error', 'message': 'Application failed', 'error': str(e), 'timestamp': datetime.now().isoformat()}), 500


if __name__ == '__main__':
    logger.info("=" * 80)
    logger.info("Ujima Loan Pride API Server Starting")
    logger.info("=" * 80)
    logger.info(f"Environment: {'Development' if os.getenv('FLASK_ENV') != 'production' else 'Production'}")
    logger.info(f"Port: 5000")
    logger.info("Endpoints:")
    logger.info("  - GET  /health")
    logger.info("  - GET  /api/config")
    logger.info("  - POST /api/assess")
    logger.info("  - POST /api/assess/<profile_id>")
    logger.info("=" * 80)

    # Run with production-grade settings
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=os.getenv('FLASK_ENV') != 'production',
        threaded=True
    )
