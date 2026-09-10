import { useEffect, useState } from "react";

import { getApiErrorMessage } from "../../api/client";
import type { InventoryCategory, ItemInventory } from "../../api/inventory";
import { getInventory } from "../../api/inventory";
import { callFeedKoi, callFetchKoisInPond } from "../../api/koi";
import { getPondsByOwner, useEnvironmentItem, type Pond } from "../../api/pond";
import InventoryKoiDialog from "../../components/inventory/InventoryKoiDialog";
import InventoryPondDialog from "../../components/inventory/InventoryPondDialog";
import { useAuth } from "../../context/AuthContext";
import type { IKoi } from "../../types/backend";
import "./Inventory.css";

export default function Inventory() {
  const { currentUserId } = useAuth();
  const [items, setItems] = useState<ItemInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<ItemInventory | null>(null);
  const [activeTab, setActiveTab] = useState<InventoryCategory>("KOI");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [kois, setKois] = useState<IKoi[]>([]);
  const [targetPondId, setTargetPondId] = useState<number | "">("");
  const [targetKoiId, setTargetKoiId] = useState<number | "">("");
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [pondDialogOpen, setPondDialogOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadInventory = async () => {
      setLoading(true);
      try {
        const data = await getInventory(currentUserId as number);
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
  }, [currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;

    const loadTargets = async () => {
      try {
        const ownedPonds = await getPondsByOwner(currentUserId);
        const koiResponses = await Promise.all(
          ownedPonds.map((pond) => callFetchKoisInPond(pond.id)),
        );

        setPonds(ownedPonds);
        setKois(koiResponses.flatMap((response) => response.data.data ?? []));
      } catch (err) {
        console.error("Failed to load inventory item targets:", err);
      }
    };

    void loadTargets();
  }, [currentUserId]);

  const filteredItems = items.filter((item) => item.itemType === activeTab);

  const tabs: [string, InventoryCategory][] = [
    ["🐟", "KOI"],
    ["🍖", "FOOD"],
    ["💊", "MEDICINE"],
  ];

  const updateInventoryQuantity = (itemId: number, remaining: number) => {
    setItems((prev) => {
      if (remaining <= 0) return prev.filter((item) => item.id !== itemId);
      return prev.map((item) =>
        item.id === itemId ? { ...item, quantity: remaining } : item,
      );
    });
  };

  const handleUseItem = async (): Promise<boolean> => {
    if (!selectedItem || selectedItem.quantity < quantity) return false;
    if (selectedItem.itemType === "KOI") {
      setActionError("Koi cannot be used as an inventory consumable.");
      return false;
    }
    if (selectedItem.itemType === "FOOD" && targetKoiId === "") {
      setActionError("Select a koi to feed first.");
      return false;
    }
    if (selectedItem.itemType === "MEDICINE" && targetPondId === "") {
      setActionError("Select a pond to apply this medicine first.");
      return false;
    }

    setActionLoading(true);
    setActionError(null);

    try {
      if (selectedItem.itemType === "FOOD") {
        const response = await callFeedKoi(targetKoiId as number, {
          userId: currentUserId as number,
          itemId: selectedItem.id,
          quantity,
        });
        const result = response.data.data;
        if (!result) throw new Error("The server returned no feeding result.");
        setKois((previous) =>
          previous.map((koi) => (koi.id === result.koi.id ? result.koi : koi)),
        );
        updateInventoryQuantity(selectedItem.id, result.remainingItemQuantity);
        setSelectedItem((current) =>
          current && result.remainingItemQuantity > 0
            ? { ...current, quantity: result.remainingItemQuantity }
            : null,
        );
      } else {
        await useEnvironmentItem(
          targetPondId as number,
          selectedItem.id,
          currentUserId as number,
          quantity,
        );
        const remaining = selectedItem.quantity - quantity;
        updateInventoryQuantity(selectedItem.id, remaining);
        setSelectedItem((current) =>
          current && remaining > 0 ? { ...current, quantity: remaining } : null,
        );
      }
      setQuantity(1);
      return true;
    } catch (err) {
      console.error("useItemFromInventory failed:", err);
      setActionError(getApiErrorMessage(err, "Không thể dùng vật phẩm này."));
      return false;
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
                <div className="detail-image inventory-koi-image">
                  <img src={selectedItem.image} alt={selectedItem.name} />
                </div>
              )}

              <h2>{selectedItem.name}</h2>

              <div className="item-effect">
                <p>Effect: +{selectedItem.effectValue}</p>
                <div className="item-effect">
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
                {(selectedItem.itemType === "FOOD" ||
                  selectedItem.itemType === "MEDICINE") && (
                  <button
                    className="equip-btn"
                    onClick={() => {
                      if (selectedItem.itemType === "FOOD") {
                        setActionError(null);
                        setFoodDialogOpen(true);
                        return;
                      }
                      setActionError(null);
                      setPondDialogOpen(true);
                    }}
                    disabled={actionLoading}
                  >
                    {actionLoading ? "Đang dùng..." : `💧 Dùng x${quantity}`}
                  </button>
                )}

                {selectedItem.itemType === "KOI" && (
                  <p className="action-hint">
                    Koi trong inventory cần được thả vào pond, không dùng như
                    vật phẩm tiêu hao.
                  </p>
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

      <InventoryKoiDialog
        open={foodDialogOpen}
        kois={kois}
        selectedKoiId={targetKoiId}
        itemName={selectedItem?.name ?? "food"}
        quantity={quantity}
        loading={actionLoading}
        error={actionError}
        onSelect={(koiId) => {
          setTargetKoiId(koiId);
          setActionError(null);
        }}
        onClose={() => {
          if (!actionLoading) setFoodDialogOpen(false);
        }}
        onConfirm={() => {
          void handleUseItem().then((used) => {
            if (used) setFoodDialogOpen(false);
          });
        }}
      />

      <InventoryPondDialog
        open={pondDialogOpen}
        ponds={ponds}
        selectedPondId={targetPondId}
        itemName={selectedItem?.name ?? "medicine"}
        quantity={quantity}
        loading={actionLoading}
        error={actionError}
        onSelect={(pondId) => {
          setTargetPondId(pondId);
          setActionError(null);
        }}
        onClose={() => {
          if (!actionLoading) setPondDialogOpen(false);
        }}
        onConfirm={() => {
          void handleUseItem().then((used) => {
            if (used) setPondDialogOpen(false);
          });
        }}
      />
    </>
  );
}
