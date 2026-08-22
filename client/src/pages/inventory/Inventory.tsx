import { useEffect, useState } from "react";

import { getInventory, useItemFromInventory } from "../../api/inventory";
import { CURRENT_USER_ID } from "../../api/currentUser";
import type { ItemInventory, InventoryCategory } from "../../api/inventory";
// import "../../style/global.css";
import "../../style/inventory.css";

export default function Inventory() {
  const [items, setItems] = useState<ItemInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemInventory | null>(null);
  const [activeTab, setActiveTab] = useState<InventoryCategory>("KOI");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const loadInventory = async () => {
      setLoading(true);
      try {
        const data = await getInventory(CURRENT_USER_ID);
        if (!cancelled) {
          setItems(data);
          setSelectedItem(data[0] ?? null);
          setQuantity(1);
        }
      } catch (err) {
        console.error("getInventory failed:", err);
        if (!cancelled) setError("Không thể tải kho đồ.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadInventory();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredItems = items.filter((item) => item.itemType === activeTab);

  const tabs: [string, InventoryCategory][] = [
    ["🐟", "KOI"],
    ["🍖", "FOOD"],
    ["💊", "MEDICINE"],
  ];

  const handleUseItem = async () => {
    if (!selectedItem || selectedItem.quantity < quantity) return;

    setActionLoading(true);
    setActionError(null);

    try {
      const updated = await useItemFromInventory(
        CURRENT_USER_ID,
        selectedItem.id,
        quantity,
      );

      setItems((prev) => {
        if (updated.quantity <= 0) {
          return prev.filter((item) => item.id !== updated.id);
        }

        return prev.map((item) => (item.id === updated.id ? updated : item));
      });

      if (updated.quantity > 0) {
        setSelectedItem(updated);
        setQuantity(Math.min(quantity, updated.quantity));
      } else {
        setSelectedItem(null);
        setQuantity(1);
      }
    } catch (err) {
      console.error("useItemFromInventory failed:", err);
      setActionError("Không thể dùng vật phẩm này.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <>
      <section className="title-section">
        <div className="wood-sign">
          <h1>INVENTORY</h1>
          <p>Koi Sanctuary</p>
        </div>
      </section>

      <section className="inventory-tabs">
        {tabs.map(([icon, category]) => (
          <button
            key={category}
            className={`inventory-tab ${activeTab === category ? "active" : ""}`}
            onClick={() => {
              setActiveTab(category);
              setActionError(null);
            }}
          >
            {icon} {category}
          </button>
        ))}
      </section>

      <main className="inventory-main">
        <section className="inventory-container">
          {loading ? (
            <div>Loading...</div>
          ) : error ? (
            <div>{error}</div>
          ) : (
            <div className="inventory-grid">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className={`inventory-item ${
                    selectedItem?.id === item.id ? "selected" : ""
                  }`}
                  onClick={() => {
                    setSelectedItem(item);
                    setQuantity(1);
                    setActionError(null);
                  }}
                >
                  {item.image && <img src={item.image} alt={item.name} />}

                  <span className="item-count">x{item.quantity}</span>
                </div>
              ))}

              {Array.from({
                length: Math.max(0, 20 - filteredItems.length),
              }).map((_, index) => (
                <div key={`empty-${index}`} className="inventory-item empty" />
              ))}
            </div>
          )}
        </section>

        <aside className="inventory-detail">
          <div className="detail-title">Item Details</div>

          {selectedItem && (
            <div className="detail-content">
              {selectedItem?.image && (
                <div className="inventory-koi-image">
                  <img src={selectedItem.image} alt={selectedItem.name} />
                </div>
              )}

              <h2>{selectedItem.name}</h2>

              <div className="item-effect">
                <p>Effect: +{selectedItem.effectValue}</p>
                <div className="item-effect">
                  <p>Effect: +{selectedItem.effectValue}</p>

                  <div className="inventory-quantity">
                    <div className="quantity-header">
                      <span>Quantity: x{selectedItem.quantity}</span>

                      <div className="stepper">
                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((prev) => Math.max(1, prev - 1))
                          }
                          disabled={actionLoading || quantity <= 1}
                        >
                          −
                        </button>

                        <span className="stepper-value">{quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            setQuantity((prev) =>
                              Math.min(selectedItem.quantity, prev + 1),
                            )
                          }
                          disabled={
                            actionLoading || quantity >= selectedItem.quantity
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <input
                      type="range"
                      min={1}
                      max={selectedItem.quantity}
                      step={1}
                      value={quantity}
                      onChange={(event) =>
                        setQuantity(Number(event.target.value))
                      }
                      disabled={actionLoading}
                      className="quantity-slider"
                    />
                  </div>
                </div>
              </div>

              <div className="item-description">{selectedItem.description}</div>

              {actionError && <p className="action-error">{actionError}</p>}

              <div className="detail-actions">
                {selectedItem.itemType === "KOI" && (
                  <button
                    className="equip-btn"
                    onClick={handleUseItem}
                    disabled={
                      actionLoading ||
                      !selectedItem ||
                      selectedItem.quantity <= 0
                    }
                  >
                    {actionLoading ? "Đang dùng..." : `💧 Dùng x${quantity}`}
                  </button>
                )}

                {(selectedItem.itemType === "FOOD" ||
                  selectedItem.itemType === "MEDICINE") && (
                  <button
                    className="equip-btn"
                    onClick={handleUseItem}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Đang dùng..." : "💧 Dùng"}
                  </button>
                )}

                {/* <button
                  className="sell-btn"
                  disabled
                  title="Chưa có API bán đồ"
                >
                  🪙 Sell ({selectedItem.price})
                </button> */}
              </div>
            </div>
          )}
        </aside>
      </main>
    </>
  );
}
