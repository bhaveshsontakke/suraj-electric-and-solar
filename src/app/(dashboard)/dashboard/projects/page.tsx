import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, FolderOpen, MapPin, Zap, User, Clock, ArrowUpRight, CheckCircle2 } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteProject, deleteAllProjects } from '@/app/actions/delete'

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = await searchParams
  const statusFilter = params.status || 'ALL'
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (statusFilter !== 'ALL') {
    whereClause.status = statusFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { projectId: { contains: searchFilter } },
      { siteAddress: { contains: searchFilter } },
      { customer: { name: { contains: searchFilter } } },
    ]
  }

  const [projects, totalCount, activeCount, completedCount, totalKwAgg] = await Promise.all([
    prisma.project.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { id: true, name: true, mobile: true, city: true } },
        assignedWorkers: {
          include: {
            worker: { include: { user: { select: { name: true } } } },
          },
        },
      },
    }),
    prisma.project.count(),
    prisma.project.count({
      where: {
        status: { in: ['INSTALLATION_STARTED', 'INSTALLATION_IN_PROGRESS', 'MATERIAL_PREPARATION'] },
      },
    }),
    prisma.project.count({ where: { status: 'COMPLETED' } }),
    prisma.project.aggregate({ _sum: { capacityKw: true } }),
  ])

  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  const statusColors: Record<string, { bg: string; text: string }> = {
    SITE_VISIT: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
    QUOTATION: { bg: 'rgba(139,92,246,0.1)', text: '#8b5cf6' },
    MATERIAL_PREPARATION: { bg: 'rgba(245,166,35,0.1)', text: '#f5a623' },
    INSTALLATION_STARTED: { bg: 'rgba(234,88,12,0.1)', text: '#ea580c' },
    INSTALLATION_IN_PROGRESS: { bg: 'rgba(234,88,12,0.15)', text: '#c2410c' },
    TESTING: { bg: 'rgba(14,165,233,0.1)', text: '#0ea5e9' },
    COMPLETED: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
    HANDOVER: { bg: 'rgba(16,185,129,0.1)', text: '#10b981' },
  }

  return (
    <div>
      <DashboardHeader title="Solar Projects" subtitle="Track on-site installation progress, equipment &amp; team assignments" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card blue">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Total Projects</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">{activeCount}</div>
          <div className="stat-label">Active Installations</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{completedCount}</div>
          <div className="stat-label">Completed Plants</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{totalKwAgg._sum.capacityKw || 0} kW</div>
          <div className="stat-label">Total Solar Deployed</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/projects"
        searchPlaceholder="Search projects by ID, address, customer..."
        filterParamName="status"
        currentFilter={statusFilter}
        currentSearch={searchFilter}
        totalCount={totalCount}
        filterOptions={[
          { key: 'ALL', label: 'All Projects', count: totalCount },
          { key: 'MATERIAL_PREPARATION', label: 'Material Prep' },
          { key: 'INSTALLATION_IN_PROGRESS', label: 'Installation', count: activeCount },
          { key: 'TESTING', label: 'Testing' },
          { key: 'COMPLETED', label: 'Completed', count: completedCount },
        ]}
        extraActions={
          <RemoveAllButton
            entityName="Projects"
            onRemoveAll={deleteAllProjects}
            totalCount={totalCount}
            label="Remove All"
          />
        }
        actionButton={{
          label: 'New Solar Project',
          href: '/dashboard/projects/new',
          icon: <Plus size={16} />,
        }}
      />


      {/* Projects List Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {projects.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
            No projects found matching the filter.
          </div>
        ) : (
          projects.map((p) => {
            const badge = statusColors[p.status] || { bg: 'rgba(0,0,0,0.05)', text: '#666' }
            return (
              <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: '#f5a623', letterSpacing: '0.05em' }}>
                        {p.projectId}
                      </span>
                      <h3 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)', marginTop: 2 }}>
                        {p.capacityKw} kW Solar System
                      </h3>
                    </div>
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: 12,
                        fontSize: 11,
                        fontWeight: 700,
                        background: badge.bg,
                        color: badge.text,
                      }}
                    >
                      {p.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  {/* Customer & Location */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--gray-600)', marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <User size={15} color="var(--gray-400)" />
                      <Link href={`/dashboard/customers/${p.customer.id}`} style={{ color: 'var(--gray-900)', fontWeight: 600, textDecoration: 'none' }}>
                        {p.customer.name}
                      </Link>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={15} color="var(--gray-400)" />
                      <span className="line-clamp-1">{p.siteAddress || p.customer.city || 'Site address not provided'}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span style={{ color: 'var(--gray-500)' }}>Progress</span>
                      <span style={{ fontWeight: 700, color: p.progress === 100 ? '#22c55e' : 'var(--gray-900)' }}>
                        {p.progress}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${p.progress}%`,
                          background: p.progress === 100 ? '#22c55e' : undefined,
                        }}
                      />
                    </div>
                  </div>

                  {/* Financials & Team */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--gray-50)', borderRadius: 10, fontSize: 12, marginBottom: 16 }}>
                    <div>
                      <span style={{ color: 'var(--gray-400)', display: 'block' }}>Contract Value</span>
                      <strong style={{ color: 'var(--gray-900)' }}>{formatCur(p.projectAmount)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--gray-400)', display: 'block' }}>Received</span>
                      <strong style={{ color: '#22c55e' }}>{formatCur(p.paidAmount)}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--gray-400)', display: 'block' }}>Balance</span>
                      <strong style={{ color: p.pendingAmount > 0 ? '#ef4444' : '#22c55e' }}>{formatCur(p.pendingAmount)}</strong>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--gray-100)', paddingTop: 14 }}>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                    👷 {p.assignedWorkers.length} Technician{p.assignedWorkers.length === 1 ? '' : 's'} assigned
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        fontSize: 13,
                        fontWeight: 700,
                        color: '#f5a623',
                        textDecoration: 'none',
                      }}
                    >
                      View Project <ArrowUpRight size={15} />
                    </Link>
                    <DeleteRowButton
                      id={p.id}
                      name={`Project ${p.projectId}`}
                      onDelete={deleteProject}
                    />
                  </div>
                </div>
              </div>

            )
          })
        )}
      </div>
    </div>
  )
}
