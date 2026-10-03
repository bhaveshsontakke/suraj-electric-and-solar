import Link from 'next/link'
import { ArrowRight, MapPin, Zap } from 'lucide-react'

const projects = [
  { id: 1, title: 'Sharma Residence', location: 'Pune, MH', type: 'Residential', capacity: '5 kW', status: 'Completed', date: 'Aug 2026', emoji: '🏠', panels: 10, savings: '₹46K/year', color: '#f5a623' },
  { id: 2, title: 'Textile Factory Unit', location: 'Ichalkaranji, MH', type: 'Industrial', capacity: '50 kW', status: 'Completed', date: 'Jul 2026', emoji: '🏭', panels: 91, savings: '₹4.5L/year', color: '#8b5cf6' },
  { id: 3, title: 'City Shopping Mall', location: 'Nashik, MH', type: 'Commercial', capacity: '25 kW', status: 'Completed', date: 'Jun 2026', emoji: '🏢', panels: 46, savings: '₹2.2L/year', color: '#3b82f6' },
  { id: 4, title: 'Mehta Farmhouse', location: 'Satara, MH', type: 'Residential', capacity: '10 kW', status: 'Completed', date: 'Sep 2026', emoji: '🏡', panels: 19, savings: '₹90K/year', color: '#22c55e' },
  { id: 5, title: 'Government School', location: 'Kolhapur, MH', type: 'Commercial', capacity: '15 kW', status: 'Completed', date: 'May 2026', emoji: '🏫', panels: 28, savings: '₹1.3L/year', color: '#f59e0b' },
  { id: 6, title: 'Patel Bungalow', location: 'Solapur, MH', type: 'Residential', capacity: '3 kW', status: 'Completed', date: 'Aug 2026', emoji: '🏘️', panels: 6, savings: '₹28K/year', color: '#ef4444' },
]

const filters = ['All', 'Residential', 'Commercial', 'Industrial']

export default function ProjectsPage() {
  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ background: 'linear-gradient(135deg, #0a1628, #112240)', padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className="section-tag" style={{ marginBottom: 16 }}>🏗️ Our Projects</div>
          <h1 style={{ color: 'white', fontSize: 'clamp(32px, 5vw, 56px)', fontWeight: 900, marginBottom: 16 }}>
            Our <span className="text-solar-gradient">Completed</span> Projects
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 18 }}>
            Browse our portfolio of successfully installed solar systems across Maharashtra.
          </p>
        </div>
      </section>

      <section style={{ padding: '60px 24px', background: 'var(--gray-50)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 48 }}>
            {[
              { label: 'Projects Completed', value: '500+' },
              { label: 'Total Capacity', value: '2.5 MW+' },
              { label: 'Residential', value: '380+' },
              { label: 'Commercial', value: '90+' },
              { label: 'Industrial', value: '30+' },
            ].map(s => (
              <div key={s.label} style={{ background: 'white', borderRadius: 14, padding: '20px 16px', textAlign: 'center', border: '1px solid var(--gray-200)' }}>
                <div style={{ fontSize: 28, fontWeight: 900, color: 'var(--gray-900)' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 28 }}>Featured Projects</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
            {projects.map(project => (
              <div key={project.id} className="card" style={{ overflow: 'hidden', padding: 0 }}>
                {/* Project image placeholder */}
                <div style={{
                  height: 200, background: `linear-gradient(135deg, ${project.color}25, ${project.color}10)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                }}>
                  <div style={{ fontSize: 72 }}>{project.emoji}</div>
                  <div style={{
                    position: 'absolute', top: 16, left: 16,
                    background: project.color, color: 'white',
                    padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                  }}>
                    {project.type}
                  </div>
                  <div style={{
                    position: 'absolute', top: 16, right: 16,
                    background: '#22c55e', color: 'white',
                    padding: '4px 12px', borderRadius: 50, fontSize: 12, fontWeight: 700,
                  }}>
                    ✓ {project.status}
                  </div>
                </div>

                <div style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>{project.title}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray-500)', fontSize: 14, marginBottom: 16 }}>
                    <MapPin size={14} /> {project.location}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                    {[
                      { label: 'Capacity', value: project.capacity },
                      { label: 'Panels', value: `${project.panels} nos` },
                      { label: 'Savings', value: project.savings },
                    ].map(info => (
                      <div key={info.label} style={{ background: 'var(--gray-50)', borderRadius: 10, padding: '10px 8px', textAlign: 'center' }}>
                        <div style={{ fontWeight: 800, color: project.color, fontSize: 14 }}>{info.value}</div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 2 }}>{info.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ color: 'var(--gray-400)', fontSize: 12 }}>Installed: {project.date}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <p style={{ color: 'var(--gray-500)', marginBottom: 20 }}>Want to see your solar project featured here?</p>
            <Link href="/contact" className="btn btn-primary btn-lg">
              Start Your Solar Project <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <section style={{ padding: '64px 24px', background: 'linear-gradient(135deg, #e8751a, #f5a623)', textAlign: 'center' }}>
        <h2 style={{ color: 'white', fontSize: 36, fontWeight: 900, marginBottom: 16 }}>Ready to Add Your Project Here?</h2>
        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 32 }}>Join our growing list of happy solar customers.</p>
        <Link href="/contact" className="btn btn-navy btn-xl">Get Free Quote →</Link>
      </section>
    </div>
  )
}
