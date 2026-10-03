'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Sun, Zap, ShieldCheck, Award, Layers, Clock, Phone,
  MessageCircle, Star, CheckCircle2, ChevronRight, ArrowRight,
  HardHat, FileText, Camera, MapPin, Building, Info, Sparkles
} from 'lucide-react'
import ConsultationModal from '@/components/public/ConsultationModal'

interface CustomerDashboardProps {
  userName: string
  userMobile: string
  customerData?: any
  sitePhotos?: Array<{ id: string; url: string; caption?: string | null; project?: any }>
  customerReviews?: Array<{ id: string; name: string; city: string; rating: number; text: string; capacity: string }>
}

export default function CustomerDashboard({
  userName,
  userMobile,
  customerData,
  sitePhotos = [],
  customerReviews = [],
}: CustomerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'guide' | 'sites' | 'project' | 'savings'>('guide')
  const [consultModalOpen, setConsultModalOpen] = useState(false)
  const [billValue, setBillValue] = useState(4500)

  // Solar calculation
  const kwSize = Math.max(1, Math.min(15, Math.round((billValue / 1400) * 10) / 10))
  const subsidyAmount = kwSize >= 3 ? 78000 : kwSize >= 2 ? 60000 : 30000
  const grossCost = Math.round(kwSize * 60000)
  const netCost = Math.max(0, grossCost - subsidyAmount)
  const annualSavings = Math.round(billValue * 0.92 * 12)
  const twentyFiveYearSavings = Math.round((annualSavings * 25 * 1.05) / 100000) / 10

  const activeProject = customerData?.projects?.[0]

  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', paddingBottom: 48 }}>

      {/* ========================================================================= */}
      {/* 1. WELCOME HERO BANNER WITH BRAND LOGO & SURAJ GHODE LEADERSHIP           */}
      {/* ========================================================================= */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1628 0%, #0f244a 50%, #153266 100%)',
        borderRadius: 24,
        padding: '32px 28px',
        color: '#ffffff',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 12px 35px rgba(10,22,40,0.25)',
      }}>
        {/* Glow */}
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 280, height: 280,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 640 }}>
            {/* Logo + Tag + Brand Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14, flexWrap: 'wrap' }}>
              <div style={{
                background: '#ffffff',
                padding: '6px 14px',
                borderRadius: 14,
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 4px 18px rgba(0,0,0,0.22)',
                border: '2px solid rgba(255,255,255,0.85)',
              }}>
                <img
                  src="/images/logo.png"
                  alt="Suraj Electric & Solar Logo"
                  style={{ height: 42, width: 'auto', objectFit: 'contain' }}
                />
              </div>

              <div>
                <div style={{
                  fontSize: 'clamp(22px, 2.8vw, 32px)',
                  fontWeight: 900,
                  letterSpacing: '-0.02em',
                  color: '#ffffff',
                  lineHeight: 1.15,
                }}>
                  Suraj Electric &amp; Solar
                </div>
                <div style={{
                  fontSize: 11,
                  color: '#ffd066',
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  marginTop: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <span>⭐ Customer Hub</span>
                  <span>•</span>
                  <span>Founder: Suraj Ghode</span>
                </div>
              </div>
            </div>

            <h1 style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', fontWeight: 900, marginBottom: 6, lineHeight: 1.25 }}>
              Namaste, {userName.split(' ')[0]}! Welcome to your Solar Dashboard
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
              Track your installation progress, discover how our elevated pergola systems work, and see real sites executed across Maharashtra by our engineering team led by <strong>Suraj Ghode</strong>.
            </p>
          </div>

          {/* Quick Direct Contact with Suraj Ghode & Team */}
          <div style={{
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 16,
            padding: '16px 20px',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}>
            <div style={{ fontSize: 11, color: '#ffd066', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              👤 Dedicated Solar Lead
            </div>
            <div style={{ fontWeight: 800, fontSize: 15 }}>Suraj Ghode &amp; Engineering Team</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <a
                href="https://wa.me/919000000001?text=Hello%20Suraj%20Ghode,%20I%20am%20logged%20into%20Suraj%20Electric%20&%20Solar%20portal."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8, background: '#25d366',
                  color: 'white', fontSize: 12, fontWeight: 700, textDecoration: 'none',
                }}
              >
                <MessageCircle size={15} /> WhatsApp Suraj
              </a>
              <a
                href="tel:+919000000001"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '8px 14px', borderRadius: 8, background: '#ffffff',
                  color: '#0a1628', fontSize: 12, fontWeight: 800, textDecoration: 'none',
                }}
              >
                <Phone size={15} color="#ea580c" /> Call Team
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. PORTAL NAVIGATION TABS                                                */}
      {/* ========================================================================= */}
      <div style={{
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: 16,
        padding: 6,
        marginBottom: 28,
        gap: 6,
        overflowX: 'auto',
      }}>
        {[
          { id: 'guide', label: '📖 How We Work & Guide', icon: Info },
          { id: 'sites', label: '📸 Real Work & Site Showcase', icon: Camera },
          { id: 'project', label: '⚡ My Solar Project Status', icon: Zap },
          { id: 'savings', label: '💰 Solar Savings & Subsidy', icon: Sparkles },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              flex: 1,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 12,
              border: 'none',
              fontSize: 14,
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              background: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#0f172a' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 4px 12px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <tab.icon size={16} color={activeTab === tab.id ? '#0070f3' : '#94a3b8'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: HOW WE WORK & HOW TO USE THIS PORTAL                              */}
      {/* ========================================================================= */}
      {activeTab === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Welcome card */}
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
              ⚡ How Suraj Electric &amp; Solar Works For Your Home
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 24 }}>
              Founded and engineered by <strong>Suraj Ghode</strong>, we provide end-to-end rooftop solar solutions across Maharashtra.
              From your initial 3D rooftop survey to government subsidy sanctions and lifetime panel cleaning, here is how our 5-step process delivers <strong>₹0 electricity bills</strong>:
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 18 }}>
              {[
                {
                  step: '01',
                  title: 'Free 3D Roof Shadow Analysis',
                  desc: 'Suraj Ghode’s certified engineers inspect your RCC terrace or metal roof using precision LiDAR to calculate exact shadow patterns and orientation for maximum power generation.',
                  icon: Layers,
                  color: '#0070f3',
                },
                {
                  step: '02',
                  title: 'PM Surya Ghar Subsidy Sanctioning',
                  desc: 'We register and process your application on the National PM Surya Ghar portal. Direct central subsidy up to ₹78,000 is approved and deposited straight into your bank account.',
                  icon: ShieldCheck,
                  color: '#22c55e',
                },
                {
                  step: '03',
                  title: 'Elevated Pergola Installation (24h)',
                  desc: 'We fabricate an elevated Hot Dip Galvanized (HDG) canopy 7-10ft high. Your terrace remains 100% usable for family tea, walking, and gatherings, while withstanding 170 km/h winds.',
                  icon: HardHat,
                  color: '#f5a623',
                },
                {
                  step: '04',
                  title: 'Bi-Directional Net-Meter Connection',
                  desc: 'We coordinate with your utility DISCOM (MSEDCL, Tata Power, etc.) for testing, inspection, and meter synchronization. Extra units generated are credited to your bill.',
                  icon: Zap,
                  color: '#8b5cf6',
                },
                {
                  step: '05',
                  title: '5-Year Free Maintenance & Cleaning',
                  desc: 'Our team visits bi-monthly for robotic and pressurized water panel cleaning. Plus, track daily solar units generated right on your phone via real-time IoT app monitoring.',
                  icon: Sparkles,
                  color: '#ea580c',
                },
              ].map((st, i) => (
                <div key={i} style={{
                  padding: 20,
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10,
                        background: `${st.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <st.icon size={20} color={st.color} />
                      </div>
                      <span style={{ fontSize: 13, fontWeight: 900, color: st.color, fontFamily: 'monospace' }}>
                        STEP {st.step}
                      </span>
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                      {st.title}
                    </h3>
                    <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How to use website guide */}
          <div className="card" style={{ padding: 28, background: '#f8fafc' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              💡 What You Can Do in This Customer Portal
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, fontSize: 13, color: '#334155' }}>
              <div style={{ background: '#ffffff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0070f3', display: 'block', marginBottom: 4 }}>📸 View Real Installation Sites</strong>
                Browse authentic photos of live elevated solar pergolas and installations executed by Suraj Electric &amp; Solar.
              </div>
              <div style={{ background: '#ffffff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#22c55e', display: 'block', marginBottom: 4 }}>⚡ Track Site Installation Status</strong>
                View live milestones of your solar system from site visit to panel mounting and net meter synchronization.
              </div>
              <div style={{ background: '#ffffff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#f5a623', display: 'block', marginBottom: 4 }}>💰 Check PM Surya Ghar Subsidy</strong>
                Calculate exact financial savings and benchmark subsidy amounts based on your electricity bill.
              </div>
              <div style={{ background: '#ffffff', padding: 14, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#8b5cf6', display: 'block', marginBottom: 4 }}>📞 1-Tap Direct Helpdesk</strong>
                Connect with Suraj Ghode directly on WhatsApp or phone call for any queries or rooftop assistance.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: REAL WORK REVIEW & SITE SHOWCASE                                   */}
      {/* ========================================================================= */}
      {activeTab === 'sites' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  📸 Real Work &amp; Rooftop Sites Executed by Suraj Electric &amp; Solar
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, marginTop: 4, margin: 0 }}>
                  High-resolution photo records of our elevated pergolas, Mono PERC modules, and certified wiring across Maharashtra.
                </p>
              </div>
              <button
                onClick={() => setConsultModalOpen(true)}
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Sparkles size={14} /> Request Free 3D Roof Survey
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
              {[
                {
                  title: '5 kW Elevated Pergola Canopy',
                  loc: 'Baner, Pune (Rajesh Verma Residence)',
                  specs: '9x 550W Mono PERC • Growatt Inverter • 10ft Clearance',
                  img: '/images/solar-family-rooftop.jpg',
                  tag: 'RESIDENTIAL PERGOLA',
                },
                {
                  title: '25 kW Commercial Hospital Solar',
                  loc: 'Aundh DP Road, Pune (Sanjeevani Hospital)',
                  specs: '46x 550W Bifacial Modules • Sungrow 25kW Inverter',
                  img: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=800',
                  tag: 'COMMERCIAL ROOFTOP',
                },
                {
                  title: '50 kW Industrial Factory Plant',
                  loc: 'Uruli Kanchan MIDC (Sunrise Agro Processing)',
                  specs: '92x 550W Half-Cut Modules • 220 Units Daily Generation',
                  img: 'https://images.unsplash.com/photo-1508873696983-2df5293cb395?w=800',
                  tag: 'INDUSTRIAL ROOFTOP',
                },
                {
                  title: '3 kW Residential Rooftop',
                  loc: 'Kothrud, Pune (Sneha Kulkarni Residence)',
                  specs: '6x 550W Modules • PM Surya Ghar ₹78,000 Subsidy',
                  img: 'https://images.unsplash.com/photo-1548337138-e87d889cc369?w=800',
                  tag: 'HOME SOLAR',
                },
              ].map((site, i) => (
                <div key={i} style={{
                  background: '#ffffff',
                  borderRadius: 18,
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.04)',
                }}>
                  <div style={{ position: 'relative', height: 210, overflow: 'hidden' }}>
                    <img
                      src={site.img}
                      alt={site.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute', top: 12, left: 12,
                      background: 'rgba(10,22,40,0.85)', color: '#ffd066',
                      padding: '3px 10px', borderRadius: 8, fontSize: 11, fontWeight: 800,
                      backdropFilter: 'blur(4px)',
                    }}>
                      {site.tag}
                    </span>
                  </div>

                  <div style={{ padding: 18 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                      {site.title}
                    </h3>
                    <div style={{ fontSize: 13, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <MapPin size={14} color="#ea580c" />
                      <span>{site.loc}</span>
                    </div>
                    <div style={{ fontSize: 12, color: '#0070f3', background: '#eff6ff', padding: '6px 10px', borderRadius: 8, fontWeight: 600 }}>
                      ⚡ {site.specs}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Reviews & Bill Proofs Card */}
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  ⭐ Verified Customer Reviews &amp; Bill Drops
                </h3>
                <p style={{ color: '#64748b', fontSize: 13, margin: '4px 0 0' }}>
                  Real Maharashtra homeowners sharing their power generation and zero electricity bill experience.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#fef3c7', padding: '6px 12px', borderRadius: 20, color: '#92400e', fontWeight: 800, fontSize: 13 }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" /> 4.96 / 5.0 (180+ Reviews)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
              {[
                {
                  name: 'Rajesh Verma',
                  loc: 'Baner, Pune',
                  system: '5 kW Elevated Pergola Solar',
                  billDrop: '₹5,800/mo → ₹140/mo',
                  review: 'Suraj Ghode and his engineers designed a 10ft elevated pergola canopy so my terrace is 100% free for family gatherings. Electricity bill dropped by 96% and ₹78,000 subsidy was received smoothly.',
                  date: 'Installed Nov 2025',
                },
                {
                  name: 'Dr. Sneha Kulkarni',
                  loc: 'Kothrud, Pune',
                  system: '3 kW Residential Rooftop',
                  billDrop: '₹3,400/mo → ₹90/mo',
                  review: 'Zero hassle from PM Surya Ghar national portal registration to net meter connection with MSEDCL. The live mobile app lets me monitor solar units everyday.',
                  date: 'Installed Jan 2026',
                },
                {
                  name: 'Dilip Deshmukh',
                  loc: 'Uruli Kanchan MIDC',
                  system: '50 kW Agro Processing Plant',
                  billDrop: '₹48,000/mo → ₹6,200/mo',
                  review: 'Exceptional structural engineering. High-tensile structure withstood peak summer wind storms. Suraj Electric & Solar provides top notch robotic panel maintenance.',
                  date: 'Installed Feb 2026',
                },
              ].map((rev, idx) => (
                <div key={idx} style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: 16,
                  padding: 20,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{rev.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>📍 {rev.loc} • <span style={{ color: '#0070f3', fontWeight: 600 }}>{rev.system}</span></div>
                      </div>
                      <div style={{ display: 'flex', gap: 2 }}>
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>

                    <div style={{
                      background: '#ecfdf5',
                      border: '1px solid #a7f3d0',
                      borderRadius: 8,
                      padding: '6px 10px',
                      fontSize: 12,
                      fontWeight: 800,
                      color: '#065f46',
                      marginBottom: 10,
                      display: 'inline-block',
                    }}>
                      ⚡ Bill Reduction: {rev.billDrop}
                    </div>

                    <p style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
                      &ldquo;{rev.review}&rdquo;
                    </p>
                  </div>

                  <div style={{ marginTop: 14, paddingTop: 10, borderTop: '1px solid #e2e8f0', fontSize: 11, color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{rev.date}</span>
                    <span style={{ color: '#16a34a', fontWeight: 700 }}>✓ Verified Solar Site</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: MY SOLAR PROJECT STATUS                                            */}
      {/* ========================================================================= */}
      {activeTab === 'project' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {activeProject ? (
            <div className="card" style={{ padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                <div>
                  <span style={{ fontSize: 12, color: '#ea580c', fontWeight: 800 }}>PROJECT ID: {activeProject.projectId}</span>
                  <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginTop: 2 }}>
                    {activeProject.capacityKw} kW Solar Installation Site
                  </h2>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>
                    📍 {activeProject.siteAddress || 'Site address on file'}
                  </div>
                </div>

                <span style={{
                  padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800,
                  background: 'rgba(34,197,94,0.12)', color: '#16a34a',
                }}>
                  {activeProject.status.replace(/_/g, ' ')}
                </span>
              </div>

              {/* Progress bar */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>Overall Site Completion</span>
                  <span style={{ fontWeight: 800, color: '#0f172a' }}>{activeProject.progress}%</span>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: `${activeProject.progress}%` }} />
                </div>
              </div>

              {/* Specifications */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 14, background: '#f8fafc', padding: 18, borderRadius: 14, marginBottom: 20 }}>
                <div>
                  <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Solar Modules</span>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginTop: 2 }}>{activeProject.panelDetails || 'Mono PERC Bifacial'}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Solar Inverter</span>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginTop: 2 }}>{activeProject.inverterDetails || 'Grid-Tie Inverter'}</div>
                </div>
                <div>
                  <span style={{ fontSize: 11, color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Structure Canopy</span>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#0f172a', marginTop: 2 }}>{activeProject.structureDetails || 'Elevated HDG Pergola'}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 40, textAlign: 'center' }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20, background: 'rgba(245,166,35,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
              }}>
                <Sun size={32} color="#f5a623" />
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
                You Have No Active Solar Project Yet
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, maxWidth: 540, margin: '0 auto 24px', lineHeight: 1.6 }}>
                Book a free consultation and 3D rooftop shadow survey with <strong>Suraj Ghode</strong>.
                We will calculate your exact capacity, design an elevated pergola, and claim your ₹78,000 PM Surya Ghar subsidy!
              </p>
              <button
                onClick={() => setConsultModalOpen(true)}
                style={{
                  background: '#0a1628', color: '#ffffff', border: 'none',
                  borderRadius: 12, padding: '14px 28px', fontSize: 15, fontWeight: 800,
                  cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                Schedule Free Site Visit &amp; 3D Survey <ArrowRight size={16} />
              </button>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SOLAR SAVINGS & PM SURYA GHAR CALCULATOR                           */}
      {/* ========================================================================= */}
      {activeTab === 'savings' && (
        <div className="card" style={{ padding: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 6 }}>
            💰 Your Personalized Solar Savings Calculator
          </h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
            Adjust your monthly bill to see your recommended solar plant size, govt subsidy, and net electricity savings.
          </p>

          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#334155' }}>Monthly Electricity Bill:</span>
              <span style={{ fontSize: 24, fontWeight: 900, color: '#0070f3' }}>₹{billValue.toLocaleString('en-IN')} / mo</span>
            </div>
            <input
              type="range"
              min="1500"
              max="25000"
              step="500"
              value={billValue}
              onChange={e => setBillValue(parseInt(e.target.value))}
              style={{ width: '100%', height: 8, accentColor: '#0070f3', cursor: 'pointer' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
            <div style={{ background: '#f8fafc', padding: 18, borderRadius: 14, border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: 12, color: '#64748b' }}>System Size Needed</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '4px 0' }}>{kwSize} kW</div>
              <div style={{ fontSize: 11, color: '#0070f3' }}>Elevated Pergola Canopy</div>
            </div>

            <div style={{ background: '#f0fdf4', padding: 18, borderRadius: 14, border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: 12, color: '#16a34a' }}>Govt. Direct Subsidy</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#16a34a', margin: '4px 0' }}>₹{subsidyAmount.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, color: '#15803d' }}>PM Surya Ghar Scheme</div>
            </div>

            <div style={{ background: '#eff6ff', padding: 18, borderRadius: 14, border: '1px solid #bfdbfe' }}>
              <div style={{ fontSize: 12, color: '#1d4ed8' }}>Net Price to You</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#1d4ed8', margin: '4px 0' }}>₹{netCost.toLocaleString('en-IN')}</div>
              <div style={{ fontSize: 11, color: '#2563eb' }}>Or ₹0 Down Green EMI</div>
            </div>

            <div style={{ background: '#fefce8', padding: 18, borderRadius: 14, border: '1px solid #fef08a' }}>
              <div style={{ fontSize: 12, color: '#a16207' }}>25-Year Net Savings</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#a16207', margin: '4px 0' }}>₹{twentyFiveYearSavings} Lakhs</div>
              <div style={{ fontSize: 11, color: '#854d0e' }}>Guaranteed Zero Bills</div>
            </div>
          </div>
        </div>
      )}

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </div>
  )
}
