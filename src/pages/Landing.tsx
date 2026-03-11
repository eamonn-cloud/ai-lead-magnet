import { useNavigate } from 'react-router-dom'
import corexLogo from '../assets/corex-logo.webp'

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
        <div className="absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-cyan/5 blur-[80px]" />
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
          <span className="text-blue-300">→</span>
        </button>
      </nav>

      {/* Hero */}
      <main className="relative z-10 max-w-6xl mx-auto px-6 md:px-12 pt-12 md:pt-20 pb-20">

        {/* Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/30 bg-cyan/5 mb-8 animate-in">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse-slow" />
          <span className="text-cyan text-xs font-semibold uppercase tracking-[0.15em]">Free Agency Diagnostic</span>
        </div>

        {/* Headline */}
        <h1
          className="text-5xl md:text-7xl font-black text-white uppercase leading-none mb-6 animate-in"
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
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed animate-in"
          style={{ animationDelay: '0.2s', opacity: 0 }}
        >
          Answer 14 questions about your operations. Get a tailored 90-day plan that shows exactly what to fix, in what order, and what to expect when you do.
        </p>

        {/* CTA row */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16 animate-in"
          style={{ animationDelay: '0.3s', opacity: 0 }}
        >
          <button
            onClick={() => navigate('/quiz')}
            className="btn-primary text-base px-10 py-4"
          >
            Start Your Audit
            <span>→</span>
          </button>
          <span className="text-white/40 text-sm">Takes 4 minutes. No credit card.</span>
        </div>

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

        {/* What you get */}
        <div
          className="grid md:grid-cols-2 gap-6 mb-20 animate-in"
          style={{ animationDelay: '0.5s', opacity: 0 }}
        >

          {/* Left — audit covers */}
          <div className="card p-8">
            <p className="section-label mb-6">The audit covers</p>
            <div className="space-y-3">
              {CATEGORIES.map(cat => (
                <div key={cat.label} className="flex items-center gap-3">
                  <span className="text-blue-primary text-sm w-5 shrink-0">{cat.icon}</span>
                  <span className="text-white/80 text-sm font-medium">{cat.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — what you get */}
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
                  <span className="text-cyan mt-0.5 text-sm shrink-0">✓</span>
                  <div>
                    <p className="text-white text-sm font-semibold">{title}</p>
                    <p className="text-white/40 text-xs">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Score preview mockup */}
        <div
          className="card p-8 mb-20 animate-in"
          style={{ animationDelay: '0.6s', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <p className="section-label">Example report preview</p>
            <span className="label-pill bg-amber-900/40 text-amber-300 border border-amber-700/40">Developing — 54/100</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { cat: 'Delivery',     score: 25,  label: 'Reactive' },
              { cat: 'CRM',          score: 50,  label: 'Developing' },
              { cat: 'Reporting',    score: 75,  label: 'Scalable' },
              { cat: 'Automation',   score: 50,  label: 'Developing' },
              { cat: 'Team Cadence', score: 75,  label: 'Scalable' },
              { cat: 'Founder Dep.', score: 25,  label: 'Reactive' },
              { cat: 'Sales',        score: 50,  label: 'Developing' },
              { cat: 'Overall',      score: 50,  label: 'Developing' },
            ].map(item => (
              <div key={item.cat} className="bg-white/5 rounded-xl p-4">
                <p className="text-white/40 text-xs mb-2">{item.cat}</p>
                <div className="h-1 bg-white/10 rounded-full mb-2">
                  <div
                    className={`h-full rounded-full ${
                      item.label === 'Reactive' ? 'bg-red-400' :
                      item.label === 'Developing' ? 'bg-amber-400' : 'bg-emerald-400'
                    }`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
                <p className="text-white font-bold text-lg">{item.score}</p>
                <p className={`text-xs font-medium ${
                  item.label === 'Reactive' ? 'text-red-400' :
                  item.label === 'Developing' ? 'text-amber-400' : 'text-emerald-400'
                }`}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Built for */}
        <div
          className="text-center animate-in"
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
        <div className="max-w-6xl mx-auto px-6 md:px-12 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-bold text-white">Ready to see where your agency stands?</p>
            <p className="text-white/50 text-sm">14 questions. 4 minutes. A plan you can act on this week.</p>
          </div>
          <button
            onClick={() => navigate('/quiz')}
            className="btn-primary whitespace-nowrap"
          >
            Start Free Audit →
          </button>
        </div>
      </div>

    </div>
  )
}
