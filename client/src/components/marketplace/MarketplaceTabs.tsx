import "../../style/market.css";

export type MarketplaceCategory = "ALL" | "KOHAKU" | "SHOWA" | "OGON";

export type FishSize = "ALL" | "SMALL" | "MEDIUM" | "LARGE";

export type FishWeight = "ALL" | "SMALL" | "MEDIUM" | "LARGE";

export type FishGender = "ALL" | "MALE" | "FEMALE";

export interface ShopFilters {
  category: MarketplaceCategory;
  keyword: string;
  minPrice: string;
  maxPrice: string;
  size: FishSize;
  weight: FishWeight;
  gender: FishGender;
}

const categories = [
  { value: "ALL", label: "🐟 Breed" },
  { value: "KOHAKU", label: "🐟 Kohaku" },
  { value: "SHOWA", label: "🐟 Showa" },
  { value: "OGON", label: "🐟 Ogon" },
];

const sizes = [
  { value: "ALL", label: "Length" },
  { value: "SMALL", label: "Small (< 20cm)" },
  { value: "MEDIUM", label: "Medium (20-40cm)" },
  { value: "LARGE", label: "Large (> 40cm)" },
];

const weights = [
  { value: "ALL", label: "All Weights" },
  { value: "SMALL", label: "Small (< 1kg)" },
  { value: "MEDIUM", label: "Medium (1-3kg)" },
  { value: "LARGE", label: "Large (> 3kg)" },
];

const genders = [
  { value: "ALL", label: "All Genders" },
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

interface ShopFiltersBarProps {
  filters: ShopFilters;
  onChange: (filters: ShopFilters) => void;
}

export default function ShopFiltersBar({
  filters,
  onChange,
}: ShopFiltersBarProps) {
  const update = <K extends keyof ShopFilters>(
    key: K,
    value: ShopFilters[K],
  ) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const resetFilters = () => {
    onChange({
      category: "ALL",
      keyword: "",
      minPrice: "",
      maxPrice: "",
      size: "ALL",
      weight: "ALL",
      gender: "ALL",
    });
  };

  return (
    <section className="marketplace-filters">
      <input
        type="text"
        className="marketplace-filters__search"
        placeholder="🔍 Search by fish name, breed..."
        value={filters.keyword}
        onChange={(e) => update("keyword", e.target.value)}
      />

      <select
        className="marketplace-filters__select"
        value={filters.category}
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
        value={filters.size}
        onChange={(e) => update("size", e.target.value as FishSize)}
      >
        {sizes.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      <select
        className="marketplace-filters__select"
        value={filters.weight}
        onChange={(e) => update("weight", e.target.value as FishWeight)}
      >
        {weights.map((w) => (
          <option key={w.value} value={w.value}>
            {w.label}
          </option>
        ))}
      </select>

      <select
        className="marketplace-filters__select"
        value={filters.gender}
        onChange={(e) => update("gender", e.target.value as FishGender)}
      >
        {genders.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      <div className="marketplace-filters__price">
        <input
          type="number"
          inputMode="numeric"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) => update("minPrice", e.target.value)}
        />

        <span>-</span>

        <input
          type="number"
          inputMode="numeric"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) => update("maxPrice", e.target.value)}
        />
      </div>

      <button
        type="button"
        className="marketplace-filters__reset"
        onClick={resetFilters}
      >
        ✕ Clear Filters
      </button>
    </section>
  );
}
