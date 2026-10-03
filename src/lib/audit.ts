import { prisma } from '@/lib/prisma'

interface AuditLogParams {
  userId?: string
  action: string
  entity: string
  entityId?: string
  customerId?: string
  projectId?: string
  metadata?: Record<string, unknown>
  ipAddress?: string
}

export async function createAuditLog(params: AuditLogParams) {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        customerId: params.customerId,
        projectId: params.projectId,
        metadata: params.metadata ? JSON.stringify(params.metadata) : undefined,
        ipAddress: params.ipAddress,
      },
    })
  } catch (error) {
    // Non-critical: don't throw if audit log fails
    console.error('Failed to create audit log:', error)
  }
}

export async function createNotification(params: {
  userId: string
  title: string
  message: string
  type?: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'ALERT'
  entityType?: string
  entityId?: string
}) {
  try {
    await prisma.notification.create({
      data: {
        userId: params.userId,
        title: params.title,
        message: params.message,
        type: params.type || 'INFO',
        entityType: params.entityType,
        entityId: params.entityId,
      },
    })
  } catch (error) {
    console.error('Failed to create notification:', error)
  }
}

export async function notifyOwners(params: {
  title: string
  message: string
  type?: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR' | 'ALERT'
  entityType?: string
  entityId?: string
}) {
  const owners = await prisma.user.findMany({
    where: { role: 'OWNER', isActive: true },
    select: { id: true },
  })

  await Promise.all(
    owners.map((owner) =>
      createNotification({
        userId: owner.id,
        ...params,
      })
    )
  )
}
