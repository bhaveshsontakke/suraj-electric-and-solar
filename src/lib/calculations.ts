// Business logic calculations

export function calculatePendingPayment(totalAmount: number, paidAmount: number): number {
  return Math.max(0, totalAmount - paidAmount)
}

export function calculateInventoryBalance(
  purchased: number,
  used: number,
  returned: number = 0,
  damaged: number = 0,
  adjusted: number = 0
): number {
  return purchased - used + returned - damaged + adjusted
}

export function calculateWorkerPayable(params: {
  paymentType: 'DAILY' | 'MONTHLY'
  dailyRate?: number
  monthlySalary?: number
  presentDays: number
  halfDays: number
  overtimeHours: number
  advance: number
  previousPayments: number
}): {
  basicAmount: number
  overtimeAmount: number
  grossPayable: number
  netPayable: number
} {
  const {
    paymentType,
    dailyRate = 0,
    monthlySalary = 0,
    presentDays,
    halfDays,
    overtimeHours,
    advance,
    previousPayments,
  } = params

  const payableDays = presentDays + halfDays * 0.5
  const basicAmount =
    paymentType === 'DAILY'
      ? dailyRate * payableDays
      : monthlySalary
  const overtimeRate = paymentType === 'DAILY' ? dailyRate / 8 : (monthlySalary / 26) / 8
  const overtimeAmount = overtimeHours * overtimeRate * 1.5
  const grossPayable = basicAmount + overtimeAmount
  const netPayable = grossPayable - advance - previousPayments

  return {
    basicAmount,
    overtimeAmount,
    grossPayable,
    netPayable: Math.max(0, netPayable),
  }
}

export function calculateSolarSystem(params: {
  monthlyBill: number
  avgTariff: number
  sunlightHours: number
  panelWattage: number
  systemEfficiency: number
  costPerKw: number
}): {
  monthlyUnits: number
  systemSizeKw: number
  panelCount: number
  annualGeneration: number
  annualSavings: number
  systemCost: number
  paybackYears: number
} {
  const { monthlyBill, avgTariff, sunlightHours, panelWattage, systemEfficiency, costPerKw } = params

  const monthlyUnits = monthlyBill / avgTariff
  const dailyUnitsNeeded = monthlyUnits / 30
  const systemSizeKw = dailyUnitsNeeded / (sunlightHours * systemEfficiency)
  const panelCount = Math.ceil((systemSizeKw * 1000) / panelWattage)
  const annualGeneration = systemSizeKw * sunlightHours * 365 * systemEfficiency
  const annualSavings = annualGeneration * avgTariff
  const systemCost = systemSizeKw * costPerKw
  const paybackYears = systemCost / annualSavings

  return {
    monthlyUnits: Math.round(monthlyUnits),
    systemSizeKw: Math.round(systemSizeKw * 10) / 10,
    panelCount,
    annualGeneration: Math.round(annualGeneration),
    annualSavings: Math.round(annualSavings),
    systemCost: Math.round(systemCost),
    paybackYears: Math.round(paybackYears * 10) / 10,
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function generateId(prefix: string, count: number): string {
  return `${prefix}-${String(count).padStart(4, '0')}`
}
