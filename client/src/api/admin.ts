import { apiClient } from './client'

export type AdminUserStatus = 'ACTIVE' | 'BANNED' | 'DELETED'

export interface AdminUserDto {
  id: number
  username: string
  email: string
  birthday: string | null
  gender: 'MALE' | 'FEMALE' | null
  role: 'USER' | 'ADMIN'
  status: AdminUserStatus | null
  isBanned: boolean | null
  exp: number
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export interface PaginationMeta {
  page: number
  pageSize: number
  totalPages: number
  totalElements: number
}

export interface AdminUsersResponse {
  meta: PaginationMeta
  result: AdminUserDto[]
}

export interface AdminMetricDto {
  total: number
  currentMonth: number
  previousMonth: number
  delta: number
  growthPercent: number | null
}

export interface AdminRankingUserDto {
  id: number
  username: string
  avatarUrl: string | null
  exp: number
  level: number
}

export interface AdminTopTransactionDto {
  source: 'SHOP' | 'MARKETPLACE'
  id: number
  title: string
  amount: number
  description: string | null
  createdAt: string
}

export interface AdminDashboardResponse {
  users: AdminMetricDto
  shopPurchases: AdminMetricDto
  marketplaceTrades: AdminMetricDto
  topUsers: AdminRankingUserDto[]
  highestLevelUser: AdminRankingUserDto | null
  topTransactions: AdminTopTransactionDto[]
}

export interface AdminModerationUserRequest {
  id: number
  status?: AdminUserStatus | null
  password?: string | null
  reason?: string | null
}

export async function getAdminUsers(page = 1, pageSize = 8): Promise<AdminUsersResponse> {
  const response = await apiClient.get('/admin/users', {
    params: {
      page: Math.max(page - 1, 0),
      size: pageSize,
    },
  })

  return response.data.data as AdminUsersResponse
}

export async function getAdminDashboard(
  userLimit = 3,
  transactionLimit = 3,
): Promise<AdminDashboardResponse> {
  const response = await apiClient.get('/admin/dashboard', {
    params: {
      userLimit,
      transactionLimit,
    },
  })

  return response.data.data as AdminDashboardResponse
}

export async function updateStatusUser(request: AdminModerationUserRequest): Promise<AdminUserDto> {
  const response = await apiClient.put('/admin/users', request)
  return response.data.data as AdminUserDto
}