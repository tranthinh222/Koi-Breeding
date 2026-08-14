import { useEffect, useState } from "react";
import type { ShopItem } from "../api/shop";

interface DetailPanelProps {
  item: ShopItem;
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
  // Khi đổi item thì reset số lượng về 1
  useEffect(() => {
    setQuantity(1);
  }, [item.id]);

  const totalPrice = item.price * quantity;
  const isVnd = item.currency === 'VND'
  const formatPrice = (value: number) => value.toLocaleString('vi-VN')
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

      <div className="description">
        <p>{item.description}</p>

        {item.detailDescription && <p>{item.detailDescription}</p>}
      </div>

      <div className="detail-price">
        {isVnd ? '₫' : '💰'} {formatPrice(item.price)}{' '}
        {isVnd ? 'VNĐ' : 'Koins'}
      </div>

      <div className="quantity-section">
        <div className="quantity-header">
          <span>Quantity</span>
          <strong>x{quantity}</strong>
        </div>

        <input
          type="range"
          min={1}
          max={10}
          step={1}
          value={quantity}
          onChange={(event) => {
            setQuantity(Number(event.target.value));
          }}
          disabled={buying}
        />

        <div className="quantity-range">
          <span>1</span>
          <span>10</span>
        </div>
      </div>

      {/* Total */}
      <div className="total-price">
        Total:{" "}
        <strong>
          {isVnd ? '₫' : '💰'} {formatPrice(totalPrice)}{' '}
          {isVnd ? 'VNĐ' : 'Koins'}
        </strong>
      </div>

      {buyError && <p className="buy-error">{buyError}</p>}
      {buySuccess && <p className="buy-success">{buySuccess}</p>}

      <button
        className="buy-btn"
        onClick={() => onBuy && onBuy(quantity)}
        disabled={buying}
      >
        {buying ? 'Processing...' : isVnd ? 'Pay with VietQR' : 'Buy Now'}
      </button>
    </aside>
  );
}
