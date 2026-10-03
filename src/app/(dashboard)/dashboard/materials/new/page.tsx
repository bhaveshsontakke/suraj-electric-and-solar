import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { createMaterial } from '@/app/actions/inventory'
import { ArrowLeft, Save, Package } from 'lucide-react'

export default async function NewMaterialPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const suppliers = await prisma.supplier.findMany({ select: { id: true, name: true } })

  return (
    <div>
      <DashboardHeader title="Add New Material / SKU" subtitle="Register a new equipment or balance of system hardware into inventory" />

      <div style={{ maxWidth: 720, margin: '24px auto' }}>
        <Link
          href="/dashboard/materials"
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
          <ArrowLeft size={16} /> Back to Materials
        </Link>

        <form action={createMaterial} className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 12 }}>
            <Package size={22} color="#3b82f6" />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Material Specifications</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Item / Material Name *</label>
              <input type="text" name="name" required placeholder="e.g. Tata Power 550W Mono PERC Half-Cut Module" className="form-input" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select name="category" required className="form-input">
                  <option value="SOLAR_PANEL">Solar Panel / Module</option>
                  <option value="INVERTER">Solar Inverter</option>
                  <option value="DC_CABLE">DC Solar Cable</option>
                  <option value="AC_CABLE">AC Cable</option>
                  <option value="MOUNTING_STRUCTURE">Mounting Structure / GI Rail</option>
                  <option value="EARTHING">Earthing Rod &amp; Chemical Kit</option>
                  <option value="ACDB">ACDB Box</option>
                  <option value="DCDB">DCDB Box</option>
                  <option value="MC4_CONNECTOR">MC4 Connectors</option>
                  <option value="BATTERY">Battery Storage</option>
                  <option value="TOOL">Tools &amp; Equipment</option>
                  <option value="OTHER">Other Hardware</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Measurement Unit *</label>
                <select name="unit" required className="form-input">
                  <option value="piece">piece</option>
                  <option value="meter">meter</option>
                  <option value="set">set</option>
                  <option value="kg">kg</option>
                  <option value="pair">pair</option>
                  <option value="box">box</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Brand / Manufacturer</label>
                <input type="text" name="brand" placeholder="e.g. Tata Power, Growatt, Polycab" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Model Number / Wattage</label>
                <input type="text" name="model" placeholder="e.g. 550W Mono PERC" className="form-input" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Initial Stock Qty *</label>
                <input type="number" step="0.1" name="currentQty" required placeholder="0" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Min Alert Level *</label>
                <input type="number" step="0.1" name="minStockLevel" required placeholder="5" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Purchase Price (₹) *</label>
                <input type="number" step="1" name="purchasePrice" required placeholder="e.g. 11500" className="form-input" />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Primary Supplier</label>
              <select name="supplierId" className="form-input">
                <option value="">-- Select Supplier (Optional) --</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes &amp; Technical Specs</label>
              <textarea name="notes" rows={2} placeholder="Warranty info, datasheet link, dimensions, etc." className="form-input" />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginTop: 24 }}>
            <Link href="/dashboard/materials" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Save Material
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
