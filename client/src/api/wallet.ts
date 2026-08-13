import axios from 'axios'
import { apiClient } from './client'

export interface Balance {
  balance: number
}

export async function getBalanceWallet(userId: number): Promise<Balance> {
  try {
    const response = await apiClient.get(`/wallet/${userId}`)
    return response.data.data as Balance
  } catch (error) {
    if (axios.isCancel(error)) throw error
    console.error(
      'Wallet API request failed. Using demo products instead.',
      error,
    )
    throw error
  }
}
