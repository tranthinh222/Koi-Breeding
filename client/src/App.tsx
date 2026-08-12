import { useEffect, useState } from 'react'
import {
  getShopProducts,
  purchaseShopProduct,
  type ShopCategory,
  type ShopProduct,
} from './api/shop'
import './App.css'
import coins250 from '../../koi-shop/koins/assets/250_koins.svg'
import coins750 from '../../koi-shop/koins/assets/750_koins.svg'
import coins3000 from '../../koi-shop/koins/assets/3000_koins.svg'
import coins9000 from '../../koi-shop/koins/assets/9000_koins.svg'
import coins25000 from '../../koi-shop/koins/assets/25000_koins.svg'

const categories: { id: ShopCategory; label: string; icon: string }[] = [
  { id: 'FOOD', label: 'Food', icon: '🥡' },
  { id: 'MEDICINE', label: 'Medicine', icon: '💊' },
  { id: 'KOI', label: 'Koi', icon: '🐟' },
  { id: 'CURRENCY', label: 'Koins', icon: '🪙' },
]
const productIcons: Record<string, string> = {
  FOOD: '🥡',
  MEDICINE: '💊',
  KOI: '🐟',
  CURRENCY: '🪙',
}
const coinPackageImages: Record<number, string> = {
  250: coins250,
  750: coins750,
  3000: coins3000,
  9000: coins9000,
  25000: coins25000,
}
const price = (product: ShopProduct) =>
  product.currency === 'USD'
    ? `💲${product.price.toFixed(2)}`
    : `💰 ${product.price} Koins`

function App() {
  const [category, setCategory] = useState<ShopCategory>('KOI')
  const [products, setProducts] = useState<ShopProduct[]>([])
  const [selected, setSelected] = useState<ShopProduct | null>(null)
  const [notice, setNotice] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    getShopProducts(category, controller.signal)
      .then((items) => {
        setProducts(items)
        setSelected(null)
        setNotice('')
      })
      .catch(() => setNotice('Không thể tải sản phẩm.'))
    return () => controller.abort()
  }, [category])

  const buy = async (product: ShopProduct) => {
    try {
      await purchaseShopProduct(product.id)
      setNotice(`Đã mua ${product.name}.`)
    } catch {
      setNotice('Không thể mua sản phẩm lúc này.')
    }
  }

  return (
    <div className="shop-page">
      <div className="cloud cloud1" />
      <div className="cloud cloud2" />
      <div className="cloud cloud3" />
      <div className="background">
        <div className="grass" />
        <div className="trees trees-left" />
        <div className="trees trees-right" />
      </div>
      <header className="hud">
        <div className="player">
          <div className="avatar">🧑</div>
          <div>
            <h3>KoiMaster</h3>
            <p>Level: 18</p>
          </div>
        </div>
        <div className="wallet">
          <div className="gold">🪙 25,800</div>
        </div>
      </header>
      <nav className="navigation-menu">
        <button>🏠 Home</button>
        <button>🎒 Inventory</button>
        <button className="active">🛒 Shop</button>
        <button>🏪 Marketplace</button>
        <button>⚙︎ Settings</button>
      </nav>
      <section className="title-section">
        <div className="wood-sign">
          <h1>KOI SHOP</h1>
          <p>Items Shop</p>
        </div>
      </section>
      <section className="market-tabs">
        {categories.map((item) => (
          <button
            key={item.id}
            className={`tab ${category === item.id ? 'active' : ''}`}
            onClick={() => setCategory(item.id)}
          >
            {item.icon} {item.label}
          </button>
        ))}
      </section>
      {notice && <p className="notice">{notice}</p>}
      <main className={`shop-main ${selected ? 'item-selected' : ''}`}>
        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                {product.category === 'CURRENCY' ? (
                  <img src={coinPackageImages[product.coinAmount ?? 0]} alt="" />
                ) : (
                  productIcons[product.category]
                )}
              </div>
              {product.rarity && (
                <div className={`rarity ${product.rarity.toLowerCase()}`}>
                  {product.rarity}
                </div>
              )}
              <h3>{product.name}</h3>
              <div className="price">{price(product)}</div>
              <button onClick={() => setSelected(product)}>Buy</button>
            </article>
          ))}
        </div>
        {selected && (
          <aside className="detail-panel">
            <div className="detail-header">Selected Item</div>
            <hr />
            <div className="detail-image">
              {selected.category === 'CURRENCY' ? (
                  <img src={coinPackageImages[selected.coinAmount ?? 0]} alt="" />
              ) : (
                productIcons[selected.category]
              )}
            </div>
            <h2>{selected.name}</h2>
            {selected.rarity && (
              <div className={`rarity ${selected.rarity.toLowerCase()}`}>
                {selected.rarity}
              </div>
            )}
            <div className="description">
              <p>{selected.description}</p>
            </div>
            <div className="detail-price">{price(selected)}</div>
            <button className="buy-btn" onClick={() => void buy(selected)}>
              Buy Now
            </button>
          </aside>
        )}
      </main>
    </div>
  )
}

export default App
