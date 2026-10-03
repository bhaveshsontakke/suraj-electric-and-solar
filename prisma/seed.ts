import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding solar business database...')

  // Clear existing
  await prisma.auditLog.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.workReportPhoto.deleteMany()
  await prisma.workReport.deleteMany()
  await prisma.projectPhoto.deleteMany()
  await prisma.review.deleteMany()
  await prisma.customerPayment.deleteMany()
  await prisma.expense.deleteMany()
  await prisma.quotationItem.deleteMany()
  await prisma.quotation.deleteMany()
  await prisma.stockMovement.deleteMany()
  await prisma.purchaseItem.deleteMany()
  await prisma.purchase.deleteMany()
  await prisma.material.deleteMany()
  await prisma.supplier.deleteMany()
  await prisma.projectWorker.deleteMany()
  await prisma.project.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.attendance.deleteMany()
  await prisma.workerPayment.deleteMany()
  await prisma.workerProfile.deleteMany()
  await prisma.document.deleteMany()
  await prisma.calculatorConfig.deleteMany()
  await prisma.monthlyReport.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Users
  const ownerPassword = await bcrypt.hash('owner123', 10)
  const staffPassword = await bcrypt.hash('staff123', 10)
  const workerPassword = await bcrypt.hash('worker123', 10)

  const owner = await prisma.user.create({
    data: {
      name: 'Suraj Ghode',
      email: 'suraj@surajelectricandsolar.com',
      mobile: '9000000001',
      password: ownerPassword,
      role: 'OWNER',
      isActive: true,
    },
  })

  const staff = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'staff@solarpro.in',
      mobile: '9000000002',
      password: staffPassword,
      role: 'OFFICE_STAFF',
      isActive: true,
      createdById: owner.id,
    },
  })

  const worker1User = await prisma.user.create({
    data: {
      name: 'Ramesh Kumar',
      email: 'ramesh@solarpro.in',
      mobile: '9000000003',
      password: workerPassword,
      role: 'WORKER',
      isActive: true,
      createdById: owner.id,
    },
  })

  const worker2User = await prisma.user.create({
    data: {
      name: 'Suresh Patil',
      email: 'suresh@solarpro.in',
      mobile: '9000000004',
      password: workerPassword,
      role: 'WORKER',
      isActive: true,
      createdById: owner.id,
    },
  })

  // Worker profiles
  const worker1Profile = await prisma.workerProfile.create({
    data: {
      userId: worker1User.id,
      address: 'Warje, Pune, Maharashtra',
      joiningDate: new Date('2024-01-15'),
      emergencyContact: '9822998877',
      paymentType: 'DAILY',
      dailyRate: 850,
      bankDetails: 'SBI A/C: 38291049281, IFSC: SBIN0001234',
      notes: 'Expert rooftop solar mounting technician & wireman',
    },
  })

  const worker2Profile = await prisma.workerProfile.create({
    data: {
      userId: worker2User.id,
      address: 'Kothrud, Pune, Maharashtra',
      joiningDate: new Date('2024-03-01'),
      emergencyContact: '9822112233',
      paymentType: 'MONTHLY',
      monthlySalary: 24000,
      bankDetails: 'HDFC A/C: 5010023491823, IFSC: HDFC0000123',
      notes: 'Lead Electrical Technician & Inverter commissioning specialist',
    },
  })

  // 2. Calculator Config
  await prisma.calculatorConfig.create({
    data: {
      avgTariffPerUnit: 8.5,
      sunlightHoursPerDay: 5.2,
      panelWattage: 550,
      systemEfficiency: 0.82,
      costPerKw: 58000,
    },
  })

  // 3. Suppliers
  const supplierTata = await prisma.supplier.create({
    data: {
      name: 'Tata Solar Distribution Centre',
      contact: 'Anil Joshi (9890012345)',
      email: 'sales.pune@tatasolar.com',
      address: 'Plot 45, MIDC Bhosari, Pune',
      gstNumber: '27AABCT1234E1Z5',
    },
  })

  const supplierPolycab = await prisma.supplier.create({
    data: {
      name: 'Polycab Electricals & Cables Hub',
      contact: 'Vikas Mehta (9890054321)',
      email: 'vikas@polycabdealers.in',
      address: 'Budhwar Peth, Pune',
      gstNumber: '27AABCP5678M1Z2',
    },
  })

  // 4. Materials
  const matPanel = await prisma.material.create({
    data: {
      materialId: 'MAT-MOD-001',
      name: 'Tata Power Mono PERC 550W Module',
      category: 'SOLAR_PANEL',
      brand: 'Tata Power Solar',
      model: 'TP-550-MONO',
      unit: 'piece',
      currentQty: 84,
      minStockLevel: 20,
      purchasePrice: 11200,
      supplierId: supplierTata.id,
      notes: 'High efficiency Half-Cut Bifacial modules',
    },
  })

  const matInverter = await prisma.material.create({
    data: {
      materialId: 'MAT-INV-001',
      name: 'Growatt 5kW 3-Phase Grid-Tie Inverter',
      category: 'INVERTER',
      brand: 'Growatt',
      model: 'MOD 5000TL3-X',
      unit: 'piece',
      currentQty: 5,
      minStockLevel: 2,
      purchasePrice: 44000,
      supplierId: supplierTata.id,
    },
  })

  const matCable = await prisma.material.create({
    data: {
      materialId: 'MAT-CBL-001',
      name: 'Polycab 4 sq mm DC Solar Cable (Red/Black)',
      category: 'DC_CABLE',
      brand: 'Polycab',
      model: 'Solar DC 4sqmm TUV',
      unit: 'meter',
      currentQty: 450,
      minStockLevel: 150,
      purchasePrice: 46,
      supplierId: supplierPolycab.id,
    },
  })

  const matStructure = await prisma.material.create({
    data: {
      materialId: 'MAT-STR-001',
      name: 'Galvanized Iron (GI) Elevated Solar Rooftop Structure',
      category: 'MOUNTING_STRUCTURE',
      brand: 'Evershine Structural',
      model: 'GI-3KW-HDG',
      unit: 'set',
      currentQty: 12,
      minStockLevel: 4,
      purchasePrice: 7500,
      supplierId: supplierTata.id,
    },
  })

  const matEarthing = await prisma.material.create({
    data: {
      materialId: 'MAT-EAR-001',
      name: 'Chemical Earthing Kit with Copper Bonded Electrode',
      category: 'EARTHING',
      brand: 'TruePower',
      model: '50mm x 2m',
      unit: 'set',
      currentQty: 3, // Low stock!
      minStockLevel: 5,
      purchasePrice: 2800,
      supplierId: supplierPolycab.id,
    },
  })

  // 5. Customers
  const customer1 = await prisma.customer.create({
    data: {
      customerId: 'CUST-2026-001',
      name: 'Rajesh Verma',
      mobile: '9822011223',
      alternateMobile: '9822011224',
      email: 'rajesh.verma@gmail.com',
      address: 'Flat 402, Ganga Meadows, Baner, Pune',
      siteAddress: 'Row House 14, Green Valley, Baner, Pune',
      city: 'Pune',
      requirement: '5kW Rooftop Solar with Net Metering for monthly bill ₹6,500',
      estimatedKw: 5.0,
      leadSource: 'Website Calculator',
      status: 'INSTALLATION_STARTED',
      createdById: owner.id,
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      customerId: 'CUST-2026-002',
      name: 'Dr. Amit Deshmukh',
      mobile: '9822033445',
      email: 'amit.deshmukh@sanjeevani-hospital.com',
      address: 'Sanjeevani Multispeciality Hospital, Aundh, Pune',
      siteAddress: 'Hospital Rooftop, Aundh DP Road, Pune',
      city: 'Pune',
      requirement: '25kW On-Grid Solar system for commercial hospital power savings',
      estimatedKw: 25.0,
      leadSource: 'Client Referral',
      status: 'QUOTATION_APPROVED',
      createdById: staff.id,
    },
  })

  const customer3 = await prisma.customer.create({
    data: {
      customerId: 'CUST-2026-003',
      name: 'Sneha Kulkarni',
      mobile: '9822055667',
      email: 'sneha.kulkarni@outlook.com',
      address: 'Bungalow 7, Mayur Colony, Kothrud, Pune',
      siteAddress: 'Bungalow 7, Mayur Colony, Kothrud, Pune',
      city: 'Pune',
      requirement: '3kW Solar System for domestic rooftop',
      estimatedKw: 3.0,
      leadSource: 'Direct Call',
      status: 'NEW_ENQUIRY',
      createdById: staff.id,
    },
  })

  const customer4 = await prisma.customer.create({
    data: {
      customerId: 'CUST-2026-004',
      name: 'Sunrise Agro Processing Ltd',
      mobile: '9822077889',
      email: 'contact@sunriseagro.in',
      address: 'Gat No 128, Pune-Solapur Highway, Uruli Kanchan',
      siteAddress: 'Processing Factory Shed 2, Uruli Kanchan',
      city: 'Pune',
      requirement: '50kW Industrial Rooftop Solar Plant',
      estimatedKw: 50.0,
      leadSource: 'Industrial Exhibition',
      status: 'COMPLETED',
      createdById: owner.id,
    },
  })

  // 6. Projects
  const project1 = await prisma.project.create({
    data: {
      projectId: 'PRJ-2026-001',
      customerId: customer1.id,
      siteAddress: 'Row House 14, Green Valley, Baner, Pune',
      gpsLocation: '18.5590° N, 73.7868° E',
      capacityKw: 5.0,
      panelDetails: '9x Tata Power 550W Mono PERC',
      inverterDetails: '1x Growatt 5kW 3-Phase Grid-Tie',
      structureDetails: 'Elevated HDG GI Structure 10ft clearance',
      startDate: new Date(Date.now() - 10 * 86400000),
      expectedEndDate: new Date(Date.now() + 5 * 86400000),
      projectAmount: 285000,
      paidAmount: 185000,
      pendingAmount: 100000,
      managedById: owner.id,
      status: 'INSTALLATION_IN_PROGRESS',
      progress: 65,
      notes: 'Structure assembled, module wiring underway. Net-meter application approved by MSEDCL.',
    },
  })

  const project2 = await prisma.project.create({
    data: {
      projectId: 'PRJ-2026-002',
      customerId: customer2.id,
      siteAddress: 'Hospital Rooftop, Aundh DP Road, Pune',
      gpsLocation: '18.5626° N, 73.8087° E',
      capacityKw: 25.0,
      panelDetails: '46x Tata Power 550W Mono PERC',
      inverterDetails: '1x Sungrow 25kW Industrial Inverter',
      structureDetails: 'Custom RCC Flat Roof Ballasted Structure',
      startDate: new Date(Date.now() - 3 * 86400000),
      expectedEndDate: new Date(Date.now() + 20 * 86400000),
      projectAmount: 1350000,
      paidAmount: 450000,
      pendingAmount: 900000,
      managedById: owner.id,
      status: 'MATERIAL_PREPARATION',
      progress: 20,
      notes: 'Advance received. Material dispatch scheduled for Tuesday.',
    },
  })

  const project3 = await prisma.project.create({
    data: {
      projectId: 'PRJ-2026-003',
      customerId: customer4.id,
      siteAddress: 'Processing Factory Shed 2, Uruli Kanchan',
      gpsLocation: '18.4870° N, 74.1320° E',
      capacityKw: 50.0,
      panelDetails: '92x Tata Power 550W Mono PERC',
      inverterDetails: '1x Sungrow 50kW Grid-Tie Inverter',
      structureDetails: 'Trapezoidal Metal Sheet Clamps Rail Structure',
      startDate: new Date(Date.now() - 45 * 86400000),
      expectedEndDate: new Date(Date.now() - 10 * 86400000),
      actualEndDate: new Date(Date.now() - 8 * 86400000),
      projectAmount: 2600000,
      paidAmount: 2600000,
      pendingAmount: 0,
      managedById: owner.id,
      status: 'COMPLETED',
      progress: 100,
      notes: 'Commissioned and generating approx 220 units daily. Handover signoff completed.',
    },
  })

  // Assign workers to Project 1
  await prisma.projectWorker.create({
    data: {
      projectId: project1.id,
      workerId: worker1Profile.id,
      isActive: true,
      notes: 'Lead roof mounting technician',
    },
  })

  await prisma.projectWorker.create({
    data: {
      projectId: project1.id,
      workerId: worker2Profile.id,
      isActive: true,
      notes: 'Inverter & ACDB/DCDB electrical cabling',
    },
  })

  // 7. Customer Payments
  await prisma.customerPayment.create({
    data: {
      paymentId: 'PAY-2026-001',
      customerId: customer1.id,
      projectId: project1.id,
      amount: 100000,
      date: new Date(Date.now() - 10 * 86400000),
      paymentMethod: 'UPI',
      transactionRef: 'UPI-RAK-84920192',
      notes: 'Initial booking advance (35%)',
    },
  })

  await prisma.customerPayment.create({
    data: {
      paymentId: 'PAY-2026-002',
      customerId: customer1.id,
      projectId: project1.id,
      amount: 85000,
      date: new Date(Date.now() - 2 * 86400000),
      paymentMethod: 'BANK_TRANSFER',
      transactionRef: 'NEFT-HDFC-992019',
      notes: 'On material arrival payment (30%)',
    },
  })

  await prisma.customerPayment.create({
    data: {
      paymentId: 'PAY-2026-003',
      customerId: customer2.id,
      projectId: project2.id,
      amount: 450000,
      date: new Date(Date.now() - 4 * 86400000),
      paymentMethod: 'CHEQUE',
      transactionRef: 'CHQ-SBI-491029',
      notes: 'Commercial project booking advance (33%)',
    },
  })

  await prisma.customerPayment.create({
    data: {
      paymentId: 'PAY-2026-004',
      customerId: customer4.id,
      projectId: project3.id,
      amount: 2600000,
      date: new Date(Date.now() - 15 * 86400000),
      paymentMethod: 'BANK_TRANSFER',
      transactionRef: 'RTGS-ICICI-819201',
      notes: 'Final settlement on project commissioning',
    },
  })

  // 8. Business Expenses
  await prisma.expense.create({
    data: {
      date: new Date(Date.now() - 8 * 86400000),
      category: 'MATERIAL',
      amount: 125000,
      description: 'Solar panels and GI structures batch delivery transport',
      projectId: project1.id,
      paymentMethod: 'BANK_TRANSFER',
      addedById: owner.id,
      notes: 'Paid to transport contractor Tempo MH-12-AB-3921',
    },
  })

  await prisma.expense.create({
    data: {
      date: new Date(Date.now() - 5 * 86400000),
      category: 'TOOLS',
      amount: 4500,
      description: 'Bosch Professional Rotary Hammer Drill Bits & Safety Harnesses',
      paymentMethod: 'UPI',
      addedById: owner.id,
      notes: 'Purchased for Baner and Aundh sites',
    },
  })

  await prisma.expense.create({
    data: {
      date: new Date(Date.now() - 3 * 86400000),
      category: 'FUEL',
      amount: 3200,
      description: 'Site vehicle fuel (Scorpio Site Support)',
      paymentMethod: 'CASH',
      addedById: staff.id,
    },
  })

  // 9. Work Reports
  const report1 = await prisma.workReport.create({
    data: {
      projectId: project1.id,
      workerId: worker1User.id,
      date: new Date(Date.now() - 2 * 86400000),
      workPerformed: 'Anchored 6 base plates on RCC roof. Assembled front and rear galvanized legs. Mounted 9 solar modules and torque tightened all mid & end clamps.',
      progressPercent: 65,
      workersPresent: 3,
      materialUsed: '9x Tata 550W modules, 12x mid clamps, 8x end clamps, 24x M10 anchor fasteners',
      problems: 'Minor shade from parapet wall accounted for by raising rear angle by 4 inches.',
      status: 'APPROVED',
      reviewedById: owner.id,
      reviewedAt: new Date(Date.now() - 1 * 86400000),
    },
  })

  await prisma.workReportPhoto.create({
    data: {
      workReportId: report1.id,
      url: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800',
      caption: 'Solar modules installed on elevated GI mounting frame',
      isPublished: true,
    },
  })

  // 10. Reviews
  await prisma.review.create({
    data: {
      customerId: customer4.id,
      projectId: project3.id,
      rating: 5,
      reviewText: 'SolarPro team executed our 50kW factory plant in record 30 days! Generates over 220 units daily and slashed our industrial tariff significantly. Highly professional engineering.',
      status: 'APPROVED',
      approvedAt: new Date(),
    },
  })

  // 11. Audit Logs
  await prisma.auditLog.create({
    data: {
      userId: owner.id,
      action: 'Created Project',
      entity: 'PRJ-2026-001 (Rajesh Verma 5kW)',
      createdAt: new Date(Date.now() - 10 * 86400000),
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: staff.id,
      action: 'Logged Customer Payment',
      entity: '₹85,000 for PRJ-2026-001',
      createdAt: new Date(Date.now() - 2 * 86400000),
    },
  })

  await prisma.auditLog.create({
    data: {
      userId: owner.id,
      action: 'Approved Daily Work Report',
      entity: 'Report #1 by Ramesh Kumar',
      createdAt: new Date(Date.now() - 1 * 86400000),
    },
  })

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
