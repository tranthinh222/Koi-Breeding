import { useState } from 'react'
import type { ShopItem } from '../api/shop'
import { purchaseShopItem } from '../api/shop'
import { useAuth } from '../context/AuthContext'

export function usePurchase() {
  const { currentUserId } = useAuth()
  const [buying, setBuying] = useState(false)
  const [buyError, setBuyError] = useState<string | null>(null)
  const [buySuccess, setBuySuccess] = useState<string | null>(null)

  const buyItem = async (item: ShopItem, quantity = 1) => {
    setBuying(true)
    setBuyError(null)
    setBuySuccess(null)

    try {
      if (!currentUserId) {
        throw new Error('Please login before buying items.')
      }

      const purchase = await purchaseShopItem(currentUserId, item.id, quantity)
      window.dispatchEvent(new CustomEvent('wallet:updated', { detail: purchase.balance }))

      setBuySuccess(`Bought ${item.name}!`)
    } catch (err) {
      console.error('Purchase failed:', err)
      setBuyError('Buying failed. Please try again !')
    } finally {
      setBuying(false)
    }
  }

  return { buyItem, buying, buyError, buySuccess }
}
