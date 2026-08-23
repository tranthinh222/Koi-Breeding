import { useEffect, useState, type KeyboardEvent } from "react";
import "../../style/market.css";

export type MarketplaceCategory = "ALL" | "KOHAKU" | "SHOWA" | "OGON";
export type FishGender = "ALL" | "MALE" | "FEMALE";

// Form filters - tất cả string để bind với input
export interface ShopFilters {
  category: MarketplaceCategory;
  keyword: string;
  minPrice: string;
  maxPrice: string;
  minLength: string;
  maxLength: string;
  minWeight: string;
  maxWeight: string;
  gender: FishGender;
}

const categories = [
  { value: "ALL", label: "🐟 Breed" },
  { value: "KOHAKU", label: "🐟 Kohaku" },
  { value: "SHOWA", label: "🐟 Showa" },
  { value: "OGON", label: "🐟 Ogon" },
];

const genders = [
  { value: "ALL", label: "All Genders" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

// Slider bounds
const LENGTH_MIN = 0;
const LENGTH_MAX = 100; // cm
const LENGTH_STEP = 1;

const WEIGHT_MIN = 0;
const WEIGHT_MAX = 90; // kg
const WEIGHT_STEP = 0.1;

const PRICE_MIN = 0;
const PRICE_MAX = 50_000_000; // ₫
const PRICE_STEP = 100_000;

export const EMPTY_FILTERS: ShopFilters = {
  category: "ALL",
  keyword: "",
  minPrice: "",
  maxPrice: "",
  minLength: "",
  maxLength: "",
  minWeight: "",
  maxWeight: "",
  gender: "ALL",
};

/* =========================================================
   RANGE FIELD — number inputs + dual drag-and-drop slider
   ========================================================= */

interface RangeFieldProps {
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  minValue: string;
  maxValue: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}

function RangeField({
  label,
  unit,
  min,
  max,
  step,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}: RangeFieldProps) {
  const lo = minValue === "" ? min : Number(minValue);
  const hi = maxValue === "" ? max : Number(maxValue);

  const safeLo = Number.isFinite(lo) ? lo : min;
  const safeHi = Number.isFinite(hi) ? hi : max;

  const loPct = ((safeLo - min) / (max - min)) * 100;
  const hiPct = ((safeHi - min) / (max - min)) * 100;

  const handleSliderMin = (v: number) => {
    const clamped = Math.min(Math.max(v, min), safeHi);
    onMinChange(String(clamped));
  };

  const handleSliderMax = (v: number) => {
    const clamped = Math.max(Math.min(v, max), safeLo);
    onMaxChange(String(clamped));
  };

  return (
    <div className="marketplace-filters__range">
      <span className="marketplace-filters__range-label">{label}</span>

      <div className="marketplace-filters__range-inputs">
        <input
          type="number"
          inputMode="decimal"
          className="marketplace-filters__range-number"
          placeholder={`Min ${unit}`}
          min={min}
          max={safeHi}
          step={step}
          value={minValue}
          onChange={(e) => onMinChange(e.target.value)}
        />
        <span className="marketplace-filters__range-sep">-</span>
        <input
          type="number"
          inputMode="decimal"
          className="marketplace-filters__range-number"
          placeholder={`Max ${unit}`}
          min={safeLo}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => onMaxChange(e.target.value)}
        />
      </div>

      <div className="marketplace-filters__slider">
        <div className="marketplace-filters__slider-track" />
        <div
          className="marketplace-filters__slider-range"
          style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }}
        />
        <input
          type="range"
          aria-label={`${label} minimum`}
          className="marketplace-filters__slider-thumb marketplace-filters__slider-thumb--min"
          min={min}
          max={max}
          step={step}
          value={safeLo}
          onChange={(e) => handleSliderMin(Number(e.target.value))}
        />
        <input
          type="range"
          aria-label={`${label} maximum`}
          className="marketplace-filters__slider-thumb marketplace-filters__slider-thumb--max"
          min={min}
          max={max}
          step={step}
          value={safeHi}
          onChange={(e) => handleSliderMax(Number(e.target.value))}
        />
      </div>
    </div>
  );
}

/* =========================================================
   MAIN FILTER BAR
   ========================================================= */

interface ShopFiltersBarProps {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
}

export default function ShopFiltersBar({
  filters,
  onChange,
}: ShopFiltersBarProps) {
  const [draft, setDraft] = useState<ShopFilters>(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const update = <K extends keyof ShopFilters>(
    key: K,
    value: ShopFilters[K],
  ) => {
    setDraft((prev) => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    onChange(draft);
  };

  const resetFilters = () => {
    setDraft(EMPTY_FILTERS);
    onChange(EMPTY_FILTERS);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      applyFilters();
    }
  };

  return (
    <section className="marketplace-filters" onKeyDown={handleKeyDown}>
      <input
        type="text"
        className="marketplace-filters__search"
        placeholder="🔍 Search by fish name, breed..."
        value={draft.keyword}
        onChange={(e) => update("keyword", e.target.value)}
      />

      <select
        className="marketplace-filters__select"
        value={draft.category}
        onChange={(e) =>
          update("category", e.target.value as MarketplaceCategory)
        }
      >
        {categories.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <select
        className="marketplace-filters__select"
        value={draft.gender}
        onChange={(e) => update("gender", e.target.value as FishGender)}
      >
        {genders.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      <RangeField
        label="Length (cm)"
        unit="cm"
        min={LENGTH_MIN}
        max={LENGTH_MAX}
        step={LENGTH_STEP}
        minValue={draft.minLength}
        maxValue={draft.maxLength}
        onMinChange={(v) => update("minLength", v)}
        onMaxChange={(v) => update("maxLength", v)}
      />

      <RangeField
        label="Weight (kg)"
        unit="kg"
        min={WEIGHT_MIN}
        max={WEIGHT_MAX}
        step={WEIGHT_STEP}
        minValue={draft.minWeight}
        maxValue={draft.maxWeight}
        onMinChange={(v) => update("minWeight", v)}
        onMaxChange={(v) => update("maxWeight", v)}
      />

      <RangeField
        label="Price (₫)"
        unit="₫"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        minValue={draft.minPrice}
        maxValue={draft.maxPrice}
        onMinChange={(v) => update("minPrice", v)}
        onMaxChange={(v) => update("maxPrice", v)}
      />

      <div className="marketplace-filters__actions">
        <button
          type="button"
          className="marketplace-filters__apply"
          onClick={applyFilters}
        >
          🔎 Filter
        </button>

        <button
          type="button"
          className="marketplace-filters__reset"
          onClick={resetFilters}
        >
          ✕ Clear Filters
        </button>
      </div>
    </section>
  );
}
