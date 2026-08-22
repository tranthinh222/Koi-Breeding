import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { ShopItem } from "../../api/shop";
import { getShopItem } from "../../api/shop";

import ShopGrid from "../../components/user/ShopGrid";
import DetailPanel from "../../components/DetailPanel";

interface Props {
  selectedItem: ShopItem | null;
  onSelect: (item: ShopItem) => void;
}

export default function KoinShop({ selectedItem, onSelect }: Props) {
  const [items, setItems] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;

    const loadItems = async () => {
      try {
        const data = await getShopItem("CURRENCY");

        if (!cancelled) {
          setItems(data);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadItems();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <main className="shop-main">Loading koins...</main>;
  }

  if (items.length === 0) {
    return <main className="shop-main">No koins available.</main>;
  }

  const currentItem = selectedItem;

  return (
    <main className={`shop-main ${currentItem ? "has-detail" : "no-detail"}`}>
      <ShopGrid items={items} selectedItem={currentItem} onSelect={onSelect} />

      {currentItem && (
        <DetailPanel
          item={selectedItem}
          onBuy={() => navigate(`/payment/${selectedItem.id}`)}
        />
      )}
    </main>
  );
}
