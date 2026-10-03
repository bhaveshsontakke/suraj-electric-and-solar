const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  const users = await prisma.user.findMany({
    select: { id: true, name: true, mobile: true, role: true }
  })
  console.log('Current users:', users)

  // Ensure Suraj Ghode is Owner
  const owner = await prisma.user.findFirst({ where: { role: 'OWNER' } })
  if (owner) {
    await prisma.user.update({
      where: { id: owner.id },
      data: { name: 'Suraj Ghode' }
    })
    console.log('Updated owner to Suraj Ghode')
  }

  // Check or create demo customer
  let demoCustomerUser = await prisma.user.findUnique({ where: { mobile: '9876543210' } })
  const hashedPassword = await bcrypt.hash('customer123', 10)
  if (!demoCustomerUser) {
    demoCustomerUser = await prisma.user.create({
      data: {
        name: 'Rajesh Patil',
        mobile: '9876543210',
        password: hashedPassword,
        role: 'CUSTOMER',
        isActive: true,
      }
    })
    console.log('Created demo customer user: Rajesh Patil')
  } else {
    await prisma.user.update({
      where: { id: demoCustomerUser.id },
      data: { password: hashedPassword, role: 'CUSTOMER' }
    })
    console.log('Updated demo customer password & role')
  }

  // Ensure Customer profile exists
  let customerProfile = await prisma.customer.findFirst({ where: { mobile: '9876543210' } })
  if (!customerProfile) {
    const count = await prisma.customer.count()
    const customerId = `CUST-2026-${String(count + 1).padStart(3, '0')}`
    customerProfile = await prisma.customer.create({
      data: {
        customerId,
        name: 'Rajesh Patil',
        mobile: '9876543210',
        city: 'Baner, Pune',
        address: 'Plot 42, Green Park Society, Baner, Pune',
        siteAddress: 'Plot 42, Green Park Society, Baner, Pune',
        requirement: '5 kW Elevated Pergola Solar System for RCC Terrace',
        estimatedKw: 5.0,
        leadSource: 'Customer Portal',
        status: 'INSTALLATION_IN_PROGRESS',
        createdById: owner?.id || demoCustomerUser.id,
      }
    })
    console.log('Created customer profile')
  }

  // Ensure Project exists for demo customer
  let project = await prisma.project.findFirst({ where: { customerId: customerProfile.id } })
  if (!project) {
    const pCount = await prisma.project.count()
    const projectId = `PRJ-2026-${String(pCount + 1).padStart(3, '0')}`
    project = await prisma.project.create({
      data: {
        projectId,
        customerId: customerProfile.id,
        managedById: owner?.id || demoCustomerUser.id,
        capacityKw: 5.0,
        panelDetails: '9x 550W Mono PERC Half-Cut Bifacial Panels',
        inverterDetails: 'Growatt 5kW 3-Phase Grid-Tie Inverter with WiFi',
        structureDetails: 'Elevated Hot Dip Galvanized (HDG) Pergola Canopy (9.5ft height)',
        projectAmount: 300000,
        paidAmount: 222000,
        pendingAmount: 78000,
        status: 'INSTALLATION_IN_PROGRESS',
        progress: 68,
        startDate: new Date(),
        expectedEndDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        siteAddress: 'Plot 42, Green Park Society, Baner, Pune',
        notes: 'PM Surya Ghar sanctioned subsidy ₹78,000. MSEDCL Pune circle net meter pending.',
      }
    })
    console.log('Created project for demo customer:', project.projectId)
  }

  // Add demo photo
  const existingPhoto = await prisma.projectPhoto.findFirst({ where: { projectId: project.id } })
  if (!existingPhoto) {
    await prisma.projectPhoto.create({
      data: {
        projectId: project.id,
        url: '/images/solar-family-rooftop.jpg',
        caption: '5kW Elevated Pergola structure completed in Baner, Pune',
        photoType: 'STRUCTURE',
        isApproved: true,
        isPublic: true,
      }
    })
    console.log('Added project photo')
  }

  console.log('Successfully completed seeding demo customer and updating owner Suraj Ghode!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
