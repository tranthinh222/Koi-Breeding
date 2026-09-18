import type { Pond } from "../../api/pond";
import "./InventoryPondDialog.css";

interface InventoryPondDialogProps {
  open: boolean;
  ponds: Pond[];
  selectedPondId: number | "";
  itemName: string;
  quantity: number;
  loading: boolean;
  error: string | null;
  onSelect: (pondId: number) => void;
  onClose: () => void;
  onConfirm: () => void;
}

export default function InventoryPondDialog({
  open,
  ponds,
  selectedPondId,
  itemName,
  quantity,
  loading,
  error,
  onSelect,
  onClose,
  onConfirm,
}: InventoryPondDialogProps) {
  if (!open) return null;

  return (
    <div className="inventory-pond-dialog-overlay" onClick={onClose}>
      <section
        className="inventory-pond-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="inventory-pond-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="inventory-pond-dialog-header">
          <div>
            <p className="inventory-pond-dialog-eyebrow">Use {itemName}</p>
            <h2 id="inventory-pond-dialog-title">Choose a pond</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>

        {ponds.length === 0 ? (
          <p className="inventory-pond-dialog-message">
            No ponds are currently available.
          </p>
        ) : (
          <div className="inventory-pond-dialog-list">
            {ponds.map((pond) => {
              const selected = selectedPondId === pond.id;
              const currentKoi = pond.currentKoi ?? 0;
              const capacity = pond.capacity ?? 0;
              const capacityPercent =
                capacity > 0 ? Math.min((currentKoi / capacity) * 100, 100) : 0;

              return (
                <button
                  type="button"
                  key={pond.id}
                  className={`inventory-pond-option${selected ? " selected" : ""}`}
                  onClick={() => onSelect(pond.id)}
                >
                  <div className="inventory-pond-option-title">
                    <span className="inventory-pond-icon">🌊</span>
                    <span>
                      <strong>{pond.name}</strong>
                      <small>Pond #{pond.id}</small>
                    </span>
                  </div>

                  <div className="inventory-pond-capacity">
                    <div>
                      <span>Koi capacity</span>
                      <strong>
                        {currentKoi}/{capacity}
                      </strong>
                    </div>
                    <div className="inventory-pond-progress">
                      <span style={{ width: `${capacityPercent}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {error && <p className="inventory-pond-dialog-error">{error}</p>}

        <div className="inventory-pond-dialog-actions">
          <button type="button" className="cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="confirm"
            disabled={selectedPondId === "" || loading || ponds.length === 0}
            onClick={onConfirm}
          >
            {loading ? "Applying..." : `Use x${quantity}`}
          </button>
        </div>
      </section>
    </div>
  );
}
