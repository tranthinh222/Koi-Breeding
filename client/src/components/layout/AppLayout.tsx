import { Outlet } from 'react-router-dom'
import ShopBackground from '../shop/ShopBackground'
import ShopHeader from './Header'
import ShopNavigation from './ShopNavigation'
import BackToPondButton from './BackToPondButton/BackToPondButton'
import '../shared/TitleSection/TitleSection.css'
import './AppLayout.css'

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
