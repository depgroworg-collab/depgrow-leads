import type { BudgetRange, UrgencyLevel, ScoreResult, LeadSegment } from '@/types'

const BUDGET_SCORE: Record<BudgetRange, number> = {
  under_10k: 5,
  '10k_20k': 20,
  '20k_50k': 40,
  '50k_1L':  70,
  above_1L:  100,
}

const URGENCY_SCORE: Record<UrgencyLevel, number> = {
  this_week:      100,
  this_month:     60,
  next_3_months:  30,
  just_exploring: 5,
}

/**
 * Score a lead 0-100 and assign Hot / Warm / Cold segment.
 *
 * Hot  = Budget ≥ ₹50k  AND urgency = "this week"
 * Warm = Budget ₹20k-50k OR urgency = "this month" (and not Hot)
 * Cold = everything else
 */
export function scoreLead(budget: BudgetRange, urgency: UrgencyLevel): ScoreResult {
  const budgetScore  = BUDGET_SCORE[budget]  ?? 5
  const urgencyScore = URGENCY_SCORE[urgency] ?? 5

  // Weighted average: budget 50%, urgency 50%
  const score = Math.round((budgetScore + urgencyScore) / 2)

  let segment: LeadSegment

  const isHighBudget = budget === '50k_1L' || budget === 'above_1L'
  const isMidBudget  = budget === '20k_50k'

  if (isHighBudget && urgency === 'this_week') {
    segment = 'Hot'
  } else if (isHighBudget || isMidBudget || urgency === 'this_month') {
    segment = 'Warm'
  } else {
    segment = 'Cold'
  }

  return { segment, score }
}
