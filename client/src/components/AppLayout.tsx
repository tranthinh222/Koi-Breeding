import { Outlet } from 'react-router-dom'
import ShopBackground from './user/ShopBackground'
import ShopHeader from './Header'
import ShopNavigation from './user/ShopNavigation'

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
