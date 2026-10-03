import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, Package, AlertTriangle, CheckCircle2, TrendingDown, ArrowUpRight } from 'lucide-react'
import { updateStockQuantity } from '@/app/actions/inventory'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteMaterial, deleteAllMaterials } from '@/app/actions/delete'

export default async function MaterialsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const { category: catFilter, search: searchFilter } = await searchParams

  const whereClause: any = {}
  if (catFilter && catFilter !== 'ALL') {
    whereClause.category = catFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { name: { contains: searchFilter } },
      { brand: { contains: searchFilter } },
      { model: { contains: searchFilter } },
    ]
  }

  const [materials, totalCount, suppliers] = await Promise.all([
    prisma.material.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: {
        supplier: { select: { id: true, name: true } },
      },
    }),
    prisma.material.count(),
    prisma.supplier.findMany({ select: { id: true, name: true } }),
  ])

  const lowStockItems = materials.filter((m) => m.currentQty <= m.minStockLevel)
  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader title="Inventory &amp; Materials" subtitle="Track solar modules, inverters, structures, cables and balance of system" />

      {/* Low stock alert banner */}
      {lowStockItems.length > 0 && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '16px 20px', background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.25)', borderRadius: 14,
          margin: '20px 0', color: '#b91c1c',
        }}>
          <AlertTriangle size={24} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <strong>Low Stock Warning ({lowStockItems.length} items): </strong>
            {lowStockItems.map((m) => `${m.name} (${m.currentQty} ${m.unit} left)`).join(' • ')}
          </div>
        </div>
      )}

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card blue">
          <div className="stat-value">{totalCount}</div>
          <div className="stat-label">Catalog SKU Items</div>
        </div>
        <div className="stat-card yellow">
          <div className="stat-value">{lowStockItems.length}</div>
          <div className="stat-label">Low Stock Alerts</div>
        </div>
        <div className="stat-card green">
          <div className="stat-value">{suppliers.length}</div>
          <div className="stat-label">Registered Suppliers</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/materials"
        searchPlaceholder="Search materials by name, brand, model..."
        filterParamName="category"
        currentFilter={catFilter || 'ALL'}
        currentSearch={searchFilter || ''}
        totalCount={totalCount}
        filterOptions={[
          { key: 'ALL', label: 'All Inventory', count: totalCount },
          { key: 'SOLAR_PANEL', label: 'Solar Panels' },
          { key: 'INVERTER', label: 'Inverters' },
          { key: 'DC_CABLE', label: 'DC Cable' },
          { key: 'MOUNTING_STRUCTURE', label: 'Structures' },
          { key: 'EARTHING', label: 'Earthing & Lightning' },
        ]}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RemoveAllButton
              entityName="Materials"
              onRemoveAll={deleteAllMaterials}
              totalCount={totalCount}
              label="Remove All"
            />
            <Link
              href="/dashboard/suppliers"
              className="btn btn-outline"
              style={{
                textDecoration: 'none',
                padding: '9px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Suppliers
            </Link>
          </div>
        }
        actionButton={{
          label: 'Add Material',
          href: '/dashboard/materials/new',
          icon: <Plus size={16} />,
        }}
      />

      {/* Materials Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Item ID / Name</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Category</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Current Stock</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Min Alert Level</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Unit Price</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Supplier</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
                    No materials found in this category.
                  </td>
                </tr>
              ) : (
                materials.map((m, idx) => {
                  const isLow = m.currentQty <= m.minStockLevel
                  return (
                    <tr
                      key={m.id}
                      style={{
                        borderBottom: idx < materials.length - 1 ? '1px solid var(--gray-100)' : 'none',
                        background: isLow ? 'rgba(239,68,68,0.02)' : undefined,
                      }}
                    >
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{m.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--gray-400)', marginTop: 2 }}>
                          {m.materialId} {m.brand ? `• ${m.brand}` : ''} {m.model ? `(${m.model})` : ''}
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: 8,
                            fontSize: 11,
                            fontWeight: 700,
                            background: 'rgba(59,130,246,0.1)',
                            color: '#3b82f6',
                          }}
                        >
                          {m.category.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <span
                          style={{
                            fontWeight: 800,
                            fontSize: 15,
                            color: isLow ? '#ef4444' : 'var(--gray-900)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 6,
                          }}
                        >
                          {m.currentQty} {m.unit}
                          {isLow && <span style={{ fontSize: 10, background: '#fee2e2', color: '#b91c1c', padding: '1px 6px', borderRadius: 4 }}>LOW</span>}
                        </span>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--gray-500)' }}>
                        {m.minStockLevel} {m.unit}
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <strong style={{ color: 'var(--gray-900)' }}>{formatCur(m.purchasePrice)}</strong>
                      </td>
                      <td style={{ padding: '16px 20px', color: 'var(--gray-600)' }}>
                        {m.supplier?.name || '-'}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, justifyContent: 'flex-end' }}>
                          <form
                            action={async () => {
                              'use server'
                              await updateStockQuantity(m.id, -1, 'Quick reduction by 1')
                            }}
                          >
                            <button
                              type="submit"
                              title="Decrease stock by 1"
                              style={{
                                width: 28, height: 28, borderRadius: 6, border: '1px solid var(--gray-300)',
                                background: 'white', cursor: 'pointer', fontWeight: 800, fontSize: 14,
                              }}
                            >
                              -
                            </button>
                          </form>
                          <form
                            action={async () => {
                              'use server'
                              await updateStockQuantity(m.id, 1, 'Quick addition by 1')
                            }}
                          >
                            <button
                              type="submit"
                              title="Increase stock by 1"
                              style={{
                                width: 28, height: 28, borderRadius: 6, border: '1px solid var(--gray-300)',
                                background: 'white', cursor: 'pointer', fontWeight: 800, fontSize: 14,
                              }}
                            >
                              +
                            </button>
                          </form>
                          <DeleteRowButton
                            id={m.id}
                            name={m.name}
                            onDelete={deleteMaterial}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

