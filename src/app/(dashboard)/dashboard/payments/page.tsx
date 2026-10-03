import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, CreditCard, DollarSign, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deletePayment, deleteAllPayments } from '@/app/actions/delete'

export default async function PaymentsPage({
  searchParams,
}: {
  searchParams?: Promise<{ method?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = searchParams ? await searchParams : {}
  const methodFilter = params.method || 'ALL'
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (methodFilter !== 'ALL') {
    whereClause.paymentMethod = methodFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { paymentId: { contains: searchFilter } },
      { customer: { name: { contains: searchFilter } } },
      { transactionRef: { contains: searchFilter } },
      { notes: { contains: searchFilter } },
    ]
  }

  const [payments, totalSalesAgg, totalPaidAgg, totalPendingAgg] = await Promise.all([
    prisma.customerPayment.findMany({
      where: whereClause,
      orderBy: { date: 'desc' },
      include: {
        customer: { select: { id: true, name: true, mobile: true } },
        project: { select: { id: true, projectId: true, capacityKw: true } },
      },
    }),
    prisma.project.aggregate({ _sum: { projectAmount: true } }),
    prisma.project.aggregate({ _sum: { paidAmount: true } }),
    prisma.project.aggregate({ _sum: { pendingAmount: true } }),
  ])

  const totalSales = totalSalesAgg._sum.projectAmount || 0
  const totalPaid = totalPaidAgg._sum.paidAmount || 0
  const totalPending = totalPendingAgg._sum.pendingAmount || 0
  const collectionRate = totalSales > 0 ? Math.round((totalPaid / totalSales) * 100) : 0

  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader title="Payments &amp; Collections" subtitle="Manage customer billing receipts, advance payments &amp; pending balances" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card blue">
          <div className="stat-value">{formatCur(totalSales)}</div>
          <div className="stat-label">Total Contract Value</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{formatCur(totalPaid)}</div>
          <div className="stat-label">Collected Payments</div>
        </div>
        <div className="stat-card red">
          <div className="stat-value">{formatCur(totalPending)}</div>
          <div className="stat-label">Pending Collections</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{collectionRate}%</div>
          <div className="stat-label">Collection Efficiency</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/payments"
        searchPlaceholder="Search payments by receipt ID, customer, transaction ref..."
        filterParamName="method"
        currentFilter={methodFilter}
        currentSearch={searchFilter}
        totalCount={payments.length}
        filterOptions={[
          { key: 'ALL', label: 'All Payments' },
          { key: 'CASH', label: 'Cash' },
          { key: 'UPI', label: 'UPI / Online' },
          { key: 'BANK_TRANSFER', label: 'Bank Transfer' },
          { key: 'CHEQUE', label: 'Cheque' },
        ]}
        extraActions={
          <RemoveAllButton
            entityName="Payments"
            onRemoveAll={deleteAllPayments}
            totalCount={payments.length}
            label="Remove All"
          />
        }
        actionButton={{
          label: 'Record Payment',
          href: '/dashboard/payments/new',
          icon: <Plus size={16} />,
        }}
      />


      {/* Payments Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Receipt ID / Date</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Customer</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Project</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Amount</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Payment Method</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Reference / Notes</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
                    No payment transactions recorded yet.
                  </td>
                </tr>
              ) : (
                payments.map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: idx < payments.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{p.paymentId}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                        {new Date(p.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Link href={`/dashboard/customers/${p.customer.id}`} style={{ fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }}>
                        {p.customer.name}
                      </Link>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{p.customer.mobile}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <Link href={`/dashboard/projects/${p.project.id}`} style={{ color: 'var(--gray-700)', fontWeight: 600, textDecoration: 'none' }}>
                        {p.project.projectId} ({p.project.capacityKw} kW)
                      </Link>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: '#22c55e' }}>
                        {formatCur(p.amount)}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '3px 8px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          background: 'rgba(59,130,246,0.1)',
                          color: '#3b82f6',
                        }}
                      >
                        {p.paymentMethod}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {p.transactionRef && (
                        <div style={{ fontSize: 12, color: 'var(--gray-800)', fontWeight: 600 }}>{p.transactionRef}</div>
                      )}
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{p.notes || '-'}</div>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <DeleteRowButton
                        id={p.id}
                        name={`Receipt ${p.paymentId} (₹${p.amount})`}
                        onDelete={deletePayment}
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

