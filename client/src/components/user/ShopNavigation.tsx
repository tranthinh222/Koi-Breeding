import {
  Backpack,
  House,
  ReceiptText,
  Settings,
  ShoppingCart,
  Waves,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
export default function ShopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="navigation-menu">
      <button onClick={() => navigate("/")}>
        <House />
        <span>Home</span>
      </button>

      <button
        className={location.pathname.startsWith("/pond") ? "active" : ""}
        onClick={() => navigate("/pond")}
      >
        <Waves />
        <span>My Ponds</span>
      </button>

      <button
        className={location.pathname === "/inventory" ? "active" : ""}
        onClick={() => navigate("/inventory")}
      >
        <Backpack />
        <span>Inventory</span>
      </button>

      <button
        className={location.pathname === "/shop" ? "active" : ""}
        onClick={() => navigate("/shop")}
      >
        <ShoppingCart />
        <span>Shop</span>
      </button>

      <button
        className={location.pathname === "/transactions" ? "active" : ""}
        onClick={() => navigate("/transactions")}
      >
        <ReceiptText />
        <span>Marketplace</span>
      </button>

      <button>
        <Settings />
        <span>Settings</span>
      </button>
    </nav>
  );
}
