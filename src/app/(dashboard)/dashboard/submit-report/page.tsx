import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { submitDailyReport } from '@/app/actions/report'
import { ArrowLeft, Save, Camera, CheckCircle2, AlertTriangle, HardHat } from 'lucide-react'
import ImageUploadInput from '@/components/common/ImageUploadInput'

export default async function SubmitReportPage({
  searchParams,
}: {
  searchParams: Promise<{ projectId?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { projectId: preselectedProjectId } = await searchParams

  const projects = await prisma.project.findMany({
    where: {
      status: { in: ['INSTALLATION_STARTED', 'INSTALLATION_IN_PROGRESS', 'MATERIAL_PREPARATION', 'SITE_VISIT'] },
    },
    include: {
      customer: { select: { name: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div style={{ maxWidth: 760, margin: '0 auto' }}>
      <DashboardHeader title="Submit Daily Site Work Report" subtitle="Record today's installation milestones, progress &amp; photos" />

      <div style={{ margin: '20px 0' }}>
        <Link
          href="/dashboard/my-projects"
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
          <ArrowLeft size={16} /> Back to My Projects
        </Link>
      </div>

      <form action={submitDailyReport} className="card" style={{ padding: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 12 }}>
          <Camera size={22} color="#f5a623" />
          <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>Daily Site Progress Log</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="form-group">
            <label className="form-label">Installation Project Site *</label>
            <select name="projectId" required defaultValue={preselectedProjectId || ''} className="form-input">
              <option value="">-- Choose Project Site --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.projectId} - {p.customer.name} ({p.capacityKw} kW) • Currently: {p.progress}%
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Date of Execution *</label>
              <input
                type="date"
                name="date"
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Crew Members Present *</label>
              <input type="number" min="1" max="20" name="workersPresent" defaultValue="3" required className="form-input" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Work Performed Today *</label>
            <textarea
              name="workPerformed"
              rows={4}
              required
              placeholder="e.g. Assembled rear and front structural legs. Mounted 9 solar modules and fastened mid/end clamps. Completed DC cable stringing to inverter location."
              className="form-input"
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Overall Project Progress (% Completion) *</label>
              <input
                type="number"
                min="0"
                max="100"
                name="progressPercent"
                required
                placeholder="e.g. 70"
                className="form-input"
              />
              <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                Enter total estimated site completion percentage.
              </span>
            </div>

            <ImageUploadInput
              name="photoUrl"
              label="Site Installation Photo (JPG, PNG, WEBP, GIF)"
              helpText="Browse or drag & drop actual site photo (JPG, PNG, WEBP, GIF up to 15MB) or toggle to paste web URL."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Materials Consumed Today</label>
            <input
              type="text"
              name="materialUsed"
              placeholder="e.g. 9 modules, 14 mid-clamps, 40m DC cable, 1 earthing electrode"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Problems / Site Roadblocks (If Any)</label>
            <textarea
              name="problems"
              rows={2}
              placeholder="e.g. Minor delay due to rain; AC distribution board location approved by client"
              className="form-input"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginTop: 24 }}>
          <Link href="/dashboard/my-projects" className="btn btn-outline" style={{ textDecoration: 'none' }}>
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Save size={18} /> Submit Daily Work Report
          </button>
        </div>
      </form>
    </div>
  )
}
