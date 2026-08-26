import { useNavigate, useLocation } from "react-router-dom";
export default function ShopNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <nav className="navigation-menu">
      <button
        className={location.pathname === "/home" ? "active" : ""}
        onClick={() => navigate("/home")}
      >
        🏠 Home
      </button>

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
        className={location.pathname === "/marketplace" ? "active" : ""}
        onClick={() => navigate("/marketplace")}
      >
        🏪 Marketplace
      </button>

      <button
        className={location.pathname === "/addlist" ? "active" : ""}
        onClick={() => navigate("/addlist")}
      >
        🏪 Add List
      </button>

      <button
        className={location.pathname === "/transactions" ? "active" : ""}
        onClick={() => navigate("/transactions")}
      >
        ⚙︎ Transactions
      </button>
    </nav>
  );
}
