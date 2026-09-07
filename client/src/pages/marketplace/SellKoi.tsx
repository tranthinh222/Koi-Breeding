import React, { useEffect, useMemo, useState } from "react";
import "./MarketplaceManagement.css";

import { getMarketListKois, sellKoi } from "../../api/marketplace";
import { type MarketplaceKoi } from "../../api/marketplace";
import TransactionNavigation from "../../components/marketplace/TransactionNavigation";
import MarketplaceState from "../../components/marketplace/MarketplaceState";
import { useAuth } from "../../context/AuthContext";

// interface KoiCard {
//   id: number;
//   name: string;
//   rarity: "Legendary" | "Premium" | "Standard";
//   image: string;
//   gender: "male" | "female";
//   pond: string;
//   length: string;
//   weight: string;
//   value: number;
//   imageAlt: string;
// }

const AddList: React.FC = () => {
  const { currentUserId } = useAuth();
  const [selectedPond, setSelectedPond] = useState("ALL");
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [sortBy, setSortBy] = useState("VALUE");
  const [refreshKey, setRefreshKey] = useState(0);

  // Tạm thời mock data
  // const koiCards: KoiCard[] = [
  //   {
  //     id: 1,
  //     name: "Grand Kohaku",
  //     rarity: "Legendary",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuDuab3rqzvQzERwWp3eyiIWin63ZfkiGE_vQM8mTMZsHURdi3dgfbgC4jEVHUGZeL4rpTARUKQz3NR2Bn-4QtmLpEMA68zEPfibwd9ggKdCQ2Bb9Ok7mcrzkypqdO8GWQR0OdsvKBA0lK-OSGR2apI5skn2rQWpwF2IIVUlt-wThR1SCiJY6IUxNL9BmQj6YzCmzUujRC5YIbbwOQtulatS5PgI0LmDV7MWeBoZSKDDV24NQqW8otFp",
  //     gender: "male",
  //     pond: "Hồ #1",
  //     length: "85 cm",
  //     weight: "12.5 kg",
  //     value: 15000,
  //     imageAlt:
  //       "A top-down view of a stunning legendary Kohaku Koi fish swimming in crystal clear, rippling blue water.",
  //   },
  //   {
  //     id: 2,
  //     name: "Taisho Sanke",
  //     rarity: "Premium",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuCtDT-SgGecLPfNxRVspbEUxOP7w2Mqv7_-sJdA5aaNujfzhy6QGYUa8gLxEFtNqt-tP6hr7zz9nzT-QzeTPh_wcO86YKIp1U9qErGf-QMPgMhAuTQcJlllNv96EWwUr0784_8GYHFownfECTlVfDFOpAsziVvosGfwuyoU-mikO5vFZgn9Km-IOW5m8g1wpONq-JIVvQux2K5YeeuouP9y8G9BVsgna77zfzcusAPQkBt6q7RofXlT",
  //     gender: "female",
  //     pond: "Hồ #1",
  //     length: "65 cm",
  //     weight: "8.2 kg",
  //     value: 5200,
  //     imageAlt:
  //       "A top-down view of a beautiful premium Taisho Sanke Koi Koi fish swimming in clear, rippling light blue water.",
  //   },
  //   {
  //     id: 3,
  //     name: "Orange Ogon",
  //     rarity: "Standard",
  //     image:
  //       "https://lh3.googleusercontent.com/aida-public/AB6AXuBhqxSRqyyjzjfjg4qUQ_pAhhTIcpvcOrx-NRZjxtxO2ozwU1hMNOxT9lz-TFsmY50RUOPZgnu3Ai3UQf8R2Rn7d5_cVOh0Owq1A0d5tJfZA4uw4zj6XVTYxnyBdGIu6fcuXm9X-OTfNjePt2cGJoK27uIcFtgX6fynCuOM6mVSNTW8lxTSVChV9liSBy1tAKyrn4k_nkrw5acpOg-Ozddm-dzK5RF5aSJKDopLVWv2yMp04uWIMKvu",
  //     gender: "male",
  //     pond: "Hồ #2",
  //     length: "45 cm",
  //     weight: "4.1 kg",
  //     value: 1200,
  //     imageAlt:
  //       "A top-down view of a standard solid orange Ogon Koi fish swimming in calm, slightly green-tinted water.",
  //   },
  // ];

  const getRarityColor = (rarity: string): string => {
    switch (rarity) {
      case "Legendary":
        return "#f5b700";

      case "Premium":
        return "#db57fc";

      case "Standard":
        return "#51adf8";

      default:
        return "#8bc34a";
    }
  };

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
          initialPrices[koi.koiId] = koi.price ?? 1000;
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
      .filter((koi) => selectedPond === "ALL" || String(koi.pondId) === selectedPond)
      .filter((koi) => selectedGender === "ALL" || koi.gender === selectedGender)
      .sort((left, right) => {
        if (sortBy === "RARITY") return (rarityRank[right.rarity] ?? 0) - (rarityRank[left.rarity] ?? 0);
        if (sortBy === "SIZE") return Number(right.length) - Number(left.length);
        return (prices[right.koiId] ?? right.price ?? 0) - (prices[left.koiId] ?? left.price ?? 0);
      });
  }, [kois, prices, selectedGender, selectedPond, sortBy]);

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
    const price = prices[koi.koiId] ?? 1000;

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
            <button type="button" onClick={clearFilters}>Reset</button>
          </div>
          <div className="filters-section">
            <label className="filter-field">
              <span>Pond</span>
              <select className="filter-select" value={selectedPond} onChange={(e) => setSelectedPond(e.target.value)}>
                <option value="ALL">All Ponds</option>
                {pondIds.map((pondId) => <option key={pondId} value={String(pondId)}>Pond #{pondId}</option>)}
              </select>
            </label>
            <label className="filter-field">
              <span>Gender</span>
              <select className="filter-select" value={selectedGender} onChange={(e) => setSelectedGender(e.target.value)}>
                <option value="ALL">All Genders</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </label>
            <label className="filter-field">
              <span>Sort by</span>
              <select className="filter-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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
        {loading && <MarketplaceState icon="🐟" title="Loading your koi" description="Checking which koi are eligible to be listed..." />}
        {!loading && error && (
          <MarketplaceState icon="⚠️" title="Unable to load your koi" description="We could not retrieve your eligible koi. Check that the server is running, then try again." actionLabel="Try Again" onAction={() => setRefreshKey((value) => value + 1)} />
        )}
        {!loading && !error && kois.length === 0 && (
          <MarketplaceState icon="🌊" title="No koi available to sell" description="Koi already listed for sale or not currently in one of your ponds will not appear here." actionLabel="View My Ponds" onAction={() => { window.location.href = "/pond"; }} />
        )}
        {!loading && !error && kois.length > 0 && visibleKois.length === 0 && (
          <MarketplaceState icon="🔎" title="No matching koi" description="None of your eligible koi match these filters." actionLabel="Reset Filters" onAction={clearFilters} />
        )}
        {visibleKois.map((koi) => (
          <div key={koi.koiId} className="koi-card">
            <div className="card-content">
              {/* RARITY */}
              <div
                className="rarity-badge"
                style={{
                  backgroundColor: getRarityColor(koi.rarity),
                }}
              >
                {koi.rarity}
              </div>

              {/* IMAGE */}
              <div className="koi-image-container">
                <img
                  src={koi.imageUrl}
                  alt={koi.koiName}
                  className="koi-image"
                />
              </div>

              {/* NAME */}
              <div className="koi-name">
                <h2>{koi.koiName}</h2>

                <span className="gender-icon">
                  {koi.gender === "MALE" ? "♂️" : "♀️"}
                </span>
              </div>

              {/* POND */}
              <p className="koi-pond">Pond {koi.pondId}</p>

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
                  {(prices[koi.koiId] ?? 1000).toLocaleString("vi-VN")} Koins
                </span>
              </div>

              <div className="price-filter">
                <button
                  type="button"
                  className="price-adjust-btn"
                  onClick={() =>
                    handlePriceChange(
                      koi.koiId,
                      Math.max(100, (prices[koi.koiId] ?? 1000) - 100),
                    )
                  }
                >
                  −
                </button>

                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={prices[koi.koiId] ?? 1000}
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
                      Math.min(5000, (prices[koi.koiId] ?? 1000) + 100),
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
