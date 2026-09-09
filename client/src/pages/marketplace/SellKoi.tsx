import React, { useEffect, useMemo, useState } from "react";
import "./MarketplaceManagement.css";

import {
  getMarketListKois,
  sellKoi,
  type MarketplaceKoi,
} from "../../api/marketplace";
import MarketplaceState from "../../components/marketplace/MarketplaceState";
import TransactionNavigation from "../../components/marketplace/TransactionNavigation";
import { useAuth } from "../../context/AuthContext";

const AddList: React.FC = () => {
  const { currentUserId } = useAuth();
  const [selectedPond, setSelectedPond] = useState("ALL");
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [sortBy, setSortBy] = useState("VALUE");
  const [refreshKey, setRefreshKey] = useState(0);

  const [kois, setKois] = useState<MarketplaceKoi[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<number, number>>({});
  const [sellingKoiId, setSellingKoiId] = useState<number | null>(null);
  const [sellError, setSellError] = useState<string | null>(null);

  useEffect(() => {
    const fetchKois = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!currentUserId) return;
        const data = await getMarketListKois(currentUserId);

        setKois(data);

        // Khởi tạo giá cho từng Koi
        const initialPrices: Record<number, number> = {};

        data.forEach((koi) => {
          initialPrices[koi.koiId] = koi.price;
        });

        setPrices(initialPrices);
      } catch (err) {
        console.error("Failed to fetch kois:", err);
        setError("Unable to load koi data.");
      } finally {
        setLoading(false);
      }
    };

    fetchKois();
  }, [currentUserId, refreshKey]);

  const pondIds = useMemo(
    () => [...new Set(kois.map((koi) => koi.pondId))],
    [kois],
  );

  const visibleKois = useMemo(() => {
    const rarityRank: Record<string, number> = {
      Legendary: 4,
      Premium: 3,
      Standard: 2,
      Common: 1,
    };

    return kois
      .filter(
        (koi) => selectedPond === "ALL" || String(koi.pondId) === selectedPond,
      )
      .filter(
        (koi) => selectedGender === "ALL" || koi.gender === selectedGender,
      )
      .sort((left, right) => {
        if (sortBy === "RARITY")
          return (
            (rarityRank[right.rarity] ?? 0) - (rarityRank[left.rarity] ?? 0)
          );
        if (sortBy === "SIZE")
          return Number(right.length) - Number(left.length);
        return right.price - left.price;
      });
  }, [kois, selectedGender, selectedPond, sortBy]);

  const clearFilters = () => {
    setSelectedPond("ALL");
    setSelectedGender("ALL");
    setSortBy("VALUE");
  };

  const handlePriceChange = (koiId: number, price: number) => {
    setPrices((prev) => ({
      ...prev,
      [koiId]: price,
    }));
  };
  const handleSell = async (koi: MarketplaceKoi) => {
    const price = prices[koi.koiId] ?? koi.price;

    try {
      setSellingKoiId(koi.koiId);
      setSellError(null);

      if (!currentUserId) throw new Error("You must be signed in to sell koi.");
      await sellKoi(koi.koiId, price, currentUserId);

      // Xóa Koi khỏi danh sách của tôi
      setKois((prev) => prev.filter((item) => item.koiId !== koi.koiId));

      // Xóa giá của Koi đó
      setPrices((prev) => {
        const newPrices = { ...prev };
        delete newPrices[koi.koiId];
        return newPrices;
      });
    } catch (error) {
      console.error(error);
      setSellError("Unable to list this koi for sale.");
    } finally {
      setSellingKoiId(null);
    }
  };
  return (
    <main className="main-content">
      {sellError && <p className="error-message">{sellError}</p>}
      {/* HEADER */}
      <div className="header-section">
        <header className="title-section">
          <div className="wood-sign">
            <div className="koi-title-container"></div>
            <h1 className="koi-title-desktop">SELL KOI</h1>
            <p>Choose a koi and set your asking price</p>
          </div>
        </header>

        <TransactionNavigation />

        {/* FILTER */}
        <div className="sell-filter-panel">
          <div className="sell-filter-heading">
            <div>
              <strong>Find a koi to sell</strong>
              <span>{visibleKois.length} eligible koi</span>
            </div>
            <button type="button" onClick={clearFilters}>
              Reset
            </button>
          </div>
          <div className="filters-section">
            <label className="filter-field">
              <span>Pond</span>
              <select
                className="filter-select"
                value={selectedPond}
                onChange={(e) => setSelectedPond(e.target.value)}
              >
                <option value="ALL">All Ponds</option>
                {pondIds.map((pondId) => (
                  <option key={pondId} value={String(pondId)}>
                    Pond #{pondId}
                  </option>
                ))}
              </select>
            </label>
            <label className="filter-field">
              <span>Gender</span>
              <select
                className="filter-select"
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              >
                <option value="ALL">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Sort by</span>
              <select
                className="filter-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="VALUE">Highest Value</option>
                <option value="RARITY">Highest Rarity</option>
                <option value="SIZE">Largest Size</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {/* KOI GRID */}
      <div className="koi-grid">
        {loading && (
          <MarketplaceState
            icon="🐟"
            title="Loading your koi"
            description="Checking which koi are eligible to be listed..."
          />
        )}
        {!loading && error && (
          <MarketplaceState
            icon="⚠️"
            title="Unable to load your koi"
            description="We could not retrieve your eligible koi. Check that the server is running, then try again."
            actionLabel="Try Again"
            onAction={() => setRefreshKey((value) => value + 1)}
          />
        )}
        {!loading && !error && kois.length === 0 && (
          <MarketplaceState
            icon="🌊"
            title="No koi available to sell"
            description="Koi already listed for sale or not currently in one of your ponds will not appear here."
            actionLabel="View My Ponds"
            onAction={() => {
              window.location.href = "/pond";
            }}
          />
        )}
        {!loading && !error && kois.length > 0 && visibleKois.length === 0 && (
          <MarketplaceState
            icon="🔎"
            title="No matching koi"
            description="None of your eligible koi match these filters."
            actionLabel="Reset Filters"
            onAction={clearFilters}
          />
        )}
        {visibleKois.map((koi) => (
          <div key={koi.koiId} className="koi-card">
            <div className="card-content">
              {/* IMAGE */}
              <div className="koi-image-container">
                <img
                  src={koi.imageUrl}
                  alt={koi.koiName}
                  className="koi-image"
                />
              </div>

              {/* RARITY */}
              {/* <div
                className="rarity-badge"
                style={{
                  backgroundColor: getRarityColor(koi.rarity),
                }}
              >
                {koi.rarity}
              </div> */}

              {/* NAME */}
              <div className="koi-name">
                <h2>{koi.koiName}</h2>

                <span className="gender-icon">
                  {koi.gender === "MALE" ? "♂️" : "♀️"}
                </span>
              </div>

              {/* POND */}
              <p className="koi-pond">
                Pond {koi.pondId}: {koi.pondName}
              </p>

              {/* STATS */}
              <div className="koi-stats">
                <div className="stat-box">
                  <span className="stat-label">Length (cm)</span>

                  <span className="stat-value">{koi.length}</span>
                </div>

                <div className="stat-box">
                  <span className="stat-label">Weight (g)</span>

                  <span className="stat-value">{koi.weight}</span>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <div className="price-section">
                <span className="stat-label">Sale Price</span>
                <span className="gold-icon">🪙</span>

                <span className="price">
                  {(prices[koi.koiId] ?? koi.price).toLocaleString("vi-VN")}{" "}
                  Koins
                </span>
              </div>

              <div className="price-filter">
                <button
                  type="button"
                  className="price-adjust-btn"
                  onClick={() =>
                    handlePriceChange(
                      koi.koiId,
                      Math.max(0, (prices[koi.koiId] ?? koi.price) - 100),
                    )
                  }
                >
                  −
                </button>

                <input
                  type="range"
                  min="0"
                  max={koi.price}
                  step="1"
                  value={prices[koi.koiId] ?? koi.price}
                  onChange={(e) =>
                    handlePriceChange(koi.koiId, Number(e.target.value))
                  }
                  className="price-range"
                />

                <button
                  type="button"
                  className="price-adjust-btn"
                  onClick={() =>
                    handlePriceChange(
                      koi.koiId,
                      Math.min(
                        koi.price,
                        (prices[koi.koiId] ?? koi.price) + 100,
                      ),
                    )
                  }
                >
                  +
                </button>
              </div>
              <div className="card-actions">
                <button
                  className="btn-sell"
                  onClick={() => handleSell(koi)}
                  disabled={sellingKoiId === koi.koiId}
                >
                  {sellingKoiId === koi.koiId ? "Listing..." : "List for Sale"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AddList;
