import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { CalendarDays, CheckCircle2, Clock, XCircle, ArrowLeft } from 'lucide-react'
import { recordAttendance } from '@/app/actions/team'

export default async function AttendancePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [workers, todayAttendance] = await Promise.all([
    prisma.workerProfile.findMany({
      include: {
        user: { select: { id: true, name: true, mobile: true } },
      },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.attendance.findMany({
      where: { date: today },
    }),
  ])

  const attendanceMap = new Map(todayAttendance.map((a) => [a.workerId, a]))
  const presentCount = todayAttendance.filter((a) => a.status === 'PRESENT').length

  return (
    <div>
      <DashboardHeader
        title="Field Crew Attendance"
        subtitle={`Today: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '20px 0' }}>
        <Link
          href="/dashboard/workers"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            color: 'var(--gray-600)',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 600,
          }}
        >
          <ArrowLeft size={16} /> Back to Workers
        </Link>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="stat-card green">
          <div className="stat-value">{presentCount}</div>
          <div className="stat-label">Present on Sites Today</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{workers.length}</div>
          <div className="stat-label">Total Crew Strength</div>
        </div>
      </div>

      {/* Attendance Logger Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>
            Mark Today's Crew Attendance
          </h3>
          <p style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 2 }}>
            Click button to record Present, Half Day, or Absent with overtime hours.
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Technician</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Wage Model</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Today's Status</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Overtime (Hrs)</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w, idx) => {
                const att = attendanceMap.get(w.user.id)
                const currentStatus = att?.status || 'NOT_MARKED'

                return (
                  <tr
                    key={w.id}
                    style={{
                      borderBottom: idx < workers.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{w.user.name}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{w.user.mobile}</div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 12, color: 'var(--gray-700)', fontWeight: 600 }}>
                        {w.paymentType === 'DAILY' ? `₹${w.dailyRate}/day` : `₹${w.monthlySalary}/mo`}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '4px 10px',
                          borderRadius: 8,
                          fontSize: 12,
                          fontWeight: 700,
                          background:
                            currentStatus === 'PRESENT'
                              ? 'rgba(34,197,94,0.1)'
                              : currentStatus === 'HALF_DAY'
                              ? 'rgba(245,166,35,0.1)'
                              : currentStatus === 'ABSENT'
                              ? 'rgba(239,68,68,0.1)'
                              : 'var(--gray-100)',
                          color:
                            currentStatus === 'PRESENT'
                              ? '#22c55e'
                              : currentStatus === 'HALF_DAY'
                              ? '#f5a623'
                              : currentStatus === 'ABSENT'
                              ? '#ef4444'
                              : 'var(--gray-500)',
                        }}
                      >
                        {currentStatus}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 13, color: 'var(--gray-700)' }}>
                        {att?.overtime ? `${att.overtime} hrs` : '-'}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: 6 }}>
                        <form
                          action={async () => {
                            'use server'
                            await recordAttendance(w.id, 'PRESENT', 0)
                          }}
                        >
                          <button
                            type="submit"
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: '1px solid #22c55e',
                              background: currentStatus === 'PRESENT' ? '#22c55e' : 'white',
                              color: currentStatus === 'PRESENT' ? 'white' : '#22c55e',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Present
                          </button>
                        </form>

                        <form
                          action={async () => {
                            'use server'
                            await recordAttendance(w.id, 'HALF_DAY', 0)
                          }}
                        >
                          <button
                            type="submit"
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: '1px solid #f5a623',
                              background: currentStatus === 'HALF_DAY' ? '#f5a623' : 'white',
                              color: currentStatus === 'HALF_DAY' ? 'white' : '#f5a623',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Half Day
                          </button>
                        </form>

                        <form
                          action={async () => {
                            'use server'
                            await recordAttendance(w.id, 'ABSENT', 0)
                          }}
                        >
                          <button
                            type="submit"
                            style={{
                              padding: '6px 12px',
                              borderRadius: 6,
                              border: '1px solid #ef4444',
                              background: currentStatus === 'ABSENT' ? '#ef4444' : 'white',
                              color: currentStatus === 'ABSENT' ? 'white' : '#ef4444',
                              fontSize: 12,
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Absent
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
