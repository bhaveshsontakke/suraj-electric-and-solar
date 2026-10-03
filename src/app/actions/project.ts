'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createProject(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const customerId = formData.get('customerId') as string
  const siteAddress = (formData.get('siteAddress') as string) || null
  const gpsLocation = (formData.get('gpsLocation') as string) || null
  const capacityKw = formData.get('capacityKw') ? parseFloat(formData.get('capacityKw') as string) : null
  const panelDetails = (formData.get('panelDetails') as string) || null
  const inverterDetails = (formData.get('inverterDetails') as string) || null
  const structureDetails = (formData.get('structureDetails') as string) || null
  const projectAmount = formData.get('projectAmount') ? parseFloat(formData.get('projectAmount') as string) : 0
  const status = (formData.get('status') as string) || 'SITE_VISIT'
  const notes = (formData.get('notes') as string) || null
  const workerIds = formData.getAll('workerIds') as string[]

  const count = await prisma.project.count()
  const projectId = `PRJ-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

  const project = await prisma.project.create({
    data: {
      projectId,
      customerId,
      siteAddress,
      gpsLocation,
      capacityKw,
      panelDetails,
      inverterDetails,
      structureDetails,
      projectAmount,
      pendingAmount: projectAmount,
      status,
      notes,
      managedById: (session.user as any).id,
    },
  })

  // Assign workers if selected
  if (workerIds && workerIds.length > 0) {
    for (const wId of workerIds) {
      await prisma.projectWorker.create({
        data: {
          projectId: project.id,
          workerId: wId,
          isActive: true,
        },
      })
    }
  }

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: (session.user as any).id,
      action: 'Created Project',
      entity: `${projectId} (${capacityKw} kW)`,
      projectId: project.id,
      customerId,
    },
  })

  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard')
  redirect('/dashboard/projects')
}

export async function updateProjectProgress(projectId: string, progress: number, status?: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const data: any = { progress }
  if (status) data.status = status
  if (progress === 100) {
    data.status = 'COMPLETED'
    data.actualEndDate = new Date()
  }

  await prisma.project.update({
    where: { id: projectId },
    data,
  })

  revalidatePath('/dashboard/projects')
  revalidatePath(`/dashboard/projects/${projectId}`)
  revalidatePath('/dashboard')
}
