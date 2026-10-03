'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Sun, Phone, LogIn, Sparkles } from 'lucide-react'
import ConsultationModal from '@/components/public/ConsultationModal'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Main Dashboard', href: '/dashboard' },
  { label: 'Why Solar', href: '/#why-solar' },
  { label: 'Elevated Pergola', href: '/#elevated-pergola' },
  { label: 'Calculator', href: '/#calculator' },
  { label: 'Subsidy & Pricing', href: '/#pricing' },
  { label: 'Projects', href: '/projects' },
  { label: 'Reviews', href: '/reviews' },
]

export default function PublicNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [consultModalOpen, setConsultModalOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={`public-nav ${scrolled ? 'scrolled' : ''}`}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Brand Logo */}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{
              background: '#ffffff',
              borderRadius: 10,
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            }}>
              <img
                src="/images/logo.png"
                alt="Suraj Electric & Solar Logo"
                style={{ height: 34, width: 'auto', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 900, fontSize: 17, lineHeight: 1.15 }}>
                Suraj Electric &amp; Solar
              </div>
              <div style={{ color: '#ffd066', fontSize: 10, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
                Leader: Suraj Ghode
              </div>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="desktop-nav">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: 'rgba(255,255,255,0.85)',
                  textDecoration: 'none',
                  padding: '8px 12px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.color = 'white'
                  ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.85)'
                  ;(e.currentTarget as HTMLElement).style.background = 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Phone Support */}
            <a
              href="tel:+919000000001"
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                color: 'rgba(255,255,255,0.9)', textDecoration: 'none',
                fontSize: 12, fontWeight: 700,
              }}
              className="hide-mobile"
            >
              <Phone size={13} color="#f5a623" />
              +91 90000 00001
            </a>

            {/* Customer Sign Up */}
            <Link
              href="/signup"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: '#ffd066',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 800,
                padding: '7px 12px',
                borderRadius: 8,
                background: 'rgba(245,166,35,0.15)',
                border: '1px solid rgba(245,166,35,0.3)',
                transition: 'all 0.2s',
              }}
              className="hide-mobile"
            >
              <Sparkles size={13} /> Sign Up
            </Link>

            {/* Main Dashboard Link */}
            <Link
              href="/dashboard"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: '#ffffff',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 800,
                padding: '7px 12px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, #0070f3, #0050b3)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 2px 10px rgba(0,112,243,0.35)',
                transition: 'all 0.2s',
              }}
            >
              📊 Main Dashboard
            </Link>

            {/* Portal Login */}
            <Link
              href="/login"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                color: 'rgba(255,255,255,0.95)',
                textDecoration: 'none',
                fontSize: 12,
                fontWeight: 700,
                padding: '7px 12px',
                borderRadius: 8,
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)',
                transition: 'all 0.2s',
              }}
              className="hide-mobile"
            >
              <LogIn size={13} color="#f5a623" /> Login
            </Link>

            {/* Get Free Quote CTA button matching SolarSquare */}
            <button
              onClick={() => setConsultModalOpen(true)}
              style={{
                background: 'linear-gradient(135deg, #e8751a, #f5a623)',
                color: '#ffffff',
                border: 'none',
                borderRadius: 9,
                padding: '8px 14px',
                fontSize: 12,
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                boxShadow: '0 4px 16px rgba(232,117,26,0.35)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(232,117,26,0.5)'
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.transform = 'none'
                ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(232,117,26,0.35)'
              }}
            >
              <Sparkles size={14} /> Get Free Quote
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                background: 'rgba(255,255,255,0.1)', border: 'none',
                cursor: 'pointer', color: 'white', padding: 8,
                borderRadius: 8, display: 'none',
              }}
              className="mobile-toggle"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
          background: 'rgba(10,22,40,0.98)', backdropFilter: 'blur(8px)',
          display: 'flex', flexDirection: 'column',
          padding: '80px 24px 40px',
        }}>
          <button
            onClick={() => setMobileOpen(false)}
            style={{
              position: 'absolute', top: 20, right: 20,
              background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              color: 'white', padding: 8, borderRadius: 8,
            }}
          >
            <X size={24} />
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  color: 'white', textDecoration: 'none', fontSize: 16,
                  fontWeight: 600, padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              style={{
                color: '#f5a623', textDecoration: 'none', fontSize: 16,
                fontWeight: 700, padding: '12px 0', display: 'flex', alignItems: 'center', gap: 8,
              }}
            >
              <LogIn size={18} /> Employee / Worker Portal Login
            </Link>

            <button
              onClick={() => { setMobileOpen(false); setConsultModalOpen(true); }}
              style={{
                marginTop: 20,
                background: 'linear-gradient(135deg, #e8751a, #f5a623)',
                color: 'white', border: 'none', padding: '16px', borderRadius: 12,
                fontSize: 16, fontWeight: 800, cursor: 'pointer',
              }}
            >
              Book a Free Consultation
            </button>
          </div>
        </div>
      )}

      {/* Global Consultation Modal matching the user's reference screenshot */}
      <ConsultationModal
        isOpen={consultModalOpen}
        onClose={() => setConsultModalOpen(false)}
      />

      <style jsx>{`
        @media (max-width: 960px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: block !important; }
        }
      `}</style>
    </>
  )
}
