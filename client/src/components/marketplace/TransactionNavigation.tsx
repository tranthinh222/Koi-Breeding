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
        🛒 BUY
      </button>

      <button
        className={location.pathname === "/sell" ? "tab active" : "tab"}
        onClick={() => navigate("/sell")}
      >
        💰 SELL
      </button>

      <button
        className={location.pathname === "/buy" ? "tab active" : "tab"}
        onClick={() => navigate("/buy")}
      >
        📋 MY LISTINGS
      </button>

      <button
        className={location.pathname === "/transactions" ? "tab active" : "tab"}
        onClick={() => navigate("/transactions")}
      >
        📜 HISTORY
      </button>
    </nav>
  );
}
