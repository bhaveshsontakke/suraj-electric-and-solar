import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Plus, Truck, Phone, Mail, MapPin, Package, ArrowLeft } from 'lucide-react'
import { createSupplier } from '@/app/actions/inventory'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteSupplier, deleteAllSuppliers } from '@/app/actions/delete'

export default async function SuppliersPage({
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
      { name: { contains: searchFilter } },
      { contact: { contains: searchFilter } },
      { email: { contains: searchFilter } },
      { gstNumber: { contains: searchFilter } },
    ]
  }

  const suppliers = await prisma.supplier.findMany({
    where: whereClause,
    orderBy: { name: 'asc' },
    include: {
      materials: { select: { id: true, name: true, category: true } },
    },
  })

  return (
    <div>
      <DashboardHeader title="Solar Suppliers &amp; Distributors" subtitle="Manage solar module, inverter and electrical component vendors" />

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/suppliers"
        searchPlaceholder="Search suppliers by vendor name, phone, GST..."
        currentSearch={searchFilter}
        totalCount={suppliers.length}
        extraActions={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RemoveAllButton
              entityName="Suppliers"
              onRemoveAll={deleteAllSuppliers}
              totalCount={suppliers.length}
              label="Remove All"
            />
            <Link
              href="/dashboard/materials"
              className="btn btn-outline"
              style={{
                textDecoration: 'none',
                padding: '9px 14px',
                borderRadius: 12,
                fontSize: 13,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ArrowLeft size={16} /> Back to Materials
            </Link>
          </div>
        }
      />


      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 24 }}>
        {/* Suppliers List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {suppliers.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
              No suppliers added yet.
            </div>
          ) : (
            suppliers.map((s) => (
              <div key={s.id} className="card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)' }}>{s.name}</h3>
                    {s.gstNumber && (
                      <span style={{ fontSize: 12, color: 'var(--gray-500)', background: 'var(--gray-100)', padding: '2px 8px', borderRadius: 4, marginTop: 4, display: 'inline-block' }}>
                        GST: {s.gstNumber}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: '#3b82f6', fontWeight: 700, background: 'rgba(59,130,246,0.1)', padding: '4px 10px', borderRadius: 12 }}>
                      {s.materials.length} SKUs supplied
                    </span>
                    <DeleteRowButton
                      id={s.id}
                      name={`Supplier ${s.name}`}
                      onDelete={deleteSupplier}
                    />
                  </div>
                </div>


                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 13, color: 'var(--gray-600)', marginBottom: 14 }}>
                  {s.contact && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Phone size={14} color="#f5a623" />
                      <span>{s.contact}</span>
                    </div>
                  )}
                  {s.email && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Mail size={14} color="#3b82f6" />
                      <span>{s.email}</span>
                    </div>
                  )}
                  {s.address && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MapPin size={14} color="#22c55e" />
                      <span>{s.address}</span>
                    </div>
                  )}
                </div>

                {s.materials.length > 0 && (
                  <div style={{ borderTop: '1px solid var(--gray-100)', paddingTop: 10, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {s.materials.map((m) => (
                      <span key={m.id} style={{ fontSize: 11, background: 'var(--gray-100)', color: 'var(--gray-700)', padding: '3px 8px', borderRadius: 6 }}>
                        {m.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Add Supplier Form */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ fontSize: 17, fontWeight: 800, color: 'var(--gray-900)', marginBottom: 16 }}>
            ➕ Register New Supplier
          </h3>
          <form action={createSupplier} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-group">
              <label className="form-label">Company / Distributor Name *</label>
              <input type="text" name="name" required placeholder="e.g. Sungrow Inverter Hub" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person &amp; Phone</label>
              <input type="text" name="contact" placeholder="e.g. Rahul Sharma (9822000000)" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" name="email" placeholder="sales@sungrowdealers.com" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">GST Number</label>
              <input type="text" name="gstNumber" placeholder="27AAAAA0000A1Z5" className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Warehouse Address</label>
              <input type="text" name="address" placeholder="MIDC Bhosari, Pune" className="form-input" />
            </div>

            <button type="submit" className="btn btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}>
              Add Supplier
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
