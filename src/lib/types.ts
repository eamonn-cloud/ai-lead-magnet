export type RevenueBand = '€500k–€1M' | '€1M–€3M' | '€3M–€10M'
export type TeamSize = '5–15' | '16–40' | '41–80'
export type MaturityLabel = 'Reactive' | 'Developing' | 'Scalable'
export type QualificationStatus = 'hot' | 'warm' | 'nurture'

export interface QuizAnswers {
  q1: number; q2: number; q3: number; q4: number; q5: number; q6: number; q7: number;
  q8: number; q9: number; q10: number; q11: number; q12: number; q13: number; q14: number;
}

export interface QuizState {
  step: number
  // Profile
  name: string
  email: string
  companyName: string
  website: string
  revenueBand: string
  teamSize: string
  services: string[]
  pmTool: string
  crm: string
  biggestBottleneck: string
  mainGoal: string
  implementationHelp: boolean | null
  consent: boolean
  // Maturity answers
  answers: Partial<QuizAnswers>
}

export interface CategoryScore {
  category: string
  key: string
  score: number
  label: MaturityLabel
}

export interface AssessmentScores {
  categoryScores: CategoryScore[]
  overallScore: number
  maturityLabel: MaturityLabel
  topWeaknesses: string[]
  topStrengths: string[]
  leadScore: number
  qualificationStatus: QualificationStatus
}

// Report JSON shape (matches report-schema.json)
export interface ReportCategorySummary {
  category: string
  score: number
  label: MaturityLabel
  one_line_insight: string
}

export interface ReportBottleneck {
  title: string
  description: string
  business_impact: string
}

export interface ReportPriorityAction {
  action: string
  category: string
  effort: 'Low' | 'Medium' | 'High'
  impact: 'Low' | 'Medium' | 'High'
  rationale: string
}

export interface ReportPlanItem {
  action: string
  category: string
  owner_role: string
  outcome: string
}

export interface ReportSystem {
  tool: string
  purpose: string
  category: string
  why_now: string
}

export interface ReportImpact {
  area: string
  improvement: string
}

export interface ReportCTA {
  headline: string
  body: string
  button_text: string
  urgency_note: string
}

export interface Report {
  executive_summary: string
  overall_score: number
  maturity_label: MaturityLabel
  company_profile: {
    company_name: string
    revenue_band: string
    team_size: string
    services: string[]
    biggest_bottleneck: string
    main_goal: string
  }
  category_summary: ReportCategorySummary[]
  top_bottlenecks: ReportBottleneck[]
  priority_actions: ReportPriorityAction[]
  day_30_plan: ReportPlanItem[]
  day_60_plan: ReportPlanItem[]
  day_90_plan: ReportPlanItem[]
  recommended_systems: ReportSystem[]
  expected_impact: ReportImpact[]
  next_step_cta: ReportCTA
}

export const QUIZ_CATEGORIES = [
  { key: 'delivery_operations',          label: 'Delivery Operations',         questions: ['q1', 'q2'] },
  { key: 'crm_pipeline',                 label: 'CRM & Pipeline Hygiene',       questions: ['q3', 'q4'] },
  { key: 'reporting_forecasting',        label: 'Reporting & Forecasting',      questions: ['q5', 'q6'] },
  { key: 'automation_ai',                label: 'Automation & AI Adoption',     questions: ['q7', 'q8'] },
  { key: 'team_cadence_accountability',  label: 'Team Cadence & Accountability',questions: ['q9', 'q10'] },
  { key: 'founder_dependency',           label: 'Founder Dependency',           questions: ['q11', 'q12'] },
  { key: 'sales_process',               label: 'Sales Process',                questions: ['q13', 'q14'] },
] as const
