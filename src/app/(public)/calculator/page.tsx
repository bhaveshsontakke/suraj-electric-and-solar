'use client'
import { useState } from 'react'
import { Zap, Sun, TrendingUp, Info, ArrowRight, Phone } from 'lucide-react'
import Link from 'next/link'

const DEFAULTS = {
  avgTariff: 8,
  sunlightHours: 5,
  panelWattage: 550,
  systemEfficiency: 0.8,
  costPerKw: 60000,
}

export default function CalculatorPage() {
  const [monthlyBill, setMonthlyBill] = useState('')
  const [propertyType, setPropertyType] = useState('residential')
  const [location, setLocation] = useState('')
  const [result, setResult] = useState<null | {
    monthlyUnits: number; systemSizeKw: number; panelCount: number;
    annualGeneration: number; annualSavings: number; systemCost: number; paybackYears: number;
  }>(null)

  function calculate() {
    const bill = parseFloat(monthlyBill)
    if (!bill || bill <= 0) return

    const { avgTariff, sunlightHours, panelWattage, systemEfficiency, costPerKw } = DEFAULTS
    const monthlyUnits = bill / avgTariff
    const dailyNeeded = monthlyUnits / 30
    const systemSizeKw = Math.round((dailyNeeded / (sunlightHours * systemEfficiency)) * 10) / 10
    const panelCount = Math.ceil((systemSizeKw * 1000) / panelWattage)
    const annualGeneration = Math.round(systemSizeKw * sunlightHours * 365 * systemEfficiency)
    const annualSavings = Math.round(annualGeneration * avgTariff)
    const systemCost = Math.round(systemSizeKw * costPerKw)
    const paybackYears = Math.round((systemCost / annualSavings) * 10) / 10

    setResult({ monthlyUnits: Math.round(monthlyUnits), systemSizeKw, panelCount, annualGeneration, annualSavings, systemCost, paybackYears })
  }

  const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #112240)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>⚡ Solar Calculator</div>
          <h1 className="hero-title" style={{ color: 'white', marginBottom: 16, fontSize: 'clamp(32px, 5vw, 56px)' }}>
            Calculate Your <span className="text-solar-gradient">Solar Savings</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
            Get an instant estimate of your solar system size, savings, and payback period.
          </p>
        </div>
      </section>

      {/* Calculator + Result */}
      <section style={{ padding: '60px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: result ? '1fr 1fr' : '1fr', gap: 32 }}>

          {/* Input form */}
          <div className="card" style={{ padding: 40 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28, color: 'var(--gray-900)' }}>
              Enter Your Details
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="form-group">
                <label className="form-label">Monthly Electricity Bill (₹) *</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="e.g. 3000"
                  value={monthlyBill}
                  onChange={e => { setMonthlyBill(e.target.value); setResult(null) }}
                  min="0"
                />
                <small style={{ color: 'var(--gray-400)', fontSize: 12 }}>Check your latest electricity bill</small>
              </div>

              <div className="form-group">
                <label className="form-label">Property Type</label>
                <select className="form-select" value={propertyType} onChange={e => setPropertyType(e.target.value)}>
                  <option value="residential">Residential (Home)</option>
                  <option value="commercial">Commercial (Office/Shop)</option>
                  <option value="industrial">Industrial (Factory)</option>
                  <option value="agricultural">Agricultural (Farm)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">City / Location (Optional)</label>
                <input type="text" className="form-input" placeholder="e.g. Pune, Maharashtra" value={location} onChange={e => setLocation(e.target.value)} />
              </div>

              <button onClick={calculate} className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px' }}>
                <Zap size={18} /> Calculate My Solar System
              </button>
            </div>

            <div style={{
              marginTop: 24, padding: '16px', background: 'rgba(59,130,246,0.06)',
              borderRadius: 12, border: '1px solid rgba(59,130,246,0.15)',
              display: 'flex', gap: 10, alignItems: 'flex-start',
            }}>
              <Info size={16} color="#3b82f6" style={{ flexShrink: 0, marginTop: 2 }} />
              <p style={{ fontSize: 12, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                <strong>Disclaimer:</strong> These are estimates based on assumptions of ₹8/unit tariff, 5 hours/day peak sunlight, and 80% system efficiency.
                Actual values depend on your site conditions, equipment selection, shading, roof orientation, and current electricity tariff.
                Please contact us for an accurate site-specific quotation.
              </p>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="card" style={{ padding: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: 'var(--gray-900)' }}>
                  Your Solar Estimate
                </h2>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[
                    { label: 'Monthly Units', value: `${result.monthlyUnits} kWh`, icon: '⚡', color: '#3b82f6' },
                    { label: 'System Size', value: `${result.systemSizeKw} kW`, icon: '☀️', color: '#f5a623' },
                    { label: 'Panels Required', value: `~${result.panelCount} panels`, icon: '🔲', color: '#8b5cf6' },
                    { label: 'Annual Generation', value: `${result.annualGeneration.toLocaleString()} kWh`, icon: '⚡', color: '#22c55e' },
                  ].map((item) => (
                    <div key={item.label} style={{ background: 'var(--gray-50)', borderRadius: 12, padding: '16px' }}>
                      <div style={{ fontSize: 22 }}>{item.icon}</div>
                      <div style={{ color: item.color, fontWeight: 800, fontSize: 20, margin: '6px 0 2px' }}>{item.value}</div>
                      <div style={{ color: 'var(--gray-500)', fontSize: 12 }}>{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: 'linear-gradient(135deg, #0a1628, #1a3a6b)', borderRadius: 20, padding: 32 }}>
                <h3 style={{ color: 'white', fontWeight: 700, marginBottom: 20, fontSize: 18 }}>💰 Financial Summary</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { label: 'Annual Savings (Est.)', value: formatINR(result.annualSavings), highlight: true },
                    { label: 'System Cost (Est.)', value: formatINR(result.systemCost), highlight: false },
                    { label: 'Payback Period (Est.)', value: `~${result.paybackYears} years`, highlight: false },
                    { label: '25-Year Savings (Est.)', value: formatINR(result.annualSavings * 25), highlight: true },
                  ].map((row) => (
                    <div key={row.label} style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}>
                      <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14 }}>{row.label}</span>
                      <span style={{ color: row.highlight ? '#f5a623' : 'white', fontWeight: 700, fontSize: 16 }}>{row.value}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 24 }}>
                  Get Accurate Quote <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @media (max-width: 768px) {
            section > div { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </section>

      {/* How calculator works */}
      <section style={{ padding: '60px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title" style={{ marginBottom: 40 }}>How We Calculate <span className="text-solar-gradient">Your Estimate</span></h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24, textAlign: 'left' }}>
            {[
              { title: 'Electricity Tariff', value: '₹8 per unit', desc: 'Average residential tariff assumption' },
              { title: 'Sunlight Hours', value: '5 hours/day', desc: 'Average peak sun hours in India' },
              { title: 'System Efficiency', value: '80%', desc: 'Account for losses and inverter efficiency' },
              { title: 'Panel Wattage', value: '550W', desc: 'Standard modern solar panel capacity' },
            ].map((item) => (
              <div key={item.title} className="card" style={{ padding: '20px' }}>
                <div style={{ color: '#f5a623', fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>{item.title}</div>
                <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
