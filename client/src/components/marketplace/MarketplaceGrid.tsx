import type { MarketplaceItem } from "../../api/marketplace";
import MarketplaceCard from "./MarketplaceCard";

interface ShopGridProps {
  items: MarketplaceItem[];
  selectedItem: MarketplaceItem | null;
  onSelect: (item: MarketplaceItem) => void;
}

export default function ShopGrid({
  items,
  selectedItem,
  onSelect,
}: ShopGridProps) {
  return (
    <div className="fish-grid">
      {items.map((item) => (
        <MarketplaceCard
          key={item.id}
          item={item}
          selected={selectedItem?.id === item.id}
          onSelect={() => onSelect(item)}
        />
      ))}
    </div>
  );
}
