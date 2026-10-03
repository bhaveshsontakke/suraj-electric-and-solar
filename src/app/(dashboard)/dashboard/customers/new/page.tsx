import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { createCustomer } from '@/app/actions/customer'
import { ArrowLeft, Save, User, MapPin, Zap, Info } from 'lucide-react'

export default async function NewCustomerPage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div>
      <DashboardHeader title="Add New Customer" subtitle="Register a new customer inquiry or solar project prospect" />

      <div style={{ maxWidth: 840, margin: '24px auto' }}>
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
            marginBottom: 20,
          }}
        >
          <ArrowLeft size={16} /> Back to Customer List
        </Link>

        <form action={createCustomer} className="card" style={{ padding: 32 }}>
          {/* Section 1: Personal Details */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--gray-200)', paddingBottom: 10 }}>
              <User size={20} color="#f5a623" />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Customer Contact Info</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input type="text" name="name" required placeholder="e.g. Ramesh Deshmukh" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Primary Mobile Number *</label>
                <input type="tel" name="mobile" required placeholder="10-digit mobile number" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Alternate Mobile / WhatsApp</label>
                <input type="tel" name="alternateMobile" placeholder="Optional alternate number" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" name="email" placeholder="customer@example.com" className="form-input" />
              </div>
            </div>
          </div>

          {/* Section 2: Site Location */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--gray-200)', paddingBottom: 10 }}>
              <MapPin size={20} color="#3b82f6" />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Installation Site &amp; Address</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Site Address (Where Solar will be installed)</label>
                <textarea name="siteAddress" rows={2} placeholder="Full address of the installation site with landmark" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">City / Town</label>
                <input type="text" name="city" placeholder="e.g. Pune, PCMC, Satara" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Billing / Correspondence Address</label>
                <input type="text" name="address" placeholder="Leave blank if same as site address" className="form-input" />
              </div>
            </div>
          </div>

          {/* Section 3: Solar Requirements */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--gray-200)', paddingBottom: 10 }}>
              <Zap size={20} color="#22c55e" />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Solar Requirement</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Estimated System Capacity (kW)</label>
                <input type="number" step="0.5" name="estimatedKw" placeholder="e.g. 3, 5, 10, 25" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Lead Source</label>
                <select name="leadSource" className="form-input">
                  <option value="Direct Call">Direct Call / Walk-in</option>
                  <option value="Website Calculator">Website Solar Calculator</option>
                  <option value="Referral">Existing Customer Referral</option>
                  <option value="Social Media">Social Media / Ads</option>
                  <option value="Field Outreach">Field Outreach / Canvassing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Status</label>
                <select name="status" className="form-input">
                  <option value="NEW_ENQUIRY">New Enquiry</option>
                  <option value="SITE_VISIT">Site Visit Scheduled</option>
                  <option value="QUOTATION_SENT">Quotation Sent</option>
                  <option value="QUOTATION_APPROVED">Quotation Approved</option>
                </select>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Customer Requirements &amp; Notes</label>
                <textarea name="requirement" rows={3} placeholder="Current monthly electricity bill, roof type (RCC/Tin shed), net metering requirement, etc." className="form-input" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
            <Link href="/dashboard/customers" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Save Customer Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
