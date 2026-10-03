import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Activity, Clock } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteAuditLog, clearAllAuditLogs } from '@/app/actions/delete'

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = searchParams ? await searchParams : {}
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (searchFilter) {
    whereClause.OR = [
      { action: { contains: searchFilter } },
      { entity: { contains: searchFilter } },
    ]
  }

  const logs = await prisma.auditLog.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: {
      user: { select: { name: true, role: true } },
    },
  })

  return (
    <div>
      <DashboardHeader title="System Audit Logs" subtitle="Security audit trail of user activities, payment receipts &amp; project changes" />

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/audit-log"
        searchPlaceholder="Search audit log by action or entity..."
        currentSearch={searchFilter}
        totalCount={logs.length}
        extraActions={
          <RemoveAllButton
            entityName="Audit Logs"
            onRemoveAll={clearAllAuditLogs}
            totalCount={logs.length}
            label="Clear All Logs"
          />
        }
      />

      <div className="card" style={{ padding: 0, overflow: 'hidden', margin: '24px 0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Timestamp</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>User / Role</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Action</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Target Entity</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
                    No audit logs found.
                  </td>
                </tr>
              ) : (
                logs.map((l, idx) => (
                  <tr
                    key={l.id}
                    style={{
                      borderBottom: idx < logs.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    }}
                  >
                    <td style={{ padding: '14px 20px', color: 'var(--gray-500)', fontSize: 13, whiteSpace: 'nowrap' }}>
                      {new Date(l.createdAt).toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <strong style={{ color: 'var(--gray-900)' }}>{l.user?.name || 'System'}</strong>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{l.user?.role || 'AUTO'}</div>
                    </td>
                    <td style={{ padding: '14px 20px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--navy)' }}>{l.action}</span>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--gray-700)' }}>
                      {l.entity}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <DeleteRowButton
                        id={l.id}
                        name={`Log: ${l.action}`}
                        onDelete={deleteAuditLog}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
