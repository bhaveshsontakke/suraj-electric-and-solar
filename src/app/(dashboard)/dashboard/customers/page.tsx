import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, Search, Phone, MapPin, Zap, UserCheck, Calendar, ArrowUpRight } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'

import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteCustomer, deleteAllCustomers } from '@/app/actions/delete'

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = await searchParams
  const statusFilter = params.status || 'ALL'
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (statusFilter !== 'ALL') {
    whereClause.status = statusFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { name: { contains: searchFilter } },
      { mobile: { contains: searchFilter } },
      { city: { contains: searchFilter } },
    ]
  }

  const [customers, totalCount, newCount, approvedCount, completedCount] = await Promise.all([
    prisma.customer.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        projects: { select: { id: true, projectId: true, progress: true, status: true } },
      },
    }),
    prisma.customer.count(),
    prisma.customer.count({ where: { status: 'NEW_ENQUIRY' } }),
    prisma.customer.count({ where: { status: 'QUOTATION_APPROVED' } }),
    prisma.customer.count({ where: { status: 'COMPLETED' } }),
  ])

  const statusColors: Record<string, { bg: string; text: string }> = {
    NEW_ENQUIRY: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
    SITE_VISIT: { bg: 'rgba(245,166,35,0.1)', text: '#f5a623' },
    QUOTATION_SENT: { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6' },
    QUOTATION_APPROVED: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
    INSTALLATION_STARTED: { bg: 'rgba(234,88,12,0.1)', text: '#ea580c' },
    COMPLETED: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
    CANCELLED: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
  }

  return (
    <div>
      <DashboardHeader title="Customer Directory" subtitle="Manage all customer inquiries, leads, and active projects" />

      {/* Stats summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card blue">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Leads &amp; Customers</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">{newCount}</div>
          <div className="stat-label">New Inquiries</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{approvedCount}</div>
          <div className="stat-label">Approved Quotations</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed Systems</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button & Remove All */}
      <ListFilterBar
        basePath="/dashboard/customers"
        searchPlaceholder="Search customers by name, phone, city..."
        filterParamName="status"
        currentFilter={statusFilter}
        currentSearch={searchFilter}
        totalCount={totalCount}
        filterOptions={[
          { key: 'ALL', label: 'All Customers', count: totalCount },
          { key: 'NEW_ENQUIRY', label: 'New Enquiry', count: newCount },
          { key: 'SITE_VISIT', label: 'Site Visit' },
          { key: 'QUOTATION_APPROVED', label: 'Approved', count: approvedCount },
          { key: 'INSTALLATION_STARTED', label: 'Installation' },
          { key: 'COMPLETED', label: 'Completed', count: completedCount },
        ]}
        extraActions={
          <RemoveAllButton
            entityName="Customers"
            onRemoveAll={deleteAllCustomers}
            totalCount={totalCount}
            label="Remove All"
          />
        }
        actionButton={{
          label: 'Add Customer',
          href: '/dashboard/customers/new',
          icon: <Plus size={16} />,
        }}
      />

      {/* Customers Table / List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Customer ID / Name</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Contact Info</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>City / Location</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>System Size</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Projects</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
                    No customers found matching this criteria.
                  </td>
                </tr>
              ) : (
                customers.map((c, idx) => {
                  const badge = statusColors[c.status] || { bg: 'rgba(0,0,0,0.05)', text: '#666' }
                  return (
                    <tr
                      key={c.id}
                      style={{
                        borderBottom: idx < customers.length - 1 ? '1px solid var(--gray-100)' : 'none',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{c.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{c.customerId}</div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-700)' }}>
                          <Phone size={14} color="#f5a623" />
                          <a href={`tel:${c.mobile}`} style={{ color: 'inherit', textDecoration: 'none' }}>{c.mobile}</a>
                        </div>
                        {c.email && (
                          <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>{c.email}</div>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--gray-600)' }}>
                          <MapPin size={14} color="#3b82f6" />
                          <span>{c.city || 'N/A'}</span>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{ fontWeight: 700, color: 'var(--gray-800)' }}>
                          {c.estimatedKw ? `${c.estimatedKw} kW` : 'Custom'}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            padding: '4px 10px',
                            borderRadius: 12,
                            fontSize: 12,
                            fontWeight: 700,
                            background: badge.bg,
                            color: badge.text,
                          }}
                        >
                          {c.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {c.projects.length > 0 ? (
                          <span style={{ fontSize: 13, color: '#3b82f6', fontWeight: 600 }}>
                            {c.projects.length} Project ({c.projects[0].progress}%)
                          </span>
                        ) : (
                          <span style={{ fontSize: 13, color: 'var(--gray-400)' }}>None</span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'flex-end' }}>
                          <Link
                            href={`/dashboard/customers/${c.id}`}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4,
                              padding: '6px 12px',
                              borderRadius: 8,
                              background: 'var(--gray-100)',
                              color: 'var(--gray-700)',
                              textDecoration: 'none',
                              fontSize: 13,
                              fontWeight: 600,
                            }}
                          >
                            View <ArrowUpRight size={14} />
                          </Link>
                          <DeleteRowButton
                            id={c.id}
                            name={c.name}
                            onDelete={deleteCustomer}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

