import { useNavigate } from 'react-router-dom'
import corexLogo from '../assets/corex-logo.webp'

const STEPS = [
  {
    number: '01',
    title: 'Answer 14 questions',
    description: 'Quick diagnostic across 7 operational categories — delivery, CRM, reporting, automation, cadence, founder dependency, and sales.',
  },
  {
    number: '02',
    title: 'Get your maturity score',
    description: 'See exactly where your agency sits on the maturity scale: Reactive, Developing, Scalable, or Optimised.',
  },
  {
    number: '03',
    title: 'Receive your 90-day plan',
    description: 'A prioritised action plan with specific fixes ordered by impact — so you know what to tackle first.',
  },
]

const CATEGORIES = [
  { icon: '▶', label: 'Delivery Operations' },
  { icon: '◈', label: 'CRM & Pipeline' },
  { icon: '◎', label: 'Reporting & Forecasting' },
  { icon: '⟳', label: 'Automation & AI' },
  { icon: '◉', label: 'Team Cadence' },
  { icon: '◇', label: 'Founder Dependency' },
  { icon: '↗', label: 'Sales Process' },
]

const TRUST_ITEMS = [
  { value: '4 min', label: 'to complete' },
  { value: '14', label: 'diagnostic questions' },
  { value: '90-day', label: 'personalised plan' },
  { value: '100%', label: 'free' },
]

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen relative overflow-hidden">

      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-navy-mid/30 blur-[100px]" />
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-orange/5 blur-[80px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="flex items-center gap-3">
          <img src={corexLogo} alt="Corex Operations" className="h-8 w-auto" />
        </div>
        <button
          onClick={() => navigate('/quiz')}
          className="hidden md:flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          Take the audit
          <span className="text-orange">→</span>
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 pt-16 md:pt-24 pb-20">

        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-orange/30 bg-orange/5 mb-8 animate-in">
          <span className="w-1.5 h-1.5 rounded-full bg-orange animate-pulse-slow" />
          <span className="text-orange text-xs font-semibold uppercase tracking-[0.15em]">Free Agency Diagnostic</span>
        </div>

        {/* Headline */}
        <h1
          className="text-4xl sm:text-5xl md:text-7xl font-black text-white uppercase leading-[0.95] mb-6 animate-in"
          style={{ animationDelay: '0.1s', opacity: 0 }}
        >
          Find out what's
          <br />
          <span className="text-gradient">slowing your agency</span>
          <br />
          down.
        </h1>

        {/* Subheadline */}
        <p
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-8 leading-relaxed animate-in"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          This free audit scores your agency across 7 operational areas and gives you a
          personalised 90-day plan — showing exactly what to fix, in what order, and what
          to expect when you do.
        </p>

        {/* Big Orange CTA */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 animate-in"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          <button
            onClick={() => navigate('/quiz')}
            className="inline-flex items-center justify-center gap-3 px-12 py-5 bg-orange text-white font-bold text-lg rounded-xl
                       transition-all duration-200 hover:bg-orange-bright hover:shadow-orange-glow hover:-translate-y-0.5
                       active:translate-y-0 active:shadow-none focus:outline-none focus:ring-2 focus:ring-orange/50
                       uppercase tracking-wide"
          >
            Take the Audit
            <span className="text-xl">→</span>
          </button>
        </div>
        <p
          className="text-white/40 text-sm mb-16 animate-in"
          style={{ animationDelay: '0.35s', opacity: 0 }}
        >
          Takes 4 minutes · No credit card · Completely free
        </p>

        {/* Trust strip */}
        <div
          className="flex flex-wrap gap-8 mb-20 animate-in"
          style={{ animationDelay: '0.4s', opacity: 0 }}
        >
          {TRUST_ITEMS.map(item => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="text-2xl font-black text-white">{item.value}</span>
              <span className="text-white/40 text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div
          className="mb-20 animate-in"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >
          <p className="section-label mb-8">How it works</p>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map(step => (
              <div key={step.number} className="card p-6">
                <span className="text-orange font-black text-3xl opacity-40 mb-3 block">{step.number}</span>
                <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What we assess + What you get */}
        <div
          className="grid md:grid-cols-2 gap-6 mb-20 animate-in"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >

          {/* Left — categories */}
          <div className="card p-8">
            <p className="section-label mb-6">What we assess</p>
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="text-orange text-sm w-5 shrink-0">{cat.icon}</span>
                  <span className="text-white/80 text-sm font-medium">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — report includes */}
          <div className="card p-8">
            <p className="section-label mb-6">Your report includes</p>
            <div className="space-y-4">
              {[
                ['Maturity Score', 'Across 7 operational categories'],
                ['Top 3 Bottlenecks', 'The specific issues costing you the most'],
                ['Priority Fixes', 'Ordered by impact and effort'],
                ['30 / 60 / 90-Day Plan', 'Concrete actions with owners and outcomes'],
                ['Recommended Systems', 'Tools that fit your stage and stack'],
                ['Expected Impact', 'What changes when you follow the plan'],
              ].map(([title, sub]) => (
                <div key={title} className="flex gap-3">
                  <span className="text-orange mt-0.5 text-sm shrink-0">✓</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-white/40 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Built for */}
        <div
          className="text-center mb-16 animate-in"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          <p className="section-label mb-4">Built for</p>
          <p className="text-white/60 text-sm max-w-xl mx-auto">
            Marketing agencies with €500k–€10M revenue and 5–80 staff who want a cleaner, more scalable operating system — without the guesswork.
          </p>
        </div>

      </main>

      {/* Bottom CTA banner */}
      <div className="relative z-10 border-t border-white/10 bg-navy-dark/60 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white text-lg">Ready to see where your agency stands?</p>
            <p className="text-white/50 text-sm">14 questions. 4 minutes. A plan you can act on this week.</p>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="inline-flex items-center justify-center gap-3 px-10 py-4 bg-orange text-white font-bold rounded-xl
                       transition-all duration-200 hover:bg-orange-bright hover:shadow-orange-glow hover:-translate-y-0.5
                       active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-orange/50
                       uppercase tracking-wide whitespace-nowrap"
          >
            Start Free Audit →
          </button>
        </div>
      </div>

    </div>
  )
}
