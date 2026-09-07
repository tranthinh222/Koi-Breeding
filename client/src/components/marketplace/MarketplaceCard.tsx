import type { MarketplaceItem } from "../../api/marketplace";

interface MarketplaceCardProps {
  item: MarketplaceItem;
  selected: boolean;
  onSelect: (item: MarketplaceItem) => void;
}

export default function MarketplaceCard({
  item,
  selected,
  onSelect,
}: MarketplaceCardProps) {
  const genderIcon = item.gender === "MALE" ? "♂" : "♀";

  return (
    <div
      className={`fish-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(item)}
    >
      <div className="fish-image">
        <img src={item.image} alt={item.koiName} />
      </div>

      {item.rarity && (
        <div className={`${item.rarity.toLowerCase()}-rarity`}>
          {item.rarity}
        </div>
      )}

      <h3>{item.koiName}</h3>

      <p className="fish-breed">
        {item.breed}{" "}
        <span className={`gender-badge ${item.gender.toLowerCase()}`}>
          {genderIcon}
        </span>
      </p>

      <div className="fish-stats">
        <span>⚖️ {item.weight} kg</span>
        <span>📏 {item.length} cm</span>
      </div>

      <p className="fish-seller">Seller: {item.seller}</p>

      <div className="price">{item.price.toLocaleString("vi-VN")} </div>

      <button
        onClick={(event) => {
          event.stopPropagation();
          onSelect(item);
        }}
      >
        View Details
      </button>
    </div>
  );
}
