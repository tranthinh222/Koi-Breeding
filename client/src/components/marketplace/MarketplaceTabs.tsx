import { useEffect, useState, type KeyboardEvent } from "react";
import "../../style/market.css";

export type MarketplaceCategory = "ALL" | "KOHAKU" | "SHOWA" | "OGON";
export type FishGender = "ALL" | "MALE" | "FEMALE";

interface OptionDropdownProps<T extends string> {
  value: T;
  options: {
    value: T;
    label: string;
  }[];
  onChange: (value: T) => void;
  placeholder: string;

  open: boolean;
  onToggle: () => void;
}

function OptionDropdown<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  open,
  onToggle,
}: OptionDropdownProps<T>) {
  const selected = options.find((option) => option.value === value);

  return (
    <div className="marketplace-option-dropdown">
      <button
        type="button"
        className={`marketplace-option-trigger ${open ? "active" : ""}`}
        onClick={onToggle}
      >
        <span>{selected?.label ?? placeholder}</span>

        <span className="option-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="marketplace-option-popup">
          <div className="option-popup-title">{placeholder}</div>

          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`marketplace-option-item ${
                option.value === value ? "selected" : ""
              }`}
              onClick={() => {
                onChange(option.value);
                onToggle();
              }}
            >
              {option.label}

              {option.value === value && (
                <span className="option-check">✓</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
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

const categories: {
  value: MarketplaceCategory;
  label: string;
}[] = [
  { value: "ALL", label: "🐟 Breed" },
  { value: "KOHAKU", label: "🐟 Kohaku" },
  { value: "SHOWA", label: "🐟 Showa" },
  { value: "OGON", label: "🐟 Ogon" },
];

const genders: {
  value: FishGender;
  label: string;
}[] = [
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

  open: boolean;
  onToggle: () => void;
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
  open,
  onToggle,
}: RangeFieldProps) {
  const lo = minValue === "" ? min : Number(minValue);

  const hi = maxValue === "" ? max : Number(maxValue);

  const safeLo = Number.isFinite(lo) ? lo : min;
  const safeHi = Number.isFinite(hi) ? hi : max;

  const loPct = ((safeLo - min) / (max - min)) * 100;

  const hiPct = ((safeHi - min) / (max - min)) * 100;

  const displayValue =
    minValue === "" && maxValue === ""
      ? label
      : `${safeLo} - ${safeHi} ${unit}`;

  const handleMinChange = (value: number) => {
    const newValue = Math.min(value, safeHi);
    onMinChange(String(newValue));
  };

  const handleMaxChange = (value: number) => {
    const newValue = Math.max(value, safeLo);
    onMaxChange(String(newValue));
  };

  return (
    <div className="marketplace-range-dropdown">
      <button
        type="button"
        className={`marketplace-range-trigger ${open ? "active" : ""}`}
        onClick={onToggle}
      >
        <span>{displayValue}</span>

        <span className="range-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="marketplace-range-popup">
          <div className="range-popup-title">{label}</div>

          <div className="range-popup-values">
            <div>
              <span>Min</span>
              <strong>
                {safeLo} {unit}
              </strong>
            </div>

            <div>
              <span>Max</span>
              <strong>
                {safeHi} {unit}
              </strong>
            </div>
          </div>

          <div className="range-slider">
            <div className="range-track" />

            <div
              className="range-selected"
              style={{
                left: `${loPct}%`,
                right: `${100 - hiPct}%`,
              }}
            />

            {/* Min */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={safeLo}
              onChange={(e) => handleMinChange(Number(e.target.value))}
              className="range-input range-input-min"
            />

            {/* Max */}
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={safeHi}
              onChange={(e) => handleMaxChange(Number(e.target.value))}
              className="range-input range-input-max"
            />
          </div>

          <div className="range-number-inputs">
            <input
              type="number"
              min={min}
              max={safeHi}
              step={step}
              value={minValue}
              placeholder={String(min)}
              onChange={(e) => onMinChange(e.target.value)}
            />

            <span>—</span>

            <input
              type="number"
              min={safeLo}
              max={max}
              step={step}
              value={maxValue}
              placeholder={String(max)}
              onChange={(e) => onMaxChange(e.target.value)}
            />
          </div>
        </div>
      )}
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const toggleDropdown = (name: string) => {
    setOpenDropdown((prev) => (prev === name ? null : name));
  };

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

      <OptionDropdown
        value={draft.category}
        options={categories}
        placeholder="🐟 Breed"
        onChange={(value) => update("category", value)}
        open={openDropdown === "breed"}
        onToggle={() => toggleDropdown("breed")}
      />

      <OptionDropdown
        value={draft.gender}
        options={genders}
        placeholder="All Genders"
        onChange={(value) => update("gender", value)}
        open={openDropdown === "gender"}
        onToggle={() => toggleDropdown("gender")}
      />

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
        open={openDropdown === "length"}
        onToggle={() => toggleDropdown("length")}
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
        open={openDropdown === "weight"}
        onToggle={() => toggleDropdown("weight")}
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
        open={openDropdown === "price"}
        onToggle={() => toggleDropdown("price")}
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
