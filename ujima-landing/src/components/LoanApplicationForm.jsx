import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Briefcase,
  Calendar,
  CheckCircle,
  ClipboardList,
  Copy,
  Database,
  FileText,
  GitBranch,
  Loader,
  Lock,
  MessageSquare,
  RefreshCw,
  Search,
  Shield,
  User,
  Users,
  Wallet,
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
const USE_LIVE_AGENTS = import.meta.env.VITE_LIVE_AGENTS === 'true'

const purposeOptions = [
  'School fees',
  'Stock / inventory',
  'Transport',
  'Emergency',
  'Working capital',
]

const incomeOptions = [
  { value: 'seasonal', label: 'Seasonal income' },
  { value: 'daily_cash', label: 'Daily cash sales' },
  { value: 'irregular', label: 'Changes from month to month' },
]

const agentCards = [
  {
    name: 'Scout',
    role: 'Financial literacy coach',
    icon: Search,
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    description: 'Reads income patterns, harvest timing, school-fee pressure, and repayment rhythm.',
  },
  {
    name: 'Guardian',
    role: 'Fair loan screening officer',
    icon: Shield,
    color: 'bg-blue-50 text-blue-800 border-blue-200',
    description: 'Checks the Scout notes, applies fair lending thresholds, and chooses the next step.',
  },
  {
    name: 'Hunter',
    role: 'Human briefing coordinator',
    icon: ClipboardList,
    color: 'bg-amber-50 text-amber-900 border-amber-200',
    description: 'Prepares a plain briefing for a loan officer when the application needs review.',
  },
]

const operatingCards = [
  {
    title: 'Memory architecture',
    icon: Database,
    text: 'The prototype keeps short-lived workflow memory for each member so pauses, handoffs, and urgent messages stay attached to the right application.',
  },
  {
    title: 'Handoff rules',
    icon: GitBranch,
    text: 'Scout passes context to Guardian. Guardian approves small strong cases, escalates higher or unclear cases, and calls Hunter when a human officer should review.',
  },
  {
    title: 'Safety rules',
    icon: Lock,
    text: 'The screen avoids banned denial language, does not use demographic shortcuts, and flags urgent debt or school-fee pressure for human attention.',
  },
  {
    title: 'Audit design',
    icon: FileText,
    text: 'Each decision keeps the member summary, agent outputs, workflow flags, and timing context so an officer can understand why the decision happened.',
  },
  {
    title: 'Self-improvement workflow',
    icon: RefreshCw,
    text: 'Future versions can compare decisions with repayment outcomes, review errors with humans, and only ship prompt changes after approval.',
  },
]

function toIntOrZero(value) {
  const number = Number(value)
  return Number.isFinite(number) ? Math.trunc(number) : 0
}

function isBlank(value) {
  return String(value ?? '').trim() === ''
}

function validateForm(form) {
  const requiredTextFields = [
    ['name', 'full name'],
    ['occupation', 'main work'],
    ['location', 'town or county'],
    ['phone', 'phone number'],
    ['purpose', 'loan purpose'],
  ]
  const requiredPositiveNumbers = [
    ['age', 'age'],
    ['loan_amount_kes', 'loan amount'],
    ['monthly_income_kes', 'monthly income'],
    ['sacco_member_months', 'months as a SACCO member'],
  ]
  const requiredZeroOrMoreNumbers = [
    ['savings_balance_kes', 'savings balance'],
    ['existing_loans', 'other active loans'],
    ['children', 'number of children'],
  ]

  const missing = requiredTextFields
    .filter(([key]) => isBlank(form[key]))
    .map(([, label]) => label)

  const invalid = []
  requiredPositiveNumbers.forEach(([key, label]) => {
    if (isBlank(form[key])) {
      missing.push(label)
    } else if (toIntOrZero(form[key]) <= 0) {
      invalid.push(`${label} must be greater than 0`)
    }
  })

  requiredZeroOrMoreNumbers.forEach(([key, label]) => {
    if (isBlank(form[key])) {
      missing.push(label)
    } else if (toIntOrZero(form[key]) < 0) {
      invalid.push(`${label} cannot be negative`)
    }
  })

  if (missing.length || invalid.length) {
    return [
      missing.length ? `Please fill in ${missing.join(', ')}.` : null,
      ...invalid,
    ].filter(Boolean)
  }

  return []
}

function parseMonthList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function parseAgeList(value) {
  const matches = String(value || '').match(/\d+/g)
  return matches ? matches.map((item) => Number(item)) : []
}

function formatMoney(value) {
  const number = Number(value)
  if (!Number.isFinite(number)) return 'KES 0'
  return `KES ${new Intl.NumberFormat('en-KE').format(number)}`
}

function humanizeKey(key) {
  return String(key)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
}

function renderPlainValue(value) {
  if (Array.isArray(value)) {
    if (value.length === 0) return <span className="text-darkSlate text-opacity-60">None listed</span>

    return (
      <ul className="space-y-1">
        {value.map((item, index) => (
          <li key={`${item}-${index}`} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gold" />
            <span>{typeof item === 'object' ? renderPlainText(item) : String(item)}</span>
          </li>
        ))}
      </ul>
    )
  }

  if (value && typeof value === 'object') {
    return (
      <div className="space-y-2">
        {Object.entries(value).map(([key, entryValue]) => (
          <div key={key}>
            <span className="font-semibold text-forestGreen">{humanizeKey(key)}: </span>
            <span>{renderPlainText(entryValue)}</span>
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined || value === '') return 'Not provided'
  return String(value)
}

function renderPlainText(value) {
  if (Array.isArray(value)) return value.length ? value.map(renderPlainText).join(', ') : 'None listed'
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .map(([key, entryValue]) => `${humanizeKey(key)}: ${renderPlainText(entryValue)}`)
      .join('; ')
  }
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'
  if (value === null || value === undefined || value === '') return 'Not provided'
  return String(value)
}

function statusFor(agentName, loading, result) {
  if (agentName === 'Scout') {
    if (result?.scout_json || result?.scout_output) return 'Done'
    return loading ? 'Reading application' : 'Waiting'
  }

  if (agentName === 'Guardian') {
    if (result?.guardian_json || result?.guardian_output) return 'Done'
    return loading ? 'Checking decision' : 'Waiting'
  }

  if (result?.hunter_output) return 'Done'
  if (result && result.decision !== 'ESCALATED') return 'Not needed'
  return loading ? 'Ready if needed' : 'Waiting'
}

function FormSection({ icon: Icon, title, note, children }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="rounded-lg bg-forestGreen p-2 text-white">
          <Icon size={20} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-forestGreen">{title}</h2>
          <p className="text-sm text-darkSlate text-opacity-70">{note}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">{children}</div>
    </section>
  )
}

function TextField({ label, hint, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <input {...props} className="input mt-2" />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

function TextAreaField({ label, hint, ...props }) {
  return (
    <label className="block md:col-span-2">
      <span className="field-label">{label}</span>
      <textarea {...props} className="textarea mt-2" />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

function SelectField({ label, hint, children, ...props }) {
  return (
    <label className="block">
      <span className="field-label">{label}</span>
      <select {...props} className="input mt-2">
        {children}
      </select>
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

function PlainDataRow({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="mb-1 text-xs font-bold uppercase tracking-wide text-darkSlate text-opacity-50">{label}</div>
      <div className="text-sm leading-6 text-darkSlate">{renderPlainValue(value)}</div>
    </div>
  )
}

function BooleanFlag({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-4 py-3">
      <span className="text-sm font-medium text-darkSlate">{label}</span>
      <span
        className={`rounded-full px-3 py-1 text-xs font-bold ${
          value ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-800'
        }`}
      >
        {value ? 'Yes' : 'No'}
      </span>
    </div>
  )
}

function AgentWorkflow({ loading, result, error }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-gold">Agent workspace</p>
          <h2 className="text-2xl font-bold text-forestGreen">See the loan agents working</h2>
          <p className="mt-1 text-sm text-darkSlate text-opacity-70">
            The form stays simple for members. The agent section shows what the system checks behind the scenes.
          </p>
        </div>
        <div
          className={`inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-bold ${
            error
              ? 'bg-red-100 text-red-800'
              : result
                ? 'bg-emerald-100 text-emerald-800'
                : loading
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-slate-100 text-darkSlate'
          }`}
        >
          {loading ? <Loader className="animate-spin" size={16} /> : <Activity size={16} />}
          {error ? 'Needs attention' : result ? 'Assessment complete' : loading ? 'Agents active' : 'Ready'}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {agentCards.map((agent, index) => {
          const Icon = agent.icon
          const status = statusFor(agent.name, loading, result)

          return (
            <div key={agent.name} className={`rounded-lg border p-5 ${agent.color}`}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-xs font-semibold opacity-80">{agent.role}</p>
                  </div>
                </div>
                {index < agentCards.length - 1 && <ArrowRight className="hidden opacity-50 lg:block" size={18} />}
              </div>
              <p className="min-h-[72px] text-sm leading-6">{agent.description}</p>
              <div className="mt-4 inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm">
                {status}
              </div>
            </div>
          )
        })}
      </div>
    </motion.section>
  )
}

function AgentOutputs({ result }) {
  if (!result) {
    return (
      <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
        <p className="font-semibold text-darkSlate">Submit the form to see Scout, Guardian, and Hunter outputs here.</p>
        <p className="mt-1 text-sm text-darkSlate text-opacity-70">
          The output will appear as short notes, scores, and officer-friendly summaries.
        </p>
      </div>
    )
  }

  const scout = result.scout_json || {}
  const guardian = result.guardian_json || {}
  const decision = guardian.decision || result.decision || 'Pending'
  const score = Number(guardian.loan_score || 0)
  const scoreWidth = Math.max(0, Math.min(100, score))

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-start">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-gold">Application result</p>
            <h2 className="text-2xl font-bold text-forestGreen">{result.member_profile?.name || 'Applicant'}</h2>
            <p className="text-sm text-darkSlate text-opacity-70">
              {result.member_profile?.occupation || 'Occupation not provided'} in{' '}
              {result.member_profile?.location || 'location not provided'} requested{' '}
              {formatMoney(result.member_profile?.loan_amount_kes)}.
            </p>
          </div>
          <div className="rounded-lg bg-forestGreen px-5 py-3 text-white">
            <div className="text-xs font-bold uppercase text-cream">Decision</div>
            <div className="text-xl font-bold">{decision}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4 lg:col-span-1">
            <div className="mb-2 text-sm font-bold text-darkSlate">Guardian score</div>
            <div className="flex items-end gap-2">
              <span className="text-4xl font-bold text-forestGreen">{score || '0'}</span>
              <span className="pb-1 text-sm text-darkSlate text-opacity-70">out of 100</span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-gold" style={{ width: `${scoreWidth}%` }} />
            </div>
          </div>
          <PlainDataRow label="Guardian message" value={guardian.approval_message || guardian.escalation_context || guardian.denial_reason} />
          <PlainDataRow label="Risk notes" value={guardian.risk_flags || []} />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Search size={22} className="text-emerald-800" />
            <div>
              <h3 className="font-bold text-emerald-900">Scout output</h3>
              <p className="text-sm text-emerald-900 text-opacity-75">Income pattern, stress signals, and repayment guidance.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <PlainDataRow label="Income pattern" value={scout.income_pattern} />
            <PlainDataRow label="Harvest timing" value={scout.harvest_alignment} />
            <PlainDataRow label="Stress signals" value={scout.stress_signals || []} />
            <PlainDataRow label="Learning gaps" value={scout.literacy_gaps || []} />
            <PlainDataRow label="Repayment plan" value={scout.recommended_repayment_schedule} />
            <PlainDataRow label="Scout summary" value={scout.scout_summary || result.scout_output} />
          </div>
        </div>

        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <Shield size={22} className="text-blue-800" />
            <div>
              <h3 className="font-bold text-blue-900">Guardian output</h3>
              <p className="text-sm text-blue-900 text-opacity-75">Fair screening result and next action.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3">
            <PlainDataRow label="Decision" value={decision} />
            <PlainDataRow label="Loan score" value={score ? `${score} out of 100` : 'Not provided'} />
            <PlainDataRow label="Reason or message" value={guardian.approval_message || guardian.escalation_context || guardian.denial_reason} />
            <PlainDataRow label="Risk notes" value={guardian.risk_flags || []} />
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <div className="mb-4 flex items-center gap-3">
          <ClipboardList size={22} className="text-amber-900" />
          <div>
            <h3 className="font-bold text-amber-950">Hunter briefing</h3>
            <p className="text-sm text-amber-950 text-opacity-75">Human-officer notes appear when the case is escalated.</p>
          </div>
        </div>
        {result.hunter_output ? (
          <div className="rounded-lg bg-white p-4 text-sm leading-6 text-darkSlate whitespace-pre-wrap">{result.hunter_output}</div>
        ) : (
          <div className="rounded-lg bg-white p-4 text-sm text-darkSlate">
            Hunter did not need to prepare a human briefing for this decision.
          </div>
        )}
      </section>
    </motion.div>
  )
}

function OperatingModel({ result }) {
  const flags = result?.workflow_flags
  const triggerContext = result?.trigger_context || {}
  const hasTriggerContext = Object.values(triggerContext).some((value) => value !== null && value !== undefined && value !== '')

  return (
    <section className="mt-10 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-wide text-gold">Operating model</p>
        <h2 className="text-2xl font-bold text-forestGreen">Agent definitions and controls</h2>
        <p className="mt-1 text-sm text-darkSlate text-opacity-70">
          These are the plain-language rules behind the lending workflow.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        {operatingCards.map((card) => {
          const Icon = card.icon
          return (
            <div key={card.title} className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white text-forestGreen shadow-sm">
                <Icon size={20} />
              </div>
              <h3 className="font-bold text-darkSlate">{card.title}</h3>
              <p className="mt-2 text-sm leading-6 text-darkSlate text-opacity-75">{card.text}</p>
            </div>
          )
        })}
      </div>

      {result && (
        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 font-bold text-forestGreen">Live safety flags</h3>
            {flags ? (
              <div className="space-y-3">
                <BooleanFlag label="Scout paused all messages" value={flags.scout_pause_all_messages} />
                <BooleanFlag label="Guardian human takeover needed" value={flags.guardian_human_takeover} />
                <BooleanFlag label="Full system pause needed" value={flags.full_system_pause} />
                <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-darkSlate">
                  Messages counted today: <span className="font-bold">{flags.sms_count_today || 0}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-darkSlate text-opacity-70">No workflow flags were returned for this assessment.</p>
            )}
          </div>

          <div className="rounded-lg border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 font-bold text-forestGreen">Handoff context</h3>
            {hasTriggerContext ? (
              <div className="space-y-3">
                {Object.entries(triggerContext).map(([key, value]) => (
                  <PlainDataRow key={key} label={humanizeKey(key)} value={value} />
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-darkSlate text-opacity-70">
                No urgent school-fees or debt-pressure context was triggered for this application.
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default function LoanApplicationForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)

  const [form, setForm] = useState({
    name: '',
    age: '',
    occupation: '',
    location: '',
    phone: '',
    loan_amount_kes: '',
    purpose: 'School fees',
    monthly_income_kes: '',
    income_type: 'seasonal',
    peak_months: 'September',
    savings_balance_kes: '',
    existing_loans: '0',
    sacco_member_months: '',
    children: '0',
    child_ages: '',
    member_text: '',
    child_age: '',
    next_harvest_date: '',
  })

  const peakMonthsList = useMemo(() => parseMonthList(form.peak_months), [form.peak_months])
  const childAgesList = useMemo(() => parseAgeList(form.child_ages), [form.child_ages])

  const onChange = (key) => (event) => {
    setForm((previous) => ({ ...previous, [key]: event.target.value }))
  }

  const copyToClipboard = async (text) => {
    await navigator.clipboard.writeText(text)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setResult(null)

    const validationErrors = validateForm(form)
    if (validationErrors.length) {
      setError(validationErrors.join(' '))
      return
    }

    setLoading(true)

    try {
      const controller = new AbortController()
      const timeoutId = window.setTimeout(() => controller.abort(), 90000)
      const payload = {
        name: form.name,
        age: toIntOrZero(form.age),
        occupation: form.occupation,
        location: form.location,
        phone: form.phone,
        loan_amount_kes: toIntOrZero(form.loan_amount_kes),
        purpose: form.purpose,
        monthly_income_kes: toIntOrZero(form.monthly_income_kes),
        income_type: form.income_type,
        peak_months: peakMonthsList,
        savings_balance_kes: toIntOrZero(form.savings_balance_kes),
        existing_loans: toIntOrZero(form.existing_loans),
        sacco_member_months: toIntOrZero(form.sacco_member_months),
        children: toIntOrZero(form.children),
        child_ages: childAgesList,
        member_text: form.member_text,
        child_age: form.child_age,
        next_harvest_date: form.next_harvest_date,
        live_agents: USE_LIVE_AGENTS,
      }

      let response
      try {
        response = await fetch(`${API_BASE_URL}/api/apply`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        })
      } finally {
        window.clearTimeout(timeoutId)
      }

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || data.error || 'Application failed')
      }

      setResult({ ...data.result, response_timestamp: data.timestamp })
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('The API took too long to respond. Check that the backend is running and live agents are not stuck.')
      } else {
        setError(err.message || 'Failed to connect to API server')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream via-white to-slate-100 pb-16 pt-28">
      <div className="section-container max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-8"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-forestGreen shadow-sm">
            <CheckCircle size={16} className="text-gold" />
            Plain-language application
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold text-forestGreen md:text-5xl">Apply for a Loan</h1>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-darkSlate">
                Share the member story in everyday words. Ujima will translate the details into the agent workflow and show the decision path below the form.
              </p>
            </div>
            <div className="rounded-lg border border-gold border-opacity-30 bg-white p-4 shadow-sm">
              <p className="text-sm font-bold text-darkSlate">What the agents need</p>
              <div className="mt-3 space-y-2 text-sm text-darkSlate text-opacity-75">
                <div className="flex items-center gap-2">
                  <User size={15} className="text-forestGreen" />
                  Member identity
                </div>
                <div className="flex items-center gap-2">
                  <Wallet size={15} className="text-forestGreen" />
                  Income and savings
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare size={15} className="text-forestGreen" />
                  Any urgent concern
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          className="space-y-5"
        >
          <FormSection icon={User} title="Member details" note="Basic contact and location details for the loan record.">
            <TextField label="Full name" value={form.name} onChange={onChange('name')} placeholder="Example: Grace Akinyi" required />
            <TextField label="Age" value={form.age} onChange={onChange('age')} placeholder="Example: 42" inputMode="numeric" required min="1" />
            <TextField label="Main work" value={form.occupation} onChange={onChange('occupation')} placeholder="Example: Maize farmer" required />
            <TextField label="Town or county" value={form.location} onChange={onChange('location')} placeholder="Example: Kakamega" required />
            <TextField label="Phone number" value={form.phone} onChange={onChange('phone')} placeholder="Example: 07xx xxx xxx" required />
          </FormSection>

          <FormSection icon={Briefcase} title="Loan request" note="How much the member needs and what the money will support.">
            <TextField
              label="Loan amount in shillings"
              value={form.loan_amount_kes}
              onChange={onChange('loan_amount_kes')}
              placeholder="Example: 28000"
              inputMode="numeric"
              required
              min="1"
            />
            <SelectField label="Loan purpose" value={form.purpose} onChange={onChange('purpose')} required>
              {purposeOptions.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </SelectField>
          </FormSection>

          <FormSection icon={Wallet} title="Income and savings" note="The agents use this to match repayments with real cash flow.">
            <TextField
              label="Usual monthly income"
              value={form.monthly_income_kes}
              onChange={onChange('monthly_income_kes')}
              placeholder="Example: 12000"
              inputMode="numeric"
              required
              min="1"
            />
            <SelectField label="How income usually arrives" value={form.income_type} onChange={onChange('income_type')}>
              {incomeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </SelectField>
            <TextField
              label="Best earning months"
              value={form.peak_months}
              onChange={onChange('peak_months')}
              placeholder="Example: September, October"
              hint="Write month names the way a member would say them."
            />
            <TextField
              label="Savings balance"
              value={form.savings_balance_kes}
              onChange={onChange('savings_balance_kes')}
              placeholder="Example: 4500"
              inputMode="numeric"
              required
              min="0"
            />
            <TextField
              label="Other active loans"
              value={form.existing_loans}
              onChange={onChange('existing_loans')}
              placeholder="Example: 1"
              inputMode="numeric"
              required
              min="0"
            />
            <TextField
              label="Months as a SACCO member"
              value={form.sacco_member_months}
              onChange={onChange('sacco_member_months')}
              placeholder="Example: 18"
              inputMode="numeric"
              required
              min="1"
            />
          </FormSection>

          <FormSection icon={Users} title="Household context" note="Use normal wording here; the system will format it for the agents.">
            <TextField
              label="Number of children"
              value={form.children}
              onChange={onChange('children')}
              placeholder="Example: 3"
              inputMode="numeric"
              required
              min="0"
            />
            <TextField
              label="Children's ages"
              value={form.child_ages}
              onChange={onChange('child_ages')}
              placeholder="Example: 6, 9, 14"
              hint="Write age numbers like this: 6, 9, 14."
            />
          </FormSection>

          <FormSection icon={Calendar} title="Urgent timing" note="Optional details for school-fee, harvest, or pressure situations.">
            <TextField
              label="Age of the child needing fees"
              value={form.child_age}
              onChange={onChange('child_age')}
              placeholder="Example: 7"
              inputMode="numeric"
            />
            <TextField
              label="Next harvest or pay date"
              value={form.next_harvest_date}
              onChange={onChange('next_harvest_date')}
              type="date"
            />
            <TextAreaField
              label="Anything the member wants the officer to know"
              value={form.member_text}
              onChange={onChange('member_text')}
              placeholder="Example: I am worried about school fees before harvest."
              rows={4}
              hint="Urgent phrases about school fees or dangerous debt pressure are passed to Guardian."
            />
          </FormSection>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            disabled={loading}
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-lg bg-forestGreen px-6 py-4 font-bold text-white shadow-lg transition hover:bg-opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader className="animate-spin" size={20} />
                Agents are reviewing the application
              </>
            ) : (
              <>
                <ClipboardList size={20} />
                Apply Loan
              </>
            )}
          </motion.button>
        </motion.form>

        <AgentWorkflow loading={loading} result={result} error={error} />

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 flex items-start gap-4 rounded-lg border-2 border-red-300 bg-red-50 p-5"
          >
            <AlertCircle className="flex-shrink-0 text-red-600" size={22} />
            <div>
              <div className="font-bold text-red-800">Application failed</div>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </motion.div>
        )}

        <AgentOutputs result={result} />
        <OperatingModel result={result} />

        {result && (
          <motion.button
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 font-bold text-forestGreen transition hover:bg-opacity-90"
          >
            <Copy size={20} />
            Copy full record
          </motion.button>
        )}
      </div>
    </div>
  )
}
