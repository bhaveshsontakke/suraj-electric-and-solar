import Link from 'next/link'
import { Home, Building2, Factory, Battery, Zap, Settings, Shield, TrendingUp, ArrowRight } from 'lucide-react'

const services = [
  {
    icon: Home, title: 'Residential Solar', color: '#f5a623', range: '1–10 kW',
    tagline: 'Power your home with clean, affordable solar energy',
    desc: 'Our residential solar solutions are designed to maximize savings on your home electricity bill. We handle everything from site survey to installation to net metering connection.',
    features: [
      'Custom system design for your rooftop',
      'High-efficiency panels with 25-year warranty',
      'Government subsidy assistance (up to 40%)',
      'Net metering application and setup',
      'Wi-Fi monitoring system included',
      'Annual maintenance service',
    ],
    benefits: ['Save ₹30,000–₹1,00,000+ per year', 'Payback in 4–6 years', 'Power for 25+ years'],
  },
  {
    icon: Building2, title: 'Commercial Solar', color: '#3b82f6', range: '10–100 kW',
    tagline: 'Reduce your business electricity costs significantly',
    desc: 'Cut your commercial electricity costs by up to 80% with a custom rooftop solar system. Perfect for offices, shops, schools, hospitals and commercial buildings.',
    features: [
      'Detailed energy audit and system design',
      'High-capacity commercial grade panels',
      'Grid-tied and hybrid options available',
      'Accelerated depreciation tax benefits',
      'Remote monitoring and performance analytics',
      'Dedicated commercial support team',
    ],
    benefits: ['Save ₹80,000–₹5,00,000+ per year', 'Quick ROI in 3–5 years', 'Improve ESG ratings'],
  },
  {
    icon: Factory, title: 'Industrial Solar', color: '#8b5cf6', range: '100 kW+',
    tagline: 'Large-scale solar for factories and industrial units',
    desc: 'Industrial solar plants for large power consumers. We design, supply, install and commission large-scale solar power plants that significantly reduce your energy costs.',
    features: [
      'Feasibility study and DPR preparation',
      'Ground-mounted or rooftop solutions',
      'High-voltage grid connection management',
      'SCADA monitoring and control systems',
      'Open access power purchase options',
      'O&M contract available',
    ],
    benefits: ['Save ₹5,00,000+ per year', 'ROI in 3–4 years', 'CSR compliance support'],
  },
  {
    icon: Battery, title: 'Off-Grid Systems', color: '#22c55e', range: '1–50 kW',
    tagline: 'Complete independence from grid power cuts',
    desc: 'Reliable off-grid solar systems with battery backup for areas with poor grid supply or no grid connection. Perfect for farms, remote locations, and power backup needs.',
    features: [
      'Lithium or lead-acid battery options',
      'Hybrid inverter systems',
      'Load analysis and system sizing',
      'Backup power for 8–24 hours',
      'Mobile monitoring app',
      'Battery replacement support',
    ],
    benefits: ['24/7 uninterrupted power', 'No monthly electricity bill', 'Works in remote areas'],
  },
  {
    icon: Zap, title: 'On-Grid (Net Metering)', color: '#f59e0b', range: '3–500 kW',
    tagline: 'Export excess power back to the grid and earn credits',
    desc: 'On-grid solar systems connected directly to the utility grid. Export excess generation as credits on your electricity bill. Most popular and cost-effective solution.',
    features: [
      'Bi-directional meter installation',
      'DISCOM approval and connection',
      'Net metering billing support',
      'Generation monitoring dashboard',
      'No battery required (lower cost)',
      'Subsidy eligible',
    ],
    benefits: ['Lowest installation cost', 'Earn credits from excess power', 'Subsidies available'],
  },
  {
    icon: Settings, title: 'Solar Maintenance (AMC)', color: '#64748b', range: 'All sizes',
    tagline: 'Keep your solar system at peak performance year-round',
    desc: 'Annual Maintenance Contracts to keep your solar system performing at its best. Regular cleaning, inspection and performance optimization.',
    features: [
      'Quarterly inspection visits',
      'Panel cleaning and checking',
      'Inverter health check',
      'Performance monitoring and reporting',
      'Emergency breakdown support',
      'Warranty claim assistance',
    ],
    benefits: ['Maintain 95%+ efficiency', 'Extend system life', 'Priority support'],
  },
]

export default function ServicesPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #112240)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>⚡ Our Services</div>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
            Solar Services for <span className="text-solar-gradient">Every Need</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
            From design to installation to maintenance — complete solar solutions under one roof.
          </p>
        </div>
      </section>

      {/* Services */}
      <section style={{ padding: '64px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 48 }}>
          {services.map((service, i) => (
            <div key={i} className="card" style={{ padding: 40, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
                  <div style={{ width: 56, height: 56, borderRadius: 16, background: `${service.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <service.icon size={28} color={service.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: service.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>System Size: {service.range}</div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)' }}>{service.title}</h2>
                  </div>
                </div>
                <p style={{ color: service.color, fontWeight: 600, fontSize: 16, marginBottom: 12 }}>{service.tagline}</p>
                <p style={{ color: 'var(--gray-500)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>{service.desc}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 24 }}>
                  {service.benefits.map(b => (
                    <span key={b} className="badge" style={{ background: `${service.color}12`, color: service.color, border: `1px solid ${service.color}30` }}>✓ {b}</span>
                  ))}
                </div>
                <Link href="/contact" className="btn btn-primary">
                  Get Quote for {service.title} <ArrowRight size={16} />
                </Link>
              </div>
              <div>
                <h4 style={{ fontWeight: 700, marginBottom: 16, color: 'var(--gray-700)' }}>What's Included:</h4>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {service.features.map((f) => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, color: 'var(--gray-600)' }}>
                      <span style={{ width: 20, height: 20, borderRadius: '50%', background: `${service.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                        <span style={{ color: service.color, fontSize: 12, fontWeight: 700 }}>✓</span>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #e8751a, #f5a623)', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Ready to Go Solar?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32 }}>Get a free site visit and customized quotation for your property.</p>
        <Link href="/contact" className="btn btn-navy btn-xl">Get Free Site Visit →</Link>
      </section>
    </div>
  )
}
