import { useEffect, useState } from "react";
import "./PondSelectDialog.css";

import { getPondsByOwner, type Pond } from "../../api/pond";

interface PondSelectDialogProps {
  open: boolean;
  userId: number;

  onClose: () => void;
  onSelect: (pond: Pond) => void;
}

export default function PondSelectDialog({
  open,
  userId,
  onClose,
  onSelect,
}: PondSelectDialogProps) {
  const [ponds, setPonds] = useState<Pond[]>([]);
  const [selectedPondId, setSelectedPondId] = useState<number | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      setSelectedPondId(null);
      return;
    }

    const fetchPonds = async () => {
      try {
        setLoading(true);

        const data = await getPondsByOwner(userId);

        console.log("Ponds loaded:", data);

        setPonds(data);
      } catch (error) {
        console.error("Failed to load ponds:", error);

        setPonds([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPonds();
  }, [open, userId]);

  if (!open) {
    return null;
  }

  const handleSelect = (pond: Pond) => {
    if (pond.currentKoi >= pond.capacity) {
      return;
    }

    setSelectedPondId(pond.id);
  };

  const handleConfirm = () => {
    const selectedPond = ponds.find((pond) => pond.id === selectedPondId);

    if (!selectedPond) {
      return;
    }

    onSelect(selectedPond);
  };

  return (
    <div className="pond-dialog-overlay" onClick={onClose}>
      <div className="pond-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="pond-dialog-title">
          <span className="pond-title-pin left" />

          <h2>Chọn hồ</h2>

          <span className="pond-title-pin right" />
        </div>

        <div className="pond-dialog-list">
          {loading ? (
            <div className="pond-dialog-message">Đang tải danh sách hồ...</div>
          ) : ponds.length === 0 ? (
            <div className="pond-dialog-message">Bạn chưa có hồ cá.</div>
          ) : (
            ponds.map((pond) => {
              const isFull = pond.currentKoi >= pond.capacity;

              const isSelected = selectedPondId === pond.id;

              const percentage =
                pond.capacity > 0
                  ? Math.min((pond.currentKoi / pond.capacity) * 100, 100)
                  : 0;

              return (
                <div
                  key={pond.id}
                  className={[
                    "pond-select-card",
                    isSelected ? "selected" : "",
                    isFull ? "full" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => handleSelect(pond)}
                >
                  <div className="pond-select-info">
                    <div className="pond-select-header">
                      <h3>{pond.name}</h3>

                      <span className={`pond-capacity ${isFull ? "full" : ""}`}>
                        {pond.currentKoi} / {pond.capacity}
                        {isFull && " [Đầy]"}
                      </span>
                    </div>

                    <div className="pond-progress">
                      <div
                        className={`pond-progress-fill ${isFull ? "full" : ""}`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`pond-select-button ${
                      isFull ? "disabled" : ""
                    } ${isSelected ? "selected" : ""}`}
                    disabled={isFull}
                    onClick={(event) => {
                      event.stopPropagation();
                      handleSelect(pond);
                    }}
                  >
                    {isFull ? "Đầy" : isSelected ? "Đã chọn" : "Chọn"}
                  </button>
                </div>
              );
            })
          )}
        </div>

        <div className="pond-dialog-actions">
          <button
            type="button"
            className="pond-dialog-cancel"
            onClick={onClose}
          >
            Hủy
          </button>

          <button
            type="button"
            className="pond-dialog-confirm"
            disabled={selectedPondId === null || loading}
            onClick={handleConfirm}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
