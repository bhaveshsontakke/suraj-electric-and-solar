'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

// ============================================================
// 1. AUDIT LOGS / ACTIVITY
// ============================================================
export async function deleteAuditLog(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.auditLog.delete({
    where: { id },
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/audit-log')
  return { success: true }
}

export async function clearAllAuditLogs() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.auditLog.deleteMany({})

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/audit-log')
  return { success: true }
}

// ============================================================
// 2. CUSTOMERS
// ============================================================
export async function deleteCustomer(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    // Audit logs for customer
    await tx.auditLog.deleteMany({ where: { customerId: id } })
    // Documents
    await tx.document.deleteMany({ where: { customerId: id } })
    // Reviews
    await tx.review.deleteMany({ where: { customerId: id } })
    // Payments
    await tx.customerPayment.deleteMany({ where: { customerId: id } })

    // Quotations & Items
    const quotes = await tx.quotation.findMany({ where: { customerId: id }, select: { id: true } })
    const quoteIds = quotes.map((q) => q.id)
    if (quoteIds.length > 0) {
      await tx.quotationItem.deleteMany({ where: { quotationId: { in: quoteIds } } })
      await tx.quotation.deleteMany({ where: { id: { in: quoteIds } } })
    }

    // Projects & Children
    const projects = await tx.project.findMany({ where: { customerId: id }, select: { id: true } })
    const projectIds = projects.map((p) => p.id)
    if (projectIds.length > 0) {
      await tx.workReportPhoto.deleteMany({ where: { workReport: { projectId: { in: projectIds } } } })
      await tx.workReport.deleteMany({ where: { projectId: { in: projectIds } } })
      await tx.projectPhoto.deleteMany({ where: { projectId: { in: projectIds } } })
      await tx.projectWorker.deleteMany({ where: { projectId: { in: projectIds } } })
      await tx.stockMovement.deleteMany({ where: { projectId: { in: projectIds } } })
      await tx.expense.deleteMany({ where: { projectId: { in: projectIds } } })
      await tx.project.deleteMany({ where: { id: { in: projectIds } } })
    }

    // Finally delete Customer
    await tx.customer.delete({ where: { id } })
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/customers')
  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard/audit-log')
  return { success: true }
}

export async function deleteAllCustomers() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.workReportPhoto.deleteMany({})
    await tx.workReport.deleteMany({})
    await tx.projectPhoto.deleteMany({})
    await tx.projectWorker.deleteMany({})
    await tx.stockMovement.deleteMany({})
    await tx.customerPayment.deleteMany({})
    await tx.expense.deleteMany({})
    await tx.quotationItem.deleteMany({})
    await tx.quotation.deleteMany({})
    await tx.review.deleteMany({})
    await tx.document.deleteMany({})
    await tx.project.deleteMany({})
    await tx.customer.deleteMany({})
  })

  revalidatePath('/dashboard')
  revalidatePath('/dashboard/customers')
  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard/audit-log')
  return { success: true }
}

// ============================================================
// 3. MATERIALS / INVENTORY
// ============================================================
export async function deleteMaterial(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.stockMovement.deleteMany({ where: { materialId: id } })
    await tx.purchaseItem.deleteMany({ where: { materialId: id } })
    await tx.quotationItem.deleteMany({ where: { materialId: id } })
    await tx.material.delete({ where: { id } })
  })

  revalidatePath('/dashboard/materials')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllMaterials() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.stockMovement.deleteMany({})
    await tx.purchaseItem.deleteMany({})
    await tx.quotationItem.deleteMany({})
    await tx.material.deleteMany({})
  })

  revalidatePath('/dashboard/materials')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 4. PROJECTS
// ============================================================
export async function deleteProject(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.workReportPhoto.deleteMany({ where: { workReport: { projectId: id } } })
    await tx.workReport.deleteMany({ where: { projectId: id } })
    await tx.projectPhoto.deleteMany({ where: { projectId: id } })
    await tx.projectWorker.deleteMany({ where: { projectId: id } })
    await tx.stockMovement.deleteMany({ where: { projectId: id } })
    await tx.customerPayment.deleteMany({ where: { projectId: id } })
    await tx.expense.deleteMany({ where: { projectId: id } })
    await tx.review.deleteMany({ where: { projectId: id } })
    await tx.document.deleteMany({ where: { projectId: id } })
    await tx.auditLog.deleteMany({ where: { projectId: id } })
    await tx.project.delete({ where: { id } })
  })

  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllProjects() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.workReportPhoto.deleteMany({})
    await tx.workReport.deleteMany({})
    await tx.projectPhoto.deleteMany({})
    await tx.projectWorker.deleteMany({})
    await tx.stockMovement.deleteMany({})
    await tx.customerPayment.deleteMany({})
    await tx.expense.deleteMany({})
    await tx.review.deleteMany({})
    await tx.document.deleteMany({})
    await tx.project.deleteMany({})
  })

  revalidatePath('/dashboard/projects')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 5. EXPENSES
// ============================================================
export async function deleteExpense(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.expense.delete({ where: { id } })

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllExpenses() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.expense.deleteMany({})

  revalidatePath('/dashboard/expenses')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 6. CUSTOMER PAYMENTS
// ============================================================
export async function deletePayment(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.customerPayment.delete({ where: { id } })

  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllPayments() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.customerPayment.deleteMany({})

  revalidatePath('/dashboard/payments')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 7. PURCHASES
// ============================================================
export async function deletePurchase(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.stockMovement.deleteMany({ where: { purchaseId: id } })
    await tx.purchaseItem.deleteMany({ where: { purchaseId: id } })
    await tx.purchase.delete({ where: { id } })
  })

  revalidatePath('/dashboard/purchases')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllPurchases() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.stockMovement.deleteMany({})
    await tx.purchaseItem.deleteMany({})
    await tx.purchase.deleteMany({})
  })

  revalidatePath('/dashboard/purchases')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 8. QUOTATIONS
// ============================================================
export async function deleteQuotation(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.quotationItem.deleteMany({ where: { quotationId: id } })
    await tx.quotation.delete({ where: { id } })
  })

  revalidatePath('/dashboard/quotations')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllQuotations() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.quotationItem.deleteMany({})
    await tx.quotation.deleteMany({})
  })

  revalidatePath('/dashboard/quotations')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 9. SUPPLIERS
// ============================================================
export async function deleteSupplier(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    // Unlink materials from supplier
    await tx.material.updateMany({
      where: { supplierId: id },
      data: { supplierId: null },
    })
    // Delete purchase items for this supplier's purchases
    const purchases = await tx.purchase.findMany({ where: { supplierId: id }, select: { id: true } })
    const purchaseIds = purchases.map((p) => p.id)
    if (purchaseIds.length > 0) {
      await tx.purchaseItem.deleteMany({ where: { purchaseId: { in: purchaseIds } } })
      await tx.purchase.deleteMany({ where: { id: { in: purchaseIds } } })
    }
    await tx.supplier.delete({ where: { id } })
  })

  revalidatePath('/dashboard/suppliers')
  revalidatePath('/dashboard/materials')
  return { success: true }
}

export async function deleteAllSuppliers() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.material.updateMany({ data: { supplierId: null } })
    await tx.purchaseItem.deleteMany({})
    await tx.purchase.deleteMany({})
    await tx.supplier.deleteMany({})
  })

  revalidatePath('/dashboard/suppliers')
  revalidatePath('/dashboard/materials')
  return { success: true }
}

// ============================================================
// 10. WORKERS
// ============================================================
export async function deleteWorker(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    const profile = await tx.workerProfile.findUnique({
      where: { id },
      select: { userId: true },
    })
    await tx.projectWorker.deleteMany({ where: { workerId: id } })
    await tx.attendance.deleteMany({ where: { workerProfileId: id } })
    await tx.workerPayment.deleteMany({ where: { workerProfileId: id } })
    await tx.document.deleteMany({ where: { workerId: id } })
    await tx.workerProfile.delete({ where: { id } })
    if (profile?.userId) {
      // Optional: keep or deactivate user, or delete if not OWNER
      const user = await tx.user.findUnique({ where: { id: profile.userId }, select: { role: true } })
      if (user && user.role !== 'OWNER') {
        await tx.user.delete({ where: { id: profile.userId } })
      }
    }
  })

  revalidatePath('/dashboard/workers')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllWorkers() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.$transaction(async (tx) => {
    await tx.projectWorker.deleteMany({})
    await tx.attendance.deleteMany({})
    await tx.workerPayment.deleteMany({})
    await tx.document.deleteMany({ where: { workerId: { not: null } } })
    await tx.workerProfile.deleteMany({})
  })

  revalidatePath('/dashboard/workers')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 11. REVIEWS
// ============================================================
export async function deleteReview(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.review.delete({ where: { id } })

  revalidatePath('/dashboard/reviews')
  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteAllReviews() {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  await prisma.review.deleteMany({})

  revalidatePath('/dashboard/reviews')
  revalidatePath('/dashboard')
  return { success: true }
}

// ============================================================
// 12. USERS (Excluding OWNER)
// ============================================================
export async function deleteUser(id: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return { success: false, error: 'User not found' }
  if (user.role === 'OWNER') {
    throw new Error('Cannot delete owner account')
  }

  await prisma.$transaction(async (tx) => {
    // Delete worker profile if any
    const profile = await tx.workerProfile.findUnique({ where: { userId: id } })
    if (profile) {
      await tx.projectWorker.deleteMany({ where: { workerId: profile.id } })
      await tx.attendance.deleteMany({ where: { workerProfileId: profile.id } })
      await tx.workerPayment.deleteMany({ where: { workerProfileId: profile.id } })
      await tx.document.deleteMany({ where: { workerId: profile.id } })
      await tx.workerProfile.delete({ where: { id: profile.id } })
    }
    // Delete documents uploaded by user
    await tx.document.deleteMany({ where: { uploadedById: id } })
    await tx.user.delete({ where: { id } })
  })

  revalidatePath('/dashboard/users')
  revalidatePath('/dashboard')
  return { success: true }
}
