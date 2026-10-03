import { auth } from '@/lib/auth'

export type Role = 'OWNER' | 'OFFICE_STAFF' | 'WORKER' | 'CUSTOMER'

export async function getCurrentUser() {
  const session = await auth()
  if (!session?.user) return null
  return session.user as {
    id: string
    name: string
    email?: string | null
    mobile: string
    role: Role
    image?: string | null
  }
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    throw new Error('Unauthorized')
  }
  return user
}

export async function requireRole(roles: Role[]) {
  const user = await requireAuth()
  if (!roles.includes(user.role)) {
    throw new Error('Forbidden')
  }
  return user
}

export function canAccess(userRole: Role, requiredRoles: Role[]) {
  return requiredRoles.includes(userRole)
}

export const ROLE_PERMISSIONS = {
  OWNER: {
    canViewFinancials: true,
    canManageUsers: true,
    canManageWorkers: true,
    canManageInventory: true,
    canViewReports: true,
    canApprovePhotos: true,
    canApproveReviews: true,
    canManageSettings: true,
    canViewAllProjects: true,
    canManageQuotations: true,
    canViewWorkerDocuments: true,
  },
  OFFICE_STAFF: {
    canViewFinancials: false,
    canManageUsers: false,
    canManageWorkers: false,
    canManageInventory: false,
    canViewReports: false,
    canApprovePhotos: false,
    canApproveReviews: false,
    canManageSettings: false,
    canViewAllProjects: true,
    canManageQuotations: false,
    canViewWorkerDocuments: false,
  },
  WORKER: {
    canViewFinancials: false,
    canManageUsers: false,
    canManageWorkers: false,
    canManageInventory: false,
    canViewReports: false,
    canApprovePhotos: false,
    canApproveReviews: false,
    canManageSettings: false,
    canViewAllProjects: false,
    canManageQuotations: false,
    canViewWorkerDocuments: false,
  },
}
