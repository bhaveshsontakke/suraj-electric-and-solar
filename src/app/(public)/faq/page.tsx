'use client'
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import Link from 'next/link'

const faqs = [
  {
    category: 'General',
    questions: [
      { q: 'How does solar power work?', a: 'Solar panels (photovoltaic cells) convert sunlight into DC (direct current) electricity. An inverter then converts this DC electricity into AC (alternating current) which powers your home or business. Excess power can be exported to the grid or stored in batteries.' },
      { q: 'Is my property suitable for solar panels?', a: 'Most properties with a south or west-facing roof with minimal shading are ideal for solar. Our engineers conduct a free site survey to assess your roof area, orientation, shading, and structural strength before designing a system.' },
      { q: 'How long does installation take?', a: 'A typical residential system (3–10 kW) takes 1–3 days to install. Commercial and industrial systems may take 1–4 weeks depending on the size and complexity.' },
      { q: 'What warranty do you provide?', a: 'We provide 25-year performance warranty on solar panels, 5–10 year warranty on inverters, and 1 year comprehensive warranty on workmanship. Extended AMC contracts are available.' },
    ]
  },
  {
    category: 'Financial',
    questions: [
      { q: 'What is the government subsidy available?', a: 'Under the PM Surya Ghar scheme, residential customers can get subsidies of up to 40% for systems up to 3 kW, and 20% for 3–10 kW systems. Our team helps you with the entire subsidy application process.' },
      { q: 'What is the typical return on investment (ROI)?', a: 'Most residential customers see a payback period of 4–6 years. After that, electricity is virtually free for the remaining 20+ year life of the system. ROI is typically 15–25% per year.' },
      { q: 'How much will I save on electricity bills?', a: 'Savings depend on your current consumption, tariff, and system size. Typically, a correctly-sized system can reduce your electricity bill by 70–90%. Use our solar calculator for an estimate.' },
      { q: 'Are there any financing options available?', a: 'Yes! We help you access solar loans from banks like SBI, PNB, and others at attractive interest rates (5–9% p.a.). EMI options available. Please contact us to discuss financing.' },
    ]
  },
  {
    category: 'Technical',
    questions: [
      { q: 'What happens on cloudy days or at night?', a: 'Solar panels still generate power on cloudy days (30–60% of peak capacity). At night, your on-grid system draws power from the grid. Off-grid systems use stored battery power. Net metering credits offset nighttime usage.' },
      { q: 'How do I monitor my solar system performance?', a: 'All our systems come with a Wi-Fi-connected monitoring system. You can view real-time generation, consumption, and export data on a mobile app or web portal 24/7.' },
      { q: 'Do I need a battery with my solar system?', a: 'For on-grid systems connected to the utility grid, batteries are optional. If you face frequent power cuts or want energy independence, we recommend adding battery backup. We can design both solutions.' },
      { q: 'What maintenance does a solar system require?', a: 'Solar systems require very little maintenance. The main requirement is periodic panel cleaning (quarterly in dusty areas) to maintain peak efficiency. We offer Annual Maintenance Contracts (AMC) for complete peace of mind.' },
    ]
  },
  {
    category: 'Process',
    questions: [
      { q: 'What is the net metering process?', a: 'Net metering allows you to export excess solar power to the grid and receive credits. We handle the entire net metering application with your DISCOM (electricity distribution company). The process typically takes 30–60 days.' },
      { q: 'What documents are required for installation?', a: 'You need: electricity bill (last 3 months), property documents (ownership proof), Aadhar card, PAN card, and a cancelled cheque for subsidy payment. We guide you through the entire process.' },
      { q: 'Do you provide after-sales service?', a: 'Yes! We have a dedicated after-sales team available Monday–Saturday 9am–6pm. We offer 1-year comprehensive warranty, AMC contracts, and emergency support. Our technicians can reach most locations within 24–48 hours.' },
    ]
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div style={{ border: '1px solid var(--gray-200)', borderRadius: 12, overflow: 'hidden', marginBottom: 10 }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '18px 20px', background: open ? 'var(--gray-50)' : 'white',
          border: 'none', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          textAlign: 'left', transition: 'background 0.2s',
        }}
      >
        <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--gray-900)', flex: 1, paddingRight: 16 }}>{q}</span>
        {open ? <ChevronUp size={20} color="var(--solar-orange)" style={{ flexShrink: 0 }} /> : <ChevronDown size={20} color="var(--gray-400)" style={{ flexShrink: 0 }} />}
      </button>
      {open && (
        <div style={{ padding: '0 20px 18px', color: 'var(--gray-600)', fontSize: 14, lineHeight: 1.7, background: 'var(--gray-50)' }}>
          {a}
        </div>
      )}
    </div>
  )
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const categories = ['All', ...faqs.map(f => f.category)]

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #112240)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>❓ FAQ</div>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
            Frequently Asked <span className="text-solar-gradient">Questions</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>Everything you need to know about going solar with SolarPro.</p>
        </div>
      </section>

      <section style={{ padding: '60px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          {/* Category tabs */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 40, flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '8px 18px', borderRadius: 50, border: 'none', cursor: 'pointer',
                  background: activeCategory === cat ? 'var(--solar-orange)' : 'white',
                  color: activeCategory === cat ? 'white' : 'var(--gray-600)',
                  fontWeight: 600, fontSize: 14,
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s',
                }}
              >{cat}</button>
            ))}
          </div>

          {/* Questions */}
          {faqs
            .filter(f => activeCategory === 'All' || f.category === activeCategory)
            .map((section) => (
              <div key={section.category} style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 20, color: 'var(--gray-900)' }}>
                  {section.category} Questions
                </h2>
                {section.questions.map((faq, i) => <FAQItem key={i} q={faq.q} a={faq.a} />)}
              </div>
            ))}

          <div style={{ marginTop: 48, textAlign: 'center', background: 'white', borderRadius: 20, padding: 40, border: '1px solid var(--gray-200)' }}>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Still have questions?</h3>
            <p style={{ color: 'var(--gray-500)', marginBottom: 24 }}>Our solar experts are ready to help you make the right decision.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary">Contact Us</Link>
              <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer" className="btn btn-ghost">Chat on WhatsApp</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
