import { useLocation, useNavigate } from "react-router-dom";

export default function TransactionNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="market-tabs history-tabs">
      <button
        className={location.pathname === "/marketplace" ? "tab active" : "tab"}
        onClick={() => navigate("/marketplace")}
      >
        🛒 Buy
      </button>

      <button
        className={location.pathname === "/sell" ? "tab active" : "tab"}
        onClick={() => navigate("/sell")}
      >
        💰 Sell
      </button>

      <button
        className={location.pathname === "/buy" ? "tab active" : "tab"}
        onClick={() => navigate("/buy")}
      >
        📋 My Listings
      </button>

      <button
        className={location.pathname === "/history" ? "tab active" : "tab"}
        onClick={() => navigate("/history")}
      >
        📜 History
      </button>
    </nav>
  );
}
