'use client'

import { useState } from 'react'
import { X, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react'
import { submitConsultationLead } from '@/app/actions/lead'

interface ConsultationModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [form, setForm] = useState({
    name: '',
    pinCode: '',
    mobile: '',
    monthlyBill: '₹3,000 - ₹5,000',
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const formData = new FormData()
    formData.append('name', form.name)
    formData.append('pinCode', form.pinCode)
    formData.append('mobile', form.mobile)
    formData.append('monthlyBill', form.monthlyBill)

    const res = await submitConsultationLead(formData)
    setLoading(false)

    if (res.success) {
      setSuccess('🎉 Consultation booked! Our solar engineer will call you shortly.')
      setForm({ name: '', pinCode: '', mobile: '', monthlyBill: '₹3,000 - ₹5,000' })
      setTimeout(() => {
        onClose()
        setSuccess('')
      }, 3000)
    } else {
      setError(res.error || 'Failed to submit. Please try again.')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      background: 'rgba(10, 22, 40, 0.75)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 16px',
    }}>
      {/* Background click to dismiss */}
      <div style={{ position: 'absolute', inset: 0 }} onClick={onClose} />

      {/* Modal Card matching the user's reference image */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        width: '100%',
        maxWidth: 920,
        background: '#ffffff',
        borderRadius: 24,
        boxShadow: '0 25px 70px -10px rgba(0, 0, 0, 0.5)',
        display: 'grid',
        gridTemplateColumns: '1fr 1.15fr',
        overflow: 'hidden',
        animation: 'modalSlideUp 0.25s ease-out',
      }} className="consultation-modal-card">

        {/* Left Side: Family Photo under Solar Pergola */}
        <div style={{
          position: 'relative',
          padding: 16,
          background: '#f8fafc',
          display: 'flex',
        }}>
          <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            minHeight: 440,
            borderRadius: 18,
            overflow: 'hidden',
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
            {/* Overlay badge */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '24px 18px 18px',
              background: 'linear-gradient(to top, rgba(10,22,40,0.92) 0%, transparent 100%)',
              color: 'white',
            }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'rgba(245,166,35,0.25)',
                color: '#ffd066',
                padding: '3px 8px',
                borderRadius: 20,
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 6,
              }}>
                <ShieldCheck size={13} /> PM SURYA GHAR SUBSIDY
              </div>
              <h4 style={{ fontSize: 16, fontWeight: 800, color: 'white', margin: 0 }}>
                Up to ₹78,000 Govt. Subsidy
              </h4>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2, margin: 0 }}>
                100% usable rooftop with wind-proof elevated pergola.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Form matching screenshot */}
        <div style={{
          padding: '36px 36px 32px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
        }}>
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute',
              top: 18,
              right: 18,
              width: 32,
              height: 32,
              borderRadius: '50%',
              border: 'none',
              background: '#f1f5f9',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s',
            }}
          >
            <X size={18} />
          </button>

          <div>
            {/* Title & subtitle */}
            <div style={{ paddingRight: 32, marginBottom: 8 }}>
              <h2 style={{
                fontSize: 26,
                fontWeight: 900,
                color: '#0f172a',
                lineHeight: 1.25,
                margin: 0,
              }}>
                Switch to solar at{' '}
                <span style={{ color: '#0070f3', fontWeight: 900 }}>0 Investment</span>
              </h2>
              <p style={{
                color: '#64748b',
                fontSize: 13,
                marginTop: 6,
                lineHeight: 1.4,
              }}>
                Govt. subsidy covers your down payment, savings cover EMIs
              </p>
            </div>

            {/* Blue highlight text */}
            <div style={{
              fontSize: 14,
              fontWeight: 700,
              color: '#1e3a8a',
              marginBottom: 20,
            }}>
              Book a free consultation &amp; save up to{' '}
              <span style={{ color: '#0070f3', fontWeight: 800 }}>₹78,000</span>
            </div>

            {/* Alert messages */}
            {success && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#f0fdf4', border: '1px solid #bbf7d0',
                borderRadius: 10, padding: '12px 14px',
                color: '#16a34a', fontSize: 13, fontWeight: 600,
                marginBottom: 16,
              }}>
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                {success}
              </div>
            )}

            {error && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 10, padding: '10px 14px',
                color: '#dc2626', fontSize: 13,
                marginBottom: 16,
              }}>
                <AlertCircle size={16} style={{ flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Form Fields matching the screenshot */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Full Name* */}
              <input
                type="text"
                required
                placeholder="Full Name*"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
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

              {/* PIN Code* */}
              <input
                type="text"
                required
                placeholder="PIN Code*"
                value={form.pinCode}
                onChange={e => setForm({ ...form, pinCode: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
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

              {/* WhatsApp Number* */}
              <input
                type="tel"
                required
                placeholder="WhatsApp Number*"
                value={form.mobile}
                onChange={e => setForm({ ...form, mobile: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
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

              {/* Monthly Electricity Bill* */}
              <select
                value={form.monthlyBill}
                onChange={e => setForm({ ...form, monthlyBill: e.target.value })}
                style={{
                  width: '100%',
                  padding: '14px 16px',
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
                <option value="Monthly Electricity Bill*">Monthly Electricity Bill*</option>
                <option value="₹1,500 - ₹3,000">₹1,500 - ₹3,000 (Recommended: 2 kW)</option>
                <option value="₹3,000 - ₹5,000">₹3,000 - ₹5,000 (Recommended: 3 kW)</option>
                <option value="₹5,000 - ₹10,000">₹5,000 - ₹10,000 (Recommended: 5 kW)</option>
                <option value="₹10,000+">₹10,000+ (Recommended: 10 kW+)</option>
              </select>

              {/* Dark Navy Button exactly matching screenshot */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  background: '#0a1628',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: 10,
                  padding: '16px',
                  fontSize: 15,
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  marginTop: 6,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#112240' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#0a1628' }}
              >
                {loading ? 'Submitting...' : 'Book a FREE Consultation'}
              </button>
            </form>
          </div>

          <div style={{
            marginTop: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12,
            color: '#94a3b8',
          }}>
            <span>🔒 100% Privacy. No Spam.</span>
            <span>⏱️ 24h Site Visit Callback</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @media (max-width: 768px) {
          .consultation-modal-card {
            grid-template-columns: 1fr !important;
            max-width: 480px !important;
          }
          .consultation-modal-card > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  )
}
