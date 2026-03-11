import type { QuizAnswers, AssessmentScores, CategoryScore, MaturityLabel, QualificationStatus } from './types'
import { QUIZ_CATEGORIES } from './types'

export function getMaturityLabel(score: number): MaturityLabel {
  if (score < 40) return 'Reactive'
  if (score < 70) return 'Developing'
  return 'Scalable'
}

export function calculateScores(
  answers: Partial<QuizAnswers>,
  revenueBand: string,
  teamSize: string,
  biggestBottleneck: string,
  implementationHelp: boolean | null
): AssessmentScores {
  const categoryScores: CategoryScore[] = QUIZ_CATEGORIES.map(cat => {
    const [q1key, q2key] = cat.questions
    const q1 = (answers[q1key as keyof QuizAnswers] ?? 0)
    const q2 = (answers[q2key as keyof QuizAnswers] ?? 0)
    const score = Math.round(((q1 + q2) / 4) * 100)
    return {
      category: cat.label,
      key: cat.key,
      score,
      label: getMaturityLabel(score),
    }
  })

  const overallScore = Math.round(
    categoryScores.reduce((sum, c) => sum + c.score, 0) / categoryScores.length
  )

  const sorted = [...categoryScores].sort((a, b) => a.score - b.score)
  const topWeaknesses = sorted.slice(0, 3).map(c => c.category)
  const topStrengths  = sorted.slice(-3).reverse().map(c => c.category)

  // Lead scoring
  let leadScore = 0
  if (revenueBand === '€500k–€1M')  leadScore += 10
  if (revenueBand === '€1M–€3M')    leadScore += 15
  if (revenueBand === '€3M–€10M')   leadScore += 20
  if (teamSize === '5–15')          leadScore += 10
  if (teamSize === '16–40')         leadScore += 15
  if (teamSize === '41–80')         leadScore += 20
  if (overallScore < 40)            leadScore += 20
  else if (overallScore < 70)       leadScore += 15
  else                              leadScore += 5
  if (biggestBottleneck)            leadScore += 20 // all bottlenecks match our services
  if (implementationHelp === true)  leadScore += 20

  const qualificationStatus: QualificationStatus =
    leadScore >= 75 ? 'hot' : leadScore >= 50 ? 'warm' : 'nurture'

  return {
    categoryScores,
    overallScore,
    maturityLabel: getMaturityLabel(overallScore),
    topWeaknesses,
    topStrengths,
    leadScore,
    qualificationStatus,
  }
}

export function getScoreColor(label: MaturityLabel): string {
  switch (label) {
    case 'Reactive':   return 'text-red-400'
    case 'Developing': return 'text-amber-400'
    case 'Scalable':   return 'text-emerald-400'
  }
}

export function getScoreBg(label: MaturityLabel): string {
  switch (label) {
    case 'Reactive':   return 'bg-red-400'
    case 'Developing': return 'bg-amber-400'
    case 'Scalable':   return 'bg-emerald-400'
  }
}

export function getScoreBadge(label: MaturityLabel): string {
  switch (label) {
    case 'Reactive':   return 'bg-red-900/40 text-red-300 border border-red-700/40'
    case 'Developing': return 'bg-amber-900/40 text-amber-300 border border-amber-700/40'
    case 'Scalable':   return 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/40'
  }
}
