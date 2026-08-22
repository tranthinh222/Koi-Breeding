import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Home from "./pages/home/Home";
import Inventory from "./pages/inventory/Inventory";
import Landing from "./pages/landing/Landing";
import TransactionHistory from "./pages/history/TransactionHistory";
import Payment from "./pages/payment/payment";
import Profile from "./pages/profile/Profile";
import Shop from "./pages/shop/Shop";
import "./style/global.css";
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

          <Route path="/landing" element={<Landing />} />
          <Route path="/" element={<Navigate to="/landing" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
