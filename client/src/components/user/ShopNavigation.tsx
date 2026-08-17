import { useNavigate, useLocation } from "react-router-dom";
export default function ShopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="navigation-menu">
      <button onClick={() => navigate("/")}>🏠 Home</button>

      <button
        className={location.pathname === "/inventory" ? "active" : ""}
        onClick={() => navigate("/inventory")}
      >
        🎒 Inventory
      </button>

      <button
        className={location.pathname === "/shop" ? "active" : ""}
        onClick={() => navigate("/shop")}
      >
        🛒 Shop
      </button>

      <button
        className={location.pathname === "/transactions" ? "active" : ""}
        onClick={() => navigate("/transactions")}
      >
        🏪 Marketplace
      </button>

      <button>⚙︎ Settings</button>
    </nav>
  );
}
