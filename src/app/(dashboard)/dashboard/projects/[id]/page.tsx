import { auth } from '@/lib/auth'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import {
  ArrowLeft, User, MapPin, Zap, DollarSign, HardHat,
  Calendar, CheckCircle2, AlertCircle, Plus, Camera, CreditCard,
  Clock, ArrowUpRight
} from 'lucide-react'
import { updateProjectProgress } from '@/app/actions/project'

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { id } = await params
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      customer: true,
      assignedWorkers: {
        include: {
          worker: {
            include: { user: { select: { id: true, name: true, mobile: true } } },
          },
        },
      },
      workReports: {
        orderBy: { date: 'desc' },
        include: {
          worker: { select: { name: true } },
          photos: true,
        },
      },
      payments: {
        orderBy: { date: 'desc' },
      },
      expenses: {
        orderBy: { date: 'desc' },
      },
    },
  })

  if (!project) notFound()

  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`
  const totalExpenses = project.expenses.reduce((acc, e) => acc + e.amount, 0)

  return (
    <div>
      <DashboardHeader
        title={`Project: ${project.projectId} (${project.capacityKw} kW)`}
        subtitle={`Customer: ${project.customer.name} • Location: ${project.siteAddress || project.customer.city || 'N/A'}`}
      />

      <div style={{ margin: '20px 0' }}>
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
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={16} /> Back to Projects
        </Link>
      </div>

      {/* Main Status & Progress Banner */}
      <div className="card" style={{ marginBottom: 24, padding: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginBottom: 16 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: 'var(--gray-900)' }}>
                {project.capacityKw} kW Solar Installation Site
              </h1>
              <span
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 700,
                  background: 'rgba(245,166,35,0.15)',
                  color: '#ea580c',
                }}
              >
                {project.status.replace(/_/g, ' ')}
              </span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
              Site: {project.siteAddress || 'No specific address'} {project.gpsLocation ? `(${project.gpsLocation})` : ''}
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Installation Completion</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: project.progress === 100 ? '#22c55e' : 'var(--navy)' }}>
              {project.progress}%
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar" style={{ height: 10, marginBottom: 16 }}>
          <div className="progress-fill" style={{ width: `${project.progress}%` }} />
        </div>

        {/* Quick progress update pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap', paddingTop: 12, borderTop: '1px solid var(--gray-100)' }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-600)' }}>Update Progress:</span>
          {[25, 50, 65, 80, 100].map((pct) => (
            <form
              key={pct}
              action={async () => {
                'use server'
                await updateProjectProgress(
                  project.id,
                  pct,
                  pct === 100 ? 'COMPLETED' : 'INSTALLATION_IN_PROGRESS'
                )
              }}
            >
              <button
                type="submit"
                disabled={project.progress === pct}
                style={{
                  padding: '4px 10px',
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid var(--gray-300)',
                  background: project.progress === pct ? 'var(--navy)' : 'white',
                  color: project.progress === pct ? 'white' : 'var(--gray-700)',
                  cursor: project.progress === pct ? 'default' : 'pointer',
                }}
              >
                {pct}%
              </button>
            </form>
          ))}
        </div>
      </div>

      {/* Financials Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="stat-card blue">
          <div className="stat-value">{formatCur(project.projectAmount)}</div>
          <div className="stat-label">Project Contract Amount</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{formatCur(project.paidAmount)}</div>
          <div className="stat-label">Customer Paid</div>
        </div>
        <div className="stat-card red">
          <div className="stat-value">{formatCur(project.pendingAmount)}</div>
          <div className="stat-label">Outstanding Balance</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{formatCur(totalExpenses)}</div>
          <div className="stat-label">Site Expenses Incurred</div>
        </div>
      </div>

      {/* Grid: Details & Team */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Left Column: Work Reports & Site Photos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Equipment Specs */}
          <div className="card">
            <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
              ⚙️ System Specifications
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Solar Modules</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginTop: 4 }}>
                  {project.panelDetails || 'Specifications not specified'}
                </p>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 10 }}>
                <span style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Inverter System</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginTop: 4 }}>
                  {project.inverterDetails || 'Specifications not specified'}
                </p>
              </div>

              <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 10, gridColumn: 'span 2' }}>
                <span style={{ fontSize: 11, color: 'var(--gray-400)', textTransform: 'uppercase', fontWeight: 700 }}>Mounting Structure &amp; Roof Specs</span>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--gray-800)', marginTop: 4 }}>
                  {project.structureDetails || 'Specifications not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Daily Work Reports from Workers */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Clock size={20} color="#f5a623" />
                <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>Field Work Reports</h3>
              </div>
              <Link
                href={`/dashboard/submit-report?projectId=${project.id}`}
                className="btn btn-outline"
                style={{ padding: '6px 12px', fontSize: 13, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> Submit Report
              </Link>
            </div>

            {project.workReports.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 14 }}>No work reports submitted yet for this project.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {project.workReports.map((r) => (
                  <div key={r.id} style={{ padding: 16, borderRadius: 12, border: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--gray-900)' }}>
                          {r.worker.name}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--gray-500)', marginLeft: 8 }}>
                          • {new Date(r.date).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 8,
                          fontSize: 11,
                          fontWeight: 700,
                          background: r.status === 'APPROVED' ? 'rgba(34,197,94,0.1)' : 'rgba(245,166,35,0.1)',
                          color: r.status === 'APPROVED' ? '#22c55e' : '#f5a623',
                        }}
                      >
                        {r.status}
                      </span>
                    </div>

                    <p style={{ fontSize: 13, color: 'var(--gray-700)', lineHeight: 1.5, marginBottom: 8 }}>
                      {r.workPerformed}
                    </p>

                    {r.materialUsed && (
                      <div style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 8 }}>
                        📦 <strong>Materials:</strong> {r.materialUsed}
                      </div>
                    )}

                    {r.photos.length > 0 && (
                      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
                        {r.photos.map((ph) => (
                          <a key={ph.id} href={ph.url} target="_blank" rel="noopener noreferrer">
                            <img
                              src={ph.url}
                              alt={ph.caption || 'Site photo'}
                              style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--gray-200)' }}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Customer & Assigned Technicians */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Customer Card */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>Customer</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div>
                <Link href={`/dashboard/customers/${project.customer.id}`} style={{ fontWeight: 800, fontSize: 15, color: 'var(--navy)', textDecoration: 'none' }}>
                  {project.customer.name}
                </Link>
                <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{project.customer.customerId}</div>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                📞 <a href={`tel:${project.customer.mobile}`} style={{ color: 'inherit', textDecoration: 'none' }}>{project.customer.mobile}</a>
              </div>
              <div style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                📍 {project.customer.city || 'N/A'}
              </div>
            </div>
          </div>

          {/* Assigned Technicians */}
          <div className="card">
            <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 12 }}>
              👷 Assigned Technicians
            </h3>
            {project.assignedWorkers.length === 0 ? (
              <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>No workers assigned yet.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {project.assignedWorkers.map((aw) => (
                  <div key={aw.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 8 }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>{aw.worker.user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{aw.worker.user.mobile}</div>
                    </div>
                    <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.1)', color: '#22c55e', padding: '2px 8px', borderRadius: 6, fontWeight: 700 }}>
                      ACTIVE
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
