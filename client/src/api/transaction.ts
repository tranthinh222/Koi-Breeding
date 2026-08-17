import { apiClient } from './client'

export interface Transaction {
  id: number
  itemId: number
  itemName: string
  amount: number
  transactionType: 'DEPOSIT' | 'BUY_FOOD' | 'BUY_FISH' | 'SELL_FISH'
  status: 'PENDING' | 'CANCELLED' | 'SUCCESSED' | 'FAILED'
  description: string
  createdAt: string
}

export async function getTransactions(userId: number): Promise<Transaction[]> {
  const response = await apiClient.get(`/users/${userId}/transactions`)
  return response.data.data as Transaction[]
}
