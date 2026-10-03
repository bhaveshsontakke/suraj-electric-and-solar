'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function registerCustomer(formData: FormData) {
  try {
    const name = formData.get('name') as string
    const mobile = formData.get('mobile') as string
    const password = formData.get('password') as string
    const email = (formData.get('email') as string) || null
    const city = (formData.get('city') as string) || 'Maharashtra'
    const address = (formData.get('address') as string) || null
    const monthlyBill = (formData.get('monthlyBill') as string) || '₹3,000 - ₹5,000'

    if (!name || !mobile || !password) {
      return { success: false, error: 'Name, mobile number, and password are required.' }
    }

    // Check if user already exists with this mobile
    const existing = await prisma.user.findUnique({ where: { mobile } })
    if (existing) {
      return { success: false, error: 'An account with this mobile number already exists. Please login instead.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    // Find owner to assign createdBy
    const owner = await prisma.user.findFirst({ where: { role: 'OWNER' } })
    const createdById = owner?.id

    // 1. Create User
    const user = await prisma.user.create({
      data: {
        name,
        mobile,
        password: hashedPassword,
        email,
        role: 'CUSTOMER',
        isActive: true,
        createdById: createdById || undefined,
      },
    })

    // 2. Create Customer Profile
    const count = await prisma.customer.count()
    const customerId = `CUST-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`

    let estimatedKw = 3.0
    if (monthlyBill.includes('₹1,500')) estimatedKw = 2.0
    else if (monthlyBill.includes('₹3,000')) estimatedKw = 3.0
    else if (monthlyBill.includes('₹5,000')) estimatedKw = 5.0
    else if (monthlyBill.includes('₹10,000')) estimatedKw = 10.0

    await prisma.customer.create({
      data: {
        customerId,
        name,
        mobile,
        email,
        city,
        address: address || city,
        siteAddress: address || city,
        requirement: `Signed up via Customer Portal. Monthly bill: ${monthlyBill}.`,
        estimatedKw,
        leadSource: 'Customer Portal Signup',
        status: 'NEW_ENQUIRY',
        createdById: user.id,
      },
    })

    // 3. Audit Log
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'Customer Account Created',
        entity: `${name} (${customerId})`,
      },
    })

    return { success: true, message: 'Account created successfully! You can now log in.' }
  } catch (err: any) {
    console.error('Registration error:', err)
    return { success: false, error: 'Registration failed. Please check your details and try again.' }
  }
}
