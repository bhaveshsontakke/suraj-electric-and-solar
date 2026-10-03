import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { ShoppingCart, Plus, Truck, FileText } from 'lucide-react'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deletePurchase, deleteAllPurchases } from '@/app/actions/delete'

export default async function PurchasesPage({
  searchParams,
}: {
  searchParams?: Promise<{ search?: string; status?: string }>
}) {
  const session = await auth()
  if (!session) redirect('/login')

  const params = searchParams ? await searchParams : {}
  const statusFilter = params.status || 'ALL'
  const searchFilter = params.search || ''

  const whereClause: any = {}
  if (statusFilter !== 'ALL') {
    whereClause.status = statusFilter
  }
  if (searchFilter) {
    whereClause.OR = [
      { purchaseId: { contains: searchFilter } },
      { invoiceNumber: { contains: searchFilter } },
      { supplier: { name: { contains: searchFilter } } },
    ]
  }

  const purchases = await prisma.purchase.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      supplier: { select: { name: true, contact: true } },
      items: { include: { material: { select: { name: true } } } },
    },
  })

  const totalPurchase = purchases.reduce((acc, p) => acc + p.totalAmount, 0)
  const formatCur = (n: number) => `₹${n.toLocaleString('en-IN')}`

  return (
    <div>
      <DashboardHeader title="Purchase Orders &amp; Invoices" subtitle="Track supplier procurement for solar modules, inverters &amp; balance of plant" />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, margin: '24px 0' }}>
        <div className="stat-card purple">
          <div className="stat-value">{purchases.length}</div>
          <div className="stat-label">Total Purchase Orders</div>
        </div>
        <div className="stat-card blue">
          <div className="stat-value">{formatCur(totalPurchase)}</div>
          <div className="stat-label">Total Procurement Value</div>
        </div>
      </div>

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/purchases"
        searchPlaceholder="Search POs by PO#, supplier, invoice..."
        filterParamName="status"
        currentFilter={statusFilter}
        currentSearch={searchFilter}
        totalCount={purchases.length}
        filterOptions={[
          { key: 'ALL', label: 'All Orders' },
          { key: 'PENDING', label: 'Pending' },
          { key: 'PAID', label: 'Paid' },
        ]}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RemoveAllButton
              entityName="Purchases"
              onRemoveAll={deleteAllPurchases}
              totalCount={purchases.length}
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
      />


      {/* Purchases List */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--gray-50)', borderBottom: '1px solid var(--gray-200)' }}>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>PO Number / Date</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Supplier</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Invoice Ref</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Items Count</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Total Value</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700 }}>Payment Status</th>
                <th style={{ padding: '14px 20px', color: 'var(--gray-600)', fontWeight: 700, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {purchases.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
                    No purchase orders recorded yet. Materials are directly updated in Materials inventory.
                  </td>
                </tr>
              ) : (
                purchases.map((p, idx) => (
                  <tr
                    key={p.id}
                    style={{
                      borderBottom: idx < purchases.length - 1 ? '1px solid var(--gray-100)' : 'none',
                    }}
                  >
                    <td style={{ padding: '16px 20px' }}>
                      <div style={{ fontWeight: 700, color: 'var(--gray-900)' }}>{p.purchaseId}</div>
                      <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                        {new Date(p.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <strong style={{ color: 'var(--navy)' }}>{p.supplier.name}</strong>
                    </td>
                    <td style={{ padding: '16px 20px', color: 'var(--gray-600)' }}>
                      {p.invoiceNumber || '-'}
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span style={{ fontSize: 13 }}>{p.items.length} materials</span>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <strong style={{ color: 'var(--gray-900)' }}>{formatCur(p.totalAmount)}</strong>
                    </td>
                    <td style={{ padding: '16px 20px' }}>
                      <span
                        style={{
                          padding: '3px 8px',
                          borderRadius: 6,
                          fontSize: 11,
                          fontWeight: 700,
                          background: p.status === 'PAID' ? 'rgba(34,197,94,0.1)' : 'rgba(245,166,35,0.1)',
                          color: p.status === 'PAID' ? '#22c55e' : '#f5a623',
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                      <DeleteRowButton
                        id={p.id}
                        name={`PO ${p.purchaseId}`}
                        onDelete={deletePurchase}
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

