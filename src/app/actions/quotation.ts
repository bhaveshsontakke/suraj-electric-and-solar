'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createQuotation(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const customerId = formData.get('customerId') as string
  const validUntilStr = formData.get('validUntil') as string
  const subtotal = parseFloat(formData.get('subtotal') as string) || 0
  const discount = parseFloat(formData.get('discount') as string) || 0
  const tax = parseFloat(formData.get('tax') as string) || 0
  const total = parseFloat(formData.get('total') as string) || 0
  const terms = (formData.get('terms') as string) || null
  const notes = (formData.get('notes') as string) || null

  const descriptions = formData.getAll('itemDescription') as string[]
  const quantities = formData.getAll('itemQuantity') as string[]
  const unitPrices = formData.getAll('itemUnitPrice') as string[]

  const count = await prisma.quotation.count()
  const quotationId = `QTN-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

  const quotation = await prisma.quotation.create({
    data: {
      quotationId,
      customerId,
      validUntil: validUntilStr ? new Date(validUntilStr) : new Date(Date.now() + 30 * 86400000),
      subtotal,
      discount,
      tax,
      total,
      terms,
      notes,
      status: 'SENT',
      createdById: (session.user as any).id,
    },
  })

  // Create quotation items
  if (descriptions && descriptions.length > 0) {
    for (let i = 0; i < descriptions.length; i++) {
      if (descriptions[i]) {
        const qty = parseFloat(quantities[i]) || 1
        const price = parseFloat(unitPrices[i]) || 0
        await prisma.quotationItem.create({
          data: {
            quotationId: quotation.id,
            description: descriptions[i],
            quantity: qty,
            unitPrice: price,
            totalPrice: qty * price,
          },
        })
      }
    }
  }

  // Update customer status to QUOTATION_SENT
  await prisma.customer.update({
    where: { id: customerId },
    data: { status: 'QUOTATION_SENT' },
  })

  // Audit log
  await prisma.auditLog.create({
    data: {
      userId: (session.user as any).id,
      action: 'Generated Quotation',
      entity: `${quotationId} (₹${total.toLocaleString('en-IN')})`,
      customerId,
    },
  })

  revalidatePath('/dashboard/quotations')
  revalidatePath('/dashboard/customers')
  revalidatePath('/dashboard')
  redirect('/dashboard/quotations')
}

export async function updateQuotationStatus(id: string, status: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.quotation.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/dashboard/quotations')
}
