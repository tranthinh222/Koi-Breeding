import { Navigate, Outlet } from 'react-router-dom'
import ShopBackground from './user/ShopBackground'
import ShopHeader from './Header'
import ShopNavigation from './user/ShopNavigation'
import { useAuth } from '../context/AuthContext'

export default function AppLayout() {
  const { currentUser, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!currentUser) {
    return <Navigate to="/landing" replace />
  }

  return (
    <>
      <ShopBackground />
      <ShopHeader />
      <ShopNavigation />
      <Outlet />
    </>
  )
}
