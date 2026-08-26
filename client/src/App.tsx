import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/home/Home";
import Inventory from "./pages/inventory/Inventory";
import Landing from "./pages/landing/Landing";
import TransactionHistory from "./pages/history/TransactionHistory";
import Payment from "./pages/payment/payment";
import Profile from "./pages/profile/Profile";
import Shop from "./pages/shop/Shop";
import Marketplace from "./pages/marketplace/Marketplace";
import Ponds from "./pages/ponds/Ponds"
import Breeding from "./pages/breeding/Breeding";
import "./style/global.css";
import MarketAddList from "./components/marketplace/MarketAddList";
import MarketListing from "./components/marketplace/MarketListing";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/ponds" element={<Ponds />}/>
            <Route path="/breeding" element={<Breeding />}/>
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/addlist" element={<MarketAddList />} />
            <Route path="/listings" element={<MarketListing />} />
            <Route path="/transactions" element={<TransactionHistory />} />
          </Route>

          <Route path="/payment/:itemId" element={<Payment />} />

          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<Navigate to="/landing" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
