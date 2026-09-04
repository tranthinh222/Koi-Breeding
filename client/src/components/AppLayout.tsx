import { Outlet } from 'react-router-dom'
import ShopBackground from './user/ShopBackground'
import ShopHeader from './Header'
import ShopNavigation from './user/ShopNavigation'
import BackToPondButton from './user/BackToPondButton/BackToPondButton'

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
