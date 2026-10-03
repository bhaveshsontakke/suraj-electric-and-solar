import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { BarChart3, TrendingUp, TrendingDown, DollarSign, Zap } from 'lucide-react'

export default async function MonthlyReportPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [monthlyCollections, monthlyExpenses, completedThisMonth, expensesByCategory] = await Promise.all([
    prisma.customerPayment.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfMonth } },
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: startOfMonth } },
    }),
    prisma.project.findMany({
      where: {
        status: 'COMPLETED',
        updatedAt: { gte: startOfMonth },
      },
      select: { projectId: true, capacityKw: true, projectAmount: true, customer: { select: { name: true } } },
    }),
    prisma.expense.groupBy({
      by: ['category'],
      _sum: { amount: true },
      where: { date: { gte: startOfMonth } },
    }),
  ])

  const totalCollected = monthlyCollections._sum.amount || 0
  const totalExpense = monthlyExpenses._sum.amount || 0
  const netProfit = totalCollected - totalExpense
  const totalKwCompleted = completedThisMonth.reduce((acc, p) => acc + (p.capacityKw || 0), 0)

  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader
        title="Monthly Performance &amp; P&amp;L Report"
        subtitle={`Business financials for ${now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
      />

      {/* Main P&L Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card green">
          <div className="stat-value">{formatCur(totalCollected)}</div>
          <div className="stat-label">Total Monthly Collections</div>
        </div>
        <div className="stat-card red">
          <div className="stat-value">{formatCur(totalExpense)}</div>
          <div className="stat-label">Monthly Business Expenses</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value" style={{ color: netProfit >= 0 ? '#22c55e' : '#ef4444' }}>
            {formatCur(netProfit)}
          </div>
          <div className="stat-label">Net Operational Surplus / P&amp;L</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{totalKwCompleted} kW</div>
          <div className="stat-label">Capacity Energized this Month</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Expenses by Category */}
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
            📊 Expenses Breakdown by Category
          </h3>
          {expensesByCategory.length === 0 ? (
            <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>No expenses recorded this month.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {expensesByCategory.map((c) => {
                const amount = c._sum.amount || 0
                const pct = totalExpense > 0 ? Math.round((amount / totalExpense) * 100) : 0
                return (
                  <div key={c.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                      <span style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{c.category.replace('_', ' ')}</span>
                      <span>
                        <strong>{formatCur(amount)}</strong> ({pct}%)
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${pct}%`, background: '#ef4444' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Commissioned Projects */}
        <div className="card">
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
            ☀️ Projects Energized / Commissioned
          </h3>
          {completedThisMonth.length === 0 ? (
            <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>No projects closed this month yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {completedThisMonth.map((p) => (
                <div key={p.projectId} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 10 }}>
                  <div>
                    <strong style={{ color: 'var(--gray-900)' }}>{p.projectId}</strong>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{p.customer.name}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, color: '#22c55e' }}>{p.capacityKw} kW</span>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{formatCur(p.projectAmount)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
