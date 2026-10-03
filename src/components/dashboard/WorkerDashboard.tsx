'use client'

import Link from 'next/link'
import {
  FolderOpen, ClipboardList, CalendarDays, CheckCircle2,
  Clock, ArrowRight, AlertCircle, Camera, MapPin, HardHat
} from 'lucide-react'

interface WorkerDashboardProps {
  userName: string
  assignedProjectsCount?: number
  pendingReportsCount?: number
  attendanceDays?: number
}

export default function WorkerDashboard({
  userName,
  assignedProjectsCount = 1,
  pendingReportsCount = 0,
  attendanceDays = 22,
}: WorkerDashboardProps) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #112240, #1a3a6b)',
        borderRadius: 20,
        padding: '24px 20px',
        color: 'white',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(245,166,35,0.2)', color: '#f5a623',
            padding: '4px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
            marginBottom: 12, border: '1px solid rgba(245,166,35,0.3)',
          }}>
            <HardHat size={14} /> FIELD TECHNICIAN PORTAL
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
            Namaste, {userName.split(' ')[0]}!
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
            Track your site installations, daily reports, and monthly attendance.
          </p>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
        <Link href="/dashboard/submit-report" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f5a623, #e8751a)',
            padding: 20, borderRadius: 16, color: 'white',
            display: 'flex', flexDirection: 'column', gap: 10,
            boxShadow: '0 8px 20px rgba(232,117,26,0.25)',
            transition: 'transform 0.2s',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Camera size={22} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800 }}>Submit Work Report</div>
              <div style={{ fontSize: 12, opacity: 0.9, marginTop: 2 }}>Upload daily site progress &amp; photos</div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/my-attendance" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white', border: '1px solid var(--gray-200)',
            padding: 20, borderRadius: 16,
            display: 'flex', flexDirection: 'column', gap: 10,
            transition: 'transform 0.2s',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CalendarDays size={22} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>Mark Attendance</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Today: Check-in / Leave status</div>
            </div>
          </div>
        </Link>

        <Link href="/dashboard/my-projects" style={{ textDecoration: 'none' }}>
          <div style={{
            background: 'white', border: '1px solid var(--gray-200)',
            padding: 20, borderRadius: 16,
            display: 'flex', flexDirection: 'column', gap: 10,
            transition: 'transform 0.2s',
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderOpen size={22} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>My Assigned Sites</div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>Active solar installation sites</div>
            </div>
          </div>
        </Link>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FolderOpen size={18} color="#3b82f6" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Active Site Assignments</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>{assignedProjectsCount} Active Site</div>
            </div>
          </div>
          <Link href="/dashboard/my-projects" style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            View Site Location &amp; Details <ArrowRight size={14} />
          </Link>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(34,197,94,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={18} color="#22c55e" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>Attendance This Month</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--gray-900)' }}>{attendanceDays} Days Present</div>
            </div>
          </div>
          <Link href="/dashboard/my-attendance" style={{ fontSize: 13, fontWeight: 600, color: '#22c55e', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            Check Attendance History <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Guidelines Card */}
      <div className="card">
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 14 }}>
          ⚠️ Daily Site Safety &amp; Reporting Guidelines
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--gray-700)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#22c55e', fontWeight: 800 }}>✓</span> Wear safety helmets, harness &amp; insulated rubber gloves during roof and electrical work.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#22c55e', fontWeight: 800 }}>✓</span> Take high-resolution photos of structure foundation, solar module wiring, and inverter installation.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#22c55e', fontWeight: 800 }}>✓</span> Submit the daily report before 7:00 PM every evening to ensure accurate attendance and wage records.
          </div>
        </div>
      </div>
    </div>
  )
}
