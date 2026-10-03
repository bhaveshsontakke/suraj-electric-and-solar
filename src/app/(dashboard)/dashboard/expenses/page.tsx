import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, Receipt, TrendingDown, DollarSign, Calendar, Tag } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteExpense, deleteAllExpenses } from '@/app/actions/delete'

export default async function ExpensesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { category: catFilter, search: searchFilter } = await searchParams

  const whereClause: any = {}
  if (catFilter && catFilter !== 'ALL') {
    whereClause.category = catFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { description: { contains: searchFilter } },
      { project: { projectId: { contains: searchFilter } } },
    ]
  }

  const [expenses, totalAgg, monthlyAgg] = await Promise.all([
    prisma.expense.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        project: { select: { projectId: true, customer: { select: { name: true } } } },
        addedBy: { select: { name: true } },
      },
    }),
    prisma.expense.aggregate({ _sum: { amount: true } }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
    }),
  ])

  const totalExpense = totalAgg._sum.amount || 0
  const monthlyExpense = monthlyAgg._sum.amount || 0
  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  const categoryColors: Record<string, string> = {
    MATERIAL: '#3b82f6',
    TRANSPORT: '#f5a623',
    FUEL: '#ef4444',
    TOOLS: '#8b5cf6',
    WORKER_PAYMENT: '#10b981',
    OFFICE: '#6b7280',
    MAINTENANCE: '#06b6d4',
    OTHER: '#64748b',
  }

  return (
    <div>
      <DashboardHeader title="Expense Management" subtitle="Log and track daily installation expenses, transport, tools &amp; fuel" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card red">
          <div className="stat-value">{formatCur(totalExpense)}</div>
          <div className="stat-label">Total Cumulative Expenses</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">{formatCur(monthlyExpense)}</div>
          <div className="stat-label">Expenses This Month</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{expenses.length}</div>
          <div className="stat-label">Logged Expense Vouchers</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/expenses"
        searchPlaceholder="Search expenses by description, project..."
        filterParamName="category"
        currentFilter={catFilter || 'ALL'}
        currentSearch={searchFilter || ''}
        filterOptions={[
          { key: 'ALL', label: 'All Expenses' },
          { key: 'MATERIAL', label: 'Materials' },
          { key: 'TRANSPORT', label: 'Transport' },
          { key: 'FUEL', label: 'Fuel' },
          { key: 'TOOLS', label: 'Tools' },
          { key: 'WORKER_PAYMENT', label: 'Labor Wages' },
          { key: 'OFFICE', label: 'Office' },
          { key: 'OTHER', label: 'Other' },
        ]}
        extraActions={
          <RemoveAllButton
            entityName="Expenses"
            onRemoveAll={deleteAllExpenses}
            totalCount={expenses.length}
            label="Remove All"
          />
        }
        actionButton={{
          label: 'Add Expense',
          href: '/dashboard/expenses/new',
          icon: <Plus size={16} />,
        }}
      />


      {/* Expenses Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Description</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Project / Site</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Amount</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Payment Method</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Logged By</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
                    No expenses recorded in this category.
                  </td>
                </tr>
              ) : (
                expenses.map((e, idx) => (
                  <tr
                    key={e.id}
                    style={{
                      borderBottom: idx < expenses.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px', whiteSpace: 'nowrap' }}>
                      <div style={{ fontWeight: 600, color: 'var(--gray-900)' }}>
                        {new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          background: `${categoryColors[e.category] || '#666'}15`,
                          color: categoryColors[e.category] || '#666',
                        }}
                      >
                        {e.category.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>{e.description}</div>
                      {e.notes && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{e.notes}</div>}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {e.project ? (
                        <div style={{ fontSize: 13, color: 'var(--navy)', fontWeight: 600 }}>
                          {e.project.projectId} ({e.project.customer.name})
                        </div>
                      ) : (
                        <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>General Office</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#ef4444' }}>
                        {formatCur(e.amount)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>{e.paymentMethod}</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>{e.addedBy?.name || 'Staff'}</span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <DeleteRowButton
                        id={e.id}
                        name={`Expense ${e.description} (₹${e.amount})`}
                        onDelete={deleteExpense}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

