'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createMaterial(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const category = (formData.get('category') as string) || 'OTHER'
  const brand = (formData.get('brand') as string) || null
  const model = (formData.get('model') as string) || null
  const unit = (formData.get('unit') as string) || 'piece'
  const currentQty = formData.get('currentQty') ? parseFloat(formData.get('currentQty') as string) : 0
  const minStockLevel = formData.get('minStockLevel') ? parseFloat(formData.get('minStockLevel') as string) : 0
  const purchasePrice = formData.get('purchasePrice') ? parseFloat(formData.get('purchasePrice') as string) : 0
  const supplierId = (formData.get('supplierId') as string) || null
  const notes = (formData.get('notes') as string) || null

  const count = await prisma.material.count()
  const materialId = `MAT-${category.slice(0, 3)}-${String(count + 1).padStart(3, '0')}`

  await prisma.material.create({
    data: {
      materialId,
      name,
      category,
      brand,
      model,
      unit,
      currentQty,
      minStockLevel,
      purchasePrice,
      supplierId: supplierId === '' ? null : supplierId,
      notes,
    },
  })

  revalidatePath('/dashboard/materials')
  revalidatePath('/dashboard')
  redirect('/dashboard/materials')
}

export async function updateStockQuantity(materialId: string, diff: number, reason: string) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const material = await prisma.material.findUnique({ where: { id: materialId } })
  if (!material) throw new Error('Material not found')

  const newQty = Math.max(0, material.currentQty + diff)

  await prisma.$transaction([
    prisma.material.update({
      where: { id: materialId },
      data: { currentQty: newQty },
    }),
    prisma.stockMovement.create({
      data: {
        materialId,
        quantity: diff,
        type: diff > 0 ? 'PURCHASE' : 'PROJECT_USAGE',
        notes: reason || (diff > 0 ? 'Manual Stock In' : 'Manual Stock Out'),
        createdById: (session.user as any).id,
      },
    }),
  ])

  revalidatePath('/dashboard/materials')
  revalidatePath('/dashboard')
}

export async function createSupplier(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const name = formData.get('name') as string
  const contact = (formData.get('contact') as string) || null
  const email = (formData.get('email') as string) || null
  const address = (formData.get('address') as string) || null
  const gstNumber = (formData.get('gstNumber') as string) || null
  const notes = (formData.get('notes') as string) || null

  await prisma.supplier.create({
    data: {
      name,
      contact,
      email,
      address,
      gstNumber,
      notes,
    },
  })

  revalidatePath('/dashboard/suppliers')
  revalidatePath('/dashboard/materials')
  redirect('/dashboard/suppliers')
}
