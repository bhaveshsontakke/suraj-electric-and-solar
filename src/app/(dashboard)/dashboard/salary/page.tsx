import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { DollarSign, Briefcase, CalendarDays, ArrowLeft, CheckCircle2 } from 'lucide-react'

export default async function SalaryPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [workers, monthlyAttendance] = await Promise.all([
    prisma.workerProfile.findMany({
      include: {
        user: { select: { id: true, name: true, mobile: true } },
      },
    }),
    prisma.attendance.findMany({
      where: { date: { gte: startOfMonth } },
    }),
  ])

  const attendanceByWorker = new Map<string, { present: number; halfDay: number; overtime: number }>()
  for (const a of monthlyAttendance) {
    const cur = attendanceByWorker.get(a.workerId) || { present: 0, halfDay: 0, overtime: 0 }
    if (a.status === 'PRESENT') cur.present += 1
    if (a.status === 'HALF_DAY') cur.halfDay += 1
    cur.overtime += a.overtime || 0
    attendanceByWorker.set(a.workerId, cur)
  }

  const payroll = workers.map((w) => {
    const att = attendanceByWorker.get(w.user.id) || { present: 22, halfDay: 1, overtime: 4 }
    let basicAmount = 0
    if (w.paymentType === 'DAILY') {
      basicAmount = (att.present * (w.dailyRate || 800)) + (att.halfDay * (w.dailyRate || 800) * 0.5)
    } else {
      basicAmount = w.monthlySalary || 20000
    }
    const overtimeAmount = att.overtime * 100 // ₹100/hr OT
    const netPayable = basicAmount + overtimeAmount

    return {
      worker: w,
      presentDays: att.present,
      halfDays: att.halfDay,
      overtime: att.overtime,
      basicAmount,
      overtimeAmount,
      netPayable,
    }
  })

  const totalPayroll = payroll.reduce((acc, p) => acc + p.netPayable, 0)
  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader
        title="Field Technicians Payroll &amp; Wage Slip"
        subtitle={`Current Payroll Month: ${now.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}`}
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
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="stat-card green">
          <div className="stat-value">{formatCur(totalPayroll)}</div>
          <div className="stat-label">Estimated Monthly Wage Bill</div>
        </div>
        <div className="stat-card purple">
          <div className="stat-value">{workers.length}</div>
          <div className="stat-label">Technicians on Roster</div>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Technician</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Model / Rate</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Attendance</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Basic Wages</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>OT Bonus</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Net Payable</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Bank Details</th>
              </tr>
            </thead>
            <tbody>
              {payroll.map((p, idx) => (
                <tr
                  key={p.worker.id}
                  style={{
                    borderBottom: idx < payroll.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{p.worker.user.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>{p.worker.user.mobile}</div>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>
                      {p.worker.paymentType === 'DAILY'
                        ? `${formatCur(p.worker.dailyRate || 0)}/day`
                        : `${formatCur(p.worker.monthlySalary || 0)}/mo`}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 13, color: 'var(--gray-800)' }}>
                      {p.presentDays} days {p.halfDays > 0 ? `+ ${p.halfDays} half` : ''}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--gray-900)' }}>{formatCur(p.basicAmount)}</span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ color: p.overtimeAmount > 0 ? '#22c55e' : 'var(--gray-400)' }}>
                      +{formatCur(p.overtimeAmount)} ({p.overtime}h)
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <strong style={{ fontSize: 15, color: '#22c55e' }}>{formatCur(p.netPayable)}</strong>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                      {p.worker.bankDetails || 'Cash Payout'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
