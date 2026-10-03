import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/calculations'
import OwnerDashboard from '@/components/dashboard/OwnerDashboard'
import StaffDashboard from '@/components/dashboard/StaffDashboard'
import WorkerDashboard from '@/components/dashboard/WorkerDashboard'

async function getOwnerStats() {
  const [
    totalCustomers, newEnquiries, activeProjects, completedProjects,
    totalPayments, pendingReports, lowStockItems, totalWorkers,
    recentActivity, monthlyPayments, monthlyExpenses,
  ] = await Promise.all([
    prisma.customer.count(),
    prisma.customer.count({ where: { status: 'NEW_ENQUIRY' } }),
    prisma.project.count({ where: { status: { in: ['INSTALLATION_STARTED', 'INSTALLATION_IN_PROGRESS', 'MATERIAL_PREPARATION'] } } }),
    prisma.project.count({ where: { status: 'COMPLETED' } }),
    prisma.customerPayment.aggregate({ _sum: { amount: true } }),
    prisma.workReport.count({ where: { status: 'PENDING' } }),
    prisma.material.count({ where: { currentQty: { lte: prisma.material.fields.minStockLevel } } }).catch(() => 0),
    prisma.user.count({ where: { role: 'WORKER', isActive: true } }),
    prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 10, include: { user: { select: { name: true } } } }),
    prisma.customerPayment.aggregate({
      _sum: { amount: true },
      where: { date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }
    }),
    prisma.expense.aggregate({
      _sum: { amount: true },
      where: { date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }
    }),
  ])

  const totalProjectAmount = await prisma.project.aggregate({ _sum: { projectAmount: true } })
  const totalPaid = await prisma.project.aggregate({ _sum: { paidAmount: true } })
  const totalPending = await prisma.project.aggregate({ _sum: { pendingAmount: true } })

  return {
    totalCustomers,
    newEnquiries,
    activeProjects,
    completedProjects,
    totalSales: totalProjectAmount._sum.projectAmount || 0,
    paymentReceived: totalPaid._sum.paidAmount || 0,
    paymentPending: totalPending._sum.pendingAmount || 0,
    totalWorkers,
    pendingReports,
    lowStockItems: 0,
    monthlyPayments: monthlyPayments._sum.amount || 0,
    monthlyExpenses: monthlyExpenses._sum.amount || 0,
    recentActivity: recentActivity.map(log => ({
      id: log.id,
      user: log.user?.name || 'System',
      action: log.action,
      entity: log.entity,
      time: log.createdAt.toISOString(),
    })),
  }
}

import CustomerDashboard from '@/components/dashboard/CustomerDashboard'

export default async function DashboardPage(props: {
  searchParams?: Promise<{ view?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const searchParams = props.searchParams ? await props.searchParams : {}
  const role = (session.user as any).role
  const userId = (session.user as any).id

  // 1. Customer role OR Admin/Owner previewing customer portal
  if (role === 'CUSTOMER' || searchParams?.view === 'customer') {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { mobile: true, name: true, role: true }
    })

    // If owner previewing, find demo customer if no customer assigned
    const targetMobile = (role === 'CUSTOMER' && user?.mobile) ? user.mobile : '9876543210'

    const customer = await prisma.customer.findFirst({
      where: { mobile: targetMobile },
      include: {
        projects: {
          include: {
            photos: true,
            payments: true,
            workReports: true,
          }
        }
      }
    })

    const projectPhotos = await prisma.projectPhoto.findMany({
      take: 12,
      orderBy: { uploadedAt: 'desc' },
      include: {
        project: {
          select: { projectId: true, siteAddress: true, capacityKw: true }
        }
      }
    }).catch(() => [])

    return (
      <CustomerDashboard
        userName={role === 'CUSTOMER' ? (session.user?.name || 'Solar Customer') : 'Preview (Admin View)'}
        userMobile={user?.mobile || '9876543210'}
        customerData={customer}
        sitePhotos={projectPhotos}
      />
    )
  }

  if (role === 'OWNER') {
    const stats = await getOwnerStats()
    return <OwnerDashboard stats={stats} userName={session.user?.name || 'Suraj Ghode'} />
  }

  if (role === 'OFFICE_STAFF') {
    return <StaffDashboard userName={session.user?.name || ''} />
  }

  // Worker redirect
  redirect('/dashboard/worker')
}
