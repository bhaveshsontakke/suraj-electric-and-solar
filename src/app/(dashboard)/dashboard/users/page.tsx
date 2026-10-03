import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Users, Shield, Phone, Mail, CheckCircle2 } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import { deleteUser } from '@/app/actions/delete'

export default async function UsersPage({
  searchParams,
}: {
  searchParams?: Promise<{ role?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = searchParams ? await searchParams : {}
  const roleFilter = params.role || 'ALL'
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (roleFilter !== 'ALL') {
    whereClause.role = roleFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { name: { contains: searchFilter } },
      { mobile: { contains: searchFilter } },
      { email: { contains: searchFilter } },
    ]
  }

  const users = await prisma.user.findMany({
    where: whereClause,
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      name: true,
      email: true,
      mobile: true,
      role: true,
      isActive: true,
      createdAt: true,
    },
  })

  return (
    <div>
      <DashboardHeader title="System User Accounts" subtitle="Manage logins and access permissions for Owner, Office Staff &amp; Technicians" />

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/users"
        searchPlaceholder="Search users by name, mobile, email..."
        filterParamName="role"
        currentFilter={roleFilter}
        currentSearch={searchFilter}
        totalCount={users.length}
        filterOptions={[
          { key: 'ALL', label: 'All Roles', count: users.length },
          { key: 'OWNER', label: 'Owners' },
          { key: 'OFFICE_STAFF', label: 'Office Staff' },
          { key: 'WORKER', label: 'Technicians' },
        ]}
      />


      <div className="card" style={{ padding: 0, overflow: 'hidden', margin: '24px 0' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>User Name</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Mobile Login</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Email</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>System Role</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Status</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, idx) => (
                <tr
                  key={u.id}
                  style={{
                    borderBottom: idx < users.length - 1 ? '1px solid var(--gray-100)' : 'none',
                  }}
                >
                  <td style={{ padding: '16px 20px' }}>
                    <strong style={{ color: 'var(--gray-900)' }}>{u.name}</strong>
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--gray-700)' }}>
                    {u.mobile}
                  </td>
                  <td style={{ padding: '16px 20px', color: 'var(--gray-500)' }}>
                    {u.email || '-'}
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span
                      style={{
                        padding: '3px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 700,
                        background:
                          u.role === 'OWNER'
                            ? 'rgba(234,88,12,0.1)'
                            : u.role === 'OFFICE_STAFF'
                            ? 'rgba(59,130,246,0.1)'
                            : 'rgba(139,92,246,0.1)',
                        color:
                          u.role === 'OWNER'
                            ? '#ea580c'
                            : u.role === 'OFFICE_STAFF'
                            ? '#3b82f6'
                            : '#8b5cf6',
                      }}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px' }}>
                    <span style={{ fontSize: 12, color: '#22c55e', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={14} /> Active
                    </span>
                  </td>
                  <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                    {u.role === 'OWNER' ? (
                      <span style={{ fontSize: 11, color: '#9ca3af', fontWeight: 600, padding: '4px 8px', background: '#f3f4f6', borderRadius: 6 }}>
                        Protected
                      </span>
                    ) : (
                      <DeleteRowButton
                        id={u.id}
                        onDelete={deleteUser}
                        name={u.name}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
