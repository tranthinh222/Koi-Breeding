import { useEffect, useState } from 'react'
import type { ShopItem } from '../../api/shop'
import { getShopItem } from '../../api/shop'
import { usePurchase } from '../../hooks/usePurchase'

import ShopGrid from '../../components/ShopGrid'
import DetailPanel from '../../components/DetailPanel'

interface Props {
  selectedItem: ShopItem | null
  onSelect: (item: ShopItem) => void
}

export default function FoodShop({ selectedItem, onSelect }: Props) {
  const [items, setItems] = useState<ShopItem[]>([])
  const [loading, setLoading] = useState(true)
  const { buyItem, buying, buyError, buySuccess } = usePurchase()

  useEffect(() => {
    let cancelled = false

    const loadItems = async () => {
      try {
        const data = await getShopItem('FOOD')
        if (!cancelled) setItems(data)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadItems()

    return () => {
      cancelled = true
    }
  }, [])

  if (loading) {
    return <main className="shop-main">Loading food...</main>
  }

  if (items.length === 0) {
    return <main className="shop-main">No food available.</main>
  }

  const currentItem = selectedItem

  return (
    <main className="shop-main">
      <ShopGrid items={items} selectedItem={currentItem} onSelect={onSelect} />

      {currentItem && (
        <DetailPanel
          item={currentItem}
          onBuy={() => buyItem(currentItem)}
          buying={buying}
          buyError={buyError}
          buySuccess={buySuccess}
        />
      )}
    </main>
  )
}
