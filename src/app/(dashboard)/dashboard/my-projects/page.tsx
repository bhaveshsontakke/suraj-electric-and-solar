import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { FolderOpen, MapPin, Zap, Camera, ArrowLeft } from 'lucide-react'

export default async function MyProjectsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId },
  })

  // If worker profile exists, fetch their assigned projects; otherwise all active
  let projects: any[] = []
  if (workerProfile) {
    const assignments = await prisma.projectWorker.findMany({
      where: { workerId: workerProfile.id, isActive: true },
      include: {
        project: {
          include: {
            customer: { select: { name: true, mobile: true, city: true } },
          },
        },
      },
    })
    projects = assignments.map((a) => a.project)
  }

  // Fallback: If no direct assignments yet, show active installation projects
  if (projects.length === 0) {
    projects = await prisma.project.findMany({
      where: { status: { in: ['INSTALLATION_STARTED', 'INSTALLATION_IN_PROGRESS', 'MATERIAL_PREPARATION'] } },
      include: {
        customer: { select: { name: true, mobile: true, city: true } },
      },
      take: 5,
    })
  }

  return (
    <div>
      <DashboardHeader title="My Assigned Installation Sites" subtitle="View active solar projects assigned to you for execution" />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 20, margin: '24px 0' }}>
        {projects.map((p) => (
          <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#f5a623' }}>{p.projectId}</span>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', marginTop: 2 }}>
                    {p.capacityKw} kW Solar Installation
                  </h3>
                </div>
                <span
                  style={{
                    padding: '3px 8px',
                    borderRadius: 8,
                    fontSize: 11,
                    fontWeight: 700,
                    background: 'rgba(59,130,246,0.1)',
                    color: '#3b82f6',
                  }}
                >
                  {p.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
                <div>
                  <strong style={{ color: 'var(--gray-900)' }}>Customer: </strong>
                  {p.customer.name} (📞 {p.customer.mobile})
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <MapPin size={15} color="#3b82f6" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{p.siteAddress || p.customer.city || 'Address on file'}</span>
                </div>
              </div>

              {/* Progress */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: 'var(--gray-500)' }}>Completion</span>
                  <span style={{ fontWeight: 700 }}>{p.progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${p.progress}%` }} />
                </div>
              </div>

              {/* Specs */}
              <div style={{ background: 'var(--gray-50)', padding: 12, borderRadius: 10, fontSize: 12, marginBottom: 16 }}>
                <div><strong>Modules: </strong>{p.panelDetails || 'As per BOQ'}</div>
                <div style={{ marginTop: 4 }}><strong>Inverter: </strong>{p.inverterDetails || 'As per BOQ'}</div>
              </div>
            </div>

            <Link
              href={`/dashboard/submit-report?projectId=${p.id}`}
              className="btn btn-primary"
              style={{ textDecoration: 'none', justifyContent: 'center', display: 'inline-flex', alignItems: 'center', gap: 8 }}
            >
              <Camera size={16} /> Submit Today's Site Report
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
