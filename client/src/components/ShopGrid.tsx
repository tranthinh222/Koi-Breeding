import type { ShopItem } from '../api/shop'
import ShopCard from './ShopCard'

interface ShopGridProps {
  items: ShopItem[]
  selectedItem: ShopItem | null
  onSelect: (item: ShopItem) => void
}

export default function ShopGrid({
  items,
  selectedItem,
  onSelect,
}: ShopGridProps) {
  return (
    <div className="fish-grid">
      {items.map((item) => (
        <ShopCard
          key={item.id}
          item={item}
          selected={selectedItem?.id === item.id}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
