import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { createQuotation } from '@/app/actions/quotation'
import { ArrowLeft, Save, FileText, Plus, DollarSign, Calendar } from 'lucide-react'

export default async function NewQuotationPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { customerId: preselectedCustomerId } = await searchParams

  const customers = await prisma.customer.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true, customerId: true, estimatedKw: true },
  })

  return (
    <div>
      <DashboardHeader title="Draft Solar Quotation" subtitle="Generate detailed Bill of Quantities (BOQ) with equipment specs, pricing &amp; terms" />

      <div style={{ maxWidth: 880, margin: '24px auto' }}>
        <Link
          href="/dashboard/quotations"
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
          <ArrowLeft size={16} /> Back to Quotations
        </Link>

        <form action={createQuotation} className="card" style={{ padding: 32 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 12 }}>
            <FileText size={22} color="#f5a623" />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Customer &amp; Validity</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
            <div className="form-group">
              <label className="form-label">Client / Customer *</label>
              <select name="customerId" required defaultValue={preselectedCustomerId || ''} className="form-input">
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.customerId}) {c.estimatedKw ? `[${c.estimatedKw} kW]` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Quotation Valid Until *</label>
              <input
                type="date"
                name="validUntil"
                required
                defaultValue={new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0]}
                className="form-input"
              />
            </div>
          </div>

          {/* Line items */}
          <div style={{ marginBottom: 24, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
              Component Line Items
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { desc: 'Tata Power 550W Mono PERC Half-Cut Bifacial Solar Modules', qty: 9, price: 12000 },
                { desc: 'Growatt 5kW 3-Phase Grid-Tie Inverter with WiFi Dongle', qty: 1, price: 46000 },
                { desc: 'Elevated Hot-Dip Galvanized (HDG) Mounting Structure & Clamps', qty: 1, price: 28000 },
                { desc: 'ACDB & DCDB Distribution Boxes with Type II SPD & MCBs', qty: 1, price: 9500 },
                { desc: 'Polycab DC 4sqmm Solar Cable, Conduit & Safety Accessories', qty: 1, price: 8500 },
                { desc: 'Chemical Earthing Kit (3 Rods) & Lightning Protection', qty: 1, price: 9000 },
                { desc: 'Installation, Testing, Commissioning & Net Metering Sanctioning', qty: 1, price: 25000 },
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr', gap: 12, alignItems: 'center' }}>
                  <input
                    type="text"
                    name="itemDescription"
                    defaultValue={item.desc}
                    className="form-input"
                    placeholder="Item description"
                  />
                  <input
                    type="number"
                    step="0.1"
                    name="itemQuantity"
                    defaultValue={item.qty}
                    className="form-input"
                    placeholder="Qty"
                  />
                  <input
                    type="number"
                    step="1"
                    name="itemUnitPrice"
                    defaultValue={item.price}
                    className="form-input"
                    placeholder="Unit Price"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Pricing totals */}
          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Subtotal Amount (₹)</label>
                <input type="number" name="subtotal" defaultValue="234000" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Discount (₹)</label>
                <input type="number" name="discount" defaultValue="14000" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">GST / Tax Amount (₹)</label>
                <input type="number" name="tax" defaultValue="26400" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label"><strong>Final Total (₹) *</strong></label>
                <input type="number" name="total" required defaultValue="246400" className="form-input" style={{ fontWeight: 800, color: 'var(--navy)' }} />
              </div>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="form-group" style={{ marginBottom: 24 }}>
            <label className="form-label">Terms &amp; Payment Schedule</label>
            <textarea
              name="terms"
              rows={3}
              defaultValue="1. 30% advance with work order. 2. 50% upon delivery of modules & inverter at site. 3. 20% on successful commissioning and DISCOM net meter synchronization. 4. 25-year performance warranty on solar panels; 5-year replacement warranty on inverter."
              className="form-input"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
            <Link href="/dashboard/quotations" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Generate Proposal
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
