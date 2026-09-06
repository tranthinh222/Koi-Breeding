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
import TransactionNavigation from "../../components/marketplace/TransactionNavigation";
import MarketplaceState from "../../components/marketplace/MarketplaceState";
import { useAuth } from "../../context/AuthContext";

export default function Marketplace() {
  const { currentUserId } = useAuth();
  const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(
    null,
  );

  const [items, setItems] = useState<MarketplaceItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [filters, setFilters] = useState<ShopFilters>(EMPTY_FILTERS);

  // Pond Dialog
  const [showPondDialog, setShowPondDialog] = useState(false);

  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const [buySuccess, setBuySuccess] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const PAGE_SIZE = 8;
  useEffect(() => {
    const fetchMarketplace = async () => {
      try {
        setLoading(true);
        setLoadError(false);

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

        const result = await getMarketplaceItems(
          apiParams,
          currentPage,
          PAGE_SIZE,
        );

        console.log("Marketplace page:", result);

        setItems(result.content);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error("Failed to load marketplace:", error);

        setItems([]);
        setTotalPages(0);
        setLoadError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketplace();
  }, [filters, currentPage]);

  // buy koi
  const handleBuyKoi = async (pondId: number) => {
    if (!selectedItem) {
      return;
    }

    try {
      setBuying(true);
      setBuyError(null);
      setBuySuccess(null);

      if (!currentUserId) throw new Error("You must be signed in to buy koi.");
      const userId = currentUserId;

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

      setBuySuccess("Koi purchased successfully!");

      setShowPondDialog(false);

      // Xóa Koi vừa mua khỏi marketplace
      setItems((current) =>
        current.filter((item) => item.id !== selectedItem.id),
      );

      setSelectedItem(null);
    } catch (error: any) {
      console.error("Buy koi failed:", error);

      const message = error?.response?.data?.message || "Unable to purchase this koi.";

      setBuyError(message);
    } finally {
      setBuying(false);
    }
  };
  // Render
  return (
    <>
      <MarketplaceTitle />

      <TransactionNavigation />

      <main
        className={`marketplace-main ${
          selectedItem ? "has-detail" : "no-detail"
        }`}
      >
        <section>
          <ShopFiltersBar filters={filters} onChange={setFilters} />

          {loading ? (
            <MarketplaceState icon="🐟" title="Loading marketplace" description="Looking for koi currently available for sale..." />
          ) : loadError ? (
            <MarketplaceState icon="⚠️" title="Marketplace unavailable" description="We could not load marketplace listings. Please check your connection and try again." actionLabel="Try Again" onAction={() => setFilters({ ...filters })} />
          ) : items.length === 0 ? (
            <MarketplaceState icon="🐟" title="No koi found" description="There are no active listings matching your filters right now." actionLabel="Clear Filters" onAction={() => { setFilters(EMPTY_FILTERS); setCurrentPage(0); }} />
          ) : (
            <>
              <MarketplaceGrid
                items={items}
                selectedItem={selectedItem}
                onSelect={setSelectedItem}
              />

              {totalPages > 1 && (
                <div className="pagination">
                  <button
                    disabled={currentPage === 0}
                    onClick={() => setCurrentPage((page) => page - 1)}
                  >
                    Previous
                  </button>

                  {Array.from({ length: totalPages }, (_, index) => (
                    <button
                      key={index}
                      className={currentPage === index ? "active" : ""}
                      onClick={() => setCurrentPage(index)}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages - 1}
                    onClick={() => setCurrentPage((page) => page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
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
        userId={currentUserId ?? 0}
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
