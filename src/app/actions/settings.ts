'use server'

import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateCalculatorConfig(formData: FormData) {
  const session = await auth()
  if (!session?.user) throw new Error('Unauthorized')

  const avgTariffPerUnit = parseFloat(formData.get('avgTariffPerUnit') as string) || 8.0
  const sunlightHoursPerDay = parseFloat(formData.get('sunlightHoursPerDay') as string) || 5.0
  const panelWattage = parseInt(formData.get('panelWattage') as string) || 550
  const systemEfficiency = parseFloat(formData.get('systemEfficiency') as string) || 0.8
  const costPerKw = parseFloat(formData.get('costPerKw') as string) || 60000

  const existing = await prisma.calculatorConfig.findFirst()
  if (existing) {
    await prisma.calculatorConfig.update({
      where: { id: existing.id },
      data: {
        avgTariffPerUnit,
        sunlightHoursPerDay,
        panelWattage,
        systemEfficiency,
        costPerKw,
      },
    })
  } else {
    await prisma.calculatorConfig.create({
      data: {
        avgTariffPerUnit,
        sunlightHoursPerDay,
        panelWattage,
        systemEfficiency,
        costPerKw,
      },
    })
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/calculator')
}
