'use client'

import Link from 'next/link'
import {
  Users, FolderOpen, Calendar, Clock, Plus, ArrowRight,
  PhoneCall, CheckCircle, AlertCircle, FileText, CheckCircle2
} from 'lucide-react'

interface StaffDashboardProps {
  userName: string
}

export default function StaffDashboard({ userName }: StaffDashboardProps) {
  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: 'var(--gray-900)' }}>
          👋 Welcome back, {userName.split(' ')[0]}!
        </h1>
        <p style={{ color: 'var(--gray-500)', marginTop: 4 }}>
          Staff Operations Hub &amp; Customer Workflow
        </p>
      </div>

      {/* Highlights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
        <Link href="/dashboard/customers" style={{ textDecoration: 'none' }}>
          <div className="stat-card blue">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="stat-icon" style={{ background: 'rgba(59,130,246,0.12)' }}>
                <Users size={22} color="#3b82f6" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#3b82f6' }}>Active Directory</span>
            </div>
            <div className="stat-value">Customers</div>
            <div className="stat-label">Manage enquiries &amp; customer profiles</div>
          </div>
        </Link>

        <Link href="/dashboard/projects" style={{ textDecoration: 'none' }}>
          <div className="stat-card yellow">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="stat-icon" style={{ background: 'rgba(245,166,35,0.12)' }}>
                <FolderOpen size={22} color="#f5a623" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#f5a623' }}>Live Sites</span>
            </div>
            <div className="stat-value">Projects</div>
            <div className="stat-label">Track site visits &amp; installations</div>
          </div>
        </Link>

        <Link href="/dashboard/customers/new" style={{ textDecoration: 'none' }}>
          <div className="stat-card green">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="stat-icon" style={{ background: 'rgba(34,197,94,0.12)' }}>
                <Plus size={22} color="#22c55e" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>Quick Add</span>
            </div>
            <div className="stat-value">New Lead</div>
            <div className="stat-label">Register inbound customer enquiry</div>
          </div>
        </Link>

        <Link href="/calculator" target="_blank" style={{ textDecoration: 'none' }}>
          <div className="stat-card purple">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div className="stat-icon" style={{ background: 'rgba(139,92,246,0.12)' }}>
                <FileText size={22} color="#8b5cf6" />
              </div>
              <span style={{ fontSize: 12, fontWeight: 600, color: '#8b5cf6' }}>Sales Tool</span>
            </div>
            <div className="stat-value">Solar Calculator</div>
            <div className="stat-label">Estimate KW, cost &amp; savings for clients</div>
          </div>
        </Link>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Workflow Guide */}
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>
            📋 Daily Office Staff Checklist
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              {
                title: 'Review New Website Enquiries',
                desc: 'Check customer section for new inquiries submitted through website forms & solar calculator.',
                action: 'View Customers',
                href: '/dashboard/customers',
                icon: PhoneCall,
                color: '#3b82f6',
              },
              {
                title: 'Schedule Site Visits',
                desc: 'Coordinate with field technicians to schedule technical site measurements for qualified leads.',
                action: 'Check Projects',
                href: '/dashboard/projects',
                icon: Calendar,
                color: '#f5a623',
              },
              {
                title: 'Customer Follow-ups',
                desc: 'Follow up with customers whose quotes have been sent and clarify questions about subsidies.',
                action: 'Open Directory',
                href: '/dashboard/customers',
                icon: Clock,
                color: '#22c55e',
              },
            ].map((step, idx) => (
              <div key={idx} style={{
                display: 'flex', alignItems: 'flex-start', gap: 16,
                padding: '16px', background: 'var(--gray-50)', borderRadius: 12,
                border: '1px solid var(--gray-200)',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: `${step.color}15`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', flexShrink: 0
                }}>
                  <step.icon size={20} color={step.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                    {step.title}
                  </h4>
                  <p style={{ fontSize: 13, color: 'var(--gray-600)', lineHeight: 1.5, marginBottom: 10 }}>
                    {step.desc}
                  </p>
                  <Link href={step.href} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    fontSize: 13, fontWeight: 600, color: step.color, textDecoration: 'none'
                  }}>
                    {step.action} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Operations */}
        <div className="card">
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>
            ⚡ Quick Shortcuts
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <Link href="/dashboard/customers/new" style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
              background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)',
              textDecoration: 'none', color: 'var(--gray-800)', fontWeight: 600,
              transition: 'all 0.2s',
            }}>
              <Plus size={18} color="#3b82f6" />
              <span>Register New Customer</span>
            </Link>

            <Link href="/dashboard/projects/new" style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
              background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)',
              textDecoration: 'none', color: 'var(--gray-800)', fontWeight: 600,
              transition: 'all 0.2s',
            }}>
              <Plus size={18} color="#f5a623" />
              <span>Create New Project</span>
            </Link>

            <Link href="/calculator" target="_blank" style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
              background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)',
              textDecoration: 'none', color: 'var(--gray-800)', fontWeight: 600,
              transition: 'all 0.2s',
            }}>
              <FileText size={18} color="#22c55e" />
              <span>Run Solar Calculator</span>
            </Link>

            <Link href="/" target="_blank" style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '14px',
              background: 'white', borderRadius: 12, border: '1px solid var(--gray-200)',
              textDecoration: 'none', color: 'var(--gray-800)', fontWeight: 600,
              transition: 'all 0.2s',
            }}>
              <ArrowRight size={18} color="#8b5cf6" />
              <span>Visit Public Website</span>
            </Link>
          </div>

          <div style={{ marginTop: 24, padding: 16, background: 'rgba(245,166,35,0.08)', borderRadius: 12, border: '1px solid rgba(245,166,35,0.2)' }}>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>
              💡 Staff Tip
            </h4>
            <p style={{ fontSize: 12, color: 'var(--gray-600)', lineHeight: 1.5 }}>
              Always verify customer site address and expected KW before scheduling technical site visits.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
