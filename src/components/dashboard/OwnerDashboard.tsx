'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Users, FolderOpen, CreditCard, Receipt, Package, Briefcase,
  FileText, AlertTriangle, TrendingUp, TrendingDown, ArrowRight,
  Plus, ClipboardList, BarChart3, Clock, CheckCircle, XCircle,
  Activity, Eye, Sparkles, ShieldCheck, Camera, Info, ExternalLink,
  MessageCircle, MapPin, Layers, HardHat, Zap,
} from 'lucide-react'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteAuditLog, clearAllAuditLogs } from '@/app/actions/delete'

interface DashboardStats {
  totalCustomers: number
  newEnquiries: number
  activeProjects: number
  completedProjects: number
  totalSales: number
  paymentReceived: number
  paymentPending: number
  totalWorkers: number
  pendingReports: number
  lowStockItems: number
  monthlyPayments: number
  monthlyExpenses: number
  recentActivity: Array<{ id: string; user: string; action: string; entity: string; time: string }>
}

function StatCard({
  title, value, subtitle, icon: Icon, colorClass, href, trend
}: {
  title: string; value: string | number; subtitle?: string;
  icon: React.ElementType; colorClass: string; href?: string; trend?: 'up' | 'down'
}) {
  const card = (
    <div className={`stat-card ${colorClass}`} style={{ cursor: href ? 'pointer' : 'default' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div className="stat-icon" style={{
          background: colorClass === 'yellow' ? 'rgba(245,166,35,0.12)' :
            colorClass === 'green' ? 'rgba(34,197,94,0.12)' :
            colorClass === 'blue' ? 'rgba(59,130,246,0.12)' :
            colorClass === 'purple' ? 'rgba(139,92,246,0.12)' :
            'rgba(239,68,68,0.12)'
        }}>
          <Icon size={22} color={
            colorClass === 'yellow' ? '#f5a623' :
            colorClass === 'green' ? '#22c55e' :
            colorClass === 'blue' ? '#3b82f6' :
            colorClass === 'purple' ? '#8b5cf6' :
            '#ef4444'
          } />
        </div>
        {trend && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: trend === 'up' ? '#22c55e' : '#ef4444' }}>
            {trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            <span>vs last month</span>
          </div>
        )}
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{title}</div>
      {subtitle && <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 4 }}>{subtitle}</div>}
    </div>
  )

  if (href) return <Link href={href} style={{ textDecoration: 'none' }}>{card}</Link>
  return card
}

function QuickAction({ href, icon: Icon, label, color }: { href: string; icon: React.ElementType; label: string; color: string }) {
  return (
    <Link href={href} style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      padding: '16px 12px', background: 'white', borderRadius: 14,
      border: '1px solid var(--gray-200)', textDecoration: 'none',
      transition: 'all 0.2s', textAlign: 'center',
    }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'none' }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color={color} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)' }}>{label}</span>
    </Link>
  )
}

export default function OwnerDashboard({ stats, userName }: { stats: DashboardStats; userName: string }) {
  const [activeTab, setActiveTab] = useState<'erp' | 'sites' | 'guide'>('erp')
  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`
  const estimatedProfit = stats.paymentReceived - stats.monthlyExpenses

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>

      {/* ========================================================================= */}
      {/* 1. HIGH-IMPACT HERO: SURAJ ELECTRIC & SOLAR WITH SURAJ GHODE LEADERSHIP     */}
      {/* ========================================================================= */}
      <div style={{
        background: 'linear-gradient(135deg, #060e1a 0%, #0d2242 45%, #153b75 100%)',
        borderRadius: 24,
        padding: '32px 30px',
        color: '#ffffff',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 15px 40px rgba(6, 14, 26, 0.35)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        {/* Glow Accents */}
        <div style={{
          position: 'absolute', top: -50, right: -50, width: 340, height: 340,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245, 166, 35, 0.22) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -50, left: '20%', width: 260, height: 260,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(0, 112, 243, 0.2) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 24 }}>
          {/* Brand Identity & Title */}
          <div style={{ maxWidth: 640 }}>
            {/* Logo Badge & Tags */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
              <div style={{
                background: '#ffffff',
                padding: '6px 14px',
                borderRadius: 14,
                display: 'inline-flex',
                alignItems: 'center',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                border: '2px solid rgba(255,255,255,0.85)',
              }}>
                <img
                  src="/images/logo.png"
                  alt="Suraj Electric & Solar"
                  style={{ height: 42, width: 'auto', objectFit: 'contain' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'rgba(245, 166, 35, 0.22)',
                  border: '1px solid rgba(245, 166, 35, 0.4)',
                  color: '#ffd066',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  width: 'fit-content',
                }}>
                  <ShieldCheck size={13} /> PM Surya Ghar Certified EPC Partner
                </div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>
                  Maharashtra Operations • Pune, MIDC &amp; Regional Sites
                </div>
              </div>
            </div>

            {/* Prominent Name */}
            <h1 style={{
              fontSize: 'clamp(26px, 3vw, 36px)',
              fontWeight: 900,
              color: '#ffffff',
              margin: '0 0 6px',
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
            }}>
              Suraj Electric &amp; Solar
            </h1>

            <p style={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.85)',
              lineHeight: 1.6,
              margin: 0,
            }}>
              Founded &amp; Managed by <strong>Suraj Ghode</strong>. Complete Solar Business Operations, Client Registration Portal &amp; High-Yield Rooftop Pergola Installation Hub.
            </p>
          </div>

          {/* Quick Launch & Contact Buttons */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.07)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: 18,
            padding: '18px 22px',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            minWidth: 260,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#ffd066', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                👑 Managing Director
              </span>
              <span style={{ fontSize: 11, color: '#4ade80', fontWeight: 700 }}>● Online</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 900 }}>Suraj Ghode</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <Link
                href="/dashboard?view=customer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  background: 'linear-gradient(135deg, #f5a623 0%, #ea580c 100%)',
                  color: '#ffffff',
                  padding: '10px 16px',
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: 800,
                  textDecoration: 'none',
                  boxShadow: '0 4px 14px rgba(245, 166, 35, 0.3)',
                }}
              >
                <Eye size={15} /> Preview Customer Portal
              </Link>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <a
                  href="https://wa.me/919000000001?text=Hello%20Suraj%20Ghode,%20admin%20quick%20ping."
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: '#25d366',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <Link
                  href="/signup"
                  target="_blank"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                    padding: '8px 10px',
                    borderRadius: 8,
                    background: 'rgba(255,255,255,0.14)',
                    color: '#ffffff',
                    fontSize: 12,
                    fontWeight: 700,
                    textDecoration: 'none',
                    border: '1px solid rgba(255,255,255,0.25)',
                  }}
                >
                  <Plus size={14} /> Sign-Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. THREE DYNAMIC VIEW TABS                                                */}
      {/* ========================================================================= */}
      <div style={{
        display: 'flex',
        background: '#f1f5f9',
        borderRadius: 16,
        padding: 6,
        marginBottom: 24,
        gap: 6,
        overflowX: 'auto',
      }}>
        {[
          { id: 'erp', label: '📊 Business Operations & ERP', icon: BarChart3 },
          { id: 'sites', label: '📸 Real Work & Site Showcase (Customer View)', icon: Camera },
          { id: 'guide', label: '📘 How Website & Company Works', icon: Info },
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
              padding: '12px 18px',
              borderRadius: 12,
              border: 'none',
              fontSize: 14,
              fontWeight: 800,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s',
              background: activeTab === tab.id ? '#ffffff' : 'transparent',
              color: activeTab === tab.id ? '#0f172a' : '#64748b',
              boxShadow: activeTab === tab.id ? '0 4px 14px rgba(0,0,0,0.06)' : 'none',
            }}
          >
            <tab.icon size={16} color={activeTab === tab.id ? '#0070f3' : '#94a3b8'} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: BUSINESS OPERATIONS & ERP OVERVIEW                                */}
      {/* ========================================================================= */}
      {activeTab === 'erp' && (
        <>
          {/* Main Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: 16, marginBottom: 28 }}>
            <StatCard title="Total Customers" value={stats.totalCustomers} subtitle={`${stats.newEnquiries} new enquiries`} icon={Users} colorClass="blue" href="/dashboard/customers" trend="up" />
            <StatCard title="Active Projects" value={stats.activeProjects} subtitle={`${stats.completedProjects} completed`} icon={FolderOpen} colorClass="yellow" href="/dashboard/projects" />
            <StatCard title="Total Sales" value={formatCur(stats.totalSales)} icon={TrendingUp} colorClass="green" href="/dashboard/payments" />
            <StatCard title="Payment Received" value={formatCur(stats.paymentReceived)} icon={CreditCard} colorClass="green" href="/dashboard/payments" />
            <StatCard title="Payment Pending" value={formatCur(stats.paymentPending)} icon={AlertTriangle} colorClass="red" href="/dashboard/payments" />
            <StatCard title="Total Workers" value={stats.totalWorkers} icon={Briefcase} colorClass="purple" href="/dashboard/workers" />
            {stats.pendingReports > 0 && (
              <StatCard title="Pending Reports" value={stats.pendingReports} subtitle="Need review" icon={ClipboardList} colorClass="yellow" href="/dashboard/reports" />
            )}
            {stats.lowStockItems > 0 && (
              <StatCard title="Low Stock Items" value={stats.lowStockItems} subtitle="Need reorder" icon={Package} colorClass="red" href="/dashboard/materials" />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, marginBottom: 28 }}>
            {/* Monthly Summary */}
            <div className="card">
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20, color: 'var(--gray-900)' }}>
                📊 Monthly Financial Performance
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Payments Collected', value: formatCur(stats.monthlyPayments), color: '#22c55e', icon: '💰' },
                  { label: 'Operational Expenses', value: formatCur(stats.monthlyExpenses), color: '#ef4444', icon: '📤' },
                  { label: 'Net Profit Estimate', value: formatCur(Math.max(0, estimatedProfit)), color: estimatedProfit >= 0 ? '#22c55e' : '#ef4444', icon: '📈' },
                ].map(item => (
                  <div key={item.label} style={{ background: 'var(--gray-50)', borderRadius: 14, padding: '16px' }}>
                    <div style={{ fontSize: 24 }}>{item.icon}</div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: item.color, margin: '6px 0 4px' }}>{item.value}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>{item.label}</div>
                  </div>
                ))}
              </div>

              {/* Progress bars for projects */}
              <div style={{ marginTop: 22 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-600)', fontWeight: 600 }}>Total Revenue Collection Rate</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: '#0070f3' }}>
                    {stats.totalSales > 0 ? Math.round((stats.paymentReceived / stats.totalSales) * 100) : 0}%
                  </span>
                </div>
                <div className="progress-bar" style={{ height: 10 }}>
                  <div className="progress-fill" style={{ width: `${stats.totalSales > 0 ? Math.min(100, (stats.paymentReceived / stats.totalSales) * 100) : 0}%` }} />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 16, color: 'var(--gray-900)' }}>⚡ Operations Shortcuts</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <QuickAction href="/dashboard/customers/new" icon={Users} label="New Customer" color="#3b82f6" />
                <QuickAction href="/dashboard/projects/new" icon={FolderOpen} label="New Project" color="#f5a623" />
                <QuickAction href="/dashboard/payments/new" icon={CreditCard} label="Add Payment" color="#22c55e" />
                <QuickAction href="/dashboard/purchases/new" icon={Package} label="Add Purchase" color="#8b5cf6" />
                <QuickAction href="/dashboard/expenses/new" icon={Receipt} label="Add Expense" color="#ef4444" />
                <QuickAction href="/dashboard/quotations/new" icon={FileText} label="New Quotation" color="#f59e0b" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', margin: 0 }}>🕐 Real-Time Business Activity</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {stats.recentActivity.length > 0 && (
                  <RemoveAllButton
                    entityName="Activity Logs"
                    onRemoveAll={clearAllAuditLogs}
                    totalCount={stats.recentActivity.length}
                    label="Clear All Activity"
                  />
                )}
                <Link href="/dashboard/audit-log" style={{ color: '#f5a623', textDecoration: 'none', fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 4 }}>
                  View all <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {stats.recentActivity.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Activity size={40} /></div>
                <div className="empty-state-title">No activity yet</div>
                <div className="empty-state-desc">Activity will appear here as the system is used.</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {stats.recentActivity.map((activity, i) => (
                  <div key={activity.id} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14,
                    padding: '12px 0',
                    borderBottom: i < stats.recentActivity.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, flex: 1 }}>
                      <div style={{
                        width: 36, height: 36, borderRadius: '50%',
                        background: 'rgba(245,166,35,0.12)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Activity size={16} color="#f5a623" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.4, margin: 0 }}>
                          <strong>{activity.user}</strong> {activity.action} on <strong>{activity.entity}</strong>
                        </p>
                        <p style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2, margin: 0 }}>
                          {new Date(activity.time).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>

                    <DeleteRowButton
                      id={activity.id}
                      name={`Activity: ${activity.action}`}
                      onDelete={deleteAuditLog}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

        </>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: REAL WORK & COMPLETED SITES SHOWCASE (WHAT CUSTOMERS SEE)         */}
      {/* ========================================================================= */}
      {activeTab === 'sites' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0 }}>
                  📸 Real Rooftop Sites Executed by Suraj Electric &amp; Solar
                </h2>
                <p style={{ color: '#64748b', fontSize: 13, marginTop: 4, margin: 0 }}>
                  Verified photos of our elevated pergolas, commercial installations, and client reviews presented to customers.
                </p>
              </div>
              <Link
                href="/dashboard/gallery"
                className="btn btn-primary btn-sm"
                style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Plus size={14} /> Upload New Site Photo
              </Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
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
                  <div style={{ position: 'relative', height: 200, overflow: 'hidden' }}>
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

                  <div style={{ padding: 16 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
                      {site.title}
                    </h3>
                    <div style={{ fontSize: 12, color: '#64748b', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <MapPin size={13} color="#ea580c" />
                      <span>{site.loc}</span>
                    </div>
                    <div style={{ fontSize: 11, color: '#0070f3', background: '#eff6ff', padding: '6px 8px', borderRadius: 6, fontWeight: 700 }}>
                      ⚡ {site.specs}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 3: HOW WEBSITE & COMPANY WORKS (GUIDE)                               */}
      {/* ========================================================================= */}
      {activeTab === 'guide' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>
              ⚡ How Suraj Electric &amp; Solar Works (The SolarSquare Model)
            </h2>
            <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6, marginBottom: 28 }}>
              Our complete 5-stage engineering delivery pipeline designed by <strong>Suraj Ghode</strong>, from lead capture to final grid synchronization.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18 }}>
              {[
                {
                  step: '01',
                  title: 'Free 3D Roof Shadow Analysis',
                  desc: 'Precision LiDAR survey by Suraj Ghode’s engineers to map shadow patterns, tilt angle, and azimuth for maximum solar irradiation.',
                  icon: Layers,
                  color: '#0070f3',
                },
                {
                  step: '02',
                  title: 'PM Surya Ghar Subsidy Sanction',
                  desc: 'Direct central subsidy processing on the national portal (up to ₹78,000) deposited straight to the customer’s bank account.',
                  icon: ShieldCheck,
                  color: '#22c55e',
                },
                {
                  step: '03',
                  title: 'Elevated Pergola Canopy (24h)',
                  desc: 'High-tensile Hot Dip Galvanized structure (7-10ft elevation). 100% usable rooftop terrace with wind resilience tested for 170 km/h.',
                  icon: HardHat,
                  color: '#f5a623',
                },
                {
                  step: '04',
                  title: 'Net-Meter Synchronization',
                  desc: 'Coordination with utility DISCOM (MSEDCL/Tata Power) for bi-directional net meter testing, inspection, and power feed crediting.',
                  icon: Zap,
                  color: '#8b5cf6',
                },
                {
                  step: '05',
                  title: '5-Year Robotic Cleaning & AMC',
                  desc: 'Bi-monthly pressurized water and robotic panel cleaning, plus live IoT app monitoring of daily solar unit generation.',
                  icon: Sparkles,
                  color: '#ea580c',
                },
              ].map((st, i) => (
                <div key={i} style={{
                  padding: 22,
                  borderRadius: 16,
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: `${st.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <st.icon size={22} color={st.color} />
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
              ))}
            </div>
          </div>

          {/* User Guide */}
          <div className="card" style={{ padding: 28, background: '#f8fafc' }}>
            <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', marginBottom: 14 }}>
              💡 What is the Purpose of This Website &amp; How Customers Use It
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, fontSize: 13, color: '#334155' }}>
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#0070f3', display: 'block', marginBottom: 4 }}>1. Customer Sign-Up</strong>
                Homeowners visit <strong>/signup</strong> to create an account with their mobile number and password, entering their estimated electricity bill.
              </div>
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#22c55e', display: 'block', marginBottom: 4 }}>2. Customer Dashboard</strong>
                Upon login, customers see the 5-step workflow, real installation photos across Pune, and their live installation tracker.
              </div>
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#f5a623', display: 'block', marginBottom: 4 }}>3. Subsidy Calculator</strong>
                Customers use the dynamic slider to view exact PM Surya Ghar ₹78,000 subsidies and 25-year financial savings.
              </div>
              <div style={{ background: '#ffffff', padding: 16, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                <strong style={{ color: '#8b5cf6', display: 'block', marginBottom: 4 }}>4. 1-Tap Contact to Suraj Ghode</strong>
                Customers can contact Suraj Ghode directly on WhatsApp or phone call for rapid technical support.
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
