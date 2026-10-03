import type { Metadata } from 'next'
import PublicNavbar from '@/components/public/Navbar'
import PublicFooter from '@/components/public/Footer'

export const metadata: Metadata = {
  title: 'Suraj Electric & Solar — PM Surya Ghar Rooftop Solar | Suraj Ghode',
  description: 'Suraj Electric & Solar founded by Suraj Ghode. Maharashtra rooftop solar pergola engineering, ₹78,000 PM Surya Ghar subsidy, and ₹0 electricity bills.',
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <PublicNavbar />
      <main style={{ minHeight: '100vh' }}>{children}</main>
      <PublicFooter />
    </>
  )
}
