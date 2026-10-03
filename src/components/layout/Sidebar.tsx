'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import {
  Sun, LayoutDashboard, Users, FolderOpen, Package, ShoppingCart,
  Truck, CreditCard, Receipt, FileText, Image, Star, Settings,
  Bell, LogOut, Menu, X, ChevronRight, Briefcase, CalendarDays,
  DollarSign, BarChart3, ClipboardList, UserCheck
} from 'lucide-react'

const ownerNavItems = [
  {
    section: 'Overview',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    section: 'Business',
    items: [
      { label: 'Customers', href: '/dashboard/customers', icon: Users },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
      { label: 'Quotations', href: '/dashboard/quotations', icon: FileText },
      { label: 'Payments', href: '/dashboard/payments', icon: CreditCard },
      { label: 'Expenses', href: '/dashboard/expenses', icon: Receipt },
    ]
  },
  {
    section: 'Inventory',
    items: [
      { label: 'Materials', href: '/dashboard/materials', icon: Package },
      { label: 'Purchases', href: '/dashboard/purchases', icon: ShoppingCart },
      { label: 'Suppliers', href: '/dashboard/suppliers', icon: Truck },
    ]
  },
  {
    section: 'Team',
    items: [
      { label: 'Workers', href: '/dashboard/workers', icon: Briefcase },
      { label: 'Attendance', href: '/dashboard/attendance', icon: CalendarDays },
      { label: 'Salary', href: '/dashboard/salary', icon: DollarSign },
    ]
  },
  {
    section: 'Content',
    items: [
      { label: 'Work Reports', href: '/dashboard/reports', icon: ClipboardList },
      { label: 'Photo Gallery', href: '/dashboard/gallery', icon: Image },
      { label: 'Reviews', href: '/dashboard/reviews', icon: Star },
    ]
  },
  {
    section: 'Reports',
    items: [
      { label: 'Monthly Report', href: '/dashboard/monthly-report', icon: BarChart3 },
      { label: 'Audit Log', href: '/dashboard/audit-log', icon: ClipboardList },
      { label: 'Users', href: '/dashboard/users', icon: UserCheck },
    ]
  },
  {
    section: 'System',
    items: [
      { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ]
  },
]

const staffNavItems = [
  {
    section: 'Overview',
    items: [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }]
  },
  {
    section: 'Business',
    items: [
      { label: 'Customers', href: '/dashboard/customers', icon: Users },
      { label: 'Projects', href: '/dashboard/projects', icon: FolderOpen },
    ]
  },
]

const workerNavItems = [
  {
    section: 'My Work',
    items: [
      { label: 'My Dashboard', href: '/dashboard/worker', icon: LayoutDashboard },
      { label: 'My Projects', href: '/dashboard/my-projects', icon: FolderOpen },
      { label: 'Submit Report', href: '/dashboard/submit-report', icon: ClipboardList },
      { label: 'My Attendance', href: '/dashboard/my-attendance', icon: CalendarDays },
    ]
  },
]

const customerNavItems = [
  {
    section: 'My Solar Portal',
    items: [
      { label: 'Customer Dashboard', href: '/dashboard', icon: LayoutDashboard },
    ]
  },
  {
    section: 'Explore',
    items: [
      { label: 'Public Website', href: '/', icon: Sun },
    ]
  }
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [notifCount] = useState(3)

  const role = (session?.user as any)?.role || 'WORKER'
  const navItems = role === 'OWNER' 
    ? ownerNavItems 
    : role === 'CUSTOMER' 
    ? customerNavItems 
    : role === 'OFFICE_STAFF' 
    ? staffNavItems 
    : workerNavItems

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const sidebarContent = (
    <>
      {/* Brand Logo & Owner */}
      <div className="sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 10,
          padding: '4px 8px',
          display: 'inline-flex',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
          flexShrink: 0,
        }}>
          <img
            src="/images/logo.png"
            alt="Suraj Electric & Solar"
            style={{ height: 32, width: 'auto', objectFit: 'contain' }}
          />
        </div>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>
            Suraj Electric &amp; Solar
          </div>
          <div style={{ color: '#ffd066', fontSize: 10, letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 2, fontWeight: 700 }}>
            {role === 'OWNER' ? '👑 Suraj Ghode' : role === 'CUSTOMER' ? '☀️ Customer Hub' : role === 'OFFICE_STAFF' ? '💼 Staff Portal' : '👷 Worker App'}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        {navItems.map((group) => (
          <div key={group.section}>
            <div className="sidebar-section-title">{group.section}</div>
            {group.items.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon size={16} className="icon" />
                  {item.label}
                  {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.6 }} />}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      {/* User info + logout */}
      <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'linear-gradient(135deg, #e8751a, #f5a623)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, color: 'white', fontWeight: 700, flexShrink: 0,
          }}>
            {session?.user?.name?.[0] || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ color: 'white', fontWeight: 600, fontSize: 13, lineHeight: 1.2 }} className="line-clamp-1">
              {session?.user?.name || 'User'}
            </div>
            <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11 }}>
              {role === 'OWNER' ? '👑 Owner' : role === 'OFFICE_STAFF' ? '💼 Staff' : '👷 Worker'}
            </div>
          </div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="sidebar-item"
          style={{ width: '100%', background: 'rgba(239,68,68,0.08)', color: '#fca5a5', border: '1px solid rgba(239,68,68,0.15)', cursor: 'pointer' }}
        >
          <LogOut size={16} className="icon" />
          Sign Out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 60,
        background: 'var(--navy)', display: 'flex', alignItems: 'center',
        padding: '0 16px', zIndex: 101, gap: 12,
      }} className="mobile-header">
        <button onClick={() => setMobileOpen(true)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
          <Menu size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ background: '#ffffff', borderRadius: 6, padding: '3px 6px', display: 'flex', alignItems: 'center' }}>
            <img src="/images/logo.png" alt="Logo" style={{ height: 22, width: 'auto' }} />
          </div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: 13 }}>Suraj Electric &amp; Solar</span>
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }}>
          <div style={{ background: 'rgba(0,0,0,0.5)', flex: 1 }} onClick={() => setMobileOpen(false)} />
          <aside style={{ width: 280, background: 'var(--navy)', display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto' }}>
            <button onClick={() => setMobileOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: 8, borderRadius: 8, cursor: 'pointer' }}>
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <style jsx>{`
        .mobile-header { display: none; }
        @media (max-width: 768px) {
          .mobile-header { display: flex !important; }
        }
      `}</style>
    </>
  )
}
