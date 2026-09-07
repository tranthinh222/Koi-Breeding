import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/auth/ProtectedRoute/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import Admin from './pages/admin/Admin'
import Breeding from './pages/breeding/Breeding'
import Dictionary from './pages/dictionary/Dictionary'
import Home from './pages/home/Home'
import Inventory from './pages/inventory/Inventory'
import Landing from './pages/landing/Landing'
import Marketplace from './pages/marketplace/Marketplace'
import MarketListing from './pages/marketplace/MyListings'
import MarketAddList from './pages/marketplace/SellKoi'
import TransactionHistory from './pages/marketplace/TransactionHistory'
import Payment from './pages/payment/Payment'
import PondLanding from './pages/pond/PondLanding'
import Profile from './pages/profile/Profile'
import Shop from './pages/shop/Shop'
import './style/global.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {/* Route công khai */}
          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<Navigate to="/landing" replace />} />
          <Route path="/login" element={<Landing initialAuthMode="login" />} />
          <Route
            path="/register"
            element={<Landing initialAuthMode="register" />}
          />
          {/* Just for user */}
          <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/sell" element={<MarketAddList />} />
              <Route path="/buy" element={<MarketListing />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/transactions" element={<TransactionHistory />} />
            </Route>
            <Route path="/payment/:itemId" element={<Payment />} />
            <Route path="/pond" element={<PondLanding />} />
            <Route path="/dictionary" element={<Dictionary />} />
            <Route path="/breeding" element={<Breeding />} />
          </Route>

          {/* Just for admin */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']} />
            }
          >
            <Route path="/admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
