'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function submitConsultationLead(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const pinCode = (formData.get('pinCode') as string) || ''
    const mobile = formData.get('mobile') as string
    const monthlyBill = (formData.get('monthlyBill') as string) || '₹3,000 - ₹5,000'

    if (!name || !mobile) {
      return { success: false, error: 'Name and mobile number are required.' }
    }

    // Estimate kW based on bill
    let estimatedKw = 3.0
    if (monthlyBill.includes('₹1,500')) estimatedKw = 2.0
    else if (monthlyBill.includes('₹3,000')) estimatedKw = 3.0
    else if (monthlyBill.includes('₹5,000')) estimatedKw = 5.0
    else if (monthlyBill.includes('₹10,000')) estimatedKw = 10.0

    // Get owner or first user for assignment
    const admin = await prisma.user.findFirst({ where: { role: 'OWNER' } })
    const createdById = admin?.id || (await prisma.user.findFirst())?.id

    if (!createdById) {
      return { success: false, error: 'System configuration error' }
    }

    const count = await prisma.customer.count()
    const customerId = `LEAD-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

    const customer = await prisma.customer.create({
      data: {
        customerId,
        name,
        mobile,
        city: pinCode ? `PIN: ${pinCode}` : 'Online Lead',
        requirement: `Monthly Bill: ${monthlyBill}. Requested PM Surya Ghar 0-Investment Consultation.`,
        estimatedKw,
        leadSource: '0-Investment Modal',
        status: 'NEW_ENQUIRY',
        createdById,
      },
    })

    // Log activity
    await prisma.auditLog.create({
      data: {
        action: 'Inbound Web Lead',
        entity: `${name} (${mobile}) - Bill: ${monthlyBill}`,
        customerId: customer.id,
      },
    })

    revalidatePath('/dashboard')
    revalidatePath('/dashboard/customers')

    return {
      success: true,
      customerId,
      message: 'Consultation booked successfully! Our solar engineer will call you shortly.',
    }
  } catch (err: any) {
    console.error('Lead submission error:', err)
    return { success: false, error: 'Failed to submit consultation. Please call us directly.' }
  }
}
