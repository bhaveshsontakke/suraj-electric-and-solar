import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { createExpense } from '@/app/actions/finance'
import { ArrowLeft, Save, Receipt, DollarSign, Calendar } from 'lucide-react'

export default async function NewExpensePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const projects = await prisma.project.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, projectId: true, customer: { select: { name: true } } },
  })

  return (
    <div>
      <DashboardHeader title="Add Expense Voucher" subtitle="Log site materials, transportation, tools, or fuel expense" />

      <div style={{ maxWidth: 720, margin: '24px auto' }}>
        <Link
          href="/dashboard/expenses"
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
          <ArrowLeft size={16} /> Back to Expenses
        </Link>

        <form action={createExpense} className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 12 }}>
            <Receipt size={22} color="#ef4444" />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Expense Voucher Details</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Expense Category *</label>
                <select name="category" required className="form-input">
                  <option value="MATERIAL">Site Materials &amp; Hardware</option>
                  <option value="TRANSPORT">Freight &amp; Transportation</option>
                  <option value="FUEL">Vehicle Fuel</option>
                  <option value="TOOLS">Tools &amp; Safety Equipment</option>
                  <option value="WORKER_PAYMENT">Site Labor Daily Wages</option>
                  <option value="OFFICE">Office &amp; Administrative</option>
                  <option value="MAINTENANCE">Vehicle &amp; Machinery Maintenance</option>
                  <option value="OTHER">Other Expense</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Amount (₹) *</label>
                <input type="number" step="1" name="amount" required placeholder="e.g. 3500" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Expense Description *</label>
              <input type="text" name="description" required placeholder="e.g. Anchor fasteners and cable ties for Baner site" className="form-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Associated Project (Optional)</label>
                <select name="projectId" className="form-input">
                  <option value="">-- General / Non-Project --</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.projectId} ({p.customer.name})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date of Expense *</label>
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
                <label className="form-label">Payment Method</label>
                <select name="paymentMethod" className="form-input">
                  <option value="CASH">Cash</option>
                  <option value="UPI">UPI / Google Pay</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                  <option value="COMPANY_CARD">Company Card</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Vendor / Bill Notes</label>
                <input type="text" name="notes" placeholder="Invoice or bill receipt reference" className="form-input" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginTop: 24 }}>
            <Link href="/dashboard/expenses" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
