import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import DashboardHeader from '@/components/layout/DashboardHeader'
import { Image as ImageIcon, Camera, Plus } from 'lucide-react'

export default async function GalleryPage() {
  const session = await auth()
  if (!session) redirect('/login')

  const photos = await prisma.workReportPhoto.findMany({
    orderBy: { uploadedAt: 'desc' },
    include: {
      workReport: {
        include: {
          project: { select: { projectId: true, customer: { select: { name: true } } } },
        },
      },
    },
  })

  return (
    <div>
      <DashboardHeader
        title="Project Photo Showcase"
        subtitle="Installation site photography, equipment mounts &amp; commissioning records"
      >
        <Link
          href="/dashboard/submit-report"
          className="btn btn-primary"
          style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <Camera size={16} /> Upload New Site Photo (JPG, PNG)
        </Link>
      </DashboardHeader>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20, margin: '24px 0' }}>
        {photos.length === 0 ? (
          <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '48px 20px', color: 'var(--gray-400)' }}>
            No project photos uploaded yet. Technicians can attach photos when submitting daily site reports.
          </div>
        ) : (
          photos.map((p) => (
            <div key={p.id} className="card" style={{ padding: 12, overflow: 'hidden' }}>
              <img
                src={p.url}
                alt={p.caption || 'Site photo'}
                style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10, marginBottom: 10 }}
              />
              <div style={{ padding: '0 4px' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--gray-900)' }}>
                  {p.workReport.project.projectId}
                </div>
                <div style={{ fontSize: 12, color: 'var(--gray-500)', marginTop: 2 }}>
                  {p.workReport.project.customer.name} • {new Date(p.uploadedAt).toLocaleDateString('en-IN')}
                </div>
                {p.caption && (
                  <p style={{ fontSize: 12, color: 'var(--gray-700)', marginTop: 6, fontStyle: 'italic' }}>
                    "{p.caption}"
                  </p>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
