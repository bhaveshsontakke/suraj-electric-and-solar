import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, FileText, CheckCircle2, Clock, XCircle, ArrowUpRight } from 'lucide-react'
import { updateQuotationStatus } from '@/app/actions/quotation'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteQuotation, deleteAllQuotations } from '@/app/actions/delete'

export default async function QuotationsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = searchParams ? await searchParams : {}
  const statusFilter = params.status || 'ALL'
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (statusFilter !== 'ALL') {
    whereClause.status = statusFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { quotationId: { contains: searchFilter } },
      { customer: { name: { contains: searchFilter } } },
    ]
  }

  const quotations = await prisma.quotation.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: { select: { id: true, name: true, mobile: true, city: true } },
      items: true,
      createdBy: { select: { name: true } },
    },
  })

  const totalValue = quotations.reduce((acc, q) => acc + q.total, 0)
  const approvedCount = quotations.filter((q) => q.status === 'APPROVED').length

  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader title="Solar Proposals &amp; Quotations" subtitle="Prepare customer solar quotes, itemized bills of materials &amp; PM Surya Ghar estimates" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card yellow">
          <div className="stat-value">{quotations.length}</div>
          <div className="stat-label">Total Quotations Sent</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{approvedCount}</div>
          <div className="stat-label">Approved by Clients</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{formatCur(totalValue)}</div>
          <div className="stat-label">Total Proposal Pipeline</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/quotations"
        searchPlaceholder="Search quotations by quote ID, customer name..."
        filterParamName="status"
        currentFilter={statusFilter}
        currentSearch={searchFilter}
        totalCount={quotations.length}
        filterOptions={[
          { key: 'ALL', label: 'All Quotations' },
          { key: 'DRAFT', label: 'Draft' },
          { key: 'SENT', label: 'Sent' },
          { key: 'APPROVED', label: 'Approved', count: approvedCount },
          { key: 'REJECTED', label: 'Rejected' },
        ]}
        extraActions={
          <RemoveAllButton
            entityName="Quotations"
            onRemoveAll={deleteAllQuotations}
            totalCount={quotations.length}
            label="Remove All"
          />
        }
        actionButton={{
          label: 'Create Quotation',
          href: '/dashboard/quotations/new',
          icon: <Plus size={16} />,
        }}
      />


      {/* Quotations Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Quote ID / Date</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Customer</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Items Count</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Total Value</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {quotations.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
                    No quotations generated yet. Click "Create Quotation" to draft one.
                  </td>
                </tr>
              ) : (
                quotations.map((q, idx) => (
                  <tr
                    key={q.id}
                    style={{
                      borderBottom: idx < quotations.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{q.quotationId}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                        {new Date(q.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      {q.customer ? (
                        <div>
                          <Link href={`/dashboard/customers/${q.customer.id}`} style={{ fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }}>
                            {q.customer.name}
                          </Link>
                          <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{q.customer.mobile}</div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--gray-400)' }}>General Prospect</span>
                      )}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>{q.items.length} Component Items</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <strong style={{ fontSize: 15, color: 'var(--navy)' }}>{formatCur(q.total)}</strong>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            q.status === 'APPROVED'
                              ? 'rgba(34,197,94,0.1)'
                              : q.status === 'SENT'
                              ? 'rgba(245,166,35,0.1)'
                              : 'rgba(239,68,68,0.1)',
                          color:
                            q.status === 'APPROVED'
                              ? '#22c55e'
                              : q.status === 'SENT'
                              ? '#f5a623'
                              : '#ef4444',
                        }}
                      >
                        {q.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                        {q.status !== 'APPROVED' && (
                          <form
                            style={{ display: 'inline-block' }}
                            action={async () => {
                              'use server'
                              await updateQuotationStatus(q.id, 'APPROVED')
                            }}
                          >
                            <button
                              type="submit"
                              style={{
                                padding: '5px 10px',
                                borderRadius: 6,
                                border: '1px solid #22c55e',
                                background: 'white',
                                color: '#22c55e',
                                fontSize: 12,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              Mark Approved
                            </button>
                          </form>
                        )}
                        <DeleteRowButton
                          id={q.id}
                          name={`Quotation ${q.quotationId}`}
                          onDelete={deleteQuotation}
                        />
                      </div>
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
