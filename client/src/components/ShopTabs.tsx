import type { ShopCategory } from "../api/shop";

interface ShopTabsProps {
  activeCategory: ShopCategory;
  onChange: (category: ShopCategory) => void;
}

const tabs: {
  category: ShopCategory;
  icon: string;
}[] = [
  {
    category: "FOOD",
    icon: "🥡",
  },
  {
    category: "MEDICINE",
    icon: "💊",
  },
  {
    category: "KOI",
    icon: "🐟",
  },
  {
    category: "CURRENCY",
    icon: "🪙",
  },
];

export default function ShopTabs({ activeCategory, onChange }: ShopTabsProps) {
  return (
    <section className="market-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.category}
          className={`tab ${activeCategory === tab.category ? "active" : ""}`}
          onClick={() => onChange(tab.category)}
        >
          {tab.icon} {tab.category}
        </button>
      ))}
    </section>
  );
}
