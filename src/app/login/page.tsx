'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  X, Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  Sun, ArrowRight, ShieldCheck, Zap, User, MapPin
} from 'lucide-react'
import { submitConsultationLead } from '@/app/actions/lead'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  // Tab: 'login' | 'consultation'
  const [activeTab, setActiveTab] = useState<'login' | 'consultation'>('login')

  // Login form state
  const [loginForm, setLoginForm] = useState({ mobile: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loginLoading, setLoginLoading] = useState(false)
  const [loginError, setLoginError] = useState('')

  // Consultation form state
  const [leadForm, setLeadForm] = useState({
    name: '',
    pinCode: '',
    mobile: '',
    monthlyBill: '₹3,000 - ₹5,000',
  })
  const [leadLoading, setLeadLoading] = useState(false)
  const [leadSuccess, setLeadSuccess] = useState('')
  const [leadError, setLeadError] = useState('')

  async function handleLoginSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')

    const result = await signIn('credentials', {
      mobile: loginForm.mobile,
      password: loginForm.password,
      redirect: false,
    })

    setLoginLoading(false)

    if (result?.error) {
      setLoginError('Invalid mobile number or password. Please try again.')
    } else {
      router.push(callbackUrl)
      router.refresh()
    }
  }

  async function handleConsultationSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLeadLoading(true)
    setLeadError('')
    setLeadSuccess('')

    const formData = new FormData()
    formData.append('name', leadForm.name)
    formData.append('pinCode', leadForm.pinCode)
    formData.append('mobile', leadForm.mobile)
    formData.append('monthlyBill', leadForm.monthlyBill)

    const res = await submitConsultationLead(formData)
    setLeadLoading(false)

    if (res.success) {
      setLeadSuccess('🎉 Consultation booked! Our solar engineer will call you shortly.')
      setLeadForm({ name: '', pinCode: '', mobile: '', monthlyBill: '₹3,000 - ₹5,000' })
    } else {
      setLeadError(res.error || 'Failed to submit. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #0f244a 50%, #153266 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 16px',
      position: 'relative',
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute', top: '15%', left: '8%',
        width: 380, height: 380, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,166,35,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '15%', right: '8%',
        width: 440, height: 440, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,112,243,0.15) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main Split Modal Card matching the user's reference screenshot */}
      <div style={{
        width: '100%',
        maxWidth: 940,
        background: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 25px 65px -10px rgba(0, 0, 0, 0.45)',
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 1fr) minmax(340px, 1.15fr)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 10,
      }} className="auth-split-card">

        {/* ============ LEFT COLUMN: Family under Rooftop Solar Pergola ============ */}
        <div style={{
          position: 'relative',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 460,
          background: '#f8fafc',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 440,
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          }}>
            <img
              src="/images/solar-family-rooftop.jpg"
              alt="Happy Indian family under rooftop solar canopy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
              }}
            />

            {/* Gradient overlay with trust badges */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px 20px 20px',
              background: 'linear-gradient(to top, rgba(10,22,40,0.92) 0%, rgba(10,22,40,0.6) 60%, transparent 100%)',
              color: 'white',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(245,166,35,0.25)',
                color: '#ffd066',
                padding: '4px 10px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.04em',
                marginBottom: 8,
                backdropFilter: 'blur(4px)',
                border: '1px solid rgba(245,166,35,0.3)',
              }}>
                <ShieldCheck size={14} /> PM SURYA GHAR APPROVED
              </div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'white', lineHeight: 1.3, marginBottom: 4 }}>
                100% Usable Rooftop Terrace
              </h3>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4 }}>
                Elevated pergola solar canopy tested for 170 km/h winds with ₹78,000 government subsidy.
              </p>
            </div>
          </div>
        </div>

        {/* ============ RIGHT COLUMN: Header & Form ============ */}
        <div style={{
          padding: '36px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          {/* Close button (top right like the reference screenshot) */}
          <Link
            href="/"
            title="Close and return to website"
            style={{
              position: 'absolute',
              top: 20,
              right: 20,
              width: 34,
              height: 34,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              textDecoration: 'none',
              transition: 'all 0.15s',
              background: '#f1f5f9',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.color = '#0f172a'
              ;(e.currentTarget as HTMLElement).style.background = '#e2e8f0'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.color = '#94a3b8'
              ;(e.currentTarget as HTMLElement).style.background = '#f1f5f9'
            }}
          >
            <X size={18} />
          </Link>

          {/* Heading exactly matching screenshot */}
          <div>
            <div style={{ paddingRight: 32, marginBottom: 8 }}>
              <h1 style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.25,
                margin: 0,
              }}>
                Switch to solar at{' '}
                <span style={{ color: '#0070f3', fontWeight: 900 }}>0 Investment</span>
              </h1>
              <p style={{
                color: '#64748b',
                fontSize: 13,
                marginTop: 6,
                lineHeight: 1.4,
              }}>
                Govt. subsidy covers your down payment, savings cover EMIs
              </p>
            </div>

            {/* Blue Highlight Tagline */}
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#1e3a8a',
              marginBottom: 20,
            }}>
              Book a free consultation &amp; save up to{' '}
              <span style={{ color: '#0070f3', fontWeight: 800 }}>₹78,000</span>
            </div>

            {/* Mode Switcher Tabs: Sign In Portal vs Consultation */}
            <div style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: 4,
              borderRadius: 12,
              marginBottom: 16,
              gap: 4,
            }}>
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setLoginError(''); }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeTab === 'login' ? '#ffffff' : 'transparent',
                  color: activeTab === 'login' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'login' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                🔐 Customer &amp; Team Login
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('consultation'); setLeadError(''); setLeadSuccess(''); }}
                style={{
                  flex: 1,
                  padding: '9px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  background: activeTab === 'consultation' ? '#ffffff' : 'transparent',
                  color: activeTab === 'consultation' ? '#0f172a' : '#64748b',
                  boxShadow: activeTab === 'consultation' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                ☀️ Free Consultation
              </button>
            </div>

            {/* Quick Link to Customer Registration */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: 10,
              padding: '8px 12px',
              marginBottom: 16,
              fontSize: 12,
            }}>
              <span style={{ color: '#1e40af', fontWeight: 600 }}>
                New Customer? Create your account
              </span>
              <Link
                href="/signup"
                style={{
                  color: '#0070f3',
                  fontWeight: 800,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 3,
                }}
              >
                Register Here <ArrowRight size={13} />
              </Link>
            </div>

            {/* ================= FORM 1: LOGIN ================= */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {loginError && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 10, padding: '10px 14px',
                    color: '#dc2626', fontSize: 13,
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    {loginError}
                  </div>
                )}

                {/* Mobile Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type="tel"
                    required
                    placeholder="Registered Mobile / User ID*"
                    value={loginForm.mobile}
                    onChange={e => setLoginForm({ ...loginForm, mobile: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 14px 13px 40px',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0070f3'}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#cbd5e1'}
                  />
                  <Phone size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                </div>

                {/* Password Input */}
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Password*"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '13px 42px 13px 40px',
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: 10,
                      color: '#0f172a',
                      fontSize: 14,
                      outline: 'none',
                      transition: 'border-color 0.2s',
                    }}
                    onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0070f3'}
                    onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#cbd5e1'}
                  />
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#94a3b8', padding: 0,
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Primary Submit Button matching the user's screenshot */}
                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    width: '100%',
                    background: '#0a1628',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '14px',
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: loginLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    marginTop: 4,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#112240' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a1628' }}
                >
                  {loginLoading ? (
                    <><span className="spinner" /> Signing In...</>
                  ) : (
                    'Sign In to Dashboard'
                  )}
                </button>

                {/* Quick 1-click Demo credentials */}
                <div style={{
                  marginTop: 10, padding: '12px 14px', background: '#f8fafc',
                  borderRadius: 12, border: '1px solid #e2e8f0',
                }}>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 8, display: 'flex', justifyContent: 'space-between' }}>
                    <span>⚡ 1-Click Demo Login</span>
                    <span style={{ color: '#0070f3', textTransform: 'none' }}>Owner: Suraj Ghode</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                    {[
                      { role: '👑 Owner', mobile: '9000000001', pass: 'owner123' },
                      { role: '☀️ Customer', mobile: '9876543210', pass: 'customer123' },
                      { role: '💼 Staff', mobile: '9000000002', pass: 'staff123' },
                      { role: '👷 Worker', mobile: '9000000003', pass: 'worker123' },
                    ].map(cred => (
                      <button
                        key={cred.role}
                        type="button"
                        onClick={() => setLoginForm({ mobile: cred.mobile, password: cred.pass })}
                        style={{
                          padding: '6px 6px', borderRadius: 6, border: '1px solid #cbd5e1',
                          background: '#ffffff', cursor: 'pointer', textAlign: 'center',
                          fontSize: 11, fontWeight: 700, color: '#0f172a',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#0070f3'
                          ;(e.currentTarget as HTMLElement).style.background = '#eff6ff'
                        }}
                        onMouseLeave={e => {
                          (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1'
                          ;(e.currentTarget as HTMLElement).style.background = '#ffffff'
                        }}
                      >
                        {cred.role}
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}

            {/* ================= FORM 2: FREE CONSULTATION (EXACT MATCH TO SCREENSHOT) ================= */}
            {activeTab === 'consultation' && (
              <form onSubmit={handleConsultationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {leadSuccess && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#f0fdf4', border: '1px solid #bbf7d0',
                    borderRadius: 10, padding: '12px 14px',
                    color: '#16a34a', fontSize: 13, fontWeight: 600,
                  }}>
                    <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                    {leadSuccess}
                  </div>
                )}

                {leadError && (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    background: '#fef2f2', border: '1px solid #fecaca',
                    borderRadius: 10, padding: '10px 14px',
                    color: '#dc2626', fontSize: 13,
                  }}>
                    <AlertCircle size={16} style={{ flexShrink: 0 }} />
                    {leadError}
                  </div>
                )}

                {/* Full Name */}
                <input
                  type="text"
                  required
                  placeholder="Full Name*"
                  value={leadForm.name}
                  onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0070f3'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#cbd5e1'}
                />

                {/* PIN Code */}
                <input
                  type="text"
                  required
                  placeholder="PIN Code*"
                  value={leadForm.pinCode}
                  onChange={e => setLeadForm({ ...leadForm, pinCode: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0070f3'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#cbd5e1'}
                />

                {/* WhatsApp Number */}
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp Number*"
                  value={leadForm.mobile}
                  onChange={e => setLeadForm({ ...leadForm, mobile: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: 14,
                    outline: 'none',
                  }}
                  onFocus={e => (e.target as HTMLInputElement).style.borderColor = '#0070f3'}
                  onBlur={e => (e.target as HTMLInputElement).style.borderColor = '#cbd5e1'}
                />

                {/* Monthly Electricity Bill */}
                <select
                  value={leadForm.monthlyBill}
                  onChange={e => setLeadForm({ ...leadForm, monthlyBill: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    background: '#ffffff',
                    border: '1.5px solid #cbd5e1',
                    borderRadius: 10,
                    color: '#0f172a',
                    fontSize: 14,
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                  onFocus={e => (e.target as HTMLSelectElement).style.borderColor = '#0070f3'}
                  onBlur={e => (e.target as HTMLSelectElement).style.borderColor = '#cbd5e1'}
                >
                  <option value="₹1,500 - ₹3,000">Monthly Electricity Bill: ₹1,500 - ₹3,000 (2 kW)</option>
                  <option value="₹3,000 - ₹5,000">Monthly Electricity Bill: ₹3,000 - ₹5,000 (3 kW)</option>
                  <option value="₹5,000 - ₹10,000">Monthly Electricity Bill: ₹5,000 - ₹10,000 (5 kW)</option>
                  <option value="₹10,000+">Monthly Electricity Bill: ₹10,000+ (10 kW+)</option>
                </select>

                {/* Button matching the reference screenshot */}
                <button
                  type="submit"
                  disabled={leadLoading}
                  style={{
                    width: '100%',
                    background: '#0a1628',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: 10,
                    padding: '15px',
                    fontSize: 15,
                    fontWeight: 800,
                    cursor: leadLoading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    marginTop: 6,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#112240' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a1628' }}
                >
                  {leadLoading ? 'Booking Consultation...' : 'Book a FREE Consultation'}
                </button>
              </form>
            )}
          </div>

          {/* Footer note */}
          <div style={{
            marginTop: 18,
            paddingTop: 12,
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#94a3b8',
          }}>
            <span>🔒 Bank-grade 256-bit encryption</span>
            <Link href="/" style={{ color: '#0070f3', textDecoration: 'none', fontWeight: 600 }}>
              Back to Home →
            </Link>
          </div>
        </div>
      </div>

      {/* Responsive layout styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .auth-split-card {
            grid-template-columns: 1fr !important;
            max-width: 480px !important;
          }
          .auth-split-card > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#0a1628', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-dark" style={{ width: 40, height: 40 }} />
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}
