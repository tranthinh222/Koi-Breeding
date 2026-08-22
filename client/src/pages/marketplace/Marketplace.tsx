import { useEffect, useState } from "react";

import MarketplaceTitle from "../../components/marketplace/MarketplaceTitle";

import ShopFiltersBar, {
  type ShopFilters,
} from "../../components/marketplace/MarketplaceTabs";

import MarketplaceGrid from "../../components/marketplace/MarketplaceGrid";
import MarketplaceDetailPanel from "../../components/marketplace/MarketplaceDetailPanel";

import {
  getMarketplaceItems,
  type MarketplaceItem,
} from "../../api/marketplace";

export default function Marketplace() {
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null,
  );

  const [items, setItems] = useState<MarketplaceItem[]>([]);

  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState<ShopFilters>({
    category: "ALL",
    keyword: "",
    minPrice: "",
    maxPrice: "",
    size: "ALL",
    weight: "ALL",
    gender: "ALL",
  });

  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        setLoading(true);

        const data = await getMarketplaceItems({
          category: filters.category,
          keyword: filters.keyword,

          minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,

          maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,

          size: filters.size,
          weight: filters.weight,
          gender: filters.gender,
        });

        console.log("Marketplace API:", data);

        setItems(data);

        // Nếu item đang chọn không còn trong kết quả
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
            <p>Loading...</p>
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
