import type { Expense, ParentRole } from '@/lib/store'

export type Balances = {
  total: number
  paidByYou: number
  paidByPartner: number
  yourExpected: number
  partnerExpected: number
  balance: number
  owedByYou: number
  owedToYou: number
  pendingShare: number
}

/**
 * splitPercent is the share of the cost carried by Parent A; Parent B carries
 * the remainder. The balance is money already paid minus the share each parent
 * was expected to carry, so a positive balance means the partner owes you.
 */
export function computeBalances(expenses: Expense[], role: ParentRole): Balances {
  const partnerRole: ParentRole = role === 'Parent A' ? 'Parent B' : 'Parent A'

  let total = 0
  let paidByYou = 0
  let paidByPartner = 0
  let expectedA = 0
  let expectedB = 0
  let pendingShare = 0

  for (const expense of expenses) {
    const split = Math.min(100, Math.max(0, expense.splitPercent))
    const shareA = (expense.amount * split) / 100
    const shareB = expense.amount - shareA
    total += expense.amount
    expectedA += shareA
    expectedB += shareB

    if (expense.paidBy === role) paidByYou += expense.amount
    if (expense.paidBy === partnerRole) {
      paidByPartner += expense.amount
      pendingShare += role === 'Parent A' ? shareA : shareB
    }
  }

  const yourExpected = role === 'Parent A' ? expectedA : expectedB
  const partnerExpected = role === 'Parent A' ? expectedB : expectedA
  const balance = paidByYou - yourExpected

  return {
    total,
    paidByYou,
    paidByPartner,
    yourExpected,
    partnerExpected,
    balance,
    owedByYou: Math.max(0, -balance),
    owedToYou: Math.max(0, balance),
    pendingShare,
  }
}
