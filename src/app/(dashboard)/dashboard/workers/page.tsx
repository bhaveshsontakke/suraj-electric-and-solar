import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, Briefcase, Phone, MapPin, DollarSign, HardHat, CalendarDays, ArrowUpRight } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteWorker, deleteAllWorkers } from '@/app/actions/delete'

export default async function WorkersPage({
  searchParams,
}: {
  searchParams?: Promise<{ type?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = searchParams ? await searchParams : {}
  const typeFilter = params.type || 'ALL'
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (typeFilter !== 'ALL') {
    whereClause.paymentType = typeFilter
  }
  if (searchFilter) {
    whereClause.user = {
      OR: [
        { name: { contains: searchFilter } },
        { mobile: { contains: searchFilter } },
      ],
    }
  }

  const workers = await prisma.workerProfile.findMany({
    where: whereClause,
    include: {
      user: { select: { id: true, name: true, mobile: true, email: true, isActive: true } },
      projectAssignments: {
        where: { isActive: true },
        include: {
          project: { select: { id: true, projectId: true, capacityKw: true, customer: { select: { name: true } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  const dailyCount = workers.filter((w) => w.paymentType === 'DAILY').length
  const monthlyCount = workers.filter((w) => w.paymentType === 'MONTHLY').length

  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader title="Technicians &amp; Field Workers" subtitle="Manage installation crew, wiremen, wage rates &amp; project site assignments" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card purple">
          <div className="stat-value">{workers.length}</div>
          <div className="stat-label">Total Technicians</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">{dailyCount}</div>
          <div className="stat-label">Daily Wage Crew</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{monthlyCount}</div>
          <div className="stat-label">Monthly Salaried Staff</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/workers"
        searchPlaceholder="Search technicians by name, mobile..."
        filterParamName="type"
        currentFilter={typeFilter}
        currentSearch={searchFilter}
        totalCount={workers.length}
        filterOptions={[
          { key: 'ALL', label: 'All Technicians', count: workers.length },
          { key: 'DAILY', label: 'Daily Wage Crew', count: dailyCount },
          { key: 'MONTHLY', label: 'Monthly Staff', count: monthlyCount },
        ]}
        extraActions={
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link
              href="/dashboard/attendance"
              className="btn btn-outline"
              style={{
                textDecoration: 'none',
                padding: '9px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Daily Attendance
            </Link>
            <Link
              href="/dashboard/salary"
              className="btn btn-outline"
              style={{
                textDecoration: 'none',
                padding: '9px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Payroll &amp; Wages
            </Link>
            <RemoveAllButton
              entityName="Workers"
              onRemoveAll={deleteAllWorkers}
              totalCount={workers.length}
            />
          </div>
        }
        actionButton={{
          label: 'Add Worker',
          href: '/dashboard/workers/new',
          icon: <Plus size={16} />,
        }}
      />


      {/* Workers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 20 }}>
        {workers.map((w) => (
          <div key={w.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #112240, #1a3a6b)',
                    color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontWeight: 800, fontSize: 16,
                  }}>
                    {w.user.name[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>{w.user.name}</h3>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                      Joined {w.joiningDate ? new Date(w.joiningDate).toLocaleDateString('en-IN') : '2024'}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 8,
                    background: w.paymentType === 'DAILY' ? 'rgba(245,166,35,0.1)' : 'rgba(59,130,246,0.1)',
                    color: w.paymentType === 'DAILY' ? '#f5a623' : '#3b82f6',
                  }}>
                    {w.paymentType === 'DAILY' ? 'DAILY WAGE' : 'MONTHLY'}
                  </span>
                  <DeleteRowButton
                    id={w.id}
                    name={`Worker ${w.user.name}`}
                    onDelete={deleteWorker}
                  />
                </div>
              </div>


              {/* Contact info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: 'var(--gray-700)', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Phone size={14} color="#f5a623" />
                  <a href={`tel:${w.user.mobile}`} style={{ color: 'inherit', textDecoration: 'none', fontWeight: 600 }}>
                    {w.user.mobile}
                  </a>
                  {w.emergencyContact && (
                    <span style={{ fontSize: 11, color: 'var(--gray-400)' }}>(Emergency: {w.emergencyContact})</span>
                  )}
                </div>
                {w.address && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <MapPin size={14} color="#3b82f6" />
                    <span>{w.address}</span>
                  </div>
                )}
              </div>

              {/* Wage info */}
              <div style={{ padding: '10px 12px', background: 'var(--gray-50)', borderRadius: 10, fontSize: 13, marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: 'var(--gray-500)' }}>Wage Structure:</span>
                  <strong style={{ color: '#22c55e' }}>
                    {w.paymentType === 'DAILY' ? `${formatCur(w.dailyRate || 0)} / day` : `${formatCur(w.monthlySalary || 0)} / month`}
                  </strong>
                </div>
                {w.bankDetails && (
                  <div style={{ fontSize: 11, color: 'var(--gray-500)' }}>
                    🏦 {w.bankDetails}
                  </div>
                )}
              </div>
            </div>

            {/* Site Assignments */}
            <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--gray-500)', marginBottom: 6 }}>
                Active Site Assignments:
              </div>
              {w.projectAssignments.length === 0 ? (
                <span style={{ fontSize: 12, color: 'var(--gray-400)' }}>No active site assigned</span>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {w.projectAssignments.map((pa) => (
                    <Link
                      key={pa.id}
                      href={`/dashboard/projects/${pa.project.id}`}
                      style={{ fontSize: 12, color: '#3b82f6', fontWeight: 600, textDecoration: 'none' }}
                    >
                      📍 {pa.project.projectId} ({pa.project.capacityKw} kW - {pa.project.customer.name})
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
