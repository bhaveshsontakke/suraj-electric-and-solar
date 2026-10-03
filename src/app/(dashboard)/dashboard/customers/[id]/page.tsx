import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import {
  ArrowLeft, Phone, Mail, MapPin, Zap, Plus, FolderOpen,
  CreditCard, FileText, CheckCircle2, Clock, Calendar, MessageSquare
} from 'lucide-react'
import { updateCustomerStatus } from '@/app/actions/customer'

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const customer = await prisma.customer.findUnique({
    where: { id },
    include: {
      projects: {
        include: {
          payments: true,
        },
      },
      quotations: true,
      payments: true,
      createdBy: { select: { name: true } },
    },
  })

  if (!customer) notFound()

  const totalProjectAmount = customer.projects.reduce((acc, p) => acc + p.projectAmount, 0)
  const totalPaid = customer.payments.reduce((acc, p) => acc + p.amount, 0)
  const pendingAmount = Math.max(0, totalProjectAmount - totalPaid)

  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader
        title={`Customer: ${customer.name}`}
        subtitle={`${customer.customerId} • Added by ${customer.createdBy?.name || 'Staff'}`}
      />

      <div style={{ margin: '20px 0' }}>
        <Link
          href="/dashboard/customers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--gray-600)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={16} /> Back to Customers
        </Link>
      </div>

      {/* Hero Customer Card */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <h1 style={{ fontSize: 24, fontWeight: 900, color: 'var(--gray-900)' }}>{customer.name}</h1>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'rgba(59,130,246,0.1)',
                  color: '#3b82f6',
                }}
              >
                {customer.status.replace('_', ' ')}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: 14, color: 'var(--gray-600)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Phone size={15} color="#f5a623" />
                <a href={`tel:${customer.mobile}`} style={{ color: 'inherit', fontWeight: 600, textDecoration: 'none' }}>
                  {customer.mobile}
                </a>
              </div>
              {customer.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Mail size={15} color="#3b82f6" />
                  <a href={`mailto:${customer.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                    {customer.email}
                  </a>
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <MapPin size={15} color="#22c55e" />
                <span>{customer.city || 'Location not specified'}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div style={{ display: 'flex', gap: 10 }}>
            <a
              href={`https://wa.me/91${customer.mobile.replace(/[^0-9]/g, '')}?text=Hello ${customer.name}, regarding your SolarPro inquiry.`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 10,
                background: '#25d366',
                color: 'white',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <MessageSquare size={16} /> WhatsApp
            </a>
            <a
              href={`tel:${customer.mobile}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 16px',
                borderRadius: 10,
                background: 'var(--navy)',
                color: 'white',
                fontSize: 13,
                fontWeight: 700,
                textDecoration: 'none',
              }}
            >
              <Phone size={16} /> Call Client
            </a>
          </div>
        </div>

        {/* Update status action bar */}
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid var(--gray-200)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)' }}>Update Status:</span>
          {['SITE_VISIT', 'QUOTATION_SENT', 'QUOTATION_APPROVED', 'INSTALLATION_STARTED', 'COMPLETED'].map((st) => (
            <form key={st} action={async () => {
              'use server'
              await updateCustomerStatus(customer.id, st)
            }}>
              <button
                type="submit"
                disabled={customer.status === st}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid var(--gray-300)',
                  background: customer.status === st ? 'var(--gray-200)' : 'white',
                  color: customer.status === st ? 'var(--gray-500)' : 'var(--gray-800)',
                  cursor: customer.status === st ? 'default' : 'pointer',
                }}
              >
                {st.replace('_', ' ')}
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* Grid: Financials & Requirement */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="stat-card green">
          <div className="stat-value">{formatCur(totalProjectAmount)}</div>
          <div className="stat-label">Total Project Value</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{formatCur(totalPaid)}</div>
          <div className="stat-label">Total Payments Received</div>
        </div>
        <div className="stat-card red">
          <div className="stat-value">{formatCur(pendingAmount)}</div>
          <div className="stat-label">Outstanding Balance</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">{customer.estimatedKw ? `${customer.estimatedKw} kW` : 'Custom'}</div>
          <div className="stat-label">Estimated System Capacity</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left Column: Projects & Quotations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Projects */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <FolderOpen size={20} color="#f5a623" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>Customer Projects</h3>
              </div>
              <Link
                href={`/dashboard/projects/new?customerId=${customer.id}`}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> New Project
              </Link>
            </div>

            {customer.projects.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>No projects created yet for this customer.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {customer.projects.map((p) => (
                  <div
                    key={p.id}
                    style={{
                      padding: 16,
                      borderRadius: 12,
                      border: '1px solid var(--gray-200)',
                      background: 'var(--gray-50)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <Link href={`/dashboard/projects/${p.id}`} style={{ fontWeight: 800, fontSize: 16, color: 'var(--gray-900)', textDecoration: 'none' }}>
                          {p.projectId} ({p.capacityKw} kW System)
                        </Link>
                        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>{p.siteAddress}</div>
                      </div>
                      <span
                        style={{
                          padding: '4px 10px',
                          borderRadius: 12,
                          fontSize: 12,
                          fontWeight: 700,
                          background: 'rgba(34,197,94,0.1)',
                          color: '#22c55e',
                        }}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </div>

                    <div style={{ marginTop: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--gray-600)', marginBottom: 4 }}>
                        <span>Installation Progress</span>
                        <span style={{ fontWeight: 700 }}>{p.progress}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment Receipts */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CreditCard size={20} color="#22c55e" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>Payments &amp; Receipts</h3>
              </div>
              <Link
                href={`/dashboard/payments/new?customerId=${customer.id}`}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> Record Payment
              </Link>
            </div>

            {customer.payments.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>No payment entries recorded yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {customer.payments.map((pm) => (
                  <div key={pm.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 10 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{formatCur(pm.amount)}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{pm.paymentMethod} • {new Date(pm.date).toLocaleDateString('en-IN')}</div>
                    </div>
                    {pm.transactionRef && (
                      <span style={{ fontSize: 12, color: 'var(--gray-600)', background: 'white', padding: '2px 8px', borderRadius: 6, border: '1px solid var(--gray-200)' }}>
                        {pm.transactionRef}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Site & Requirement Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 14 }}>Site Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, fontSize: 13 }}>
              <div>
                <span style={{ color: 'var(--gray-400)', display: 'block', fontSize: 12, marginBottom: 2 }}>Installation Site Address</span>
                <p style={{ color: 'var(--gray-800)', fontWeight: 600, lineHeight: 1.4 }}>{customer.siteAddress || 'Same as billing address'}</p>
              </div>
              <div>
                <span style={{ color: 'var(--gray-400)', display: 'block', fontSize: 12, marginBottom: 2 }}>Billing Address</span>
                <p style={{ color: 'var(--gray-800)', fontWeight: 600, lineHeight: 1.4 }}>{customer.address || 'N/A'}</p>
              </div>
              <div>
                <span style={{ color: 'var(--gray-400)', display: 'block', fontSize: 12, marginBottom: 2 }}>Lead Source</span>
                <p style={{ color: 'var(--gray-800)', fontWeight: 600 }}>{customer.leadSource || 'Direct Lead'}</p>
              </div>
              <div>
                <span style={{ color: 'var(--gray-400)', display: 'block', fontSize: 12, marginBottom: 2 }}>Customer Requirement / Notes</span>
                <p style={{ color: 'var(--gray-800)', lineHeight: 1.5, background: 'var(--gray-50)', padding: 10, borderRadius: 8 }}>
                  {customer.requirement || 'No specific requirements recorded.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
