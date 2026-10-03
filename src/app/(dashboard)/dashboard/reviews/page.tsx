import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Star, CheckCircle2, MessageSquare } from 'lucide-react'
import { revalidatePath } from 'next/cache'

import ListFilterBar from '@/components/common/ListFilterBar'
import DeleteRowButton from '@/components/common/DeleteRowButton'
import RemoveAllButton from '@/components/common/RemoveAllButton'
import { deleteReview, deleteAllReviews } from '@/app/actions/delete'

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; search?: string }>
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
      { customer: { name: { contains: searchFilter } } },
      { reviewText: { contains: searchFilter } },
    ]
  }

  const reviews = await prisma.review.findMany({
    where: whereClause,
    orderBy: { createdAt: 'desc' },
    include: {
      customer: { select: { name: true, city: true } },
      project: { select: { projectId: true, capacityKw: true } },
    },
  })

  return (
    <div>
      <DashboardHeader title="Customer Reviews &amp; Testimonials" subtitle="Approve reviews to display on the public website" />

      {/* Top Filter & Search Bar with Clear Button */}
      <ListFilterBar
        basePath="/dashboard/reviews"
        searchPlaceholder="Search reviews by customer name, review text..."
        filterParamName="status"
        currentFilter={statusFilter}
        currentSearch={searchFilter}
        totalCount={reviews.length}
        filterOptions={[
          { key: 'ALL', label: 'All Reviews', count: reviews.length },
          { key: 'PENDING', label: 'Pending Approval' },
          { key: 'APPROVED', label: 'Approved' },
        ]}
        extraActions={
          <RemoveAllButton
            entityName="Reviews"
            onRemoveAll={deleteAllReviews}
            totalCount={reviews.length}
            label="Remove All"
          />
        }
      />


      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, margin: '24px 0' }}>
        {reviews.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
            No customer reviews submitted yet.
          </div>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="card" style={{ padding: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--gray-900)' }}>{r.customer.name}</h3>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          color={i < r.rating ? '#f5a623' : '#e5e7eb'}
                          fill={i < r.rating ? '#f5a623' : 'none'}
                        />
                      ))}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                    {r.customer.city} • Project {r.project.projectId} ({r.project.capacityKw} kW)
                  </div>
                </div>

                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      padding: '3px 8px',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 700,
                      background: r.status === 'APPROVED' ? 'rgba(34,197,94,0.1)' : 'rgba(245,166,35,0.1)',
                      color: r.status === 'APPROVED' ? '#22c55e' : '#f5a623',
                    }}
                  >
                    {r.status}
                  </span>
                  <DeleteRowButton
                    id={r.id}
                    name={`Review from ${r.customer.name}`}
                    onDelete={deleteReview}
                  />
                </div>
              </div>


              <p style={{ fontSize: 14, color: 'var(--gray-700)', lineHeight: 1.5, background: 'var(--gray-50)', padding: 12, borderRadius: 8 }}>
                "{r.reviewText}"
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
