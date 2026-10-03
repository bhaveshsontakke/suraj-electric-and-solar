const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  const user = await prisma.user.findUnique({ where: { mobile: '9876543210' } })
  const customer = await prisma.customer.findFirst({
    where: { mobile: '9876543210' },
    include: { projects: true }
  })
  const owner = await prisma.user.findFirst({ where: { role: 'OWNER' } })
  const photos = await prisma.projectPhoto.findMany({ take: 3 })

  console.log('✅ Owner Name:', owner?.name, '| Mobile:', owner?.mobile)
  console.log('✅ Demo Customer User:', user?.name, '| Role:', user?.role)
  console.log('✅ Demo Customer Project:', customer?.projects?.[0]?.projectId, '| Capacity:', customer?.projects?.[0]?.capacityKw, 'kW')
  console.log('✅ Site Photos Count:', photos.length, '| First Photo URL:', photos[0]?.url)
}

test().catch(console.error).finally(() => prisma.$disconnect())
