import { apiClient } from './client'
import type { IModelPagination, IRestResponse } from '../types/backend'

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

export async function getTransactions(
  userId: number,
  page: number,
  pageSize: number,
  sortDirection: 'asc' | 'desc',
  filter: 'ALL' | 'BOUGHT' | 'SOLD',
): Promise<IModelPagination<Transaction>> {
  const response = await apiClient.get<IRestResponse<IModelPagination<Transaction>>>(
    `/users/${userId}/transactions`,
    {
      params: {
        page: page - 1,
        size: pageSize,
        sort: `createdAt,${sortDirection}`,
        filter,
      },
    },
  )

  return response.data.data as IModelPagination<Transaction>
}
