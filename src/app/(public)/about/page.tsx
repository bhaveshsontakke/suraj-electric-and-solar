import Link from 'next/link'
import { Award, Users, TrendingUp, Heart, Sun, Target, Eye, Handshake } from 'lucide-react'

const team = [
  { name: 'Suraj Ghode', role: 'Founder & Managing Director', exp: 'Solar EPC & Electrical Engineering Expert', emoji: '👨‍💼' },
  { name: 'Pooja Mehta', role: 'Head of Operations', exp: '10+ years management', emoji: '👩‍💼' },
  { name: 'Rahul Kumar', role: 'Lead Solar Engineer', exp: '12+ years, MNRE certified', emoji: '👨‍🔧' },
  { name: 'Priya Desai', role: 'Customer Relations', exp: '8+ years customer success', emoji: '👩‍💼' },
]

const milestones = [
  { year: '2018', event: 'Suraj Electric & Solar founded in Pune with a specialized engineering team' },
  { year: '2019', event: 'Completed our first 100 residential installations' },
  { year: '2021', event: 'Expanded to commercial and industrial solar systems' },
  { year: '2022', event: 'Crossed 1 MW of total solar capacity installed' },
  { year: '2024', event: 'Launched elevated pergola structural fabrication unit' },
  { year: '2026', event: '500+ happy customers and PM Surya Ghar ₹78,000 subsidy leadership' },
]

export default function AboutPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #112240)', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>🌞 About Suraj Electric &amp; Solar</div>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 60px)', fontWeight: 900, marginBottom: 20 }}>
            Powering Maharashtra&apos;s Clean <span className="text-solar-gradient">Energy Future</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: 18, lineHeight: 1.7, maxWidth: 640, margin: '0 auto' }}>
            Suraj Electric &amp; Solar, founded by <strong>Suraj Ghode</strong>, helps homes and businesses across Maharashtra harness the power of the sun with zero-compromise elevated pergolas and ₹0 electricity bills.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '48px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 24 }}>
          {[
            { label: 'Happy Customers', value: '500+', icon: '😊' },
            { label: 'Capacity Installed', value: '2.5 MW+', icon: '⚡' },
            { label: 'Years Experience', value: '8+', icon: '🗓️' },
            { label: 'Cities Served', value: '12+', icon: '📍' },
            { label: 'Certified Engineers', value: '15+', icon: '👷' },
            { label: 'Annual CO₂ Offset', value: '3,500 T', icon: '🌱' },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center', padding: '24px 16px', border: '1px solid var(--gray-200)', borderRadius: 16 }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--gray-900)' }}>{s.value}</div>
              <div style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission / Vision */}
      <section style={{ padding: '64px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
          {[
            { icon: Target, title: 'Our Mission', color: '#f5a623', text: 'To make clean solar energy accessible and affordable for every home and business in India, while providing world-class installation quality and lifetime customer support.' },
            { icon: Eye, title: 'Our Vision', color: '#3b82f6', text: 'To be the most trusted solar energy company in Maharashtra — known for engineering excellence, customer transparency, and measurable environmental impact.' },
          ].map(item => (
            <div key={item.title} className="card" style={{ padding: 36 }}>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                <item.icon size={26} color={item.color} />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 14 }}>{item.title}</h2>
              <p style={{ color: 'var(--gray-600)', fontSize: 15, lineHeight: 1.7 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section style={{ padding: '64px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
            Our Core <span className="text-solar-gradient">Values</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {[
              { icon: Award, title: 'Quality First', color: '#f5a623', desc: 'We only use Tier-1 panels and branded equipment. No compromises on quality.' },
              { icon: Heart, title: 'Customer Care', color: '#ef4444', desc: 'Our relationship doesn\'t end after installation. We\'re with you for the system\'s lifetime.' },
              { icon: Handshake, title: 'Transparency', color: '#22c55e', desc: 'Honest pricing, clear timelines, no hidden costs. We say what we do and do what we say.' },
              { icon: TrendingUp, title: 'Performance', color: '#3b82f6', desc: 'Every system is optimized for maximum energy output and ROI for the customer.' },
            ].map(v => (
              <div key={v.title} className="card">
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${v.color}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                  <v.icon size={24} color={v.color} />
                </div>
                <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: 17 }}>{v.title}</h3>
                <p style={{ color: 'var(--gray-500)', fontSize: 14, lineHeight: 1.6 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #0a1628, #112240)' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ color: 'white', textAlign: 'center', marginBottom: 48, fontSize: 36, fontWeight: 800 }}>
            Our <span className="text-solar-gradient">Journey</span>
          </h2>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 24, top: 0, bottom: 0, width: 2, background: 'rgba(245,166,35,0.3)' }} />
            {milestones.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 28, marginBottom: 32, position: 'relative' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #e8751a, #f5a623)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: 'white', fontWeight: 800,
                }}>
                  {m.year.slice(2)}
                </div>
                <div style={{ paddingTop: 10 }}>
                  <div style={{ color: '#f5a623', fontWeight: 700, fontSize: 14 }}>{m.year}</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15, marginTop: 2 }}>{m.event}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '64px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
            Meet Our <span className="text-solar-gradient">Team</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 24 }}>
            {team.map(member => (
              <div key={member.name} className="card" style={{ textAlign: 'center', padding: 28 }}>
                <div style={{ fontSize: 56, marginBottom: 16 }}>{member.emoji}</div>
                <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 4 }}>{member.name}</h3>
                <div style={{ color: '#f5a623', fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{member.role}</div>
                <div style={{ color: 'var(--gray-500)', fontSize: 13 }}>{member.exp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #e8751a, #f5a623)', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Ready to Start Your Solar Journey?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32 }}>Join 500+ satisfied customers who have already made the switch to solar.</p>
        <Link href="/contact" className="btn btn-navy btn-xl">Get Free Consultation →</Link>
      </section>
    </div>
  )
}
