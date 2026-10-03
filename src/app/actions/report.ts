'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function reviewWorkReport(reportId: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.workReport.update({
    where: { id: reportId },
    data: {
      status,
      rejectionReason: rejectionReason || null,
      reviewedById: (session.user as any).id,
      reviewedAt: new Date(),
    },
  })

  revalidatePath('/dashboard/reports')
  revalidatePath('/dashboard')
}

export async function submitDailyReport(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const projectId = formData.get('projectId') as string
  const dateStr = formData.get('date') as string
  const workPerformed = formData.get('workPerformed') as string
  const progressPercent = parseInt(formData.get('progressPercent') as string) || 0
  const workersPresent = parseInt(formData.get('workersPresent') as string) || 1
  const materialUsed = (formData.get('materialUsed') as string) || null
  const problems = (formData.get('problems') as string) || null
  const photoUrl = (formData.get('photoUrl') as string) || null

  const report = await prisma.workReport.create({
    data: {
      projectId,
      workerId: (session.user as any).id,
      date: dateStr ? new Date(dateStr) : new Date(),
      workPerformed,
      progressPercent,
      workersPresent,
      materialUsed,
      problems,
      status: 'PENDING',
    },
  })

  if (photoUrl) {
    await prisma.workReportPhoto.create({
      data: {
        workReportId: report.id,
        url: photoUrl,
        caption: 'Field installation photo',
        isPublished: true,
      },
    })
  }

  // Update project progress
  await prisma.project.update({
    where: { id: projectId },
    data: {
      progress: progressPercent,
      status: progressPercent === 100 ? 'COMPLETED' : 'INSTALLATION_IN_PROGRESS',
    },
  })

  revalidatePath('/dashboard/reports')
  revalidatePath('/dashboard/my-projects')
  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard')
  redirect('/dashboard/my-projects')
}
