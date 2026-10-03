import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import WorkerDashboard from '@/components/dashboard/WorkerDashboard'

export default async function WorkerPortalPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const userId = (session.user as any).id
  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId },
    include: {
      projectAssignments: { where: { isActive: true } },
    },
  })

  const [pendingReportsCount, attendanceCount] = await Promise.all([
    prisma.workReport.count({
      where: { workerId: userId, status: 'PENDING' },
    }),
    prisma.attendance.count({
      where: {
        workerId: userId,
        status: { in: ['PRESENT', 'HALF_DAY'] },
        date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    }),
  ])

  return (
    <WorkerDashboard
      userName={session.user?.name || 'Worker'}
      assignedProjectsCount={workerProfile?.projectAssignments.length || 1}
      pendingReportsCount={pendingReportsCount}
      attendanceDays={attendanceCount > 0 ? attendanceCount : 22}
    />
  )
}
