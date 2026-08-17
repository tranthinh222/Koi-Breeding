import { useState } from 'react'

import type { ShopCategory, ShopItem } from '../../api/shop'

import ShopTitle from '../../components/user/ShopTitle'
import ShopTabs from '../../components/user/ShopTabs'

import FoodShop from './FoodShop'
import MedicineShop from './MedicineShop'
import KoiShop from './KoiShop'
import KoinShop from './KoinShop'

export default function Shop() {
  const [category, setCategory] = useState<ShopCategory>('FOOD')

  const [selectedItem, setSelectedItem] = useState<ShopItem | null>(null)

  return (
    <>
      <ShopTitle />

      <ShopTabs
        activeCategory={category}
        onChange={(newCategory) => {
          setCategory(newCategory)
          setSelectedItem(null)
        }}
      />

      {category === 'FOOD' && (
        <FoodShop selectedItem={selectedItem} onSelect={setSelectedItem} />
      )}

      {category === 'MEDICINE' && (
        <MedicineShop selectedItem={selectedItem} onSelect={setSelectedItem} />
      )}

      {category === 'KOI' && (
        <KoiShop selectedItem={selectedItem} onSelect={setSelectedItem} />
      )}

      {category === 'CURRENCY' && (
        <KoinShop selectedItem={selectedItem} onSelect={setSelectedItem} />
      )}
    </>
  )
}
