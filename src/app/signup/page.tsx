'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Phone, Lock, Eye, EyeOff, AlertCircle, CheckCircle2,
  Sun, ArrowRight, ShieldCheck, Zap, User, MapPin, Sparkles, Building
} from 'lucide-react'
import { registerCustomer } from '@/app/actions/auth'

function SignupForm() {
  const router = useRouter()

  const [form, setForm] = useState({
    name: '',
    mobile: '',
    password: '',
    city: 'Pune',
    address: '',
    monthlyBill: '₹3,000 - ₹5,000',
  })

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (form.mobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.')
      setLoading(false)
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      setLoading(false)
      return
    }

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('mobile', form.mobile)
    formData.append('password', form.password)
    formData.append('city', form.city)
    formData.append('address', form.address)
    formData.append('monthlyBill', form.monthlyBill)

    const res = await registerCustomer(formData)

    if (!res.success) {
      setError(res.error || 'Failed to create account. Please try again.')
      setLoading(false)
      return
    }

    setSuccess('🎉 Account created successfully! Logging you in...')

    // Auto sign-in
    const loginRes = await signIn('credentials', {
      mobile: form.mobile,
      password: form.password,
      redirect: false,
    })

    setLoading(false)

    if (loginRes?.error) {
      // If auto-signin fails, redirect to login page
      router.push('/login?registered=true')
    } else {
      router.push('/dashboard')
      router.refresh()
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
        width: 420, height: 420, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,112,243,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main split container */}
      <div style={{
        maxWidth: 1040,
        width: '100%',
        background: '#ffffff',
        borderRadius: 28,
        boxShadow: '0 25px 60px -15px rgba(0,0,0,0.5)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '1.05fr 1fr',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* LEFT COLUMN: Visual & Value Proposition */}
        <div style={{
          position: 'relative',
          background: 'linear-gradient(180deg, rgba(10,22,40,0.4) 0%, rgba(10,22,40,0.95) 100%)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '36px 32px',
          color: '#ffffff',
          overflow: 'hidden',
          minHeight: 560,
        }}>
          {/* Background image */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 0,
            backgroundImage: "url('/images/solar-family-rooftop.jpg')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.78)',
          }} />

          {/* Dark gradient overlay */}
          <div style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(to bottom, rgba(10,22,40,0.45) 0%, rgba(10,22,40,0.7) 40%, rgba(10,22,40,0.96) 100%)',
          }} />

          {/* Top Brand & Badges */}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                background: '#ffffff',
                padding: '6px 12px',
                borderRadius: 12,
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 4px 14px rgba(0,0,0,0.18)',
              }}>
                <img
                  src="/images/logo.png"
                  alt="Suraj Electric & Solar"
                  style={{ height: 42, width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16, color: '#ffffff', letterSpacing: '0.02em', lineHeight: 1.1 }}>
                  Suraj Electric &amp; Solar
                </div>
                <div style={{ fontSize: 11, color: '#ffd066', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Leader: Suraj Ghode
                </div>
              </div>
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(245,166,35,0.25)',
              border: '1px solid rgba(245,166,35,0.4)',
              color: '#ffd066',
              padding: '6px 14px',
              borderRadius: 30,
              fontSize: 12,
              fontWeight: 800,
              backdropFilter: 'blur(8px)',
            }}>
              <Sparkles size={14} /> PM Surya Ghar Muft Bijli Yojana
            </div>
          </div>

          {/* Bottom Value Pitch */}
          <div style={{ position: 'relative', zIndex: 2, marginTop: 'auto' }}>
            <h2 style={{
              fontSize: 'clamp(24px, 2.5vw, 32px)',
              fontWeight: 900,
              lineHeight: 1.25,
              marginBottom: 12,
              color: '#ffffff',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)',
            }}>
              Join 500+ Happy Homes with <span style={{ color: '#ffd066' }}>Zero Electricity Bills</span>
            </h2>

            <p style={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.9)',
              marginBottom: 20,
              textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            }}>
              Create your customer account to track your rooftop solar journey, explore completed installation photos, and calculate your exact savings.
            </p>

            {/* Feature pills */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '10px 12px',
                backdropFilter: 'blur(6px)',
              }}>
                <div style={{ fontSize: 11, color: '#ffd066', fontWeight: 800 }}>DIRECT SUBSIDY</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>Up to ₹78,000 Govt. Aid</div>
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: 12,
                padding: '10px 12px',
                backdropFilter: 'blur(6px)',
              }}>
                <div style={{ fontSize: 11, color: '#ffd066', fontWeight: 800 }}>TERRACE PERGOLA</div>
                <div style={{ fontSize: 13, fontWeight: 700 }}>100% Usable Rooftop Space</div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Customer Registration Form */}
        <div style={{
          padding: '36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#ffffff',
        }}>
          {/* Header */}
          <div style={{ marginBottom: 24 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: '#0070f3',
              display: 'block',
              marginBottom: 4,
            }}>
              Customer Registration
            </span>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 6px' }}>
              Create Customer Account
            </h1>
            <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
              Access your personalized solar portal, site photos &amp; live project tracker.
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 12,
              background: '#fef2f2', border: '1px solid #fecaca',
              color: '#dc2626', fontSize: 13, marginBottom: 16,
            }}>
              <AlertCircle size={16} flex-shrink="0" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 12,
              background: '#f0fdf4', border: '1px solid #bbf7d0',
              color: '#16a34a', fontSize: 13, marginBottom: 16,
            }}>
              <CheckCircle2 size={16} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {/* Full Name */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Full Name *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patil"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 40px',
                    borderRadius: 12,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#0070f3')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            </div>

            {/* Mobile / User ID */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Mobile Number (Your User ID for Login) *
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 700, color: '#64748b' }}>
                  +91
                </span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={form.mobile}
                  onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 48px',
                    borderRadius: 12,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 14,
                    fontWeight: 600,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#0070f3')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                Create Password *
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#94a3b8" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '11px 42px 11px 40px',
                    borderRadius: 12,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 14,
                    outline: 'none',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={e => (e.target.style.borderColor = '#0070f3')}
                  onBlur={e => (e.target.style.borderColor = '#e2e8f0')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute', right: 12, top: '50%',
                    transform: 'translateY(-50%)', background: 'none',
                    border: 'none', cursor: 'pointer', color: '#94a3b8',
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* City / Area & Monthly Bill Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  City / Location
                </label>
                <div style={{ position: 'relative' }}>
                  <MapPin size={15} color="#94a3b8" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="text"
                    placeholder="e.g. Pune, Kothrud"
                    value={form.city}
                    onChange={e => setForm({ ...form, city: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 34px',
                      borderRadius: 10,
                      border: '1.5px solid #e2e8f0',
                      fontSize: 13,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', marginBottom: 6 }}>
                  Monthly Bill (Approx)
                </label>
                <select
                  value={form.monthlyBill}
                  onChange={e => setForm({ ...form, monthlyBill: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: 10,
                    border: '1.5px solid #e2e8f0',
                    fontSize: 13,
                    background: '#ffffff',
                    outline: 'none',
                  }}
                >
                  <option value="₹1,500 - ₹3,000">₹1,500 - ₹3,000</option>
                  <option value="₹3,000 - ₹5,000">₹3,000 - ₹5,000</option>
                  <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000</option>
                  <option value="₹10,000+">₹10,000+</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 6,
                background: 'linear-gradient(135deg, #0070f3 0%, #0051b3 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                padding: '13px',
                fontSize: 15,
                fontWeight: 800,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(0,112,243,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'all 0.2s',
              }}
            >
              {loading ? 'Creating Your Account...' : (
                <>
                  Register &amp; Open Customer Portal <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Already have an account */}
          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 13, color: '#64748b' }}>
            Already have an account?{' '}
            <Link
              href="/login"
              style={{ color: '#0070f3', fontWeight: 800, textDecoration: 'none' }}
            >
              Sign In with Mobile &amp; Password
            </Link>
          </div>

          <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9', textAlign: 'center' }}>
            <Link
              href="/"
              style={{ color: '#94a3b8', fontSize: 12, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}
            >
              ← Return to Suraj Electric &amp; Solar Public Homepage
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff' }}>Loading...</div>}>
      <SignupForm />
    </Suspense>
  )
}
