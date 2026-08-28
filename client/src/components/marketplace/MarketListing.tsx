import React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../style/marketaddlist.css";

import { getMarketBuyKois, deleteKoiFromMarket } from "../../api/marketplace";
import { type MarketplaceKoi } from "../../api/marketplace";

// interface MarketListing {
//   id: number;
//   name: string;
//   rarity: "Legendary" | "Premium" | "Standard";
//   image: string;
//   gender: "male" | "female";
//   pond: string;
//   length: string;
//   weight: string;
//   price: number;
//   imageAlt: string;
// }

const Listings: React.FC = () => {
  const navigate = useNavigate();

  //   const marketListings: MarketListing[] = [
  //     {
  //       id: 1,
  //       name: "Kohaku Fry",
  //       rarity: "Standard",
  //       image:
  //         "https://lh3.googleusercontent.com/aida-public/AB6AXuAHo3pZsTqh9yUOBEZA5Kuli1sbNyKiN-8O_L0-IoOALIiCWY4ABrVYd4dQwN2wp4N45rpWOV61cD1GR5ytjNHjXtNHmEP5J7ccQi4e1ygfJzLdy9bGpgcdbKt4xlRwDiPa3OdTyCkN0aLmoki0EV9-owe2O4NE2VjqY47qOn7EdmaWquKDXqn-CpeqBlJ4vZYa6dShCthTCGYPJE7qmg1AxpxlmWuMJqazwqAKz4ksgOr6usXHIk9D",
  //       price: 1200,
  //       imageAlt: "Kohaku Fry Koi",
  //       gender: "female",
  //       pond: "Hồ #1",
  //       length: "35 cm",
  //       weight: "2.8 kg",
  //     },
  //     {
  //       id: 2,
  //       name: "Showa Adult",
  //       rarity: "Premium",
  //       image:
  //         "https://lh3.googleusercontent.com/aida-public/AB6AXuCu5jlfTU-zcZhuAK-h6mRraoUFnUbBdADVUIMuOdIIpJl44As7BJi_J9ioSw_u2N62B-S4RGeKSGNAAWZ8Bfwlo757kfCpLCYlFzXF-Yz7tFXftc62H3Zr0zb28s0Jme3uAaMj0r57hLVIAzMgZS9Srcfhp3aJ7FvVX1LMQS4c7wHYpl-7DtBho_6OurJdxPbO8UtM1A4nFyKiDnl55D2_RyTpQxpi4hTgR2IyQ1Zvw4f-rS7JUx5p",
  //       gender: "male",
  //       pond: "Hồ #2",
  //       length: "72 cm",
  //       weight: "9.6 kg",
  //       price: 4500,
  //       imageAlt: "Showa Adult Koi",
  //     },
  //     {
  //       id: 3,
  //       name: "Health Drops",
  //       rarity: "Standard",
  //       image:
  //         "https://lh3.googleusercontent.com/aida-public/AB6AXuDmLBsqqaUExAtNjJrjIApx7mzPVm22U10HI4uTs_GhA82GgBqLktBYuNr63nuhRrKo4AsBWz8_CpZF91MHw4ZM9R0yHLNR2fFt72PG9AKU-_QLAT9dP9wvyc9Bk_9OW82o4_c40Ts1BtiAZtDCN6YWChLhlpASFaHBDH_4KsBXyDseqrqXE_frv4pKg6KlMsTeXRWzx8r5yfKBijutay8kZBM10xTxvLL-WGFmsy6nWyoeu_CHUt",
  //       gender: "female",
  //       pond: "Hồ #1",
  //       length: "18 cm",
  //       weight: "0.9 kg",
  //       price: 300,
  //       imageAlt: "Health Drops",
  //     },
  //     {
  //       id: 4,
  //       name: "Stone Lantern",
  //       rarity: "Legendary",
  //       image:
  //         "https://lh3.googleusercontent.com/aida-public/AB6AXuBmFOuxz7EHhjdaViZsBQHEN9WD7MrFvFBeu_fc1MQ6LTIiXSa2VSwSIhWo1_Zh3LeQ5B5glqnyryhwKaImcuUhOgNQhfr0CmGoOeCtmTdm4PaBgi_0jTc289yBlLRQSDr-BHsgi2dtbnSqVx3CUGQIFyO14TK20qsLS6XCX-aD3vMfRl4eBkCSPk2Q0QDKE2mNiyCnAucJEavEV3MO9tNBIbnrwXG8COnrpV80xw1qNb8_VkiOeWni",
  //       gender: "male",
  //       pond: "Hồ #3",
  //       length: "58 cm",
  //       weight: "6.4 kg",
  //       price: 2500,
  //       imageAlt: "Stone Lantern",
  //     },
  //   ];

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

  const [kois, setKois] = React.useState<MarketplaceKoi[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchKois = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getMarketBuyKois(1); // Replace with actual userId

        setKois(data);
      } catch (err) {
        console.error("Failed to fetch kois:", err);
        setError("Not able to load koi data.");
      } finally {
        setLoading(false);
      }
    };
    fetchKois();
  }, []);

  const [deletingKoiId, setDeletingKoiId] = useState<number | null>(null);
  const handleRemoveListing = async (koiId: number) => {
    try {
      setDeletingKoiId(koiId);
      setError(null);

      await deleteKoiFromMarket(koiId, 1);

      setKois((prev) => prev.filter((item) => item.koiId !== koiId));
    } catch (err) {
      console.error("Failed to remove koi from market:", err);
      setError("Don't able to remove koi from market.");
    } finally {
      setDeletingKoiId(null);
    }
  };

  const totalGold = kois.reduce((total, item) => total + (item.price || 0), 0);
  return (
    <main className="main-content">
      {/* HEADER */}
      <div className="header-section">
        <header className="title-section">
          <div className="wood-sign">
            <div className="koi-title-container"></div>
            <h1 className="koi-title-desktop">HOME</h1>
            <p>User Info</p>
            <h1 className="koi-title-mobile">HOME</h1>
          </div>
        </header>

        {/* VIEW SWITCH */}
        <div className="view-switch">
          <button className="view-btn" onClick={() => navigate("/addlist")}>
            🐟 Cá của tôi
          </button>

          <button
            className="view-btn active"
            onClick={() => navigate("/listings")}
          >
            🏪 Danh sách đang bán
          </button>
        </div>
      </div>

      {/* SUMMARY */}
      <div className="listings-container">
        <div className="listing-summary">
          <div className="summary-item">
            <div className="summary-icon">📋</div>

            <div>
              <p className="summary-label">TOTAL ACTIVE LISTINGS</p>

              <p className="summary-value">{kois.length} Items</p>
            </div>
          </div>

          <div className="summary-divider" />

          <div className="summary-item">
            <div className="summary-icon gold">💰</div>

            <div>
              <p className="summary-label">TOTAL GOLD POTENTIAL</p>

              <p className="summary-value">💰 {totalGold.toLocaleString()}</p>
            </div>
          </div>

          <button
            className="new-listing-btn"
            onClick={() => navigate("/addlist")}
          >
            ＋ Thêm cá
          </button>
        </div>

        {/* LISTING GRID */}
        <div className="listing-grid">
          {kois.map((item) => (
            <div key={item.koiId} className="koi-card">
              <div className="card-content">
                {/* IMAGE */}
                <div className="koi-image-container">
                  <img
                    src={item.imageUrl}
                    alt={item.koiName}
                    className="koi-image"
                  />
                </div>

                {/* RARITY */}
                <div
                  className="rarity-badge"
                  style={{
                    backgroundColor: getRarityColor(item.rarity),
                  }}
                >
                  {item.rarity}
                </div>

                {/* NAME */}
                <div className="koi-name">
                  <h2>{item.koiName}</h2>

                  <span className="gender-icon">
                    {item.gender === "MALE" ? "♂️" : "♀️"}
                  </span>
                </div>

                {/* POND */}
                <p className="koi-pond">{item.pondId}</p>

                {/* STATS */}
                <div className="koi-stats">
                  <div className="stat-box">
                    <span className="stat-label">Chiều dài</span>

                    <span className="stat-value">{item.length}</span>
                  </div>

                  <div className="stat-box">
                    <span className="stat-label">Cân nặng</span>

                    <span className="stat-value">{item.weight}</span>
                  </div>
                </div>

                {/* PRICE */}
                <div className="listing-price">
                  <span className="listed-price-label">Giá niêm yết</span>

                  <span className="listed-price">
                    💰 {item.price?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* FOOTER */}
              <div className="card-footer">
                <div className="card-actions">
                  <button
                    className="btn-sell"
                    onClick={() => handleRemoveListing(item.koiId)}
                    disabled={deletingKoiId === item.koiId}
                  >
                    {deletingKoiId === item.koiId
                      ? "⏳ Deleting..."
                      : "🗑 Gỡ bán"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Listings;
