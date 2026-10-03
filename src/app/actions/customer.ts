'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCustomer(formData: FormData) {
  const session = await auth()
  if (!session?.user) {
    throw new Error('Unauthorized')
  }

  const name = formData.get('name') as string
  const mobile = formData.get('mobile') as string
  const alternateMobile = (formData.get('alternateMobile') as string) || null
  const email = (formData.get('email') as string) || null
  const address = (formData.get('address') as string) || null
  const siteAddress = (formData.get('siteAddress') as string) || null
  const city = (formData.get('city') as string) || null
  const requirement = (formData.get('requirement') as string) || null
  const estimatedKw = formData.get('estimatedKw') ? parseFloat(formData.get('estimatedKw') as string) : null
  const leadSource = (formData.get('leadSource') as string) || 'Direct Lead'
  const status = (formData.get('status') as string) || 'NEW_ENQUIRY'
  const notes = (formData.get('notes') as string) || null

  const count = await prisma.customer.count()
  const customerId = `CUST-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

  const customer = await prisma.customer.create({
    data: {
      customerId,
      name,
      mobile,
      alternateMobile,
      email,
      address,
      siteAddress,
      city,
      requirement,
      estimatedKw,
      leadSource,
      status,
      notes,
      createdById: (session.user as any).id,
    },
  })

  // Create audit log
  await prisma.auditLog.create({
    data: {
      userId: (session.user as any).id,
      action: 'Created Customer',
      entity: `${name} (${customerId})`,
      customerId: customer.id,
    },
  })

  revalidatePath('/dashboard/customers')
  revalidatePath('/dashboard')
  redirect('/dashboard/customers')
}

export async function updateCustomerStatus(id: string, status: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.customer.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/dashboard/customers')
  revalidatePath(`/dashboard/customers/${id}`)
}
