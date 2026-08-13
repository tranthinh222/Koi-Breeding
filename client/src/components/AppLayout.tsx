import { Outlet } from 'react-router-dom'
import ShopBackground from './ShopBackground'
import ShopHeader from './Header'
import ShopNavigation from './ShopNavigation'

export default function AppLayout() {
  return (
    <>
      <ShopBackground />
      <ShopHeader />
      <ShopNavigation />
      <Outlet />
    </>
  )
}
