import axios from 'axios'
import { apiClient } from './client'

export type ShopCategory = 'FOOD' | 'MEDICINE' | 'KOI' | 'CURRENCY'
export interface ShopItem {
  id: number
  name: string
  image?: string
  category: ShopCategory
  price: number
  currency: 'KOINS' | 'USD'
  rarity?: 'COMMON' | 'STANDARD' | 'PREMIUM' | 'LEGENDARY'
  description: string
  detailDescription?: string
  coinAmount?: number
}

const fromBackendItem = (item: BackendItem): ShopItem => ({
  id: item.id,
  name: item.name,
  category: item.itemType,
  price: item.price,
  currency: item.itemType === 'CURRENCY' ? 'USD' : 'KOINS',
  coinAmount: item.itemType === 'CURRENCY' ? item.effectValue : undefined,
  description: item.description,
})
const products: ShopItem[] = [
  {
    id: 1,
    name: 'Koi - Kohaku',
    category: 'KOI',
    price: 100,
    currency: 'KOINS',
    description: 'Classic white Koi with vivid red Hi markings.',
  },
  {
    id: 2,
    name: 'Koi - Tancho',
    category: 'KOI',
    price: 180,
    currency: 'KOINS',
    description: 'Distinctive Koi with a red head marking.',
  },
  {
    id: 3,
    name: 'Koi - Taisho Sanke',
    category: 'KOI',
    price: 120,
    currency: 'KOINS',
    description: 'A graceful three-colour Koi variety.',
  },
  {
    id: 4,
    name: 'Koi Food - Aqua Master',
    category: 'FOOD',
    price: 15,
    currency: 'KOINS',
    rarity: 'COMMON',
    description: 'Recover 15 food points for your Koi.',
  },
  {
    id: 5,
    name: 'Koi Food - Bethech',
    category: 'FOOD',
    price: 25,
    currency: 'KOINS',
    rarity: 'STANDARD',
    description: 'A balanced food for healthy Koi growth.',
  },
  {
    id: 6,
    name: 'Health Elixir - KAFKA',
    category: 'MEDICINE',
    price: 45,
    currency: 'KOINS',
    rarity: 'PREMIUM',
    description: 'Restores Koi health with a premium formula.',
  },
  {
    id: 7,
    name: 'Environment Elixir - KMnO4',
    category: 'MEDICINE',
    price: 15,
    currency: 'KOINS',
    rarity: 'COMMON',
    description: 'Recovers pond water quality.',
  },
  {
    id: 8,
    name: '250 Koins',
    category: 'CURRENCY',
    price: 0.99,
    currency: 'USD',
    coinAmount: 250,
    description: 'A starter Koin package for new players.',
  },
  {
    id: 9,
    name: '750 Koins',
    category: 'CURRENCY',
    price: 2.99,
    currency: 'USD',
    coinAmount: 750,
    description: 'A small Koin package for your pond.',
  },
  {
    id: 10,
    name: '3,000 Koins',
    category: 'CURRENCY',
    price: 4.99,
    currency: 'USD',
    coinAmount: 3000,
    description: 'A value pack of Koins for your pond.',
  },
  {
    id: 11,
    name: '9,000 Koins',
    category: 'CURRENCY',
    price: 9.99,
    currency: 'USD',
    coinAmount: 9000,
    description: 'A large Koin package for dedicated players.',
  },
  {
    id: 12,
    name: '25,000 Koins',
    category: 'CURRENCY',
    price: 19.99,
    currency: 'USD',
    coinAmount: 25000,
    description: 'The best-value package of Koins.',
  },
]

interface ShopPageResponse {
  content: BackendItem[]
}

interface RestResponse<T> {
  statusCode: number
  message: string
  data: T
}

interface BackendItem {
  id: number
  name: string
  price: number
  itemType: ShopCategory
  effectValue: number
  description: string
  quantity: number
}

export async function getShopItem(
  category: ShopCategory,
  signal?: AbortSignal,
): Promise<ShopItem[]> {
  try {
    const response = await apiClient.get<RestResponse<ShopPageResponse>>(
      '/shop/items',
      {
        params: { category, page: 0, size: 20 },
        signal,
      },
    )
    return response.data.data.content.map(fromBackendItem)
  } catch (error) {
    if (axios.isCancel(error)) throw error
    console.error(
      'Shop API request failed. Using demo products instead.',
      error,
    )
    return products.filter((product) => product.category === category)
  }
}

export async function purchaseShopItem(
  userId: number,
  itemId: number,
  quantity: number,
): Promise<void> {
  try {
    await apiClient.post(`/shop/${userId}/items/${itemId}/purchase`, {
      quantity: quantity,
    })
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) return
    throw error
  }
}
