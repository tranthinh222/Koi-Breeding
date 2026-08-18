import axios from 'axios'
import { apiClient } from './client'

export interface User {
  id: number
  username: string
  email: string
  birthday: string | null
  gender: 'MALE' | 'FEMALE' | null
  exp: number
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
