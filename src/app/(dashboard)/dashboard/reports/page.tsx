import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { ClipboardList, CheckCircle2, XCircle, Clock, Camera, User, FolderOpen } from 'lucide-react'
import { reviewWorkReport } from '@/app/actions/report'

export default async function ReportsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const reports = await prisma.workReport.findMany({
    orderBy: { submittedAt: 'desc' },
    include: {
      worker: { select: { id: true, name: true, mobile: true } },
      project: {
        select: {
          id: true,
          projectId: true,
          capacityKw: true,
          customer: { select: { name: true } },
        },
      },
      photos: true,
    },
  })

  const pendingCount = reports.filter((r) => r.status === 'PENDING').length
  const approvedCount = reports.filter((r) => r.status === 'APPROVED').length

  return (
    <div>
      <DashboardHeader title="Site Work Reports" subtitle="Review on-site installation work submitted daily by field technicians" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card yellow">
          <div className="stat-value">{pendingCount}</div>
          <div className="stat-label">Pending Owner Review</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{approvedCount}</div>
          <div className="stat-label">Approved Reports</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{reports.length}</div>
          <div className="stat-label">Total Reports Logged</div>
        </div>
      </div>

      {/* Reports List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {reports.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
            No work reports submitted yet.
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>
                      {r.project.projectId} ({r.project.capacityKw} kW - {r.project.customer.name})
                    </h3>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background:
                          r.status === 'APPROVED'
                            ? 'rgba(34,197,94,0.1)'
                            : r.status === 'PENDING'
                            ? 'rgba(245,166,35,0.1)'
                            : 'rgba(239,68,68,0.1)',
                        color:
                          r.status === 'APPROVED'
                            ? '#22c55e'
                            : r.status === 'PENDING'
                            ? '#f5a623'
                            : '#ef4444',
                      }}
                    >
                      {r.status}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                    Submitted by <strong>{r.worker.name}</strong> • Work Date: {new Date(r.date).toLocaleDateString('en-IN')}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>Progress Reported</span>
                    <div style={{ fontWeight: 800, fontSize: 16, color: 'var(--navy)' }}>{r.progressPercent}%</div>
                  </div>

                  {/* Approve / Reject actions */}
                  {r.status === 'PENDING' && (
                    <div style={{ display: 'flex', gap: 8 }}>
                      <form
                        action={async () => {
                          'use server'
                          await reviewWorkReport(r.id, 'APPROVED')
                        }}
                      >
                        <button
                          type="submit"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '6px 12px', borderRadius: 8, border: 'none',
                            background: '#22c55e', color: 'white', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          <CheckCircle2 size={14} /> Approve
                        </button>
                      </form>

                      <form
                        action={async () => {
                          'use server'
                          await reviewWorkReport(r.id, 'REJECTED', 'Site verification needed')
                        }}
                      >
                        <button
                          type="submit"
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            padding: '6px 12px', borderRadius: 8, border: '1px solid #ef4444',
                            background: 'white', color: '#ef4444', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                          }}
                        >
                          <XCircle size={14} /> Reject
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>

              {/* Work performed */}
              <div style={{ background: 'var(--gray-50)', padding: 14, borderRadius: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gray-400)', textTransform: 'uppercase' }}>Work Executed</span>
                <p style={{ fontSize: 14, color: 'var(--gray-800)', lineHeight: 1.5, marginTop: 4 }}>
                  {r.workPerformed}
                </p>
              </div>

              {/* Materials & Problems */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12, fontSize: 13, color: 'var(--gray-600)', marginBottom: 12 }}>
                {r.materialUsed && (
                  <div>
                    <strong>📦 Materials Consumed:</strong> {r.materialUsed}
                  </div>
                )}
                {r.problems && (
                  <div>
                    <strong style={{ color: '#ea580c' }}>⚠️ Issues Faced:</strong> {r.problems}
                  </div>
                )}
              </div>

              {/* Photos */}
              {r.photos.length > 0 && (
                <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-600)', marginBottom: 8, display: 'block' }}>
                    Site Photos ({r.photos.length}):
                  </span>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {r.photos.map((p) => (
                      <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer">
                        <img
                          src={p.url}
                          alt="Report photo"
                          style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 10, border: '1px solid var(--gray-200)' }}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
