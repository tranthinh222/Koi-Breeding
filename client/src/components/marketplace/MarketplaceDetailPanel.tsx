import { useEffect, useState } from "react";
import type { MarketplaceItem } from "../../api/marketplace";

interface DetailPanelProps {
  item: MarketplaceItem;
  onBuy?: (quantity: number) => void;
  buying?: boolean;
  buyError?: string | null;
  buySuccess?: string | null;
}

export default function DetailPanel({
  item,
  onBuy,
  buying,
  buyError,
  buySuccess,
}: DetailPanelProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [item.id]);

  const totalPrice = item.price * quantity;
  const isVnd = item.currency === "VND";
  const formatPrice = (value: number) => value.toLocaleString("vi-VN");
  const genderLabel = item.gender === "MALE" ? "Đực ♂" : "Cái ♀";

  return (
    <aside className="detail-panel">
      <div className="detail-header">Selected Item</div>

      <hr />

      <div className="detail-image">
        <img src={item.image} alt={item.name} />
      </div>

      <h2>{item.name}</h2>

      {item.rarity && (
        <div className={`${item.rarity.toLowerCase()}-rarity`}>
          {item.rarity}
        </div>
      )}

      {/* Bảng thông số cá */}
      <div className="fish-info-table">
        <div className="fish-info-row">
          <span>Breed</span>
          <strong>{item.breed}</strong>
        </div>
        <div className="fish-info-row">
          <span>Gender</span>
          <strong>{genderLabel}</strong>
        </div>
        <div className="fish-info-row">
          <span>Weight</span>
          <strong>{item.weight} kg</strong>
        </div>
        <div className="fish-info-row">
          <span>Length</span>
          <strong>{item.length} cm</strong>
        </div>
        <div className="fish-info-row">
          <span>Seller</span>
          <strong>
            {item.seller}
            {/* {item.sellerRating && ` (⭐ ${item.sellerRating})`} */}
          </strong>
        </div>
      </div>

      <div className="description">
        <p>{item.description}</p>
      </div>

      <div className="detail-price">
        {isVnd ? "₫" : "💰"} {formatPrice(item.price)} {isVnd ? "VNĐ" : "Koins"}
      </div>

      <div className="total-price">
        Total:{" "}
        <strong>
          {isVnd ? "₫" : "💰"} {formatPrice(totalPrice)}{" "}
          {isVnd ? "VNĐ" : "Koins"}
        </strong>
      </div>

      {buyError && <p className="buy-error">{buyError}</p>}
      {buySuccess && <p className="buy-success">{buySuccess}</p>}

      <button
        className="buy-btn"
        onClick={() => onBuy && onBuy(quantity)}
        disabled={buying}
      >
        {buying ? "Processing..." : isVnd ? "Pay with VietQR" : "Buy Now"}
      </button>
    </aside>
  );
}
