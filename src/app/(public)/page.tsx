'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Sun, Zap, Shield, TrendingUp, Star, ArrowRight, CheckCircle2,
  Phone, ShieldCheck, Award, Users, Clock, MapPin, Sparkles,
  Layers, HardHat, FileText, ChevronRight, CheckCircle, Percent
} from 'lucide-react'
import ConsultationModal from '@/components/public/ConsultationModal'
import { submitConsultationLead } from '@/app/actions/lead'

const trustStats = [
  { value: '500+', label: 'Rooftops Energized', sub: 'Across Maharashtra & India' },
  { value: '₹78,000', label: 'Max Govt. Subsidy', sub: 'PM Surya Ghar Yojana' },
  { value: '170 km/h', label: 'Wind-Proof Tested', sub: 'Elevated Pergola Canopy' },
  { value: '25 Years', label: 'Module Warranty', sub: 'Tier-1 Mono PERC' },
]

const subsidyTiers = [
  {
    capacity: '1 - 2 kW System',
    idealFor: 'Small Homes / Monthly Bill ₹1,000 - ₹2,000',
    generation: '120 - 240 Units / mo',
    marketPrice: '₹85,000 - ₹1,40,000',
    subsidy: '₹30,000 - ₹60,000',
    netCost: 'Starting at ₹55,000',
    emi: '₹1,150 / mo',
    badge: 'Basic Tier',
  },
  {
    capacity: '3 kW System',
    idealFor: '3-4 BHK Homes / Monthly Bill ₹3,000 - ₹5,000',
    generation: '360 - 400 Units / mo',
    marketPrice: '₹1,85,000',
    subsidy: '₹78,000 (MAX)',
    netCost: '₹1,07,000',
    emi: '₹1,950 / mo',
    badge: 'MOST POPULAR',
    isPopular: true,
  },
  {
    capacity: '5 kW System',
    idealFor: 'Large Bungalows / ACs / Bill ₹5,000 - ₹9,000',
    generation: '600 - 650 Units / mo',
    marketPrice: '₹2,85,000',
    subsidy: '₹78,000 (MAX)',
    netCost: '₹2,07,000',
    emi: '₹3,750 / mo',
    badge: 'High Savings',
  },
  {
    capacity: '10 kW System',
    idealFor: 'Villas & Commercial / Bill ₹10,000+',
    generation: '1,200+ Units / mo',
    marketPrice: '₹5,40,000',
    subsidy: '₹78,000 (MAX)',
    netCost: '₹4,62,000',
    emi: '₹7,900 / mo',
    badge: 'Maximum Power',
  },
]

const pergolaFeatures = [
  {
    title: '100% Usable Rooftop Terrace',
    desc: 'Unlike traditional solar racks that clutter your floor, our elevated structure raises panels 7-10 feet high. Your terrace remains a beautiful open space for family gatherings, morning tea & children playing.',
    icon: Layers,
    color: '#0070f3',
  },
  {
    title: 'Tested for 170 km/h Cyclone Winds',
    desc: 'Engineered with heavy-duty Hot Dip Galvanized (HDG) structural steel and high-tensile hardware. Solid anchoring designed to withstand the heaviest monsoon storms and coastal cyclone winds.',
    icon: ShieldCheck,
    color: '#22c55e',
  },
  {
    title: 'Cools Your Home by 3°C - 5°C',
    desc: 'The solar canopy acts as an insulated roof shield that blocks direct harsh sunlight from hitting your RCC slab, drastically reducing top-floor indoor temperatures and AC power consumption.',
    icon: Sun,
    color: '#f5a623',
  },
  {
    title: 'Zero Leakage Roof Anchoring',
    desc: 'We use non-penetrating chemical anchoring and industrial waterproofing gaskets. Zero roof seepage guaranteed with a comprehensive 5-year roof integrity warranty.',
    icon: Award,
    color: '#8b5cf6',
  },
]

const journeySteps = [
  {
    step: '01',
    title: 'Free 3D Roof Shadow Analysis',
    desc: 'Our solar design engineer visits your home with LiDAR measurement tools to assess roof tilt, shade, and design a custom elevated solar pergola.',
  },
  {
    step: '02',
    title: 'Paperwork & Subsidy Sanctioning',
    desc: 'We handle 100% of the administrative paperwork on the National PM Surya Ghar portal and coordinate with your local DISCOM (MSEDCL, Tata Power, BESCOM).',
  },
  {
    step: '03',
    title: 'Precision 24-Hour Installation',
    desc: 'Certified electrical engineers mount your high-efficiency Mono PERC modules, smart inverter, and safety ACDB/DCDB boxes within 1 to 2 days.',
  },
  {
    step: '04',
    title: 'Net Meter Synchronization',
    desc: 'Your utility DISCOM inspects and connects the bi-directional solar net meter. Any extra units you generate are automatically credited to your power bill.',
  },
  {
    step: '05',
    title: '5-Year Free AMC & IoT Monitoring',
    desc: 'Enjoy lifetime peace of mind with scheduled bi-monthly module cleaning visits, inverter health checks, and 24/7 mobile app generation tracking.',
  },
]

const realTestimonials = [
  {
    name: 'Dr. Rajesh & Sunita Kulkarni',
    city: 'Baner, Pune',
    capacity: '5 kW Elevated Pergola',
    billBefore: '₹6,800/mo',
    billAfter: '₹340/mo',
    savings: '₹77,500/year',
    quote: 'The elevated structure is brilliant! Our terrace looks like a luxurious rooftop garden café. The top bedroom feels significantly cooler during summers, and our electricity bill dropped by 95%!',
    rating: 5,
  },
  {
    name: 'Vikram & Ananya Sharma',
    city: 'Kothrud, Pune',
    capacity: '3 kW Rooftop Solar',
    billBefore: '₹4,200/mo',
    billAfter: '₹190/mo',
    savings: '₹48,000/year',
    quote: 'The ₹78,000 PM Surya Ghar subsidy was deposited directly into our bank account within 25 days of net meter commissioning. Suraj Electric & Solar handled every single document without us visiting any office.',
    rating: 5,
  },
  {
    name: 'Col. Suresh Deshmukh (Retd.)',
    city: 'Aundh, Pune',
    capacity: '6 kW Solar System',
    billBefore: '₹8,500/mo',
    billAfter: '₹420/mo',
    savings: '₹96,000/year',
    quote: 'The craftsmanship of the structural steel and cabling is top-tier. Clean installation, zero leaks during heavy monsoon, and their mobile app shows daily unit generation in real-time.',
    rating: 5,
  },
]

export default function HomePage() {
  const [consultModalOpen, setConsultModalOpen] = useState(false)

  // Interactive Calculator State
  const [billValue, setBillValue] = useState(4500)

  // Hero Lead Form State matching SolarSquare screenshot
  const [selectedBillRange, setSelectedBillRange] = useState('₹2500 - ₹4000')
  const [termsAgreed, setTermsAgreed] = useState(true)
  const [bookedCustomerId, setBookedCustomerId] = useState('')
  const [heroForm, setHeroForm] = useState({
    name: '',
    pinCode: '',
    mobile: '',
    monthlyBill: '₹2500 - ₹4000',
  })
  const [heroLoading, setHeroLoading] = useState(false)
  const [heroSuccess, setHeroSuccess] = useState('')
  const [heroError, setHeroError] = useState('')

  async function handleHeroLeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!termsAgreed) {
      setHeroError('Please agree to the Terms of use and Privacy Policy.')
      return
    }
    setHeroLoading(true)
    setHeroError('')
    setHeroSuccess('')

    const formData = new FormData()
    formData.append('name', heroForm.name)
    formData.append('pinCode', heroForm.pinCode)
    formData.append('mobile', heroForm.mobile)
    formData.append('monthlyBill', heroForm.monthlyBill || selectedBillRange)

    const res = await submitConsultationLead(formData)
    setHeroLoading(false)

    if (res.success) {
      setHeroSuccess('🎉 Consultation booked successfully! Our senior solar engineer will call you shortly.')
      setBookedCustomerId(res.customerId || '')
      setHeroForm({ name: '', pinCode: '', mobile: '', monthlyBill: '₹2500 - ₹4000' })
    } else {
      setHeroError(res.error || 'Failed to submit. Please try again.')
    }
  }

  // Calculator computations
  const kwSize = Math.max(1, Math.min(15, Math.round((billValue / 1400) * 10) / 10))
  const subsidyAmount = kwSize >= 3 ? 78000 : kwSize >= 2 ? 60000 : 30000
  const grossCost = Math.round(kwSize * 60000)
  const netCost = Math.max(0, grossCost - subsidyAmount)
  const monthlySavings = Math.round(billValue * 0.92)
  const annualSavings = monthlySavings * 12
  const twentyFiveYearSavings = Math.round((annualSavings * 25 * 1.05) / 100000) / 10 // in Lakhs
  const emiEstimate = Math.round((netCost * 0.021))

  return (
    <div style={{ color: '#0f172a', background: '#ffffff', overflowX: 'hidden' }}>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: SolarSquare High-Converting Split Layout                */}
      {/* ========================================================================= */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        background: `linear-gradient(to right, rgba(7, 16, 33, 0.94) 0%, rgba(10, 24, 52, 0.85) 45%, rgba(10, 24, 52, 0.96) 100%), url('/images/solar-hero-van.jpg') center/cover no-repeat`,
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        padding: '120px 24px 80px',
        overflow: 'hidden',
      }}>
        {/* Ambient solar glows */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%', width: 500, height: 500,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '5%', width: 600, height: 600,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,112,243,0.18) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1.15fr 0.95fr',
          gap: 48,
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}>

          {/* Left Column: Hero Headline & Badges matching SolarSquare Screenshot */}
          <div>
            {/* Government Approved Subsidy Badge & Owner Details */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(245,166,35,0.18)',
              color: '#ffd066',
              border: '1px solid rgba(245,166,35,0.35)',
              padding: '6px 14px',
              borderRadius: 30,
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: '0.04em',
              marginBottom: 16,
              backdropFilter: 'blur(6px)',
            }}>
              <ShieldCheck size={16} /> PM SURYA GHAR CERTIFIED &bull; SURAJ ELECTRIC &amp; SOLAR (SURAJ GHODE)
            </div>

            {/* Main Headline from User Screenshot */}
            <h1 style={{
              fontSize: 'clamp(34px, 4.4vw, 56px)',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#ffffff',
              marginBottom: 16,
              letterSpacing: '-0.02em',
            }}>
              Nagpur, Go Solar At{' '}
              <span style={{
                background: 'linear-gradient(135deg, #ffd066 0%, #f5a623 50%, #e8751a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                Zero Investment!
              </span>
            </h1>

            {/* Subtitle from Screenshot */}
            <p style={{
              fontSize: 'clamp(16px, 1.4vw, 19px)',
              color: 'rgba(255,255,255,0.9)',
              lineHeight: 1.6,
              marginBottom: 26,
              maxWidth: 580,
            }}>
              Save up to 90% on electricity bills with government subsidy (up to ₹78,000) and easy EMI.
            </p>

            {/* 4 Trust Badges matching Screenshot */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: 10,
              marginBottom: 22,
              maxWidth: 560,
            }}>
              {[
                { icon: Award, label: '10+ Years of Experience' },
                { icon: Users, label: '50,000+ Homes Solarised' },
                { icon: Zap, label: '200MW+ Installation Experience' },
                { icon: TrendingUp, label: '₹100Cr+ Savings Across India' },
              ].map((badge, idx) => (
                <div key={idx} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'rgba(255,255,255,0.1)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 10,
                  padding: '9px 12px',
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#ffffff',
                  backdropFilter: 'blur(8px)',
                }}>
                  <badge.icon size={16} color="#ffd066" style={{ flexShrink: 0 }} />
                  <span>{badge.label}</span>
                </div>
              ))}
            </div>

            {/* Google Rating Pill matching bottom-left of Screenshot */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: 'rgba(0,0,0,0.55)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 30,
              padding: '7px 16px',
              fontSize: 13,
              fontWeight: 700,
              color: '#ffffff',
              backdropFilter: 'blur(10px)',
              marginBottom: 28,
            }}>
              Rated <span style={{ color: '#ffd066', fontWeight: 800 }}>★ 4.8</span> on Google | <strong style={{ color: '#ffffff' }}>15000+ ratings</strong>
            </div>

            {/* Quick Access to Main Dashboard & Portals */}
            <div style={{
              display: 'flex',
              gap: 10,
              flexWrap: 'wrap',
              alignItems: 'center',
            }}>
              <Link
                href="/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #0070f3, #0050b3)',
                  color: '#ffffff',
                  padding: '13px 22px',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 18px rgba(0,112,243,0.4)',
                  transition: 'all 0.2s',
                }}
              >
                📊 Open Main Dashboard <ArrowRight size={16} />
              </Link>

              <Link
                href="/login"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 7,
                  background: 'rgba(255,255,255,0.1)',
                  color: '#ffffff',
                  border: '1px solid rgba(255,255,255,0.25)',
                  padding: '13px 18px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 700,
                  textDecoration: 'none',
                  backdropFilter: 'blur(8px)',
                }}
              >
                👑 Owner Login (Suraj Ghode)
              </Link>

              <Link
                href="/signup"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(245,166,35,0.18)',
                  color: '#ffd066',
                  border: '1px solid rgba(245,166,35,0.4)',
                  padding: '13px 18px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 800,
                  textDecoration: 'none',
                }}
              >
                <Sparkles size={14} /> New Customer Sign-Up
              </Link>
            </div>
          </div>

          {/* Right Column: Exact Consultation Form Card matching Screenshot */}
          <div>
            <div style={{
              background: '#ffffff',
              borderRadius: 24,
              boxShadow: '0 25px 65px rgba(0, 0, 0, 0.45)',
              padding: '32px 30px',
              color: '#0f172a',
              position: 'relative',
            }}>
              {/* Card Header matching screenshot */}
              <div style={{ marginBottom: 18 }}>
                <h2 style={{
                  fontSize: 23,
                  fontWeight: 900,
                  color: '#0f172a',
                  lineHeight: 1.25,
                  margin: 0,
                }}>
                  Book a FREE Solar Consultation
                </h2>
                <p style={{
                  color: '#64748b',
                  fontSize: 13,
                  marginTop: 4,
                  fontWeight: 500,
                }}>
                  And save up to ₹ 78,000 with subsidy
                </p>
              </div>

              {/* Success Alert */}
              {heroSuccess && (
                <div style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: 12,
                  padding: '16px',
                  marginBottom: 16,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#16a34a', fontWeight: 700, fontSize: 14 }}>
                    <CheckCircle2 size={18} /> {heroSuccess}
                  </div>
                  {bookedCustomerId && (
                    <div style={{ marginTop: 8, fontSize: 12, color: '#15803d' }}>
                      Lead Ref: <strong>{bookedCustomerId}</strong>
                    </div>
                  )}
                  <div style={{ marginTop: 12 }}>
                    <Link
                      href="/dashboard"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        background: '#15803d',
                        color: '#ffffff',
                        padding: '8px 14px',
                        borderRadius: 8,
                        fontSize: 12,
                        fontWeight: 700,
                        textDecoration: 'none',
                      }}
                    >
                      Go to Customer Dashboard <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {heroError && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: '#fef2f2', border: '1px solid #fecaca',
                  borderRadius: 10, padding: '10px 14px',
                  color: '#dc2626', fontSize: 13,
                  marginBottom: 16,
                }}>
                  <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
                  {heroError}
                </div>
              )}

              {/* Form matching user image */}
              <form onSubmit={handleHeroLeadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <input
                  type="text"
                  required
                  placeholder="Full Name"
                  value={heroForm.name}
                  onChange={e => setHeroForm({ ...heroForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#ffffff',
                    border: '1.5px solid #d1d5db',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0f2b5c'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
                />

                <input
                  type="tel"
                  required
                  placeholder="Whatsapp Number"
                  value={heroForm.mobile}
                  onChange={e => setHeroForm({ ...heroForm, mobile: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#ffffff',
                    border: '1.5px solid #d1d5db',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0f2b5c'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
                />

                {/* Monthly Electricity Bill Chips matching screenshot */}
                <div>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#374151',
                    marginBottom: 8,
                  }}>
                    <span>Monthly Electricity Bill</span>
                    <span title="Used to calculate ideal solar kW capacity & PM Surya Ghar subsidy" style={{ cursor: 'help', color: '#9ca3af', fontSize: 13 }}>ⓘ</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {[
                      'Less than ₹1500',
                      '₹1500 - ₹2500',
                      '₹2500 - ₹4000',
                      '₹4000 - ₹8000',
                      'More than ₹8000',
                    ].map((range) => {
                      const isSelected = selectedBillRange === range
                      return (
                        <button
                          key={range}
                          type="button"
                          onClick={() => {
                            setSelectedBillRange(range)
                            setHeroForm({ ...heroForm, monthlyBill: range })
                          }}
                          style={{
                            padding: '7px 12px',
                            borderRadius: 18,
                            fontSize: 12,
                            fontWeight: 600,
                            border: isSelected ? '1.5px solid #0f2b5c' : '1px solid #d1d5db',
                            background: isSelected ? 'rgba(15, 43, 92, 0.08)' : '#ffffff',
                            color: isSelected ? '#0f2b5c' : '#374151',
                            cursor: 'pointer',
                            transition: 'all 0.15s',
                          }}
                        >
                          {range}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder="PIN Code"
                  value={heroForm.pinCode}
                  onChange={e => setHeroForm({ ...heroForm, pinCode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#ffffff',
                    border: '1.5px solid #d1d5db',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0f2b5c'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#d1d5db'}
                />

                {/* Terms Checkbox matching screenshot */}
                <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, color: '#4b5563', cursor: 'pointer', lineHeight: 1.4 }}>
                  <input
                    type="checkbox"
                    checked={termsAgreed}
                    onChange={e => setTermsAgreed(e.target.checked)}
                    style={{ width: 15, height: 15, marginTop: 2, accentColor: '#0f2b5c', cursor: 'pointer' }}
                  />
                  <span>
                    I agree to Suraj Electric &amp; Solar <span style={{ color: '#0070f3', textDecoration: 'underline' }}>Terms of use</span> and <span style={{ color: '#0070f3', textDecoration: 'underline' }}>Privacy Policy</span>.
                  </span>
                </label>

                {/* Dark Blue Submit Button matching screenshot */}
                <button
                  type="submit"
                  disabled={heroLoading}
                  style={{
                    width: '100%',
                    background: '#0f2b5c',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '15px',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: heroLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 15px rgba(15, 43, 92, 0.3)',
                    marginTop: 4,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#163a75' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0f2b5c' }}
                >
                  {heroLoading ? 'Booking Consultation...' : 'Book a FREE Consultation'}
                </button>
              </form>

              <div style={{
                marginTop: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: 11,
                color: '#94a3b8',
              }}>
                <span>🔒 100% Privacy Protected</span>
                <span>⚡ 24h Site Visit Callback</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. TRUST STATS BAR                                                       */}
      {/* ========================================================================= */}
      <section style={{
        background: '#f8fafc',
        borderBottom: '1px solid #e2e8f0',
        padding: '32px 24px',
      }}>
        <div style={{
          maxWidth: 1280,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
          textAlign: 'center',
        }}>
          {trustStats.map((st, i) => (
            <div key={i}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#0f172a' }}>{st.value}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#0070f3', marginTop: 2 }}>{st.label}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{st.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. SIGNATURE FEATURE: ELEVATED ROOFTOP PERGOLA STRUCTURE                 */}
      {/* ========================================================================= */}
      <section id="elevated-pergola" style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,112,243,0.1)', color: '#0070f3',
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800,
              marginBottom: 12,
            }}>
              🏗️ SIGNATURE ROOFTOP DESIGN
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#0f172a', lineHeight: 1.2 }}>
              Why Homeowners Choose Our{' '}
              <span style={{ color: '#0070f3' }}>Elevated Solar Pergola</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, marginTop: 12, lineHeight: 1.6 }}>
              Most rooftop solar setups ruin your terrace by laying panels on the ground.
              Our elevated pergola canopy preserves 100% of your open roof while keeping your home cool.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 48,
            alignItems: 'center',
          }}>
            {/* Visual comparison illustration */}
            <div style={{
              borderRadius: 24,
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.12)',
              position: 'relative',
              background: '#0a1628',
            }}>
              <img
                src="/images/solar-family-rooftop.jpg"
                alt="Suraj Electric & Solar elevated rooftop solar pergola"
                style={{ width: '100%', height: 480, objectFit: 'cover', display: 'block' }}
              />
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0,
                padding: '24px',
                background: 'linear-gradient(to top, rgba(10,22,40,0.95), transparent)',
                color: 'white',
              }}>
                <div style={{ fontSize: 13, color: '#ffd066', fontWeight: 800, textTransform: 'uppercase' }}>
                  ☀️ Real Home Installation • Pune
                </div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>
                  Full 10ft Terrace Clearance &amp; Family Open Living
                </div>
              </div>
            </div>

            {/* Feature Cards Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {pergolaFeatures.map((f, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 16,
                  padding: '20px 22px', background: '#f8fafc',
                  border: '1px solid #e2e8f0', borderRadius: 16,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#0070f3'
                    ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#e2e8f0'
                    ;(e.currentTarget as HTMLElement).style.transform = 'none'
                  }}
                >
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${f.color}15`, display: 'flex',
                    alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <f.icon size={22} color={f.color} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 6 }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                      {f.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. INTERACTIVE SOLARSQUARE-STYLE SOLAR SAVINGS CALCULATOR                */}
      {/* ========================================================================= */}
      <section id="calculator" style={{
        padding: '96px 24px',
        background: 'linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto 48px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(34,197,94,0.12)', color: '#16a34a',
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800,
              marginBottom: 12,
            }}>
              ⚡ INSTANT SOLAR ESTIMATOR
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#0f172a' }}>
              Calculate Your <span style={{ color: '#0070f3' }}>Solar Savings &amp; Subsidy</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, marginTop: 8 }}>
              Drag the slider to your average monthly electricity bill and see exact PM Surya Ghar savings.
            </p>
          </div>

          <div style={{
            background: '#ffffff',
            borderRadius: 24,
            padding: '40px 36px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
          }}>
            {/* Slider container */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 15, fontWeight: 700, color: '#334155' }}>Your Current Monthly Electricity Bill:</span>
                <span style={{ fontSize: 26, fontWeight: 900, color: '#0070f3' }}>
                  ₹{billValue.toLocaleString('en-IN')} / month
                </span>
              </div>
              <input
                type="range"
                min="1500"
                max="25000"
                step="500"
                value={billValue}
                onChange={e => setBillValue(parseInt(e.target.value))}
                style={{
                  width: '100%',
                  height: 10,
                  accentColor: '#0070f3',
                  cursor: 'pointer',
                  borderRadius: 5,
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginTop: 8 }}>
                <span>₹1,500</span>
                <span>₹5,000</span>
                <span>₹10,000</span>
                <span>₹15,000</span>
                <span>₹25,000+</span>
              </div>
            </div>

            {/* Results Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 32,
            }}>
              <div style={{ background: '#f8fafc', padding: 20, borderRadius: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>Recommended Solar Size</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', margin: '6px 0 2px' }}>
                  {kwSize} kW
                </div>
                <div style={{ fontSize: 12, color: '#0070f3', fontWeight: 700 }}>~{Math.round(kwSize * 100)} sq.ft roof space</div>
              </div>

              <div style={{ background: '#f0fdf4', padding: 20, borderRadius: 16, border: '1px solid #bbf7d0' }}>
                <div style={{ fontSize: 12, color: '#16a34a', fontWeight: 700 }}>PM Surya Ghar Govt Subsidy</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#16a34a', margin: '6px 0 2px' }}>
                  ₹{subsidyAmount.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 12, color: '#15803d' }}>Direct Bank Deposit (DBT)</div>
              </div>

              <div style={{ background: '#eff6ff', padding: 20, borderRadius: 16, border: '1px solid #bfdbfe' }}>
                <div style={{ fontSize: 12, color: '#1d4ed8', fontWeight: 700 }}>Net Price (After Subsidy)</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#1d4ed8', margin: '6px 0 2px' }}>
                  ₹{netCost.toLocaleString('en-IN')}
                </div>
                <div style={{ fontSize: 12, color: '#2563eb', fontWeight: 700 }}>Or ₹0 Down (₹{emiEstimate}/mo EMI)</div>
              </div>

              <div style={{ background: '#fefce8', padding: 20, borderRadius: 16, border: '1px solid #fef08a' }}>
                <div style={{ fontSize: 12, color: '#a16207', fontWeight: 700 }}>25-Year Net Savings</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: '#a16207', margin: '6px 0 2px' }}>
                  ₹{twentyFiveYearSavings} Lakhs
                </div>
                <div style={{ fontSize: 12, color: '#854d0e' }}>Save ₹{annualSavings.toLocaleString('en-IN')}/year</div>
              </div>
            </div>

            {/* CTA bar */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 16,
              borderTop: '1px solid #e2e8f0',
              paddingTop: 24,
            }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a' }}>
                  Ready to lock in your ₹{subsidyAmount.toLocaleString('en-IN')} Government Subsidy?
                </div>
                <div style={{ fontSize: 13, color: '#64748b' }}>
                  Zero paperwork hassle. We complete your sanctioning in 48 hours.
                </div>
              </div>
              <button
                onClick={() => setConsultModalOpen(true)}
                style={{
                  background: '#0a1628',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 12,
                  padding: '14px 28px',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  boxShadow: '0 4px 15px rgba(10,22,40,0.25)',
                }}
              >
                Claim Subsidy &amp; Book Site Visit <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. PM SURYA GHAR: MUFT BIJLI YOJANA SUBSIDY & PRICING TABLE              */}
      {/* ========================================================================= */}
      <section id="pricing" style={{ padding: '96px 24px', background: '#ffffff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(234,88,12,0.1)', color: '#ea580c',
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800,
              marginBottom: 12,
            }}>
              🇮🇳 CENTRAL GOVT. SCHEME 2026
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#0f172a' }}>
              Transparent Pricing &amp; <span style={{ color: '#0070f3' }}>Official Govt. Subsidies</span>
            </h2>
            <p style={{ color: '#64748b', fontSize: 16, marginTop: 10 }}>
              Under the PM Surya Ghar: Muft Bijli Yojana, get guaranteed central government subsidies deposited straight into your bank account.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
            gap: 24,
          }}>
            {subsidyTiers.map((tier, i) => (
              <div
                key={i}
                style={{
                  background: tier.isPopular ? '#0a1628' : '#ffffff',
                  color: tier.isPopular ? '#ffffff' : '#0f172a',
                  borderRadius: 24,
                  padding: 32,
                  border: tier.isPopular ? '2px solid #0070f3' : '1px solid #e2e8f0',
                  boxShadow: tier.isPopular ? '0 20px 50px rgba(0,112,243,0.25)' : '0 10px 30px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                {tier.isPopular && (
                  <div style={{
                    position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)',
                    background: 'linear-gradient(135deg, #0070f3, #00c6ff)',
                    color: '#ffffff', fontSize: 11, fontWeight: 900,
                    letterSpacing: '0.08em', padding: '4px 14px', borderRadius: 20,
                  }}>
                    {tier.badge}
                  </div>
                )}

                <div>
                  <div style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: tier.isPopular ? '#ffd066' : '#0070f3',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 6,
                  }}>
                    {tier.badge}
                  </div>
                  <h3 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{tier.capacity}</h3>
                  <p style={{ fontSize: 13, color: tier.isPopular ? 'rgba(255,255,255,0.7)' : '#64748b', lineHeight: 1.4, marginBottom: 20 }}>
                    {tier.idealFor}
                  </p>

                  <div style={{
                    background: tier.isPopular ? 'rgba(255,255,255,0.08)' : '#f8fafc',
                    borderRadius: 14,
                    padding: 16,
                    marginBottom: 24,
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                      <span style={{ color: tier.isPopular ? 'rgba(255,255,255,0.6)' : '#64748b' }}>Benchmark Cost:</span>
                      <del style={{ color: tier.isPopular ? 'rgba(255,255,255,0.5)' : '#94a3b8' }}>{tier.marketPrice}</del>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, color: '#22c55e', marginBottom: 8 }}>
                      <span>Govt. Subsidy:</span>
                      <span>- {tier.subsidy}</span>
                    </div>
                    <div style={{ borderTop: `1px solid ${tier.isPopular ? 'rgba(255,255,255,0.1)' : '#e2e8f0'}`, paddingTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontSize: 13, fontWeight: 800 }}>Net Cost:</span>
                      <strong style={{ fontSize: 20, color: tier.isPopular ? '#ffd066' : '#0070f3' }}>{tier.netCost}</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, marginBottom: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="#22c55e" />
                      <span>{tier.generation}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="#22c55e" />
                      <span>Zero Down Payment EMI: <strong>{tier.emi}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="#22c55e" />
                      <span>Elevated Wind-Proof Pergola Structure</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <CheckCircle size={16} color="#22c55e" />
                      <span>25-Year Performance Warranty</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setConsultModalOpen(true)}
                  style={{
                    width: '100%',
                    padding: '14px',
                    borderRadius: 12,
                    border: 'none',
                    background: tier.isPopular ? '#0070f3' : '#0a1628',
                    color: '#ffffff',
                    fontSize: 14,
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                >
                  Book Free Consultation
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. HASSLE-FREE 5-STEP JOURNEY                                            */}
      {/* ========================================================================= */}
      <section style={{ padding: '96px 24px', background: '#0a1628', color: '#ffffff' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 60px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(245,166,35,0.2)', color: '#ffd066',
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800,
              marginBottom: 12,
            }}>
              📋 ZERO-HASSLE EXECUTION
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#ffffff' }}>
              Your Journey to <span style={{ color: '#f5a623' }}>Free Electricity</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 16, marginTop: 10 }}>
              From initial 3D shadow analysis to net metering approvals and bi-monthly cleaning, we do everything.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 24,
          }}>
            {journeySteps.map((step, i) => (
              <div
                key={i}
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 20,
                  padding: 24,
                  position: 'relative',
                }}
              >
                <div style={{
                  fontSize: 32,
                  fontWeight: 900,
                  color: '#f5a623',
                  marginBottom: 12,
                  fontFamily: 'monospace',
                }}>
                  {step.step}
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 7. REAL HOMEOWNER TESTIMONIALS                                           */}
      {/* ========================================================================= */}
      <section style={{ padding: '96px 24px', background: '#f8fafc' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 56px' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'rgba(0,112,243,0.1)', color: '#0070f3',
              padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 800,
              marginBottom: 12,
            }}>
              ⭐ VERIFIED HOMEOWNER STORIES
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 900, color: '#0f172a' }}>
              Hear From Families Who Switched to <span style={{ color: '#0070f3' }}>Suraj Electric &amp; Solar</span>
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 28,
          }}>
            {realTestimonials.map((t, i) => (
              <div
                key={i}
                style={{
                  background: '#ffffff',
                  borderRadius: 20,
                  padding: 32,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 12px 35px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  {/* Rating Stars */}
                  <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} size={16} color="#f5a623" fill="#f5a623" />
                    ))}
                  </div>

                  {/* Savings pill */}
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#f0fdf4', color: '#16a34a',
                    padding: '6px 12px', borderRadius: 10, fontSize: 12,
                    fontWeight: 700, marginBottom: 16,
                  }}>
                    Bill Reduced: {t.billBefore} ➔ {t.billAfter} ({t.savings})
                  </div>

                  <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.7, fontStyle: 'italic', marginBottom: 24 }}>
                    "{t.quote}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', margin: 0 }}>{t.name}</h4>
                    <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{t.city}</div>
                  </div>
                  <span style={{ fontSize: 11, background: '#eff6ff', color: '#1d4ed8', padding: '4px 10px', borderRadius: 8, fontWeight: 700 }}>
                    {t.capacity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 8. BOTTOM HERO CTA BANNER                                                */}
      {/* ========================================================================= */}
      <section style={{
        padding: '80px 24px',
        background: 'linear-gradient(135deg, #e8751a, #f5a623)',
        color: '#ffffff',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, marginBottom: 16 }}>
            Ready to Zero Your Electricity Bills?
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.92)', lineHeight: 1.6, marginBottom: 32 }}>
            Book your free 3D roof inspection today. Secure your ₹78,000 PM Surya Ghar subsidy before quota allocation runs out.
          </p>
          <button
            onClick={() => setConsultModalOpen(true)}
            style={{
              background: '#0a1628',
              color: '#ffffff',
              border: 'none',
              borderRadius: 14,
              padding: '18px 36px',
              fontSize: 16,
              fontWeight: 800,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
            }}
          >
            Book Free Consultation &amp; 3D Survey <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* Global Consultation Lead Modal matching user screenshot */}
      <ConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />
    </div>
  )
}
