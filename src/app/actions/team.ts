'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createWorker(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const mobile = formData.get('mobile') as string
  const password = formData.get('password') as string || 'worker123'
  const email = (formData.get('email') as string) || null
  const address = (formData.get('address') as string) || null
  const emergencyContact = (formData.get('emergencyContact') as string) || null
  const paymentType = (formData.get('paymentType') as string) || 'DAILY'
  const dailyRate = formData.get('dailyRate') ? parseFloat(formData.get('dailyRate') as string) : null
  const monthlySalary = formData.get('monthlySalary') ? parseFloat(formData.get('monthlySalary') as string) : null
  const bankDetails = (formData.get('bankDetails') as string) || null
  const notes = (formData.get('notes') as string) || null

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      mobile,
      password: hashedPassword,
      role: 'WORKER',
      email,
      createdById: (session.user as any).id,
    },
  })

  await prisma.workerProfile.create({
    data: {
      userId: user.id,
      address,
      emergencyContact,
      paymentType,
      dailyRate,
      monthlySalary,
      bankDetails,
      notes,
      joiningDate: new Date(),
    },
  })

  revalidatePath('/dashboard/workers')
  revalidatePath('/dashboard')
  redirect('/dashboard/workers')
}

export async function recordAttendance(workerId: string, status: string, overtimeHours: number = 0, notes?: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const worker = await prisma.workerProfile.findUnique({
    where: { id: workerId },
    include: { user: true },
  })

  if (!worker) throw new Error('Worker not found')

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  await prisma.attendance.upsert({
    where: {
      workerId_date: {
        workerId: worker.user.id,
        date: today,
      },
    },
    update: {
      status,
      overtime: overtimeHours,
      notes,
    },
    create: {
      workerId: worker.user.id,
      workerProfileId: worker.id,
      date: today,
      status,
      overtime: overtimeHours,
      notes,
    },
  })

  revalidatePath('/dashboard/attendance')
  revalidatePath('/dashboard/worker')
  revalidatePath('/dashboard/my-attendance')
}
