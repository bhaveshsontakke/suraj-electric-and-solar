'use client'

import Link from 'next/link'
import { Sun, Phone, Mail, MapPin } from 'lucide-react'

export default function PublicFooter() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'rgba(255,255,255,0.7)', paddingTop: 64 }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 48, paddingBottom: 48 }}>

          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                background: '#ffffff',
                borderRadius: 12,
                padding: '6px 12px',
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              }}>
                <img
                  src="/images/logo.png"
                  alt="Suraj Electric & Solar"
                  style={{ height: 38, width: 'auto', objectFit: 'contain' }}
                />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 900, fontSize: 17, lineHeight: 1.15 }}>Suraj Electric &amp; Solar</div>
                <div style={{ color: '#ffd066', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 700 }}>
                  Founder: Suraj Ghode
                </div>
              </div>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.7, marginBottom: 20, maxWidth: 260 }}>
              Leading residential elevated pergolas and commercial rooftop solar across Maharashtra. Engineered by Suraj Ghode with PM Surya Ghar ₹78,000 direct subsidy.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { name: 'Facebook', svg: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
                { name: 'Instagram', svg: <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0122 6.5v11a4.5 4.5 0 01-4.5 4.5h-11A4.5 4.5 0 012 17.5v-11A4.5 4.5 0 016.5 2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
                { name: 'YouTube', svg: <path d="M22.54 6.42a2.78 2.78 0 00-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 00-1.94 2A29 29 0 001 11.75a29 29 0 00.46 5.33A2.78 2.78 0 003.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 001.94-2 29 29 0 00.46-5.25 29 29 0 00-.46-5.43zM9.75 15.02l5.75-3.27-5.75-3.27v6.54z" fill="currentColor" /> },
                { name: 'Twitter', svg: <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /> },
              ].map((item, i) => (
                <a key={i} href="#" aria-label={item.name} style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'rgba(255,255,255,0.6)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(245,166,35,0.2)'; (e.currentTarget as HTMLElement).style.color = '#f5a623'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.6)'; }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill={item.svg.props.fill || 'currentColor'}>
                    {item.svg}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Quick Links</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Home', href: '/' },
                { label: 'About Us', href: '/about' },
                { label: 'Our Services', href: '/services' },
                { label: 'Projects', href: '/projects' },
                { label: 'Solar Calculator', href: '/calculator' },
                { label: 'Customer Reviews', href: '/reviews' },
                { label: 'FAQ', href: '/faq' },
                { label: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <Link key={link.href} href={link.href} style={{
                  color: 'rgba(255,255,255,0.6)', textDecoration: 'none', fontSize: 14,
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => (e.target as HTMLElement).style.color = '#f5a623'}
                  onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.6)'}
                >
                  → {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Our Services</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                'Residential Solar Installation',
                'Commercial Solar Systems',
                'Industrial Solar Plants',
                'On-Grid Solar Systems',
                'Off-Grid Solar Systems',
                'Solar Maintenance',
                'Solar AMC',
                'Net Metering Support',
              ].map((service) => (
                <span key={service} style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>
                  ☀ {service}
                </span>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ color: 'white', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Contact Suraj Ghode</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <a href="tel:+919000000001" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14 }}>
                <Phone size={16} style={{ marginTop: 2, color: '#f5a623', flexShrink: 0 }} />
                <span>+91 90000 00001<br /><span style={{ fontSize: 12, opacity: 0.6 }}>Direct Hotline • Suraj Ghode</span></span>
              </a>
              <a href="mailto:suraj@surajelectricandsolar.com" style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(255,255,255,0.85)', textDecoration: 'none', fontSize: 14 }}>
                <Mail size={16} style={{ marginTop: 2, color: '#f5a623', flexShrink: 0 }} />
                suraj@surajelectricandsolar.com
              </a>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                <MapPin size={16} style={{ marginTop: 2, color: '#f5a623', flexShrink: 0 }} />
                <span>Baner Road, Pune, Maharashtra - 411045</span>
              </div>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919000000001?text=Hello%20Suraj%20Ghode,%20I%20am%20interested%20in%20a%20solar%20installation."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  background: '#25d366', color: 'white',
                  padding: '10px 16px', borderRadius: 10,
                  fontSize: 14, fontWeight: 700, textDecoration: 'none',
                  marginTop: 6,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Suraj
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          padding: '20px 0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
        }}>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            © 2026 Suraj Electric &amp; Solar. Founded &amp; Operated by Suraj Ghode. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item) => (
              <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.4)'}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
