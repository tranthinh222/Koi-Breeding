import type { IKoi } from "../../types/backend";
import "./InventoryKoiDialog.css";

interface InventoryKoiDialogProps {
  open: boolean;
  kois: IKoi[];
  selectedKoiId: number | "";
  itemName: string;
  quantity: number;
  loading: boolean;
  error: string | null;
  onSelect: (koiId: number) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const percentage = (value: number) => Math.min(Math.max(value, 0), 100);

export default function InventoryKoiDialog({
  open,
  kois,
  selectedKoiId,
  itemName,
  quantity,
  loading,
  error,
  onSelect,
  onClose,
  onConfirm,
}: InventoryKoiDialogProps) {
  if (!open) return null;

  return (
    <div className="inventory-koi-dialog-overlay" onClick={onClose}>
      <section
        className="inventory-koi-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-koi-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="inventory-koi-dialog-header">
          <div>
            <p className="inventory-koi-dialog-eyebrow">Use {itemName}</p>
            <h2 id="inventory-koi-dialog-title">Choose a Koi to feed</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {kois.length === 0 ? (
          <p className="inventory-koi-dialog-message">
            No Koi are currently available in your ponds.
          </p>
        ) : (
          <div className="inventory-koi-dialog-list">
            {kois.map((koi) => {
              const selected = selectedKoiId === koi.id;
              const foodBar = koi.foodBar ?? 0;
              const health = koi.health ?? 0;

              return (
                <button
                  type="button"
                  key={koi.id}
                  className={`inventory-koi-option${selected ? " selected" : ""}`}
                  onClick={() => onSelect(koi.id)}
                >
                  <div className="inventory-koi-option-main">
                    {koi.dictionary?.imageUrl ? (
                      <img src={koi.dictionary.imageUrl} alt="" />
                    ) : (
                      <span className="inventory-koi-option-placeholder">
                        🐟
                      </span>
                    )}
                    <span>
                      <strong>{koi.name}</strong>
                      <small>Pond #{koi.pondId}</small>
                    </span>
                  </div>

                  <div className="inventory-koi-stat">
                    <div className="inventory-koi-stat-label">
                      <span>Hunger</span>
                      <strong>{foodBar}/100</strong>
                    </div>
                    <div className="inventory-koi-progress">
                      <span
                        className="hunger"
                        style={{ width: `${percentage(foodBar)}%` }}
                      />
                    </div>
                  </div>

                  <div className="inventory-koi-stat">
                    <div className="inventory-koi-stat-label">
                      <span>Health</span>
                      <strong>{health}/100</strong>
                    </div>
                    <div className="inventory-koi-progress">
                      <span
                        className="health"
                        style={{ width: `${percentage(health)}%` }}
                      />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="inventory-koi-dialog-error">{error}</p>}

        <div className="inventory-koi-dialog-actions">
          <button type="button" className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="confirm"
            disabled={selectedKoiId === "" || loading || kois.length === 0}
            onClick={onConfirm}
          >
            {loading ? "Feeding..." : `Feed x${quantity}`}
          </button>
        </div>
      </section>
    </div>
  );
}
