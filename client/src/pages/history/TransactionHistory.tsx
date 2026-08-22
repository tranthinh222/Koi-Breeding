import { useEffect, useMemo, useState } from "react";
import { CURRENT_USER_ID } from "../../api/currentUser";
import { getTransactions, type Transaction } from "../../api/transaction";
import "../../style/history.css";

type TransactionFilter = "ALL" | "BOUGHT" | "SOLD";
type TransactionSort = "NEWEST" | "OLDEST";

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<TransactionFilter>("ALL");
  const [sort, setSort] = useState<TransactionSort>("NEWEST");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTransactions(CURRENT_USER_ID)
      .then(setTransactions)
      .catch((requestError) => {
        console.error("Failed to load transactions:", requestError);
        setError("Unable to load transaction history.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter((transaction) => {
      if (filter === "BOUGHT")
        return transaction.transactionType.startsWith("BUY_");
      if (filter === "SOLD") {
        return (
          transaction.transactionType === "DEPOSIT" ||
          transaction.transactionType === "SELL_FISH"
        );
      }
      return true;
    });

    return filtered.sort((left, right) => {
      const leftTime = new Date(left.createdAt).getTime();
      const rightTime = new Date(right.createdAt).getTime();
      return sort === "NEWEST" ? rightTime - leftTime : leftTime - rightTime;
    });
  }, [filter, sort, transactions]);

  return (
    <div className="transaction-history-page">
      <section className="title-section">
        <div className="wood-sign">
          <h1>TRANSACTION HISTORY</h1>
        </div>
      </section>

      <section className="market-tabs history-tabs">
        <button className="tab">🛒 Buy</button>
        <button className="tab">💰 Sell</button>
        <button className="tab">📋 My Listings</button>
        <button className="tab active">📜 History</button>
      </section>

      <section className="search-panel">
        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value as TransactionFilter)
          }
        >
          <option value="ALL">All Transactions</option>
          <option value="BOUGHT">Bought</option>
          <option value="SOLD">Sold</option>
        </select>
        <select
          value={sort}
          onChange={(event) => setSort(event.target.value as TransactionSort)}
        >
          <option value="NEWEST">Newest</option>
          <option value="OLDEST">Oldest</option>
        </select>
      </section>
      <section className="history-container">
        {loading && <p className="history-message">Loading transactions...</p>}
        {error && <p className="history-message">{error}</p>}
        {!loading && !error && filteredTransactions.length === 0 && (
          <p className="history-message">No transactions yet.</p>
        )}
        {filteredTransactions.map((transaction) => {
          const isDeposit = transaction.transactionType === "DEPOSIT";
          return (
            <article className="history-card" key={transaction.id}>
              <div className={`history-icon ${isDeposit ? "sell" : "buy"}`}>
                {isDeposit ? "💰" : "🛒"}
              </div>
              <div className="history-info">
                <h3>{transaction.itemName}</h3>
                <p>{transaction.description}</p>
                <p>{new Date(transaction.createdAt).toLocaleString()}</p>
              </div>
              <div className={`history-price ${isDeposit ? "income" : ""}`}>
                {isDeposit ? "+" : "-"}
                {transaction.amount.toLocaleString("vi-VN")} Koins
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
