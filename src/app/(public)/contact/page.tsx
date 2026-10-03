'use client'
import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from 'lucide-react'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', mobile: '', email: '', city: '', requirement: '', bill: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // Simulate API call
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #112240)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>📞 Contact Us</div>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
            Let&apos;s Talk <span className="text-solar-gradient">Solar</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
            Get a free consultation, site visit, and customized solar quotation — no obligations.
          </p>
        </div>
      </section>

      <section style={{ padding: '64px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: 48 }}>

          {/* Contact info */}
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Get in Touch</h2>
            <p style={{ color: 'var(--gray-500)', marginBottom: 32, fontSize: 15 }}>
              We&apos;re here to help. Reach out through any channel and our team will respond within a few hours.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 32 }}>
              {[
                { icon: Phone, title: 'Call / WhatsApp', info: '+91 99999 99999', sub: 'Mon–Sat, 9am–6pm', href: 'tel:+919999999999', color: '#22c55e' },
                { icon: Mail, title: 'Email Us', info: 'info@solarpro.in', sub: 'Reply within 24 hours', href: 'mailto:info@solarpro.in', color: '#3b82f6' },
                { icon: MapPin, title: 'Visit Our Office', info: '123 Solar Street, Green City', sub: 'Maharashtra - 411001', href: '#map', color: '#f5a623' },
              ].map((c) => (
                <a key={c.title} href={c.href} style={{ display: 'flex', gap: 16, alignItems: 'flex-start', textDecoration: 'none', padding: '18px 20px', background: 'white', borderRadius: 14, border: '1px solid var(--gray-200)', transition: 'all 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.08)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.boxShadow = 'none'}
                >
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <c.icon size={20} color={c.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{c.title}</div>
                    <div style={{ fontWeight: 700, color: 'var(--gray-900)', fontSize: 15, marginTop: 2 }}>{c.info}</div>
                    <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{c.sub}</div>
                  </div>
                </a>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <a href="https://wa.me/919999999999?text=Hello, I want a solar quote!" target="_blank" rel="noopener noreferrer" className="btn" style={{
              background: '#25d366', color: 'white', width: '100%', justifyContent: 'center',
              fontSize: 16, padding: '14px',
            }}>
              <MessageCircle size={20} /> Chat on WhatsApp
            </a>

            {/* Map placeholder */}
            <div id="map" style={{
              marginTop: 24, height: 200, borderRadius: 16,
              background: 'linear-gradient(135deg, #e2e8f0, #cbd5e1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', position: 'relative',
            }}>
              <div style={{ textAlign: 'center' }}>
                <MapPin size={36} color="var(--gray-400)" />
                <div style={{ color: 'var(--gray-400)', fontSize: 14, marginTop: 8 }}>Map loading...</div>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="card" style={{ padding: 40 }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
                  <CheckCircle size={40} color="#22c55e" />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Thank You!</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 16, marginBottom: 24 }}>
                  We&apos;ve received your enquiry. Our team will contact you within 2-4 hours to schedule a free site visit.
                </p>
                <button onClick={() => { setSubmitted(false); setForm({ name: '', mobile: '', email: '', city: '', requirement: '', bill: '', message: '' }) }} className="btn btn-ghost">
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Request Free Quote</h2>
                <p style={{ color: 'var(--gray-500)', marginBottom: 28, fontSize: 14 }}>Fill in your details and we&apos;ll get back to you with a customized solar quotation.</p>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input className="form-input" placeholder="Rajesh Sharma" required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Mobile Number *</label>
                      <input className="form-input" type="tel" placeholder="+91 98765 43210" required value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input className="form-input" type="email" placeholder="rajesh@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input className="form-input" placeholder="Pune" required value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Property Type *</label>
                      <select className="form-select" required value={form.requirement} onChange={e => setForm({ ...form, requirement: e.target.value })}>
                        <option value="">Select...</option>
                        <option>Residential Home</option>
                        <option>Commercial Office</option>
                        <option>Industrial/Factory</option>
                        <option>Agricultural</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label">Monthly Electricity Bill (₹)</label>
                      <input className="form-input" type="number" placeholder="3000" value={form.bill} onChange={e => setForm({ ...form, bill: e.target.value })} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Additional Requirements</label>
                    <textarea className="form-textarea" placeholder="Tell us about your rooftop size, current setup, or any specific requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ minHeight: 100 }} />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center', padding: '14px', fontSize: 16 }} disabled={loading}>
                    {loading ? <><span className="spinner" /> Sending...</> : <><Send size={18} /> Submit Enquiry</>}
                  </button>
                  <p style={{ textAlign: 'center', color: 'var(--gray-400)', fontSize: 12 }}>
                    🔒 Your information is secure and will never be shared.
                  </p>
                </form>
              </>
            )}
          </div>
        </div>
      </section>

      <style jsx>{`
        @media (max-width: 900px) {
          section > div { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          form > div { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
