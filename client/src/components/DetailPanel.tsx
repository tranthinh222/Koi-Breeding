import type { ShopItem } from '../api/shop'

interface DetailPanelProps {
  item: ShopItem
  onBuy?: () => void
  buying?: boolean
  buyError?: string | null
  buySuccess?: string | null
}

export default function DetailPanel({
  item,
  onBuy,
  buying,
  buyError,
  buySuccess,
}: DetailPanelProps) {
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
        {item.currency === 'USD' ? '💵' : '💰'} {item.price}{' '}
        {item.currency === 'USD' ? 'USD' : 'Koins'}
      </div>

      {buyError && <p className="buy-error">{buyError}</p>}
      {buySuccess && <p className="buy-success">{buySuccess}</p>}

      <button className="buy-btn" onClick={onBuy} disabled={buying}>
        {buying ? 'Buying...' : 'Buy Now'}
      </button>
    </aside>
  )
}
