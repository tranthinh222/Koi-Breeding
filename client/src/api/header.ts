import axios from 'axios'
import { apiClient } from './client'

export interface HeaderInfo {
  id: number
  username: string
  balance: number
}


export async function get