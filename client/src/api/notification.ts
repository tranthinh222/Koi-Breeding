import { apiClient } from './client'

export interface AppNotification {
  id: number
  type: string
  title: string
  message: string
  isRead: boolean
  createdAt: string
}

export async function getNotifications(userId: number): Promise<AppNotification[]> {
  const response = await apiClient.get(`/users/${userId}/notifications`)
  return response.data.data as AppNotification[]
}

export async function markAllNotificationsRead(userId: number): Promise<void> {
  await apiClient.post(`/users/${userId}/notifications/read`)
}

export function notificationStreamUrl(userId: number): string {
  const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8090/koi_breeding'
  return `${baseUrl}/users/${userId}/notifications/stream`
}
