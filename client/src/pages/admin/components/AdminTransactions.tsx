import { useEffect, useState } from "react";
import {
  Search,
  RotateCcw,
  Eye,
  ChevronLeft,
  ChevronRight,
  Wallet,
  ArrowDown,
  ShoppingBag,
  Fish,
  Tag,
} from "lucide-react";

import {
  getAdminTransactions,
  type AdminTransaction,
} from "../../../api/admin";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US").format(Math.abs(value));
}

function formatTransactionType(type: AdminTransaction["transactionType"]) {
  return {
    DEPOSIT: "Deposit",
    BUY_FOOD: "Food purchase",
    BUY_FISH: "Koi purchase",
    SELL_FISH: "Koi sale",
  }[type];
}

function formatTransactionStatus(status: AdminTransaction["status"]) {
  return status === "SUCCESSED"
    ? "Completed"
    : status.charAt(0) + status.slice(1).toLowerCase();
}

function getTransactionIcon(type: AdminTransaction["transactionType"]) {
  switch (type) {
    case "DEPOSIT":
      return <ArrowDown size={14} />;

    case "BUY_FOOD":
      return <ShoppingBag size={14} />;

    case "BUY_FISH":
      return <Fish size={14} />;

    case "SELL_FISH":
      return <Tag size={14} />;

    default:
      return null;
  }
}

function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortPrice, setSortPrice] = useState("DEFAULT");
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminTransactions({
          page: currentPage,
          size: 8,
          search: searchTerm,
          transactionType: typeFilter,
          transactionStatus: statusFilter,
          sortPrice,
        });
        setTransactions(response.content);
        setTotalPages(response.totalPages);
      } catch (fetchError) {
        console.error("Failed to fetch admin transactions:", fetchError);
        setError("Unable to load transactions.");
        setTransactions([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    void fetchTransactions();
  }, [currentPage, searchTerm, typeFilter, statusFilter, sortPrice]);

  const resetFilters = () => {
    setSearchTerm("");
    setTypeFilter("ALL");
    setStatusFilter("ALL");
    setSortPrice("DEFAULT");
    setCurrentPage(0);
  };

  return (
    <div className="transactions-view">
      {/* ================= FILTER ================= */}

      <section className="transaction-filter-card">
        <div className="transaction-filter-header">
          <div>
            <h2>Transaction history</h2>
            <p>Review and monitor shop transactions across the platform.</p>
          </div>
        </div>

        <div className="transaction-filter-row">
          <div className="transaction-search">
            <Search size={18} />

            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(0);
              }}
              placeholder="Search by ID, item, or description..."
            />
          </div>

          <select
            value={typeFilter}
            onChange={(event) => {
              setTypeFilter(event.target.value);
              setCurrentPage(0);
            }}
            className="transaction-select"
          >
            <option value="ALL">All transaction types</option>
            <option value="DEPOSIT">Deposit</option>
            <option value="BUY_FOOD">Food purchase</option>
            <option value="BUY_FISH">Koi purchase</option>
            <option value="SELL_FISH">Koi sale</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(0);
            }}
            className="transaction-select"
          >
            <option value="ALL">All statuses</option>
            <option value="SUCCESSED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            value={sortPrice}
            onChange={(event) => {
              setSortPrice(event.target.value);
              setCurrentPage(0);
            }}
            className="transaction-select"
          >
            <option value="DEFAULT">Sort by amount</option>
            <option value="ASC">Amount: low to high</option>
            <option value="DESC">Amount: high to low</option>
          </select>

          <button
            type="button"
            className="transaction-reset-button"
            onClick={resetFilters}
            title="Reset filters"
          >
            <RotateCcw size={18} />
          </button>
        </div>
      </section>

      {error && <div className="inline-alert error">{error}</div>}

      {/* ================= TABLE ================= */}

      <section className="transaction-table-card">
        <div className="transaction-table-scroll">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Transaction & date</th>
                <th>Wallet & item</th>
                <th>Type</th>
                <th className="text-right">Amount</th>
                <th>Description</th>
                <th className="text-center">Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="transaction-empty">
                    Loading transactions...
                  </td>
                </tr>
              ) : (
                transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    {/* ID */}

                    <td>
                      <div className="transaction-id">#{transaction.id}</div>

                      <div className="transaction-date">
                        {transaction.createdAt}
                      </div>
                    </td>

                    {/* Wallet */}

                    <td>
                      <div className="wallet-cell">
                        <Wallet size={15} />

                        <span>{transaction.itemName || "No item"}</span>
                      </div>

                      <div className="item-id-cell">
                        Item ID:
                        <span
                          className={
                            transaction.itemId ? "has-item" : "empty-item"
                          }
                        >
                          {transaction.itemId ?? "Not linked"}
                        </span>
                      </div>
                    </td>

                    {/* Type */}

                    <td>
                      <span
                        className={`transaction-type type-${transaction.transactionType.toLowerCase()}`}
                      >
                        {getTransactionIcon(transaction.transactionType)}

                        {formatTransactionType(transaction.transactionType)}
                      </span>
                    </td>

                    {/* Amount */}

                    <td
                      className={`transaction-amount ${
                        transaction.amount >= 0
                          ? "amount-positive"
                          : "amount-negative"
                      }`}
                    >
                      {transaction.amount >= 0 ? "+" : "-"}
                      {formatCurrency(transaction.amount)} Koins
                    </td>

                    {/* Description */}

                    <td>
                      <div className="transaction-description">
                        {transaction.description}
                      </div>

                      <div
                        className={`transaction-note ${
                          transaction.status === "FAILED"
                            ? "note-error"
                            : transaction.status === "PENDING"
                              ? "note-warning"
                              : ""
                        }`}
                      >
                        {transaction.status === "FAILED"
                          ? "Transaction failed"
                          : transaction.status === "PENDING"
                            ? "Pending"
                            : ""}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="text-center">
                      <span
                        className={`transaction-status status-${transaction.status.toLowerCase()}`}
                      >
                        <span className="status-dot" />

                        {formatTransactionStatus(transaction.status)}
                      </span>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="transaction-actions">
                        <button type="button" title="View transaction details">
                          <Eye size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && !transactions.length && (
                <tr>
                  <td colSpan={7} className="transaction-empty">
                    No transactions match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ================= PAGINATION ================= */}

        <div className="transaction-pagination">
          <div className="transaction-pagination-buttons">
            <button
              type="button"
              disabled={currentPage === 0 || loading}
              onClick={() => setCurrentPage((page) => page - 1)}
            >
              <ChevronLeft size={17} />
            </button>

            {Array.from({ length: totalPages }, (_, index) => (
              <button
                type="button"
                key={index}
                className={currentPage === index ? "active" : ""}
                disabled={loading}
                onClick={() => setCurrentPage(index)}
              >
                {index + 1}
              </button>
            ))}

            <button
              type="button"
              disabled={
                totalPages === 0 || currentPage >= totalPages - 1 || loading
              }
              onClick={() => setCurrentPage((page) => page + 1)}
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AdminTransactions;
