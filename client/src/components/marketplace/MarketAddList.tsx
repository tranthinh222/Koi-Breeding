import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../style/marketaddlist.css";

import { getMarketListKois, sellKoi } from "../../api/marketplace";
import { type MarketplaceKoi } from "../../api/marketplace";

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
  const navigate = useNavigate();

  const [selectedPond, setSelectedPond] = useState("All Ponds (Tất cả hồ)");

  const [selectedGender, setSelectedGender] = useState(
    "All Genders (Tất cả giới tính)",
  );

  const [sortBy, setSortBy] = useState("Sort by: Value (Giá trị)");

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

        const data = await getMarketListKois(1); // Replace with actual userId

        setKois(data);

        // Khởi tạo giá cho từng Koi
        const initialPrices: Record<number, number> = {};

        data.forEach((koi) => {
          initialPrices[koi.koiId] = koi.price ?? 1000;
        });

        setPrices(initialPrices);
      } catch (err) {
        console.error("Failed to fetch kois:", err);
        setError("Not able to load koi data.");
      } finally {
        setLoading(false);
      }
    };

    fetchKois();
  }, []);

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

      await sellKoi(koi.koiId, price, 1);

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
      setSellError("Không thể bán Koi.");
    } finally {
      setSellingKoiId(null);
    }
  };
  return (
    <main className="main-content">
      {/* HEADER */}
      <div className="header-section">
        <div className="wood-board">
          <h1>MY KOI POND</h1>
          <p>Manage your fish</p>
        </div>

        {/* VIEW SWITCH */}
        <div className="view-switch">
          <button
            className="view-btn active"
            onClick={() => navigate("/addlist")}
          >
            🐟 Cá của tôi
          </button>

          <button className="view-btn" onClick={() => navigate("/listings")}>
            🏪 Danh sách đang bán
          </button>
        </div>

        {/* FILTER */}
        <div className="filters-section">
          <select
            className="filter-select"
            value={selectedPond}
            onChange={(e) => setSelectedPond(e.target.value)}
          >
            <option>All Ponds (Tất cả hồ)</option>
            <option>Hồ #1</option>
            <option>Hồ #2</option>
          </select>

          <select
            className="filter-select"
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
          >
            <option>All Genders (Tất cả giới tính)</option>

            <option>♂ Đực</option>
            <option>♀ Cái</option>
          </select>

          <select
            className="filter-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option>Sort by: Value (Giá trị)</option>

            <option>Sort by: Rarity (Độ hiếm)</option>

            <option>Sort by: Size (Kích thước)</option>
          </select>
        </div>
      </div>

      {/* KOI GRID */}
      <div className="koi-grid">
        {kois.map((koi) => (
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
                <span className="stat-label"> Giá bán</span>
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
                  {sellingKoiId === koi.koiId ? "Đang bán..." : "Bán"}
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
