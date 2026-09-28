import { HeartPulse, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { callFetchInventoryByType } from "../../../api/inventory";
import { getApiErrorMessage } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import type { IItemInventory, IKoi } from "../../../types/backend";
import { toast } from "../../shared/Toast/toast";
import styles from "../FeedKoiForm/FeedKoiForm.module.css";

interface HealKoiFormProps {
  koi: IKoi;
  onClose: () => void;
  onSubmit: (medicine: IItemInventory) => Promise<boolean>;
}

export default function HealKoiForm({ koi, onClose, onSubmit }: HealKoiFormProps) {
  const { currentUserId } = useAuth();
  const [medicines, setMedicines] = useState<IItemInventory[]>([]);
  const [selected, setSelected] = useState<IItemInventory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        if (!currentUserId) throw new Error("Please sign in to use medicine.");
        const response = await callFetchInventoryByType(currentUserId, "MEDICINE");
        if (!cancelled) setMedicines((response.data.data ?? []).filter(
          (item) => item.effectType === "HEALTH" && item.quantity > 0 && item.effectValue >= 1,
        ));
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err, "Failed to load medicine."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => { cancelled = true; };
  }, [currentUserId]);

  const heal = async () => {
    if (!selected || koi.health >= 100 || submitting.current) return;
    submitting.current = true;
    setProcessing(true);
    try {
      if (await onSubmit(selected)) onClose();
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Failed to use medicine."));
    } finally {
      submitting.current = false;
      setProcessing(false);
    }
  };

  return (
    <div className={styles.form} role="dialog" aria-modal="true" aria-label={`Treat ${koi.name}`}>
      <button type="button" className={styles.closeButton} onClick={onClose} disabled={processing} aria-label="Close">
        <X />
      </button>
      <header className={styles.header}>
        <HeartPulse />
        <div><h2>Treat {koi.name}</h2><p>HP: {koi.health}/100</p></div>
      </header>
      <p className={styles.message}>Use one medicine to restore HP. Keep your koi fed and the pond healthy to prevent further HP loss.</p>
      {loading ? <p className={styles.message}>Loading medicine...</p>
        : error ? <p className={styles.message} role="alert">{error}</p>
        : medicines.length === 0 ? <p className={styles.message}>No health medicine in your inventory. Buy some in the shop.</p>
        : <div className={styles.foodGrid}>
          {medicines.map((medicine) => (
            <button type="button" key={medicine.id} disabled={processing}
              className={`${styles.foodCard} ${selected?.id === medicine.id ? styles.selected : ""}`}
              onClick={() => setSelected(medicine)}>
              {medicine.image ? <img src={medicine.image} alt="" /> : <HeartPulse />}
              <span>{medicine.name}</span>
              <small>+{medicine.effectValue} HP · x{medicine.quantity}</small>
            </button>
          ))}
        </div>}
      <button type="button" className={styles.feedButton}
        disabled={loading || !selected || processing || koi.health >= 100} onClick={() => void heal()}>
        {processing ? "Treating..." : koi.health >= 100 ? "HP is full" : `Use medicine${selected ? ` (+${Math.min(selected.effectValue, 100 - koi.health)} HP)` : ""}`}
      </button>
    </div>
  );
}
