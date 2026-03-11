import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import corexLogo from '../assets/corex-logo.webp'
import { MOCK_REPORT } from '../lib/mockReport'
import { generateReport } from '../lib/reportGenerator'
import { getScoreBg, getScoreBadge, getScoreColor } from '../lib/scoring'
// Lazy-load supabase client to prevent crash if env vars are missing
async function getSupabase() {
  const { supabase } = await import('../integrations/supabase/client')
  return supabase
}
import type { Report as ReportType, MaturityLabel, ReportPlanItem, QuizAnswers } from '../lib/types'

// Build report from saved quiz data, fallback to mock
function buildReport(): ReportType {
  const formDataRaw = localStorage.getItem('quiz_form_data')
  const answersRaw = localStorage.getItem('quiz_answers')

  if (formDataRaw && answersRaw) {
    try {
      const formData = JSON.parse(formDataRaw)
      const answers: Partial<QuizAnswers> = JSON.parse(answersRaw)
      return generateReport(answers, {
        companyName: formData.companyName || 'Your Agency',
        revenueBand: formData.revenueBand || '',
        teamSize: formData.teamSize || '',
        services: formData.services || [],
        biggestBottleneck: formData.biggestBottleneck || '',
        mainGoal: formData.mainGoal || '',
        pmTool: formData.pmTool || '',
        crm: formData.crm || '',
        implementationHelp: formData.implementationHelp ?? null,
      })
    } catch {
      // Fall through to mock
    }
  }

  const companyName = localStorage.getItem('quiz_company_name') || 'Your Agency'
  return {
    ...MOCK_REPORT,
    company_profile: { ...MOCK_REPORT.company_profile, company_name: companyName },
    executive_summary: MOCK_REPORT.executive_summary.split('Momentum Agency').join(companyName),
  }
}

const report = buildReport()

// ─── Helper components ────────────────────────────────────────────────────────

function ScoreDial({ score, label }: { score: number; label: MaturityLabel }) {
  const circumference = 2 * Math.PI * 54
  const offset = circumference - (score / 100) * circumference
  const color = label === 'Reactive' ? '#f87171' : label === 'Developing' ? '#fbbf24' : '#34d399'

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
        <circle cx="80" cy="80" r="60" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="12" />
        <circle
          cx="80" cy="80" r="60"
          fill="none"
          stroke={color}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 8px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-white">{score}</span>
        <span className="text-white/50 text-sm">/ 100</span>
      </div>
    </div>
  )
}

function CategoryBar({ category, score, label }: { category: string; score: number; label: MaturityLabel }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-white/90 text-base font-medium">{category}</span>
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-base">{score}</span>
          <span className={`label-pill text-xs ${getScoreBadge(label)}`}>{label}</span>
        </div>
      </div>
      <div className="h-2 bg-white/8 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${getScoreBg(label)} transition-all duration-1000 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  )
}

function PlanCard({ item, index }: { item: ReportPlanItem; index: number }) {
  return (
    <div className="card p-6 flex gap-4">
      <div className="w-10 h-10 rounded-full bg-blue-primary/20 border border-blue-primary/30 flex items-center justify-center shrink-0 text-blue-300 font-bold text-base">
        {index + 1}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-semibold text-base mb-1 leading-snug">{item.action}</p>
        <p className="text-white/60 text-sm mb-2">Owner: {item.owner_role}</p>
        <div className="flex items-start gap-2">
          <span className="text-cyan text-sm shrink-0 mt-0.5">→</span>
          <p className="text-white/70 text-sm leading-relaxed">{item.outcome}</p>
        </div>
      </div>
    </div>
  )
}

const EFFORT_COLORS: Record<string, string> = {
  Low:    'text-emerald-400 bg-emerald-900/30 border-emerald-700/40',
  Medium: 'text-amber-400 bg-amber-900/30 border-amber-700/40',
  High:   'text-red-400 bg-red-900/30 border-red-700/40',
}
const IMPACT_COLORS: Record<string, string> = {
  Low:    'text-white/60 bg-white/5 border-white/10',
  Medium: 'text-blue-300 bg-blue-900/30 border-blue-700/40',
  High:   'text-cyan bg-cyan/10 border-cyan/30',
}

// ─── Main Report Component ────────────────────────────────────────────────────

export default function Report() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'30' | '60' | '90'>('30')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const planMap = { '30': report.day_30_plan, '60': report.day_60_plan, '90': report.day_90_plan }

  const handleSendEmail = useCallback(async () => {
    setEmailStatus('sending')
    try {
      const formDataRaw = localStorage.getItem('quiz_form_data')
      const formData = formDataRaw ? JSON.parse(formDataRaw) : {}
      const recipientEmail = formData.email
      if (!recipientEmail) {
        alert('No email address found. Please retake the quiz.')
        setEmailStatus('error')
        return
      }

      const { data, error } = await supabase.functions.invoke('send-report-email', {
        body: {
          recipientEmail,
          recipientName: formData.name || '',
          companyName: report.company_profile.company_name,
          formData,
          reportSummary: {
            overallScore: report.overall_score,
            maturityLabel: report.maturity_label,
            executiveSummary: report.executive_summary,
            categories: report.category_summary.map(c => ({
              category: c.category,
              score: c.score,
              label: c.label,
            })),
            priorityActions: report.priority_actions.map(a => ({
              action: a.action,
              effort: a.effort,
              impact: a.impact,
            })),
          },
        },
      })

      if (error) throw error
      setEmailStatus('sent')
    } catch (err) {
      console.error('Failed to send email:', err)
      setEmailStatus('error')
    }
  }, [])

  return (
    <div className="min-h-screen">

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-primary/8 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-navy-mid/20 blur-[100px]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5 border-b border-white/8 bg-navy-deepest/60 backdrop-blur-sm sticky top-0">
        <div className="flex items-center gap-3">
          <img src={corexLogo} alt="Corex Operations" className="h-7 w-auto" />
        </div>
        <div className="flex items-center gap-3">
          <button
            className="btn-outline text-sm py-2 px-5 hidden md:flex"
            onClick={() => window.print()}
          >
            ↓ Download PDF
          </button>
          <button
            onClick={handleSendEmail}
            disabled={emailStatus === 'sending' || emailStatus === 'sent'}
            className={`text-sm py-2 px-5 rounded-lg font-semibold transition-all ${
              emailStatus === 'sent'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : emailStatus === 'sending'
                ? 'bg-white/5 text-white/40 border border-white/10 cursor-wait'
                : 'btn-outline'
            } hidden md:flex`}
          >
            {emailStatus === 'sending' ? 'Sending…' : emailStatus === 'sent' ? '✓ Sent!' : '✉ Email Report'}
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="text-white/60 hover:text-white/80 text-sm transition-colors"
          >
            Retake ↺
          </button>
        </div>
      </nav>

      <main className="relative z-10 max-w-4xl mx-auto px-6 md:px-8 py-12 space-y-14">

        {/* ── Report header ─────────────────────────────────────────── */}
        <div className="animate-in">
          <p className="section-label mb-2 text-sm">Operational Assessment Report</p>
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase leading-tight mb-2">
            {report.company_profile.company_name}
          </h1>
          <p className="text-white/60 text-base">
            Generated {new Date().toLocaleDateString('en-IE', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}{report.company_profile.revenue_band}
            {' · '}{report.company_profile.team_size} staff
          </p>
        </div>

        {/* ── Score hero ────────────────────────────────────────────── */}
        <div className="card p-8 md:p-10 animate-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex flex-col md:flex-row items-center gap-10">
            <div className="flex flex-col items-center gap-3">
              <ScoreDial score={report.overall_score} label={report.maturity_label} />
              <span className={`label-pill text-sm ${getScoreBadge(report.maturity_label)}`}>
                {report.maturity_label}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white uppercase mb-4">Overall Maturity Score</h2>
              <p className="text-white/80 text-base leading-relaxed mb-6">{report.executive_summary}</p>
              <div className="flex flex-wrap gap-2">
                {report.company_profile.services.map(s => (
                  <span key={s} className="px-3 py-1.5 rounded-full bg-blue-primary/15 border border-blue-primary/30 text-blue-300 text-sm font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Category scores ───────────────────────────────────────── */}
        <div className="animate-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-white uppercase">Category Breakdown</h2>
          </div>
          <div className="card p-8 space-y-6">
            {report.category_summary.map(cat => (
              <div key={cat.category}>
                <CategoryBar category={cat.category} score={cat.score} label={cat.label} />
                <p className="text-white/60 text-sm mt-2 ml-0">{cat.one_line_insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Top bottlenecks ───────────────────────────────────────── */}
        <div className="animate-in" style={{ animationDelay: '0.3s' }}>
          <p className="section-label mb-2 text-sm">Identified</p>
          <h2 className="text-2xl font-black text-white uppercase mb-6">Top 3 Bottlenecks</h2>
          <div className="space-y-4">
            {report.top_bottlenecks.map((b, i) => (
              <div key={b.title} className="card p-6 md:p-8">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-black text-lg ${
                    i === 0 ? 'bg-red-900/40 text-red-300 border border-red-700/30' :
                    i === 1 ? 'bg-amber-900/40 text-amber-300 border border-amber-700/30' :
                    'bg-blue-900/40 text-blue-300 border border-blue-700/30'
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-white uppercase text-lg mb-2">{b.title}</h3>
                    <p className="text-white/80 text-base leading-relaxed mb-3">{b.description}</p>
                    <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-white/5 border border-white/8">
                      <span className="text-amber-400 text-base shrink-0">⚡</span>
                      <p className="text-white/70 text-sm leading-relaxed">{b.business_impact}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Priority actions ──────────────────────────────────────── */}
        <div className="animate-in" style={{ animationDelay: '0.4s' }}>
          <p className="section-label mb-2 text-sm">Start Here</p>
          <h2 className="text-2xl font-black text-white uppercase mb-6">Priority Fixes</h2>
          <div className="space-y-3">
            {report.priority_actions.map((action, i) => (
              <div key={i} className="card p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-primary/20 border border-blue-primary/30 flex items-center justify-center shrink-0 text-blue-300 font-bold text-sm">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <p className="text-white font-semibold text-base mb-1">{action.action}</p>
                  <p className="text-white/60 text-sm">{action.rationale}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`label-pill text-xs border ${EFFORT_COLORS[action.effort]}`}>
                    {action.effort} effort
                  </span>
                  <span className={`label-pill text-xs border ${IMPACT_COLORS[action.impact]}`}>
                    {action.impact} impact
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── 30 / 60 / 90-day plan ─────────────────────────────────── */}
        <div className="animate-in" style={{ animationDelay: '0.5s' }}>
          <p className="section-label mb-2 text-sm">Your Roadmap</p>
          <h2 className="text-2xl font-black text-white uppercase mb-6">90-Day Action Plan</h2>

          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-white/5 rounded-xl mb-6 w-fit">
            {(['30', '60', '90'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-lg text-base font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-blue-primary text-white shadow-blue-glow'
                    : 'text-white/60 hover:text-white/80'
                }`}
              >
                Day {tab}
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {planMap[activeTab].map((item, i) => (
              <PlanCard key={i} item={item} index={i} />
            ))}
          </div>
        </div>

        {/* ── Recommended systems ───────────────────────────────────── */}
        <div className="animate-in" style={{ animationDelay: '0.6s' }}>
          <p className="section-label mb-2 text-sm">Tooling</p>
          <h2 className="text-2xl font-black text-white uppercase mb-6">Recommended Systems</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {report.recommended_systems.map(sys => (
              <div key={sys.tool} className="card p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-primary/20 border border-blue-primary/30 flex items-center justify-center">
                    <span className="text-blue-300 text-sm font-bold">{sys.tool[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-bold text-base">{sys.tool}</p>
                    <p className="text-white/50 text-sm">{sys.category}</p>
                  </div>
                </div>
                <p className="text-white/75 text-sm leading-relaxed mb-2">{sys.purpose}</p>
                <p className="text-cyan/80 text-sm">{sys.why_now}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Expected impact ───────────────────────────────────────── */}
        <div className="animate-in" style={{ animationDelay: '0.7s' }}>
          <p className="section-label mb-2 text-sm">If You Follow This Plan</p>
          <h2 className="text-2xl font-black text-white uppercase mb-6">Expected Impact</h2>
          <div className="card p-8 space-y-6">
            {report.expected_impact.map(item => (
              <div key={item.area} className="flex gap-4">
                <div className="w-1 self-stretch rounded-full bg-blue-primary/40 shrink-0" />
                <div>
                  <p className="text-white font-semibold text-base mb-1">{item.area}</p>
                  <p className="text-white/70 text-base leading-relaxed">{item.improvement}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── CTA ──────────────────────────────────────────────────── */}
        <div className="relative animate-in overflow-hidden" style={{ animationDelay: '0.8s' }}>
          <div className="absolute inset-0 bg-blue-primary/10 rounded-2xl" />
          <div className="absolute inset-0 rounded-2xl border border-blue-primary/30" />
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-primary/15 rounded-full blur-[60px] pointer-events-none" />
          <div className="relative p-8 md:p-12 text-center">
            <p className="section-label mb-4 text-sm">Next Step</p>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase mb-4 leading-tight">
              {report.next_step_cta.headline}
            </h2>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-xl mx-auto">
              {report.next_step_cta.body}
            </p>
            <a
              href="#"
              className="btn-primary text-base px-12 py-4 inline-flex mb-4"
              onClick={e => e.preventDefault()}
            >
              {report.next_step_cta.button_text} →
            </a>
            {report.next_step_cta.urgency_note && (
              <p className="text-white/50 text-sm mt-4">{report.next_step_cta.urgency_note}</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <img src={corexLogo} alt="Corex Operations" className="h-6 w-auto opacity-60" />
          </div>
          <p className="text-white/40 text-sm">
            This report was generated based on your assessment answers. Results are indicative and intended to guide operational planning.
          </p>
        </div>

      </main>
    </div>
  )
}
