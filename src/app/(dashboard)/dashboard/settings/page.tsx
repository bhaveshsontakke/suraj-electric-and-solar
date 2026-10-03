import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { updateCalculatorConfig } from '@/app/actions/settings'
import { Settings, Save, Zap, Building } from 'lucide-react'

export default async function SettingsPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const config = await prisma.calculatorConfig.findFirst()

  return (
    <div>
      <DashboardHeader title="Business &amp; Calculator Settings" subtitle="Configure solar calculator defaults, energy tariffs &amp; EPC pricing variables" />

      <div style={{ maxWidth: 760, margin: '24px auto' }}>
        <form action={updateCalculatorConfig} className="card" style={{ padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, borderBottom: '1px solid var(--gray-200)', paddingBottom: 12 }}>
            <Zap size={22} color="#f5a623" />
            <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--gray-900)' }}>
              Solar Calculator &amp; ROI Defaults
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Average Electricity Tariff (₹ / kWh) *</label>
                <input
                  type="number"
                  step="0.1"
                  name="avgTariffPerUnit"
                  required
                  defaultValue={config?.avgTariffPerUnit || 8.5}
                  className="form-input"
                />
                <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                  Default tariff used in financial savings calculator.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">Average Sunlight Peak Hours / Day *</label>
                <input
                  type="number"
                  step="0.1"
                  name="sunlightHoursPerDay"
                  required
                  defaultValue={config?.sunlightHoursPerDay || 5.2}
                  className="form-input"
                />
                <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                  Typical solar generation window (4.5 to 5.5 in India).
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Standard Panel Wattage (Wp) *</label>
                <input
                  type="number"
                  name="panelWattage"
                  required
                  defaultValue={config?.panelWattage || 550}
                  className="form-input"
                />
                <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                  Used to estimate number of solar modules needed.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label">System Performance Ratio / Efficiency *</label>
                <input
                  type="number"
                  step="0.01"
                  name="systemEfficiency"
                  required
                  defaultValue={config?.systemEfficiency || 0.82}
                  className="form-input"
                />
                <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                  Efficiency factor accounting for inverter &amp; cable loss (e.g. 0.82 for 82%).
                </span>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Turnkey EPC Cost per kW (₹) *</label>
              <input
                type="number"
                name="costPerKw"
                required
                defaultValue={config?.costPerKw || 58000}
                className="form-input"
              />
              <span style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 4 }}>
                Average cost per kilowatt including modules, structure, inverter &amp; installation.
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--gray-200)', paddingTop: 20, marginTop: 24 }}>
            <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Save size={18} /> Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
