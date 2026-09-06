import { Outlet } from 'react-router-dom'
import ShopBackground from '../shop/ShopBackground'
import ShopHeader from './Header'
import ShopNavigation from './ShopNavigation'
import BackToPondButton from './BackToPondButton/BackToPondButton'

export default function AppLayout() {
  return (
    <div className="app-layout">
      <ShopBackground />
      <ShopHeader />
      <BackToPondButton />
      <Outlet />
      <footer className="app-footer">
        <ShopNavigation />
      </footer>
    </div>
  )
}
