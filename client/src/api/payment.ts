import { apiClient } from './client'

interface RestResponse<T> {
  data: T
}

export interface CreatedPayment {
  paymentId: number
  orderCode: number
  amount: number
  qrUrl: string
  status: 'PENDING' | 'PAID' | 'CANCELLED'
}

export interface PaymentStatus {
  paymentId: number
  orderCode: number
  amount: number
  status: CreatedPayment['status']
}

export async function createPayment(userId: number, itemId: number): Promise<CreatedPayment> {
  const response = await apiClient.post<RestResponse<CreatedPayment>>(`/payments/items/${itemId}`, undefined, {
    params: { userId },
  })
  return response.data.data
}

export async function getPaymentStatus(orderCode: number): Promise<PaymentStatus> {
  const response = await apiClient.get<RestResponse<PaymentStatus>>(`/payments/${orderCode}`)
  return response.data.data
}
