import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'
import Sidebar from '@/components/layout/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <SessionProvider session={session}>
      <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--gray-50)' }}>
        <Sidebar />
        <main className="dash-content" style={{ flex: 1, minWidth: 0 }}>
          {children}
        </main>
      </div>
    </SessionProvider>
  )
}
