import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./style/global.css";
import Shop from "./pages/shop/Shop";
import Inventory from "./pages/inventory/Inventory";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/shop" element={<Shop />} />

          <Route path="/inventory" element={<Inventory />} />

          <Route path="/" element={<Navigate to="/shop" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
