import axios from 'axios'
import { apiClient } from './client'

export interface User {
  id: number
  username: string
  email: string
  birthday: string | null
  gender: 'MALE' | 'FEMALE' | null
  level: number
  avatarUrl: string | null
  createdAt: string
  updatedAt: string
}

export async function getUser(userId: number): Promise<User> {
  try {
    const response = await apiClient.get(`/users/${userId}`)
    return response.data.data as User
  } catch (error) {
    if (axios.isCancel(error)) throw error
    console.error(
      'User API request failed.',
      error,
    )
    throw error
  }
}

export type UpdateUserProfileRequest = Pick<
  User,
  'username' | 'email' | 'birthday' | 'gender'
>

export async function updateUserProfile(
  userId: number,
  data: UpdateUserProfileRequest,
): Promise<User> {
  const response = await apiClient.put('/users/profile', data, {
    params: { id: userId },
  })
  return (response.data?.data ?? response.data) as User
}

export async function uploadUserAvatar(userId: number, file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)
  const response = await apiClient.post('/users/avatar', formData, {
    params: { id: userId },
  })
  const payload = response.data?.data ?? response.data
  return payload.avatarUrl as string
}
