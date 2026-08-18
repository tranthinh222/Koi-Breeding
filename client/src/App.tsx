import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './style/global.css'
import AppLayout from './components/AppLayout'
import Shop from './pages/shop/Shop'
import Inventory from './pages/inventory/Inventory'
import TransactionHistory from './pages/marketplace/TransactionHistory'
import Payment from './pages/payment/payment'
import Home from './pages/home/Home'
import Profile from './pages/profile/Profile'
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Route>

          <Route path="/payment/:itemId" element={<Payment />} />

          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
