import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { CalendarDays, CheckCircle2, Clock } from 'lucide-react'
import { recordAttendance } from '@/app/actions/team'

export default async function MyAttendancePage() {
  const session = await auth()
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId },
  })

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [attendanceRecords, todayRecord] = await Promise.all([
    prisma.attendance.findMany({
      where: { workerId: userId },
      orderBy: { date: 'desc' },
      take: 30,
    }),
    prisma.attendance.findUnique({
      where: {
        workerId_date: {
          workerId: userId,
          date: today,
        },
      },
    }),
  ])

  const presentDays = attendanceRecords.filter((a) => a.status === 'PRESENT').length
  const totalOvertime = attendanceRecords.reduce((acc, a) => acc + (a.overtime || 0), 0)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <DashboardHeader title="My Attendance &amp; Punch Log" subtitle="Track your site check-ins, monthly presence &amp; overtime hours" />

      {/* Today's Punch Card */}
      <div className="card" style={{ margin: '24px 0', padding: 24, background: 'linear-gradient(135deg, #112240, #1a3a6b)', color: 'white' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 13, color: '#f5a623', fontWeight: 700 }}>
              TODAY'S STATUS ({today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })})
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 900, marginTop: 4 }}>
              {todayRecord ? todayRecord.status : 'Not Punched In Yet'}
            </h2>
          </div>

          {!todayRecord && workerProfile && (
            <form
              action={async () => {
                'use server'
                await recordAttendance(workerProfile.id, 'PRESENT', 0)
              }}
            >
              <button
                type="submit"
                style={{
                  padding: '12px 24px',
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #e8751a, #f5a623)',
                  border: 'none',
                  color: 'white',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 15px rgba(245,166,35,0.4)',
                }}
              >
                ✓ Punch In as Present
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="stat-card green">
          <div className="stat-value">{presentDays} Days</div>
          <div className="stat-label">Days Present (Last 30 Days)</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{totalOvertime} Hours</div>
          <div className="stat-label">Total Overtime Logged</div>
        </div>
      </div>

      {/* History table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--gray-200)' }}>
          <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>Attendance Log History</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '12px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Date</th>
                <th style={{ padding: '12px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '12px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Overtime</th>
                <th style={{ padding: '12px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '36px 20px', color: 'var(--gray-400)' }}>
                    No attendance records logged yet.
                  </td>
                </tr>
              ) : (
                attendanceRecords.map((a, idx) => (
                  <tr key={a.id} style={{ borderBottom: idx < attendanceRecords.length - 1 ? '1px solid var(--gray-100)' : 'none' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600 }}>
                      {new Date(a.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          background: a.status === 'PRESENT' ? 'rgba(34,197,94,0.1)' : 'rgba(245,166,35,0.1)',
                          color: a.status === 'PRESENT' ? '#22c55e' : '#f5a623',
                        }}
                      >
                        {a.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      {a.overtime ? `${a.overtime} hrs` : '-'}
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--gray-500)', fontSize: 13 }}>
                      {a.notes || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
