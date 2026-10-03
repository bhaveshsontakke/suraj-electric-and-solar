'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCustomerPayment(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const customerId = formData.get('customerId') as string
  const projectId = formData.get('projectId') as string
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date()
  const paymentMethod = (formData.get('paymentMethod') as string) || 'CASH'
  const transactionRef = (formData.get('transactionRef') as string) || null
  const notes = (formData.get('notes') as string) || null

  const count = await prisma.customerPayment.count()
  const paymentId = `PAY-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

  await prisma.$transaction(async (tx) => {
    // 1. Create payment
    await tx.customerPayment.create({
      data: {
        paymentId,
        customerId,
        projectId,
        amount,
        date,
        paymentMethod,
        transactionRef,
        notes,
      },
    })

    // 2. Update project paidAmount and pendingAmount
    const project = await tx.project.findUnique({ where: { id: projectId } })
    if (project) {
      const newPaid = project.paidAmount + amount
      const newPending = Math.max(0, project.projectAmount - newPaid)
      await tx.project.update({
        where: { id: projectId },
        data: {
          paidAmount: newPaid,
          pendingAmount: newPending,
        },
      })
    }

    // 3. Create Audit Log
    await tx.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'Received Payment',
        entity: `₹${amount.toLocaleString('en-IN')} for ${project?.projectId || customerId}`,
        customerId,
        projectId,
      },
    })
  })

  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard')
  redirect('/dashboard/payments')
}

export async function createExpense(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const date = formData.get('date') ? new Date(formData.get('date') as string) : new Date()
  const category = (formData.get('category') as string) || 'OTHER'
  const amount = parseFloat(formData.get('amount') as string)
  const description = formData.get('description') as string
  const projectId = (formData.get('projectId') as string) || null
  const paymentMethod = (formData.get('paymentMethod') as string) || 'CASH'
  const notes = (formData.get('notes') as string) || null

  await prisma.expense.create({
    data: {
      date,
      category,
      amount,
      description,
      projectId: projectId === '' ? null : projectId,
      paymentMethod,
      addedById: (session.user as any).id,
      notes,
    },
  })

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
  redirect('/dashboard/expenses')
}
