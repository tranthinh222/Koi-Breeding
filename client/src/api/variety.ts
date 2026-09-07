import type {
  IModelPagination,
  IRestResponse,
  IVariety,
} from '../types/backend'
import { apiClient } from './client'

/**
 * 
Module Variety
 */

export const callCreateVariety = (variety: IVariety) => {
  return apiClient.post<IRestResponse<IVariety>>('/varieties', {
    ...variety,
  })
}

export const callUpdateVariety = (variety: IVariety) => {
  return apiClient.put<IRestResponse<IVariety>>('/varieties', {
    ...variety,
  })
}

export const callFetchAllVarieties = (query: string) => {
  return apiClient.get<IRestResponse<IModelPagination<IVariety>>>(
    `/varieties?${query}`,
  )
}

export const callFetchVarietyById = (id: number) => {
  return apiClient.get<IRestResponse<IVariety>>(`/varieties/${id}`)
}
