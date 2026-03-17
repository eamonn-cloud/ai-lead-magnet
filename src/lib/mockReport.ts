import type { Report } from './types'

export const MOCK_REPORT: Report = {
  executive_summary:
    "Momentum Agency is operating at a Reactive level across most of its operational categories, with delivery and founder dependency representing your most significant growth constraints. Your CRM is partially established but discipline around it is low, and your reporting gives you little forward visibility. The good news: you have a solid team foundation to build on, and the fixes required are structural, not cultural. With focused effort over 90 days, you can move from reactive fire-fighting to a scalable operating system that runs without the founder in every room.",
  overall_score: 36,
  maturity_label: 'Reactive',
  company_profile: {
    company_name: 'Momentum Agency',
    revenue_band: '€1M-€3M',
    team_size: '16-40',
    services: ['SEO', 'Paid Media', 'Content & Social'],
    biggest_bottleneck: 'Delivery',
    main_goal: 'Reduce founder hours',
  },
  category_summary: [
    { category: 'Delivery Operations',          score: 25,  label: 'Reactive',   one_line_insight: 'Delivery relies on individual knowledge - every team member has their own version of the process.' },
    { category: 'CRM & Pipeline Hygiene',        score: 50,  label: 'Developing', one_line_insight: 'CRM exists but data quality is inconsistent, making pipeline reviews unreliable.' },
    { category: 'Reporting & Forecasting',       score: 0,   label: 'Reactive',   one_line_insight: 'No regular reporting means financial surprises are routine and growth planning is guesswork.' },
    { category: 'Automation & AI Adoption',      score: 25,  label: 'Reactive',   one_line_insight: 'Manual admin is consuming senior team time that should be spent on client work.' },
    { category: 'Team Cadence & Accountability', score: 50,  label: 'Developing', one_line_insight: 'Meetings happen occasionally but lack structure - accountability is based on relationships, not systems.' },
    { category: 'Founder Dependency',            score: 25,  label: 'Reactive',   one_line_insight: 'The founder is embedded in delivery and decision-making - this is the primary growth ceiling.' },
    { category: 'Sales Process',                 score: 50,  label: 'Developing', one_line_insight: 'New business comes in but the process is inconsistent - wins are hard to replicate.' },
  ],
  top_bottlenecks: [
    {
      title: 'Founder as Operational Ceiling',
      description: 'The founder is directly involved in client delivery, key decisions, and escalation handling. No team lead has been empowered to own delivery end-to-end. As a result, every growth initiative competes with the founder\'s finite capacity.',
      business_impact: 'The agency cannot scale beyond its current revenue without the founder burning out - or taking on more than the business can support.',
    },
    {
      title: 'Delivery Without a System',
      description: 'Client work is delivered based on individual knowledge rather than documented processes. Handoffs between team members are ad hoc, quality is inconsistent across accounts, and onboarding a new team member takes months rather than weeks.',
      business_impact: 'Inconsistent delivery quality risks churn on your best accounts and makes it impossible to maintain margins as the team grows.',
    },
    {
      title: 'No Financial Visibility',
      description: 'There is no monthly reporting cadence and no 90-day revenue forecast. Leadership decisions on hiring, pricing, and capacity are made without reliable data - often reactively after problems have already compounded.',
      business_impact: 'Without forward visibility, the agency is vulnerable to cash flow shocks and unable to make confident investment decisions.',
    },
  ],
  priority_actions: [
    { action: 'Identify and formally appoint a Delivery Lead from your existing team', category: 'Founder Dependency', effort: 'Medium', impact: 'High', rationale: 'This single action frees the founder from day-to-day delivery and creates a clear escalation point that isn\'t you.' },
    { action: 'Map your top 3 delivery workflows end-to-end and document as SOPs in ClickUp', category: 'Delivery Operations', effort: 'Medium', impact: 'High', rationale: 'Without documented processes, quality depends entirely on who is assigned - not how the agency is built.' },
    { action: 'Build a monthly business review template and run it on the first Monday of each month', category: 'Reporting & Forecasting', effort: 'Low', impact: 'High', rationale: 'You currently have no regular financial review - this is the fastest way to get visibility without building a full dashboard.' },
    { action: 'Implement a weekly pipeline review - 30 minutes, every Friday', category: 'CRM & Pipeline Hygiene', effort: 'Low', impact: 'Medium', rationale: 'Your CRM data improves when there\'s a standing meeting that depends on it being accurate.' },
    { action: 'Build a standardised client onboarding automation triggered by contract sign', category: 'Automation & AI Adoption', effort: 'Medium', impact: 'High', rationale: 'Client onboarding is your highest-risk manual process - automating it protects the first impression and saves 3-4 hours per new client.' },
    { action: 'Document a decision rights matrix for team leads', category: 'Founder Dependency', effort: 'Low', impact: 'High', rationale: 'Most decisions route to the founder not because they need to, but because no one knows what they\'re empowered to decide.' },
  ],
  day_30_plan: [
    { action: 'Appoint a Delivery Lead and transfer ownership of 2 accounts', category: 'Founder Dependency', owner_role: 'Founder', outcome: 'Founder exits day-to-day delivery on at least 2 client accounts' },
    { action: 'Document 3 core delivery SOPs in ClickUp', category: 'Delivery Operations', owner_role: 'Delivery Lead', outcome: 'Team has a written process for the 3 most common delivery workflows' },
    { action: 'Build and run the first monthly business review', category: 'Reporting & Forecasting', owner_role: 'Founder', outcome: 'Leadership has a clear view of revenue, margin, and pipeline for the month' },
    { action: 'Add mandatory fields to HubSpot and clean all active deals', category: 'CRM & Pipeline Hygiene', owner_role: 'Account Manager', outcome: 'All active deals have owner, stage, close date, and value populated' },
    { action: 'Build a client onboarding automation in Make or ClickUp automations', category: 'Automation & AI Adoption', owner_role: 'Delivery Lead', outcome: 'New client onboarding triggers automatically within 1 hour of contract sign' },
  ],
  day_60_plan: [
    { action: 'Write and share a Decision Rights Matrix with all team leads', category: 'Founder Dependency', owner_role: 'Founder', outcome: 'Team leads make day-to-day decisions independently - escalations to founder drop by 50%' },
    { action: 'Launch weekly operating cadence: Monday standup, Friday pipeline review', category: 'Team Cadence & Accountability', owner_role: 'Delivery Lead', outcome: 'Structured weekly rhythm is running consistently without founder facilitation' },
    { action: 'Define KPIs for Delivery Lead, Account Managers, and any senior hires', category: 'Team Cadence & Accountability', owner_role: 'Founder', outcome: 'Every senior team member has 2-3 measurable targets reviewed monthly' },
    { action: 'Build a 90-day revenue forecast model in a spreadsheet', category: 'Reporting & Forecasting', owner_role: 'Founder', outcome: 'Leadership can see expected revenue for the next 3 months at any time' },
  ],
  day_90_plan: [
    { action: 'Run the first full quarterly business review using 3 months of MBR data', category: 'Reporting & Forecasting', owner_role: 'Founder', outcome: 'Leadership makes Q4 planning decisions with data, not gut feel' },
    { action: 'Audit automation coverage and build the next 3 highest-ROI automations', category: 'Automation & AI Adoption', owner_role: 'Delivery Lead', outcome: 'At least 5 recurring admin workflows are fully automated' },
    { action: 'Run a documented sales process training session with anyone involved in new business', category: 'Sales Process', owner_role: 'Founder', outcome: 'New business can be progressed by at least one team member without the founder' },
    { action: 'Review founder involvement across all accounts and identify remaining hand-back opportunities', category: 'Founder Dependency', owner_role: 'Founder', outcome: 'Founder is operationally involved in fewer than 30% of active accounts' },
  ],
  recommended_systems: [
    { tool: 'HubSpot CRM', purpose: 'Pipeline management, deal tracking, and lead routing', category: 'CRM & Pipeline Hygiene', why_now: 'You have a partial CRM setup - focus is governance and adoption, not a new tool.' },
    { tool: 'ClickUp', purpose: 'Delivery workflow management, SOPs, and task ownership', category: 'Delivery Operations', why_now: 'Your team already has a PM tool - focus is on building documented workflows inside it.' },
    { tool: 'Make (Integromat)', purpose: 'Workflow automation - onboarding, reporting, status updates', category: 'Automation & AI Adoption', why_now: 'Low-cost, high-impact automation without engineering resources.' },
    { tool: 'Google Looker Studio', purpose: 'Monthly business review dashboard pulling from CRM and accounting', category: 'Reporting & Forecasting', why_now: 'Free, connects to HubSpot and Xero/QuickBooks - replaces manual reporting within 2 weeks.' },
    { tool: 'Loom', purpose: 'Async communication and SOP walkthroughs for delivery team', category: 'Delivery Operations', why_now: 'Reduces founder involvement in explaining context and reviewing work.' },
  ],
  expected_impact: [
    { area: 'Founder hours', improvement: 'Founder reclaims 8-12 hours per week within 60 days by exiting day-to-day delivery and reducing decision escalations.' },
    { area: 'Delivery consistency', improvement: 'Client experience standardised across all accounts - fewer errors, faster onboarding, and reduced senior staff involvement in routine delivery.' },
    { area: 'Revenue visibility', improvement: 'Monthly reporting and 90-day forecasting in place within 30 days - no more financial surprises.' },
    { area: 'Team accountability', improvement: 'KPIs and weekly cadence in place by day 60 - performance conversations become data-driven rather than subjective.' },
    { area: 'Pipeline reliability', improvement: 'CRM governance improvement means forecast accuracy improves by 30-40% within 90 days.' },
  ],
  next_step_cta: {
    headline: 'Ready to build this system in your agency?',
    body: 'This plan identifies what needs to change. The operational strategy call with Corex Operations gives you the implementation roadmap - prioritised, sequenced, and built around your team. We\'ll review your top 3 bottlenecks, align on the right starting point, and give you a clear week-one action list before you leave.',
    button_text: 'Book Your Strategy Call',
    urgency_note: 'We take on a limited number of new engagements each quarter. Strategy calls are available this month.',
  },
}
