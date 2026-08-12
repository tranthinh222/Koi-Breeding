import { useState } from "react";
import type { ShopItem } from "../api/shop";
import { purchaseShopItem } from "../api/shop";
import { addItemToInventory } from "../api/inventory";

const CURRENT_USER_ID = 1;

export function usePurchase() {
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState<string | null>(null);

  const buyItem = async (item: ShopItem, quantity = 1) => {
    setBuying(true);
    setBuyError(null);
    setBuySuccess(null);

    try {
      await purchaseShopItem(CURRENT_USER_ID, item.id, quantity);
      await addItemToInventory(CURRENT_USER_ID, item.id, quantity);
      setBuySuccess(`Đã mua ${item.name}!`);
    } catch (err) {
      console.error("Purchase failed:", err);
      setBuyError("Mua thất bại. Vui lòng thử lại.");
    } finally {
      setBuying(false);
    }
  };

  return { buyItem, buying, buyError, buySuccess };
}
