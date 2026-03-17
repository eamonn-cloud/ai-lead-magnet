import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import corexLogo from '../assets/corex-logo.webp'
import type { QuizState } from '../lib/types'

// ─── Data ────────────────────────────────────────────────────────────────────

const SERVICES = ['SEO', 'Paid Media', 'Content & Social', 'Web & Development', 'PR & Comms', 'Full Service', 'Other']
const PM_TOOLS  = ['None', 'Spreadsheets', 'Asana', 'Monday.com', 'ClickUp', 'Notion', 'Other']
const CRMS      = ['None', 'Spreadsheets', 'HubSpot', 'Salesforce', 'Pipedrive', 'Other']
const BOTTLENECKS = ['Delivery', 'CRM & Pipeline', 'Reporting', 'Automation', 'Team Accountability', 'Founder Dependency', 'Capacity Planning']
const GOALS = ['Grow revenue', 'Improve margins', 'Build and delegate the team', 'Reduce founder hours', 'All of the above']
const REVENUE_BANDS = ['€500k–€1M', '€1M–€3M', '€3M–€10M']
const TEAM_SIZES    = ['5–15', '16–40', '41–80']

const ANSWER_OPTIONS = [
  { value: 0, label: 'No' },
  { value: 1, label: 'Partially' },
  { value: 2, label: 'Yes' },
]

interface MaturityQuestion {
  key: string
  text: string
  noLabel:        string
  partiallyLabel: string
  yesLabel:       string
}

interface CategoryStep {
  category: string
  description: string
  questions: [MaturityQuestion, MaturityQuestion]
}

const CATEGORY_STEPS: CategoryStep[] = [
  {
    category:    'Delivery Operations',
    description: 'How your agency manages and delivers client work',
    questions: [
      {
        key: 'q1',
        text: 'Are your delivery processes and workflows documented and consistently followed by the team?',
        noLabel:        'We rely on individual knowledge',
        partiallyLabel: 'Some things written down, inconsistently used',
        yesLabel:       'Documented, accessible, and followed by all',
      },
      {
        key: 'q2',
        text: 'Are client handoffs between team members handled through a clear, standardised process?',
        noLabel:        'Ad hoc - things fall through the cracks',
        partiallyLabel: 'Informal norms exist, no formal process',
        yesLabel:       'Clear handoff steps with checklists',
      },
    ],
  },
  {
    category:    'CRM & Pipeline Hygiene',
    description: 'How you track and manage your sales pipeline',
    questions: [
      {
        key: 'q3',
        text: 'Are all active deals and prospects tracked in a CRM with current, accurate information?',
        noLabel:        'We use spreadsheets, email, or nothing',
        partiallyLabel: 'CRM exists but rarely kept up to date',
        yesLabel:       'CRM consistently maintained by everyone',
      },
      {
        key: 'q4',
        text: 'Are your pipeline stages clearly defined with agreed entry and exit criteria?',
        noLabel:        'Stages are vague or unused',
        partiallyLabel: 'Stages exist but no real discipline',
        yesLabel:       'Defined stages, consistently applied',
      },
    ],
  },
  {
    category:    'Reporting & Forecasting',
    description: 'Your visibility into business performance and future revenue',
    questions: [
      {
        key: 'q5',
        text: 'Do you produce a monthly performance or financial report for the business?',
        noLabel:        'No regular reporting',
        partiallyLabel: 'Occasional or inconsistent reports',
        yesLabel:       'Monthly, consistent, reviewed by leadership',
      },
      {
        key: 'q6',
        text: 'Can you forecast revenue for the next 90 days with reasonable confidence?',
        noLabel:        'Little visibility beyond current month',
        partiallyLabel: 'Rough estimates based on gut feel',
        yesLabel:       'Based on pipeline data and recurring revenue',
      },
    ],
  },
  {
    category:    'Automation & AI Adoption',
    description: 'How much your agency uses automation to reduce manual work',
    questions: [
      {
        key: 'q7',
        text: 'Are repetitive admin tasks (reporting, onboarding, invoicing, status updates) automated?',
        noLabel:        'Most admin is still done manually',
        partiallyLabel: 'One or two things automated',
        yesLabel:       'Multiple workflows automated, saving meaningful time',
      },
      {
        key: 'q8',
        text: 'Is your team actively using AI tools in a structured way to improve speed or quality of work?',
        noLabel:        'Not using AI tools',
        partiallyLabel: 'A few people experimenting informally',
        yesLabel:       'Structured adoption with defined use cases',
      },
    ],
  },
  {
    category:    'Team Cadence & Accountability',
    description: 'How your team is structured around goals and regular rhythms',
    questions: [
      {
        key: 'q9',
        text: 'Do you run a structured weekly team meeting or operating cadence?',
        noLabel:        'Meetings are ad hoc or reactive',
        partiallyLabel: 'Sometimes happens, not reliable',
        yesLabel:       'Consistent weekly cadence, standing agenda',
      },
      {
        key: 'q10',
        text: 'Are team members held to clear performance targets or KPIs that are tracked regularly?',
        noLabel:        'No defined targets',
        partiallyLabel: 'Targets exist on paper, rarely reviewed',
        yesLabel:       'Tracked and reviewed at least monthly',
      },
    ],
  },
  {
    category:    'Founder Dependency',
    description: 'How much the agency depends on the founder to run',
    questions: [
      {
        key: 'q11',
        text: 'Can client work be delivered without the founder\'s direct involvement?',
        noLabel:        'Founder is in day-to-day delivery',
        partiallyLabel: 'Involved in key accounts or escalations only',
        yesLabel:       'Team delivers independently across all accounts',
      },
      {
        key: 'q12',
        text: 'Are key decisions (hiring, pricing, client escalations) delegated to team leads?',
        noLabel:        'Founder makes most decisions',
        partiallyLabel: 'Some delegation, most still routes through founder',
        yesLabel:       'Documented decision rights, team leads empowered',
      },
    ],
  },
  {
    category:    'Sales Process',
    description: 'How consistently your agency converts and generates new business',
    questions: [
      {
        key: 'q13',
        text: 'Do you have a documented, repeatable process for converting new business leads?',
        noLabel:        'Every deal is handled differently',
        partiallyLabel: 'Informal process exists in someone\'s head',
        yesLabel:       'Documented process, consistently followed',
      },
      {
        key: 'q14',
        text: 'Is outreach or lead generation activity happening consistently each week?',
        noLabel:        'Fully reactive, only when pipeline is empty',
        partiallyLabel: 'Happens in bursts, not weekly',
        yesLabel:       'Consistent weekly outreach or lead gen activity',
      },
    ],
  },
]

// Total steps: 0=intro, 1=company basics, 2=services+tools, 3=bottleneck+goal,
//              4–10 = 7 category pairs, 11=contact, 12=loading
const TOTAL_STEPS = 13

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: number }) {
  const progress = Math.round(((step) / (TOTAL_STEPS - 1)) * 100)
  return (
    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-primary rounded-full transition-all duration-500 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

function RadioCard({
  label,
  sublabel,
  selected,
  onClick,
}: {
  label: string
  sublabel?: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`option-card ${selected ? 'selected' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? 'border-blue-primary bg-blue-primary' : 'border-white/30'
        }`}>
          {selected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
        <div>
          <p className={`font-semibold text-sm transition-colors ${selected ? 'text-white' : 'text-white/80'}`}>{label}</p>
          {sublabel && <p className="text-white/40 text-xs mt-0.5">{sublabel}</p>}
        </div>
      </div>
    </button>
  )
}

function CheckCard({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`option-card ${selected ? 'selected' : ''}`}
    >
      <div className="flex items-center gap-3">
        <div className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
          selected ? 'border-blue-primary bg-blue-primary' : 'border-white/30'
        }`}>
          {selected && <span className="text-white text-[10px] leading-none">✓</span>}
        </div>
        <p className={`font-medium text-sm transition-colors ${selected ? 'text-white' : 'text-white/70'}`}>{label}</p>
      </div>
    </button>
  )
}

function AnswerCard({
  option,
  sublabel,
  selected,
  onClick,
}: {
  option: { value: number; label: string }
  sublabel: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left p-5 rounded-xl border transition-all duration-150 ${
        selected
          ? 'border-blue-primary bg-blue-primary/15 shadow-[0_0_0_1px_rgba(0,94,183,0.5)]'
          : 'border-white/10 bg-white/5 hover:border-blue-primary/40 hover:bg-blue-primary/8'
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 font-bold text-sm transition-colors ${
          selected ? 'border-blue-primary bg-blue-primary text-white' : 'border-white/20 text-white/40'
        }`}>
          {option.label[0]}
        </div>
        <div>
          <p className={`font-semibold text-sm mb-1 transition-colors ${selected ? 'text-white' : 'text-white/80'}`}>
            {option.label}
          </p>
          <p className="text-white/40 text-xs leading-relaxed">{sublabel}</p>
        </div>
      </div>
    </button>
  )
}

// ─── Loading Screen ───────────────────────────────────────────────────────────

function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0)

  const PHASES = [
    'Analysing your agency profile…',
    'Calculating operational maturity scores…',
    'Matching bottlenecks to recommendations…',
    'Generating your 90-day plan…',
    'Finalising your report…',
  ]

  useEffect(() => {
    const timers = PHASES.map((_, i) =>
      setTimeout(() => setPhase(i), i * 5000)
    )
    const done = setTimeout(onComplete, 26000)
    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(done)
    }
  }, [onComplete])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-blue-primary/8 blur-[120px]" />
      </div>

      {/* Animated orb */}
      <div className="relative mb-12">
        <div className="w-24 h-24 rounded-full bg-navy-dark border border-blue-primary/30 flex items-center justify-center relative">
          <div className="absolute inset-0 rounded-full border border-blue-primary/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-[-8px] rounded-full border border-blue-primary/10 animate-ping" style={{ animationDuration: '2.5s' }} />
          <img src={corexLogo} alt="Corex Operations" className="h-8 w-auto" />
        </div>
      </div>

      <p className="section-label mb-4">Corex Operations</p>
      <h2 className="text-2xl md:text-3xl font-black text-white uppercase mb-3">
        Building Your Plan
      </h2>
      <p className="text-white/50 text-sm mb-10 min-h-[20px] transition-all duration-500">
        {PHASES[phase]}
      </p>

      {/* Progress bar */}
      <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mb-8">
        <div className="h-full bg-blue-primary rounded-full animate-progress" />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {PHASES.map((p, i) => (
          <div
            key={p}
            className={`flex items-center gap-3 text-xs transition-all duration-300 ${
              i <= phase ? 'text-white/70' : 'text-white/20'
            }`}
          >
            <span className={`w-3 h-3 rounded-full flex items-center justify-center ${
              i < phase ? 'bg-emerald-400' : i === phase ? 'bg-blue-primary animate-pulse' : 'bg-white/10'
            }`}>
              {i < phase && <span className="text-[7px]">✓</span>}
            </span>
            {p}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Quiz Component ──────────────────────────────────────────────────────

const INITIAL_STATE: QuizState = {
  step: 0,
  name: '', email: '', companyName: '', website: '',
  revenueBand: '', teamSize: '',
  services: [], pmTool: '', crm: '',
  biggestBottleneck: '', mainGoal: '',
  implementationHelp: null, consent: false,
  answers: {},
}

export default function Quiz() {
  const navigate = useNavigate()
  const [state, setState] = useState<QuizState>(() => {
    const saved = localStorage.getItem('quiz_state')
    if (saved) {
      try { return JSON.parse(saved) } catch { return INITIAL_STATE }
    }
    return INITIAL_STATE
  })
  const [animating, setAnimating] = useState(false)
  const [error, setError] = useState('')

  // Persist to localStorage
  useEffect(() => {
    if (state.step > 0) localStorage.setItem('quiz_state', JSON.stringify(state))
  }, [state])

  const set = (updates: Partial<QuizState>) =>
    setState(prev => ({ ...prev, ...updates }))

  const nextStep = useCallback(() => {
    setError('')
    setAnimating(true)
    setTimeout(() => {
      setState(prev => ({ ...prev, step: prev.step + 1 }))
      setAnimating(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 200)
  }, [])

  const prevStep = () => {
    setState(prev => ({ ...prev, step: Math.max(0, prev.step - 1) }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const setAnswer = (key: string, value: number) =>
    setState(prev => ({ ...prev, answers: { ...prev.answers, [key]: value } }))

  const toggleService = (s: string) =>
    setState(prev => ({
      ...prev,
      services: prev.services.includes(s)
        ? prev.services.filter(x => x !== s)
        : [...prev.services, s],
    }))

  const handleComplete = useCallback(() => {
    localStorage.setItem('quiz_report', 'demo')
    localStorage.setItem('quiz_company_name', state.companyName)
    localStorage.setItem('quiz_form_data', JSON.stringify({
      name: state.name,
      email: state.email,
      companyName: state.companyName,
      website: state.website,
      revenueBand: state.revenueBand,
      teamSize: state.teamSize,
      services: state.services,
      pmTool: state.pmTool,
      crm: state.crm,
      biggestBottleneck: state.biggestBottleneck,
      mainGoal: state.mainGoal,
      implementationHelp: state.implementationHelp,
    }))
    localStorage.setItem('quiz_answers', JSON.stringify(state.answers))
    localStorage.removeItem('quiz_state')
    navigate('/report/demo')
  }, [navigate, state])

  const validateStep = (): boolean => {
    switch (state.step) {
      case 1:
        if (!state.companyName.trim()) { setError('Please enter your company name'); return false }
        if (!state.revenueBand) { setError('Please select your revenue band'); return false }
        if (!state.teamSize)    { setError('Please select your team size'); return false }
        return true
      case 2:
        if (state.services.length === 0) { setError('Please select at least one service'); return false }
        if (!state.pmTool) { setError('Please select your PM tool'); return false }
        if (!state.crm)    { setError('Please select your CRM'); return false }
        return true
      case 3:
        if (!state.biggestBottleneck) { setError('Please select your biggest bottleneck'); return false }
        if (!state.mainGoal)          { setError('Please select your main goal'); return false }
        return true
      case 11: {
        if (!state.name.trim())  { setError('Please enter your name'); return false }
        if (!state.email.trim() || !state.email.includes('@')) { setError('Please enter a valid work email'); return false }
        if (state.implementationHelp === null) { setError('Please answer the implementation question'); return false }
        if (!state.consent) { setError('Please accept the terms to continue'); return false }
        return true
      }
      default: {
        // Category steps 4–10
        if (state.step >= 4 && state.step <= 10) {
          const catStep = CATEGORY_STEPS[state.step - 4]
          const [q1, q2] = catStep.questions
          if (state.answers[q1.key as keyof typeof state.answers] === undefined) {
            setError('Please answer both questions to continue'); return false
          }
          if (state.answers[q2.key as keyof typeof state.answers] === undefined) {
            setError('Please answer both questions to continue'); return false
          }
        }
        return true
      }
    }
  }

  const handleNext = () => {
    if (!validateStep()) return
    nextStep()
  }

  // ── Render loading step (step 12) ─────────────────────────────────────────
  if (state.step === 12) {
    return <LoadingScreen onComplete={handleComplete} />
  }

  const isMaturityStep = state.step >= 4 && state.step <= 10

  return (
    <div className="min-h-screen flex flex-col">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-blue-primary/8 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/8">
        <div className="flex items-center gap-3">
          <img src={corexLogo} alt="Corex Operations" className="h-7 w-auto" />
        </div>

        {/* Progress */}
        {state.step > 0 && state.step < 12 && (
          <div className="flex-1 max-w-xs mx-8">
            <ProgressBar step={state.step} />
          </div>
        )}

        <div className="text-white/40 text-xs font-medium">
          {state.step > 0 && state.step < 12 ? `Step ${state.step} of 11` : ''}
        </div>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div
          className={`w-full max-w-2xl transition-all duration-200 ${animating ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
        >

          {/* ── Step 0: Intro ──────────────────────────────────────────── */}
          {state.step === 0 && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-slow" />
                <span className="text-cyan text-xs font-semibold uppercase tracking-[0.15em]">Free Agency Diagnostic</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-4">
                Most agencies<br />score below 50.<br /><span className="text-gradient">Where do you stand?</span>
              </h1>
              <p className="text-white/60 text-base leading-relaxed mb-8 max-w-lg mx-auto">
                14 questions across 7 operational areas. Takes about 4 minutes. You'll get a personalised 90-day operational plan the moment you're done.
              </p>
              <div className="flex flex-col items-center gap-3 mb-4">
                <button onClick={() => set({ step: 1 })} className="btn-primary text-base px-12 py-4">
                  Get My Agency Score →
                </button>
                <p className="text-white/30 text-xs">No account needed · Free · Instant results</p>
              </div>
              <p className="text-white/30 text-xs mb-6 max-w-sm mx-auto">
                Agencies that don't know their bottleneck spend 6–12 months fixing the wrong thing.
              </p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                <div className="flex -space-x-1.5">
                  {['bg-blue-400', 'bg-emerald-400', 'bg-amber-400', 'bg-purple-400'].map((c, i) => (
                    <div key={i} className={`w-5 h-5 rounded-full ${c} border-2 border-navy-dark`} />
                  ))}
                </div>
                <span className="text-white/50 text-xs">Join <span className="text-white font-semibold">127 agency owners</span> who've taken the audit this month</span>
              </div>
            </div>
          )}

          {/* ── Step 1: Company basics ─────────────────────────────────── */}
          {state.step === 1 && (
            <div>
              <p className="section-label mb-3">About Your Agency</p>
              <h2 className="text-3xl font-black text-white uppercase mb-8">Tell us the basics.</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Company name</label>
                  <input
                    type="text"
                    placeholder="Your agency name"
                    value={state.companyName}
                    onChange={e => set({ companyName: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20
                               focus:outline-none focus:border-blue-primary/60 focus:bg-blue-primary/5 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">Annual revenue</label>
                  <div className="space-y-2">
                    {REVENUE_BANDS.map(band => (
                      <RadioCard
                        key={band}
                        label={band}
                        selected={state.revenueBand === band}
                        onClick={() => set({ revenueBand: band })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">Team size</label>
                  <div className="space-y-2">
                    {TEAM_SIZES.map(size => (
                      <RadioCard
                        key={size}
                        label={`${size} people`}
                        selected={state.teamSize === size}
                        onClick={() => set({ teamSize: size })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Services & tools ───────────────────────────────── */}
          {state.step === 2 && (
            <div>
              <p className="section-label mb-3">Services & Stack</p>
              <h2 className="text-3xl font-black text-white uppercase mb-8">What do you offer, and how do you run it?</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">Services offered <span className="text-white/30">(select all that apply)</span></label>
                  <div className="grid grid-cols-2 gap-2">
                    {SERVICES.map(s => (
                      <CheckCard
                        key={s}
                        label={s}
                        selected={state.services.includes(s)}
                        onClick={() => toggleService(s)}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">Project management tool</label>
                  <div className="grid grid-cols-2 gap-2">
                    {PM_TOOLS.map(t => (
                      <RadioCard
                        key={t}
                        label={t}
                        selected={state.pmTool === t}
                        onClick={() => set({ pmTool: t })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">CRM</label>
                  <div className="grid grid-cols-2 gap-2">
                    {CRMS.map(c => (
                      <RadioCard
                        key={c}
                        label={c}
                        selected={state.crm === c}
                        onClick={() => set({ crm: c })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Goals & bottleneck ────────────────────────────── */}
          {state.step === 3 && (
            <div>
              <p className="section-label mb-3">Context</p>
              <h2 className="text-3xl font-black text-white uppercase mb-8">What's slowing you down?</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">Biggest bottleneck right now</label>
                  <div className="space-y-2">
                    {BOTTLENECKS.map(b => (
                      <RadioCard
                        key={b}
                        label={b}
                        selected={state.biggestBottleneck === b}
                        onClick={() => set({ biggestBottleneck: b })}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">Main goal for the next 12 months</label>
                  <div className="space-y-2">
                    {GOALS.map(g => (
                      <RadioCard
                        key={g}
                        label={g}
                        selected={state.mainGoal === g}
                        onClick={() => set({ mainGoal: g })}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Steps 4–10: Category maturity questions ──────────────── */}
          {isMaturityStep && (() => {
            const catStep = CATEGORY_STEPS[state.step - 4]
            const [q1, q2] = catStep.questions
            const catIndex = state.step - 3
            return (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <p className="section-label">Category {catIndex} of 7</p>
                </div>
                <h2 className="text-3xl font-black text-white uppercase mb-1">{catStep.category}</h2>
                <p className="text-white/40 text-sm mb-8">{catStep.description}</p>

                {/* Question 1 */}
                <div className="mb-8">
                  <p className="text-white font-semibold text-base mb-4 leading-snug">{q1.text}</p>
                  <div className="space-y-3">
                    {ANSWER_OPTIONS.map(opt => (
                      <AnswerCard
                        key={opt.value}
                        option={opt}
                        sublabel={opt.value === 0 ? q1.noLabel : opt.value === 1 ? q1.partiallyLabel : q1.yesLabel}
                        selected={state.answers[q1.key as keyof typeof state.answers] === opt.value}
                        onClick={() => setAnswer(q1.key, opt.value)}
                      />
                    ))}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="mb-8">
                  <p className="text-white font-semibold text-base mb-4 leading-snug">{q2.text}</p>
                  <div className="space-y-3">
                    {ANSWER_OPTIONS.map(opt => (
                      <AnswerCard
                        key={opt.value}
                        option={opt}
                        sublabel={opt.value === 0 ? q2.noLabel : opt.value === 1 ? q2.partiallyLabel : q2.yesLabel}
                        selected={state.answers[q2.key as keyof typeof state.answers] === opt.value}
                        onClick={() => setAnswer(q2.key, opt.value)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )
          })()}

          {/* ── Step 11: Contact ──────────────────────────────────────── */}
          {state.step === 11 && (
            <div>
              <p className="section-label mb-3">Almost Done</p>
              <h2 className="text-3xl font-black text-white uppercase mb-2">Where should we send your plan?</h2>
              <p className="text-white/50 text-sm mb-8">Your report generates immediately. No spam, no sequences - just your plan.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">First name</label>
                  <input
                    type="text"
                    placeholder="Jane"
                    value={state.name}
                    onChange={e => set({ name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20
                               focus:outline-none focus:border-blue-primary/60 focus:bg-blue-primary/5 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-2">Work email</label>
                  <input
                    type="email"
                    placeholder="jane@youragency.com"
                    value={state.email}
                    onChange={e => set({ email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/20
                               focus:outline-none focus:border-blue-primary/60 focus:bg-blue-primary/5 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/60 text-sm font-medium mb-3">
                    Would you like help implementing this plan?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <RadioCard
                      label="Yes, I'd like help"
                      selected={state.implementationHelp === true}
                      onClick={() => set({ implementationHelp: true })}
                    />
                    <RadioCard
                      label="No, just the plan"
                      selected={state.implementationHelp === false}
                      onClick={() => set({ implementationHelp: false })}
                    />
                  </div>
                </div>

                <label className="flex items-start gap-3 cursor-pointer">
                  <div
                    onClick={() => set({ consent: !state.consent })}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-colors cursor-pointer ${
                      state.consent ? 'border-blue-primary bg-blue-primary' : 'border-white/30'
                    }`}
                  >
                    {state.consent && <span className="text-white text-[10px]">✓</span>}
                  </div>
                  <span className="text-white/50 text-sm leading-relaxed">
                    I agree to receive this report and occasional operational insights from Corex Operations. No spam.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* ── Error ────────────────────────────────────────────────────── */}
          {error && (
            <div className="mt-4 px-4 py-3 rounded-xl bg-red-900/30 border border-red-700/40 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* ── Navigation ───────────────────────────────────────────────── */}
          {state.step > 0 && (
            <div className="flex items-center justify-between mt-10">
              <button
                onClick={prevStep}
                className="text-white/40 hover:text-white/70 text-sm font-medium transition-colors flex items-center gap-2"
              >
                ← Back
              </button>

              <button
                onClick={handleNext}
                className="btn-primary"
              >
                {state.step === 11 ? 'Generate My Plan →' : 'Continue →'}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
