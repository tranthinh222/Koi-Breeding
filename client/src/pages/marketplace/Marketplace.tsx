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
  type MarketplaceItem,
  type MarketplaceApiParams,
} from "../../api/marketplace";

export default function Marketplace() {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null,
  );
  const [items, setItems] = useState<MarketplaceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<ShopFilters>(EMPTY_FILTERS);

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        setLoading(true);

        // Chuyển đổi ShopFilters (string) → MarketplaceApiParams (number)
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

        // Nếu item đang chọn không còn trong kết quả, bỏ chọn
        setSelectedItem((current) => {
          if (!current) return null;
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

        {selectedItem && <MarketplaceDetailPanel item={selectedItem} />}
      </main>
    </>
  );
}
