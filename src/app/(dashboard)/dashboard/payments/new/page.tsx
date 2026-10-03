import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { createCustomerPayment } from '@/app/actions/finance'
import { ArrowLeft, Save, CreditCard, DollarSign, Calendar } from 'lucide-react'

export default async function NewPaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string; projectId?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { customerId: preCustomerId, projectId: preProjectId } = await searchParams

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      customer: { select: { id: true, name: true, customerId: true } },
    },
  })

  return (
    <div>
      <DashboardHeader title="Record Customer Payment" subtitle="Add incoming payment against a solar project contract" />

      <div style={{ maxWidth: 720, margin: '24px auto' }}>
        <Link
          href="/dashboard/payments"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--gray-600)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={16} /> Back to Payments
        </Link>

        <form action={createCustomerPayment} className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 12 }}>
            <CreditCard size={22} color="#22c55e" />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Payment Details</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Project / Customer Selector */}
            <div className="form-group">
              <label className="form-label">Project / Customer *</label>
              <select
                name="projectId"
                required
                defaultValue={preProjectId || ''}
                className="form-input"
                id="projectSelect"
              >
                <option value="">-- Choose Project --</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.projectId} - {p.customer.name} ({p.capacityKw} kW) • Pending: ₹{p.pendingAmount.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>

            {/* Hidden customerId that gets populated or we infer from project */}
            {/* To be safe in action, we can get customerId from selected project or send customer list */}
            {/* Let's send customerId from projects map or provide customer select */}
            <div className="form-group">
              <label className="form-label">Customer Associated *</label>
              <select name="customerId" required defaultValue={preCustomerId || ''} className="form-input">
                <option value="">-- Choose Customer --</option>
                {projects.map((p) => (
                  <option key={`c-${p.customer.id}`} value={p.customer.id}>
                    {p.customer.name} ({p.customer.customerId})
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Payment Amount (₹) *</label>
                <input type="number" step="1" name="amount" required placeholder="e.g. 50000" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Payment Date *</label>
                <input
                  type="date"
                  name="date"
                  required
                  defaultValue={new Date().toISOString().split('T')[0]}
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Payment Method *</label>
                <select name="paymentMethod" className="form-input">
                  <option value="UPI">UPI / Google Pay / PhonePe</option>
                  <option value="BANK_TRANSFER">Bank Transfer (NEFT / RTGS / IMPS)</option>
                  <option value="CHEQUE">Cheque</option>
                  <option value="CASH">Cash</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Transaction Reference / UTR / Cheque No.</label>
                <input type="text" name="transactionRef" placeholder="e.g. UTR-9821039821" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Notes / Payment Stage</label>
              <textarea name="notes" rows={2} placeholder="e.g. 2nd Milestone payment on structure completion" className="form-input" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginTop: 24 }}>
            <Link href="/dashboard/payments" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Record Receipt
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
