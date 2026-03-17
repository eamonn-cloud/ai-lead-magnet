import type { Report, MaturityLabel, QuizAnswers, ReportBottleneck, ReportPriorityAction, ReportPlanItem, ReportSystem, ReportImpact, ReportCategorySummary } from './types'
import { QUIZ_CATEGORIES } from './types'
import { getMaturityLabel, calculateScores } from './scoring'

// ─── Content maps keyed by category ────────────────────────────────────────────

const CATEGORY_INSIGHTS: Record<string, Record<MaturityLabel, string>> = {
  delivery_operations: {
    Reactive:   'Delivery relies on individual knowledge - every team member has their own version of the process.',
    Developing: 'Core delivery workflows exist but aren\'t consistently followed - quality varies by team member.',
    Scalable:   'Delivery is systemised with clear SOPs and handoff protocols - the team runs without constant oversight.',
  },
  crm_pipeline: {
    Reactive:   'No CRM discipline - pipeline data is unreliable and deal stages are inconsistent.',
    Developing: 'CRM exists but data quality is inconsistent, making pipeline reviews unreliable.',
    Scalable:   'CRM is clean, up-to-date, and trusted - pipeline reviews drive real decisions.',
  },
  reporting_forecasting: {
    Reactive:   'No regular reporting means financial surprises are routine and growth planning is guesswork.',
    Developing: 'Some reporting exists but it\'s manual and inconsistent - forecasting is based on gut feel.',
    Scalable:   'Monthly reporting and forward forecasting are embedded - leadership plans with data, not instinct.',
  },
  automation_ai: {
    Reactive:   'Manual admin is consuming senior team time that should be spent on client work.',
    Developing: 'Some automations are in place but coverage is patchy - key workflows still run manually.',
    Scalable:   'Automation covers onboarding, reporting, and internal ops - the team focuses on high-value work.',
  },
  team_cadence_accountability: {
    Reactive:   'No structured cadence - meetings happen ad hoc and accountability is based on relationships, not systems.',
    Developing: 'Meetings happen occasionally but lack structure - accountability is informal and inconsistent.',
    Scalable:   'Weekly cadence is locked in with clear ownership, KPIs, and structured reviews.',
  },
  founder_dependency: {
    Reactive:   'The founder is embedded in delivery and decision-making - this is the primary growth ceiling.',
    Developing: 'The founder has started delegating but is still the default escalation point for most decisions.',
    Scalable:   'The founder operates strategically - day-to-day delivery and decisions run without them.',
  },
  sales_process: {
    Reactive:   'Sales relies entirely on the founder\'s network - there\'s no repeatable process or documentation.',
    Developing: 'New business comes in but the process is inconsistent - wins are hard to replicate.',
    Scalable:   'Sales process is documented, measured, and can be run by multiple team members.',
  },
}

const BOTTLENECK_LIBRARY: Record<string, ReportBottleneck> = {
  founder_dependency: {
    title: 'Founder as Operational Ceiling',
    description: 'The founder is directly involved in client delivery, key decisions, and escalation handling. No team lead has been empowered to own delivery end-to-end.',
    business_impact: 'The agency cannot scale beyond its current revenue without the founder burning out or taking on more than the business can support.',
  },
  delivery_operations: {
    title: 'Delivery Without a System',
    description: 'Client work is delivered based on individual knowledge rather than documented processes. Handoffs are ad hoc, quality is inconsistent, and onboarding new staff takes months.',
    business_impact: 'Inconsistent delivery risks churn on your best accounts and makes it impossible to maintain margins as the team grows.',
  },
  reporting_forecasting: {
    title: 'No Financial Visibility',
    description: 'There is no monthly reporting cadence and no 90-day revenue forecast. Leadership decisions on hiring, pricing, and capacity are made without reliable data.',
    business_impact: 'Without forward visibility, the agency is vulnerable to cash flow shocks and unable to make confident investment decisions.',
  },
  crm_pipeline: {
    title: 'Pipeline Data You Can\'t Trust',
    description: 'Deal data is incomplete, stages aren\'t standardised, and there\'s no regular pipeline review. Revenue forecasting is guesswork.',
    business_impact: 'Unreliable pipeline data means you can\'t forecast hiring needs, capacity requirements, or quarterly targets.',
  },
  automation_ai: {
    title: 'Manual Work Eating Margins',
    description: 'Core admin workflows - onboarding, reporting, status updates - are handled manually. Senior team time is consumed by tasks that should be automated.',
    business_impact: 'Every hour spent on manual admin is an hour not spent on client strategy or new business - and it compounds as you grow.',
  },
  team_cadence_accountability: {
    title: 'No Rhythm, No Accountability',
    description: 'There\'s no structured weekly cadence and no clear KPIs for team members. Performance conversations happen reactively, if at all.',
    business_impact: 'Without a consistent operating rhythm, issues surface too late and team performance plateaus without anyone noticing.',
  },
  sales_process: {
    title: 'Sales Depends on One Person',
    description: 'New business generation relies on the founder\'s relationships and instinct. There\'s no documented sales process, no qualification criteria, and no handoff structure.',
    business_impact: 'Revenue growth is capped by the founder\'s personal bandwidth - and pipeline dries up whenever they focus on delivery.',
  },
}

interface ActionTemplate {
  action: string
  effort: 'Low' | 'Medium' | 'High'
  impact: 'Low' | 'Medium' | 'High'
  rationale: string
}

const PRIORITY_ACTIONS: Record<string, ActionTemplate[]> = {
  founder_dependency: [
    { action: 'Identify and formally appoint a Delivery Lead from your existing team', effort: 'Medium', impact: 'High', rationale: 'This single action frees the founder from day-to-day delivery and creates a clear escalation point.' },
    { action: 'Document a decision rights matrix for team leads', effort: 'Low', impact: 'High', rationale: 'Most decisions route to the founder not because they need to, but because no one knows what they\'re empowered to decide.' },
  ],
  delivery_operations: [
    { action: 'Map your top 3 delivery workflows end-to-end and document as SOPs', effort: 'Medium', impact: 'High', rationale: 'Without documented processes, quality depends entirely on who is assigned - not how the agency is built.' },
    { action: 'Create a standardised client handoff checklist between sales and delivery', effort: 'Low', impact: 'Medium', rationale: 'Handoff gaps cause the most common early-stage client frustrations.' },
  ],
  reporting_forecasting: [
    { action: 'Build a monthly business review template and run it on the first Monday of each month', effort: 'Low', impact: 'High', rationale: 'You currently have limited financial review - this is the fastest way to get visibility.' },
    { action: 'Build a 90-day revenue forecast model in a spreadsheet', effort: 'Medium', impact: 'High', rationale: 'Forward visibility lets you make hiring and investment decisions with confidence.' },
  ],
  crm_pipeline: [
    { action: 'Implement a weekly pipeline review - 30 minutes, every Friday', effort: 'Low', impact: 'Medium', rationale: 'Your CRM data improves when there\'s a standing meeting that depends on it being accurate.' },
    { action: 'Add mandatory fields to your CRM and clean all active deals', effort: 'Low', impact: 'Medium', rationale: 'Clean data is the foundation - without it, every report and forecast is unreliable.' },
  ],
  automation_ai: [
    { action: 'Build a standardised client onboarding automation triggered by contract sign', effort: 'Medium', impact: 'High', rationale: 'Client onboarding is your highest-risk manual process - automating it protects the first impression.' },
    { action: 'Audit your top 5 most time-consuming admin tasks and automate at least 2', effort: 'Medium', impact: 'Medium', rationale: 'Quick automation wins compound - each one frees recurring hours every week.' },
  ],
  team_cadence_accountability: [
    { action: 'Launch a weekly operating cadence: Monday standup, Friday pipeline review', effort: 'Low', impact: 'High', rationale: 'A structured weekly rhythm creates accountability without micromanagement.' },
    { action: 'Define 2-3 measurable KPIs for each senior team member', effort: 'Low', impact: 'Medium', rationale: 'You can\'t improve what you don\'t measure - and team members want clarity on what success looks like.' },
  ],
  sales_process: [
    { action: 'Document your current sales process from lead to close in a simple flowchart', effort: 'Low', impact: 'Medium', rationale: 'Making the implicit explicit is the first step to making it repeatable.' },
    { action: 'Create qualification criteria so the team knows which leads to prioritise', effort: 'Low', impact: 'High', rationale: 'Not every lead is worth pursuing - clear criteria save time and improve win rates.' },
  ],
}

const PLAN_LIBRARY: Record<string, { day30: ReportPlanItem; day60: ReportPlanItem; day90: ReportPlanItem }> = {
  founder_dependency: {
    day30: { action: 'Appoint a Delivery Lead and transfer ownership of 2 accounts', category: 'Founder Dependency', owner_role: 'Founder', outcome: 'Founder exits day-to-day delivery on at least 2 client accounts' },
    day60: { action: 'Write and share a Decision Rights Matrix with all team leads', category: 'Founder Dependency', owner_role: 'Founder', outcome: 'Team leads make day-to-day decisions independently - escalations drop by 50%' },
    day90: { action: 'Review founder involvement across all accounts and identify remaining hand-back opportunities', category: 'Founder Dependency', owner_role: 'Founder', outcome: 'Founder is operationally involved in fewer than 30% of active accounts' },
  },
  delivery_operations: {
    day30: { action: 'Document 3 core delivery SOPs in your PM tool', category: 'Delivery Operations', owner_role: 'Delivery Lead', outcome: 'Team has a written process for the 3 most common delivery workflows' },
    day60: { action: 'Run a quality audit on 5 active accounts using the new SOPs', category: 'Delivery Operations', owner_role: 'Delivery Lead', outcome: 'Delivery consistency measurably improves across audited accounts' },
    day90: { action: 'Onboard a new team member using only documented SOPs - no shadowing required', category: 'Delivery Operations', owner_role: 'Delivery Lead', outcome: 'New hire is productive within 2 weeks instead of 6-8 weeks' },
  },
  reporting_forecasting: {
    day30: { action: 'Build and run the first monthly business review', category: 'Reporting & Forecasting', owner_role: 'Founder', outcome: 'Leadership has a clear view of revenue, margin, and pipeline for the month' },
    day60: { action: 'Build a 90-day revenue forecast model', category: 'Reporting & Forecasting', owner_role: 'Founder', outcome: 'Leadership can see expected revenue for the next 3 months at any time' },
    day90: { action: 'Run the first quarterly business review using 3 months of data', category: 'Reporting & Forecasting', owner_role: 'Founder', outcome: 'Leadership makes planning decisions with data, not gut feel' },
  },
  crm_pipeline: {
    day30: { action: 'Clean all active deals and add mandatory fields to CRM', category: 'CRM & Pipeline Hygiene', owner_role: 'Account Manager', outcome: 'All active deals have owner, stage, close date, and value populated' },
    day60: { action: 'Launch weekly Friday pipeline review meeting', category: 'CRM & Pipeline Hygiene', owner_role: 'Sales Lead', outcome: 'Pipeline reviews are data-driven with accurate deal progression' },
    day90: { action: 'Set up automated deal-stage notifications and stale-deal alerts', category: 'CRM & Pipeline Hygiene', owner_role: 'Account Manager', outcome: 'No deal sits stale for more than 14 days without follow-up' },
  },
  automation_ai: {
    day30: { action: 'Build a client onboarding automation triggered by contract sign', category: 'Automation & AI Adoption', owner_role: 'Delivery Lead', outcome: 'New client onboarding triggers automatically within 1 hour of contract sign' },
    day60: { action: 'Automate weekly status report generation for all active clients', category: 'Automation & AI Adoption', owner_role: 'Delivery Lead', outcome: 'Client status reports are generated automatically - saving 3-4 hours per week' },
    day90: { action: 'Audit automation coverage and build the next 3 highest-ROI automations', category: 'Automation & AI Adoption', owner_role: 'Ops Lead', outcome: 'At least 5 recurring admin workflows are fully automated' },
  },
  team_cadence_accountability: {
    day30: { action: 'Launch Monday standup and Friday pipeline review', category: 'Team Cadence & Accountability', owner_role: 'Delivery Lead', outcome: 'Structured weekly rhythm is running consistently' },
    day60: { action: 'Define KPIs for all senior team members and run first monthly review', category: 'Team Cadence & Accountability', owner_role: 'Founder', outcome: 'Every senior team member has 2-3 measurable targets reviewed monthly' },
    day90: { action: 'Run first quarterly performance review using accumulated KPI data', category: 'Team Cadence & Accountability', owner_role: 'Founder', outcome: 'Performance conversations are data-driven rather than subjective' },
  },
  sales_process: {
    day30: { action: 'Document sales process from lead to close and create qualification criteria', category: 'Sales Process', owner_role: 'Founder', outcome: 'Sales process is written down and qualification criteria are clear' },
    day60: { action: 'Train at least one other team member on the documented sales process', category: 'Sales Process', owner_role: 'Founder', outcome: 'New business can be progressed by someone other than the founder' },
    day90: { action: 'Implement lead scoring and automated follow-up sequences', category: 'Sales Process', owner_role: 'Sales Lead', outcome: 'Lead qualification is systematic and follow-up never falls through the cracks' },
  },
}

const SYSTEM_LIBRARY: Record<string, (crm: string, pmTool: string) => ReportSystem> = {
  crm_pipeline: (crm) => ({
    tool: crm && crm !== 'None' ? crm : 'HubSpot CRM',
    purpose: 'Pipeline management, deal tracking, and lead routing',
    category: 'CRM & Pipeline Hygiene',
    why_now: crm && crm !== 'None' ? `You're using ${crm} - focus is governance and adoption, not a new tool.` : 'You need a CRM to create pipeline visibility and track deals consistently.',
  }),
  delivery_operations: (_crm, pmTool) => ({
    tool: pmTool && pmTool !== 'None' && pmTool !== 'Spreadsheets' ? pmTool : 'ClickUp',
    purpose: 'Delivery workflow management, SOPs, and task ownership',
    category: 'Delivery Operations',
    why_now: pmTool && pmTool !== 'None' && pmTool !== 'Spreadsheets' ? `You're using ${pmTool} - focus on building documented workflows inside it.` : 'You need a proper PM tool to systemise delivery workflows.',
  }),
  automation_ai: () => ({
    tool: 'Make (Integromat)',
    purpose: 'Workflow automation - onboarding, reporting, status updates',
    category: 'Automation & AI Adoption',
    why_now: 'Low-cost, high-impact automation without engineering resources.',
  }),
  reporting_forecasting: () => ({
    tool: 'Google Looker Studio',
    purpose: 'Monthly business review dashboard pulling from CRM and accounting',
    category: 'Reporting & Forecasting',
    why_now: 'Free, connects to most CRMs and accounting tools - replaces manual reporting within 2 weeks.',
  }),
}

// ─── Generator ─────────────────────────────────────────────────────────────────

export function generateReport(
  answers: Partial<QuizAnswers>,
  profile: {
    companyName: string
    revenueBand: string
    teamSize: string
    services: string[]
    biggestBottleneck: string
    mainGoal: string
    pmTool: string
    crm: string
    implementationHelp: boolean | null
  }
): Report {
  const scores = calculateScores(answers, profile.revenueBand, profile.teamSize, profile.biggestBottleneck, profile.implementationHelp)

  // Category summary with contextual insights
  const category_summary: ReportCategorySummary[] = scores.categoryScores.map(cat => ({
    category: cat.category,
    score: cat.score,
    label: cat.label,
    one_line_insight: CATEGORY_INSIGHTS[cat.key]?.[cat.label] || '',
  }))

  // Top 3 bottlenecks from weakest categories
  const weakestKeys = [...scores.categoryScores]
    .sort((a, b) => a.score - b.score)
    .slice(0, 3)
    .map(c => c.key)

  const top_bottlenecks = weakestKeys
    .map(key => BOTTLENECK_LIBRARY[key])
    .filter(Boolean)

  // Priority actions - 2 per weakest category, up to 6
  const priority_actions: ReportPriorityAction[] = weakestKeys
    .flatMap(key => (PRIORITY_ACTIONS[key] || []).map(a => ({ ...a, category: QUIZ_CATEGORIES.find(c => c.key === key)?.label || key })))
    .slice(0, 6)

  // 30/60/90 plans from all categories, prioritised by weakness
  const allCatKeys = [...scores.categoryScores]
    .sort((a, b) => a.score - b.score)
    .map(c => c.key)

  const day_30_plan: ReportPlanItem[] = allCatKeys.slice(0, 5).map(key => PLAN_LIBRARY[key]?.day30).filter(Boolean)
  const day_60_plan: ReportPlanItem[] = allCatKeys.slice(0, 4).map(key => PLAN_LIBRARY[key]?.day60).filter(Boolean)
  const day_90_plan: ReportPlanItem[] = allCatKeys.slice(0, 4).map(key => PLAN_LIBRARY[key]?.day90).filter(Boolean)

  // Recommended systems - relevant to weakest categories
  const recommended_systems: ReportSystem[] = weakestKeys
    .map(key => SYSTEM_LIBRARY[key]?.(profile.crm, profile.pmTool))
    .filter(Boolean)
  // Always add automation if not already included
  if (!recommended_systems.find(s => s.category === 'Automation & AI Adoption')) {
    recommended_systems.push(SYSTEM_LIBRARY.automation_ai(profile.crm, profile.pmTool))
  }
  // Always add reporting if not included
  if (!recommended_systems.find(s => s.category === 'Reporting & Forecasting')) {
    recommended_systems.push(SYSTEM_LIBRARY.reporting_forecasting(profile.crm, profile.pmTool))
  }

  // Expected impact - tailored to weak areas
  const impactMap: Record<string, ReportImpact> = {
    founder_dependency: { area: 'Founder hours', improvement: 'Founder reclaims 8-12 hours per week within 60 days by exiting day-to-day delivery and reducing decision escalations.' },
    delivery_operations: { area: 'Delivery consistency', improvement: 'Client experience standardised across all accounts - fewer errors, faster onboarding, and reduced senior staff involvement in routine delivery.' },
    reporting_forecasting: { area: 'Revenue visibility', improvement: 'Monthly reporting and 90-day forecasting in place within 30 days - no more financial surprises.' },
    team_cadence_accountability: { area: 'Team accountability', improvement: 'KPIs and weekly cadence in place by day 60 - performance conversations become data-driven rather than subjective.' },
    crm_pipeline: { area: 'Pipeline reliability', improvement: 'CRM governance improvement means forecast accuracy improves by 30-40% within 90 days.' },
    automation_ai: { area: 'Operational efficiency', improvement: 'Automating key workflows saves 10-15 hours of admin time per week across the team.' },
    sales_process: { area: 'Sales scalability', improvement: 'Documented sales process means new business can be progressed by multiple team members - not just the founder.' },
  }

  const expected_impact: ReportImpact[] = allCatKeys
    .slice(0, 5)
    .map(key => impactMap[key])
    .filter(Boolean)

  // Executive summary - dynamically generated
  const weakestNames = weakestKeys.map(k => QUIZ_CATEGORIES.find(c => c.key === k)?.label || k)
  const strongestKeys = [...scores.categoryScores]
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(c => QUIZ_CATEGORIES.find(cat => cat.key === c.key)?.label || c.key)

  const goalPhrase = profile.mainGoal ? ` Your stated goal - "${profile.mainGoal}" - ` : ' '
  const bottleneckPhrase = profile.biggestBottleneck ? `You identified "${profile.biggestBottleneck}" as your biggest bottleneck, and your scores confirm this area needs immediate attention. ` : ''

  const executive_summary = `${profile.companyName} is operating at a ${scores.maturityLabel} level overall (${scores.overallScore}/100), with ${weakestNames[0]} and ${weakestNames[1]} representing your most significant growth constraints. ${bottleneckPhrase}Your relative strengths are ${strongestKeys[0]} and ${strongestKeys[1]}, which gives you a foundation to build on.${goalPhrase}is achievable with the right operational structure - the fixes required are structural, not cultural. With focused effort over 90 days, you can move from ${scores.maturityLabel === 'Reactive' ? 'reactive fire-fighting to a scalable operating system' : scores.maturityLabel === 'Developing' ? 'inconsistent execution to a reliable, repeatable operating model' : 'solid foundations to an optimised, self-running operation'}.`

  return {
    executive_summary,
    overall_score: scores.overallScore,
    maturity_label: scores.maturityLabel,
    company_profile: {
      company_name: profile.companyName,
      revenue_band: profile.revenueBand,
      team_size: profile.teamSize,
      services: profile.services,
      biggest_bottleneck: profile.biggestBottleneck,
      main_goal: profile.mainGoal,
    },
    category_summary,
    top_bottlenecks,
    priority_actions,
    day_30_plan,
    day_60_plan,
    day_90_plan,
    recommended_systems,
    expected_impact,
    next_step_cta: {
      headline: 'Ready to build this system in your agency?',
      body: `This plan identifies what needs to change. The operational strategy call with Corex Operations gives you the implementation roadmap - prioritised, sequenced, and built around your team. We'll review your top 3 bottlenecks, align on the right starting point, and give you a clear week-one action list before you leave.`,
      button_text: 'Book Your Strategy Call',
      urgency_note: 'We take on a limited number of new engagements each quarter. Strategy calls are available this month.',
    },
  }
}
