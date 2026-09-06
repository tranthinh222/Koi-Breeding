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
  return new Intl.NumberFormat("vi-VN").format(Math.abs(value));
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
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

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
        setSelectedIds([]);
      } catch (fetchError) {
        console.error("Failed to fetch admin transactions:", fetchError);
        setError("Không thể tải danh sách giao dịch.");
        setTransactions([]);
        setTotalPages(0);
      } finally {
        setLoading(false);
      }
    };

    void fetchTransactions();
  }, [currentPage, searchTerm, typeFilter, statusFilter, sortPrice]);

  const toggleSelectAll = () => {
    if (selectedIds.length === transactions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(transactions.map((item) => item.id));
    }
  };

  const toggleTransaction = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

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
            <h2>Lịch sử giao dịch</h2>
            <p>Quản lý và theo dõi toàn bộ giao dịch trong hệ thống.</p>
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
              placeholder="Tìm ID, tên item hoặc mô tả..."
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
            <option value="ALL">Loại GD: ALL</option>
            <option value="DEPOSIT">DEPOSIT</option>
            <option value="BUY_FOOD">BUY_FOOD</option>
            <option value="BUY_FISH">BUY_FISH</option>
            <option value="SELL_FISH">SELL_FISH</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(0);
            }}
            className="transaction-select"
          >
            <option value="ALL">Trạng thái: ALL</option>
            <option value="SUCCESSED">SUCCESSED</option>
            <option value="PENDING">PENDING</option>
            <option value="FAILED">FAILED</option>
            <option value="CANCELLED">CANCELLED</option>
          </select>

          <select
            value={sortPrice}
            onChange={(event) => {
              setSortPrice(event.target.value);
              setCurrentPage(0);
            }}
            className="transaction-select"
          >
            <option value="DEFAULT">DEFAULT</option>
            <option value="ASC">ASC</option>
            <option value="DESC">DESC</option>
          </select>

          <button
            type="button"
            className="transaction-reset-button"
            onClick={resetFilters}
            title="Làm mới bộ lọc"
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
                <th>ID GD & THỜI GIAN</th>
                <th>VÍ & ITEM</th>
                <th>LOẠI GIAO DỊCH</th>
                <th className="text-right">SỐ TIỀN</th>
                <th>MÔ TẢ</th>
                <th className="text-center">TRẠNG THÁI</th>
                <th className="text-center">THAO TÁC</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="transaction-empty">
                    Đang tải dữ liệu...
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

                        <span>{transaction.itemName || "Không có item"}</span>
                      </div>

                      <div className="item-id-cell">
                        itemId:
                        <span
                          className={
                            transaction.itemId ? "has-item" : "empty-item"
                          }
                        >
                          {transaction.itemId ?? "null"}
                        </span>
                      </div>
                    </td>

                    {/* Type */}

                    <td>
                      <span
                        className={`transaction-type type-${transaction.transactionType.toLowerCase()}`}
                      >
                        {getTransactionIcon(transaction.transactionType)}

                        {transaction.transactionType}
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
                      {formatCurrency(transaction.amount)} đ
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
                          ? "Giao dịch thất bại"
                          : transaction.status === "PENDING"
                            ? "Đang chờ xử lý"
                            : ""}
                      </div>
                    </td>

                    {/* Status */}

                    <td className="text-center">
                      <span
                        className={`transaction-status status-${transaction.status.toLowerCase()}`}
                      >
                        <span className="status-dot" />

                        {transaction.status}
                      </span>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="transaction-actions">
                        <button type="button" title="Xem chi tiết">
                          <Eye size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}

              {!loading && !transactions.length && (
                <tr>
                  <td colSpan={8} className="transaction-empty">
                    Không tìm thấy giao dịch phù hợp.
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
