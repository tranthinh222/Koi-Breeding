import axios from 'axios'
import { apiClient } from './client'
import type { IModelPagination, IPond } from '../types/backend'

export async function getPonds(page = 0, size = 100): Promise<IModelPagination<IPond>> {
  try {
    const response = await apiClient.get('/ponds', {
      params: { page, size },
    })

    return response.data.data as IModelPagination<IPond>
  } catch (error) {
    if (axios.isCancel(error)) throw error
    console.error('Pond API request failed.', error)
    throw error
  }
}