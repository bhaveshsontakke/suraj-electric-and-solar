import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { createWorker } from '@/app/actions/team'
import { ArrowLeft, Save, Briefcase, DollarSign, User } from 'lucide-react'

export default async function NewWorkerPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div>
      <DashboardHeader title="Register New Field Technician" subtitle="Add solar roof wireman or electrical technician to the installation crew" />

      <div style={{ maxWidth: 720, margin: '24px auto' }}>
        <Link
          href="/dashboard/workers"
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
          <ArrowLeft size={16} /> Back to Workers
        </Link>

        <form action={createWorker} className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 12 }}>
            <User size={22} color="#8b5cf6" />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Worker Credentials &amp; Contact</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" name="name" required placeholder="e.g. Ramesh Kumar" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Mobile Number (For Login) *</label>
                <input type="tel" name="mobile" required placeholder="10-digit mobile number" className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Login Password *</label>
                <input type="text" name="password" required defaultValue="worker123" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Emergency Contact Phone</label>
                <input type="tel" name="emergencyContact" placeholder="Relative phone number" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Residential Address</label>
              <input type="text" name="address" placeholder="e.g. Warje, Pune, Maharashtra" className="form-input" />
            </div>

            <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 16, marginTop: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <DollarSign size={20} color="#22c55e" />
                <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>Wages &amp; Payment Model</h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Payment Type *</label>
                  <select name="paymentType" className="form-input">
                    <option value="DAILY">Daily Wage</option>
                    <option value="MONTHLY">Monthly Fixed Salary</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Rate / Salary Amount (₹)</label>
                  <input type="number" name="dailyRate" placeholder="e.g. 850 (if daily) or 22000 (if monthly)" className="form-input" />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Bank Details / UPI for Wage Transfer</label>
                <input type="text" name="bankDetails" placeholder="SBI A/C: 123456789, IFSC: SBIN0001234" className="form-input" />
              </div>

              <div className="form-group" style={{ marginTop: 16 }}>
                <label className="form-label">Skills &amp; Roles Notes</label>
                <textarea name="notes" rows={2} placeholder="Certified wireman, elevated mounting, inverter commissioning..." className="form-input" />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginTop: 24 }}>
            <Link href="/dashboard/workers" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Register Worker
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
