import type { ShopItem } from "../api/shop";

interface ShopCardProps {
  item: ShopItem;
  selected: boolean;
  onSelect: (item: ShopItem) => void;
}

export default function ShopCard({ item, selected, onSelect }: ShopCardProps) {
  return (
    <div
      className={`fish-card ${selected ? "selected" : ""}`}
      onClick={() => onSelect(item)}
    >
      <div className="fish-image">
        <img src={item.image} alt={item.name} />
      </div>

      {item.rarity && (
        <div className={`${item.rarity.toLowerCase()}-rarity`}>
          {item.rarity}
        </div>
      )}

      <h3>{item.name}</h3>

<<<<<<< Updated upstream
      {item.currency === "USD" && (
        <div className="price">💵 {item.price} Koins</div>
      )}

      {item.currency === "KOINS" && (
        <div className="price">💰 {item.price} Koins</div>
      )}
=======
      <div className="price">
        {item.currency === "USD" ? "💵" : "💰"} {item.price}{" "}
        {item.currency === "USD" ? "USD" : "Koins"}
      </div>
>>>>>>> Stashed changes

      <button
        onClick={(event) => {
          event.stopPropagation();
          onSelect(item);
        }}
      >
        Buy
      </button>
    </div>
  );
}
