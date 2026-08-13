import { useEffect, useState } from "react";
import { getBalanceWallet } from "../api/wallet";

const CURRENT_USER_ID = 1;

export default function ShopHeader() {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const data = await getBalanceWallet(CURRENT_USER_ID);

        setBalance(data.balance);
      } catch (error) {
        console.error("Failed to load wallet balance:", error);
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
  }, []);

  return (
    <header className="hud">
      <div className="player">
        <div className="avatar">🧑</div>

        <div>
          <h3>Koi Master</h3>
          <p>Level: 18</p>
        </div>
      </div>

      <div className="wallet">
        <div className="gold">
          🪙 {loading ? "Loading..." : balance.toLocaleString("en-US")}
        </div>
      </div>
    </header>
  );
}
