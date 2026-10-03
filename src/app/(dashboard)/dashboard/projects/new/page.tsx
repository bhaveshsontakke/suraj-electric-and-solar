import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { createProject } from '@/app/actions/project'
import { ArrowLeft, Save, FolderOpen, User, Zap, HardHat, DollarSign } from 'lucide-react'

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { customerId: preselectedCustomerId } = await searchParams

  const [customers, workers] = await Promise.all([
    prisma.customer.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, customerId: true, siteAddress: true, estimatedKw: true },
    }),
    prisma.workerProfile.findMany({
      include: { user: { select: { name: true, role: true } } },
    }),
  ])

  return (
    <div>
      <DashboardHeader title="Create New Solar Project" subtitle="Set up a new rooftop or commercial solar installation site" />

      <div style={{ maxWidth: 840, margin: '24px auto' }}>
        <Link
          href="/dashboard/projects"
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
          <ArrowLeft size={16} /> Back to Projects
        </Link>

        <form action={createProject} className="card" style={{ padding: 32 }}>
          {/* Section 1: Customer Selection */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--gray-200)', paddingBottom: 10 }}>
              <User size={20} color="#f5a623" />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Customer &amp; Site Location</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Select Customer *</label>
                <select name="customerId" required defaultValue={preselectedCustomerId || ''} className="form-input">
                  <option value="">-- Choose Customer --</option>
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.customerId}) {c.estimatedKw ? `- ${c.estimatedKw} kW` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">GPS Coordinates / Location</label>
                <input type="text" name="gpsLocation" placeholder="e.g. 18.5204° N, 73.8567° E" className="form-input" />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Site Installation Address</label>
                <textarea name="siteAddress" rows={2} placeholder="Specific installation location or rooftop details" className="form-input" />
              </div>
            </div>
          </div>

          {/* Section 2: Technical Specifications */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--gray-200)', paddingBottom: 10 }}>
              <Zap size={20} color="#3b82f6" />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>System Specifications</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">System Capacity (kW) *</label>
                <input type="number" step="0.5" name="capacityKw" required placeholder="e.g. 5.0" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Initial Project Status</label>
                <select name="status" className="form-input">
                  <option value="SITE_VISIT">Site Visit Scheduled</option>
                  <option value="MATERIAL_PREPARATION">Material Preparation</option>
                  <option value="INSTALLATION_STARTED">Installation Started</option>
                  <option value="INSTALLATION_IN_PROGRESS">Installation In Progress</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Solar Module / Panel Details</label>
                <input type="text" name="panelDetails" placeholder="e.g. 9x Tata Power 550W Mono PERC" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Inverter Specifications</label>
                <input type="text" name="inverterDetails" placeholder="e.g. Growatt 5kW 3-Phase Grid-Tie" className="form-input" />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Mounting Structure &amp; Roof Specs</label>
                <input type="text" name="structureDetails" placeholder="e.g. Elevated HDG GI Structure 10ft clearance on RCC Flat Roof" className="form-input" />
              </div>
            </div>
          </div>

          {/* Section 3: Financials & Technicians */}
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18, borderBottom: '1px solid var(--gray-200)', paddingBottom: 10 }}>
              <DollarSign size={20} color="#22c55e" />
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Contract &amp; Team Assignment</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Total Project Contract Value (₹) *</label>
                <input type="number" name="projectAmount" required placeholder="e.g. 285000" className="form-input" />
              </div>

              <div className="form-group">
                <label className="form-label">Assign Field Technicians</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 6 }}>
                  {workers.map((w) => (
                    <label key={w.id} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, cursor: 'pointer' }}>
                      <input type="checkbox" name="workerIds" value={w.id} style={{ width: 16, height: 16, accentColor: '#f5a623' }} />
                      <span>{w.user.name} ({w.paymentType === 'DAILY' ? 'Daily Wage' : 'Monthly'})</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Project Notes &amp; Special Instructions</label>
                <textarea name="notes" rows={2} placeholder="Shading considerations, DISCOM net metering sanction application number, etc." className="form-input" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20 }}>
            <Link href="/dashboard/projects" className="btn btn-outline" style={{ textDecoration: 'none' }}>
              Cancel
            </Link>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Initialize Project
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
