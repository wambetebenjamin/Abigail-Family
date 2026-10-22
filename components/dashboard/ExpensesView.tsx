'use client'

import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Paperclip, Plus, Receipt, X } from 'lucide-react'
import BalanceBar from '@/components/dashboard/BalanceBar'
import { useApiForm } from '@/components/dashboard/useApiForm'
import { CaptchaFallback, useRecaptcha } from '@/components/site/Recaptcha'
import { computeBalances } from '@/lib/balances'
import { formatDate, formatKes } from '@/lib/dates'
import { uploadFile } from '@/lib/client-api'
import type { Expense, ParentRole } from '@/lib/store'
import { expenseCategories } from '@/lib/validation'

export default function ExpensesView({
  expenses,
  parentRole,
  yourName,
  partnerName,
}: {
  expenses: Expense[]
  parentRole: ParentRole
  yourName: string
  partnerName: string
}) {
  const router = useRouter()
  const { execute } = useRecaptcha()
  const formApi = useApiForm<{ expense: Expense }>('/api/expenses/add', 'add_expense')
  const fileInput = useRef<HTMLInputElement | null>(null)

  const [formOpen, setFormOpen] = useState(false)
  const [category, setCategory] = useState<string>(expenseCategories[0])
  const [amount, setAmount] = useState('')
  const [splitPercent, setSplitPercent] = useState('50')
  const [paidBy, setPaidBy] = useState<ParentRole>(parentRole)
  const [notes, setNotes] = useState('')
  const [receipt, setReceipt] = useState<File | null>(null)
  const [uploadNote, setUploadNote] = useState<string | null>(null)

  const balances = useMemo(() => computeBalances(expenses, parentRole), [expenses, parentRole])
  const partnerRole: ParentRole = parentRole === 'Parent A' ? 'Parent B' : 'Parent A'
  const splitA = Math.min(100, Math.max(0, Number(splitPercent) || 0))
  const yourShareFor = (expense: Expense) =>
    parentRole === 'Parent A'
      ? (expense.amount * expense.splitPercent) / 100
      : expense.amount - (expense.amount * expense.splitPercent) / 100

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setUploadNote(null)

    let receiptUrl = ''
    if (receipt) {
      const recaptchaToken = await execute('upload_document')
      const uploaded = await uploadFile(receipt, 'receipt', { recaptchaToken: recaptchaToken || '' })
      if (uploaded.ok && uploaded.url) {
        receiptUrl = uploaded.url
      } else {
        setUploadNote(
          `${uploaded.error || 'The receipt could not be uploaded.'} The expense can still be saved without it.`,
        )
      }
    }

    const result = await formApi.submit({
      category,
      amount: Number(amount),
      splitPercent: Number(splitPercent),
      paidBy,
      notes,
      receiptUrl,
    })

    if (result?.ok) {
      setAmount('')
      setNotes('')
      setSplitPercent('50')
      setReceipt(null)
      if (fileInput.current) fileInput.current.value = ''
      setFormOpen(false)
      router.refresh()
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BalanceBar
            paidByYou={balances.paidByYou}
            paidByPartner={balances.paidByPartner}
            balance={balances.balance}
            yourName={yourName}
            partnerName={partnerName}
          />
        </div>
        <div className="card grid grid-cols-2 divide-x divide-line">
          <div className="p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">You paid</p>
            <p className="mt-1 font-display text-xl text-ink">{formatKes(balances.paidByYou)}</p>
            <p className="mt-1 text-[11px] text-muted">share {formatKes(balances.yourExpected)}</p>
          </div>
          <div className="p-4">
            <p className="text-[11px] uppercase tracking-[0.12em] text-muted">
              {partnerName.split(' ')[0]} paid
            </p>
            <p className="mt-1 font-display text-xl text-ink">{formatKes(balances.paidByPartner)}</p>
            <p className="mt-1 text-[11px] text-muted">
              share {formatKes(balances.partnerExpected)}
            </p>
          </div>
        </div>
      </div>

      <section className="card p-4 sm:p-5" aria-labelledby="expense-table-heading">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 id="expense-table-heading" className="text-lg text-ink">
            Shared child expenses
          </h2>
          <button
            type="button"
            onClick={() => setFormOpen((value) => !value)}
            className="btn btn-primary px-4 text-[11px]"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add expense
          </button>
        </div>

        <div className="mt-4 overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[600px] px-4 sm:px-0">
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-[11px] uppercase tracking-[0.1em] text-muted">
                  <th scope="col" className="py-2 pr-3 font-semibold">Date</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Category</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Notes</th>
                  <th scope="col" className="py-2 pr-3 font-semibold">Paid by</th>
                  <th scope="col" className="py-2 pr-3 text-right font-semibold">Amount</th>
                  <th scope="col" className="py-2 pr-3 text-right font-semibold">Split A/B</th>
                  <th scope="col" className="py-2 text-right font-semibold">Your share</th>
                </tr>
              </thead>
              <tbody>
                {expenses.length ? (
                  expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-line/70 align-top">
                      <td className="whitespace-nowrap py-3 pr-3 text-xs text-muted">
                        {formatDate(expense.createdAt.slice(0, 10))}
                      </td>
                      <td className="py-3 pr-3 text-slatedeep">
                        <span className="flex items-center gap-1.5">
                          {expense.category}
                          {expense.receiptUrl ? (
                            <a
                              href={expense.receiptUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open receipt for ${expense.category}`}
                              className="text-primary"
                            >
                              <Receipt className="h-3.5 w-3.5" aria-hidden="true" />
                            </a>
                          ) : null}
                        </span>
                      </td>
                      <td className="max-w-[220px] py-3 pr-3 text-xs text-muted">
                        {expense.notes || 'No notes'}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-3 text-xs text-slatedeep">
                        {expense.paidBy === parentRole ? `${yourName.split(' ')[0]} (you)` : partnerName.split(' ')[0]}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-3 text-right text-ink">
                        {formatKes(expense.amount)}
                      </td>
                      <td className="whitespace-nowrap py-3 pr-3 text-right text-xs text-muted">
                        {expense.splitPercent}/{100 - expense.splitPercent}
                      </td>
                      <td className="whitespace-nowrap py-3 text-right text-xs font-semibold text-slatedeep">
                        {formatKes(yourShareFor(expense))}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-6 text-center text-sm text-muted">
                      No shared expenses yet. Add the first one and the balance starts from a clear
                      place.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-xs text-center mt-2 opacity-60 sm:hidden">Scroll left to see full table</p>
      </section>

      {formOpen ? (
        <form onSubmit={submit} className="card p-4 sm:p-5" aria-label="Add a shared expense">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg text-ink">Add an expense</h2>
              <p className="text-xs text-muted">
                Amounts in Kenya shillings. Split A/B means the share carried by Parent A and Parent B.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              aria-label="Close the add expense form"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-slatedeep"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor="expense-category" className="field-label">
                Category
              </label>
              <select
                id="expense-category"
                className="field"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {expenseCategories.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="expense-amount" className="field-label">
                Amount (KES)
              </label>
              <input
                id="expense-amount"
                type="number"
                inputMode="decimal"
                min="1"
                step="1"
                className="field"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                placeholder="2500"
                required
              />
              {formApi.fieldErrors.amount?.[0] ? (
                <p className="mt-1 text-xs text-[#b02a37]">{formApi.fieldErrors.amount[0]}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="expense-paid-by" className="field-label">
                Who paid?
              </label>
              <select
                id="expense-paid-by"
                className="field"
                value={paidBy}
                onChange={(event) => setPaidBy(event.target.value as ParentRole)}
              >
                <option value="Parent A">Parent A ({yourName.split(' ')[0]})</option>
                <option value="Parent B">Parent B ({partnerName.split(' ')[0]})</option>
              </select>
            </div>

            <div>
              <label htmlFor="expense-split" className="field-label">
                Split, Parent A share
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="expense-split"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={splitPercent}
                  onChange={(event) => setSplitPercent(event.target.value)}
                  className="h-11 w-full accent-[#f86f2d]"
                />
                <span className="w-14 shrink-0 text-right text-sm font-semibold text-ink">
                  {splitA}/{100 - splitA}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <label htmlFor="expense-notes" className="field-label">
              Notes (optional)
            </label>
            <textarea
              id="expense-notes"
              className="field min-h-[80px]"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Term two fees, pharmacy, school shoes"
              maxLength={600}
            />
          </div>

          <div className="mt-3">
            <span className="field-label">Receipt (optional)</span>
            <label
              htmlFor="expense-receipt"
              className="flex min-h-[44px] cursor-pointer items-center gap-2 rounded border border-dashed border-line bg-surface px-3 text-sm text-muted transition hover:border-primary"
            >
              <Paperclip className="h-4 w-4" aria-hidden="true" />
              {receipt ? receipt.name : 'Attach a photo or PDF'}
            </label>
            <input
              id="expense-receipt"
              ref={fileInput}
              type="file"
              accept="application/pdf,image/*"
              className="sr-only"
              onChange={(event) => setReceipt(event.target.files?.[0] ?? null)}
            />
            <p className="mt-1 text-[11px] text-muted">
              Receipts are stored privately for your family space. Keep files under 10 MB.
            </p>
          </div>

          {uploadNote ? (
            <p role="status" className="mt-3 rounded border border-tertiary/40 bg-tertiary/10 p-3 text-xs text-slatedeep">
              {uploadNote}
            </p>
          ) : null}

          {formApi.error ? (
            <p role="alert" className="mt-3 rounded border border-[#dc3545]/30 bg-[#dc3545]/5 p-3 text-xs text-[#b02a37]">
              {formApi.error}
            </p>
          ) : null}

          {formApi.requiresV2 ? (
            <CaptchaFallback onRetry={() => formApi.retry()} retrying={formApi.loading} />
          ) : null}

          <button
            type="submit"
            disabled={formApi.loading}
            className="btn btn-primary mt-4 w-full disabled:opacity-70"
          >
            {formApi.loading ? 'Saving expense' : 'Save expense'}
          </button>
        </form>
      ) : null}
    </div>
  )
}
