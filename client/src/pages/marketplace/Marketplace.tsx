import { useEffect, useState } from "react";

import MarketplaceTitle from "../../components/marketplace/MarketplaceTitle";
import ShopFiltersBar, {
  EMPTY_FILTERS,
  type ShopFilters,
} from "../../components/marketplace/MarketplaceTabs";
import MarketplaceGrid from "../../components/marketplace/MarketplaceGrid";
import MarketplaceDetailPanel from "../../components/marketplace/MarketplaceDetailPanel";

import {
  getMarketplaceItems,
  buyKoi,
  type MarketplaceItem,
  type MarketplaceApiParams,
} from "../../api/marketplace";
import { getBalanceWallet } from "../../api/wallet";

import PondSelectDialog from "../../components/pond/PondSelectDialog";

export default function Marketplace() {
  // =========================
  // Marketplace
  // =========================

  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null,
  );

  const [items, setItems] = useState<MarketplaceItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ShopFilters>(EMPTY_FILTERS);

  // Pond Dialog
  const [showPondDialog, setShowPondDialog] = useState(false);

  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState<string | null>(null);

  // Load Marketplace
  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        setLoading(true);

        const apiParams: MarketplaceApiParams = {
          category: filters.category,
          keyword: filters.keyword || undefined,

          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,

          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,

          minLength: filters.minLength ? Number(filters.minLength) : undefined,

          maxLength: filters.maxLength ? Number(filters.maxLength) : undefined,

          minWeight: filters.minWeight ? Number(filters.minWeight) : undefined,

          maxWeight: filters.maxWeight ? Number(filters.maxWeight) : undefined,

          gender: filters.gender,
        };

        const data = await getMarketplaceItems(apiParams);

        console.log("Marketplace items loaded:", data);

        setItems(data);

        // Nếu item đang chọn không còn trong kết quả
        setSelectedItem((current) => {
          if (!current) {
            return null;
          }

          const stillExists = data.some((item) => item.id === current.id);

          return stillExists ? current : null;
        });
      } catch (error) {
        console.error("Failed to load marketplace:", error);

        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplace();
  }, [filters]);

  // buy koi
  const handleBuyKoi = async (pondId: number) => {
    if (!selectedItem) {
      return;
    }

    try {
      setBuying(true);
      setBuyError(null);
      setBuySuccess(null);

      const userId = 1;

      const result = await buyKoi(
        userId,
        selectedItem.sellerId,
        selectedItem.koiId,
        selectedItem.price,
        pondId,
      );

      console.log("Buy koi success:", result);

      try {
        const wallet = await getBalanceWallet(userId);
        window.dispatchEvent(
          new CustomEvent<number>("wallet:updated", {
            detail: wallet.balance,
          }),
        );
      } catch (error) {
        console.error("Failed to refresh wallet balance:", error);
      }

      setBuySuccess("Mua Koi thành công!");

      setShowPondDialog(false);

      // Xóa Koi vừa mua khỏi marketplace
      setItems((current) =>
        current.filter((item) => item.id !== selectedItem.id),
      );

      setSelectedItem(null);
    } catch (error: any) {
      console.error("Buy koi failed:", error);

      const message = error?.response?.data?.message || "Mua Koi thất bại.";

      setBuyError(message);
    } finally {
      setBuying(false);
    }
  };
  // Render
  return (
    <>
      <MarketplaceTitle />

      <main
        className={`marketplace-main ${
          selectedItem ? "has-detail" : "no-detail"
        }`}
      >
        <section>
          <ShopFiltersBar filters={filters} onChange={setFilters} />

          {loading ? (
            <p>Loading marketplace items...</p>
          ) : items.length === 0 ? (
            <p>No items found. Try adjusting your filters.</p>
          ) : (
            <MarketplaceGrid
              items={items}
              selectedItem={selectedItem}
              onSelect={setSelectedItem}
            />
          )}
        </section>

        {/* Detail Panel */}
        {selectedItem && (
          <MarketplaceDetailPanel
            item={selectedItem}
            onOpenPondDialog={() => {
              setBuyError(null);
              setBuySuccess(null);
              setShowPondDialog(true);
            }}
            buying={buying}
            buyError={buyError}
            buySuccess={buySuccess}
          />
        )}
      </main>

      {/* Pond Select Dialog */}
      <PondSelectDialog
        open={showPondDialog}
        userId={1}
        onClose={() => {
          if (!buying) {
            setShowPondDialog(false);
          }
        }}
        onSelect={async (pond) => {
          console.log("Selected Koi:", selectedItem);

          console.log("Selected Pond:", pond);

          await handleBuyKoi(pond.id);
        }}
      />
    </>
  );
}
