'use client'

import Link from 'next/link'
import { MessageCircle, ShieldCheck, Sparkles } from 'lucide-react'

interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

export default function DashboardHeader({ title, subtitle, children }: DashboardHeaderProps) {
  return (
    <div style={{
      marginBottom: 24,
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
      background: '#ffffff',
      padding: '20px 24px',
      borderRadius: 18,
      border: '1px solid #e2e8f0',
      boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
    }}>
      <div>
        {/* Brand bar above page title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{
            background: '#ffffff',
            borderRadius: 8,
            padding: '3px 8px',
            display: 'inline-flex',
            alignItems: 'center',
            border: '1px solid #e2e8f0',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
          }}>
            <img src="/images/logo.png" alt="Suraj Electric & Solar" style={{ height: 24, width: 'auto' }} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 900, color: '#0a1628', letterSpacing: '-0.01em' }}>
            Suraj Electric &amp; Solar
          </span>
          <span style={{
            fontSize: 11,
            color: '#ea580c',
            fontWeight: 800,
            background: 'rgba(234,88,12,0.1)',
            padding: '2px 8px',
            borderRadius: 12,
            letterSpacing: '0.02em',
          }}>
            Leader: Suraj Ghode
          </span>
          <span style={{
            fontSize: 11,
            color: '#16a34a',
            fontWeight: 700,
            background: 'rgba(34,197,94,0.1)',
            padding: '2px 8px',
            borderRadius: 12,
          }}>
            PM Surya Ghar Certified
          </span>
        </div>

        {title && (
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
            {title}
          </h1>
        )}
        {subtitle && (
          <p style={{ color: '#64748b', fontSize: 13, margin: 0 }}>
            {subtitle}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {children}
        <a
          href="https://wa.me/919000000001?text=Hello%20Suraj%20Ghode,%20inquiry%20from%20portal."
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '8px 14px',
            borderRadius: 10,
            background: '#25d366',
            color: 'white',
            fontSize: 12,
            fontWeight: 700,
            textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(37,211,102,0.25)',
          }}
        >
          <MessageCircle size={14} /> WhatsApp Suraj
        </a>
      </div>
    </div>
  )
}
