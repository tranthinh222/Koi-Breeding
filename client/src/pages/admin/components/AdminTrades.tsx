import { useEffect, useState, type ReactNode } from "react";
import { FileText, Search } from "lucide-react";

import { getAdminTrades, type AdminTrade } from "../../../api/admin";
import AdminPagination from "./AdminPagination";
import "./admintrade.css";

type DateFilter = "ALL" | "today" | "week" | "month";
type PriceSort = "DEFAULT" | "ASC" | "DESC";

function formatKoins(amount: number): string {
  return `${new Intl.NumberFormat("en-US").format(amount)} Koins`;
}

function formatDateTime(dateTime: string): string {
  const date = new Date(dateTime);
  if (Number.isNaN(date.getTime())) return dateTime;

  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

interface KpiCardProps {
  label: string;
  value: string;
  subtext: string;
  dotColor: string;
  icon: ReactNode;
  iconBg: string;
  accentClass: string;
}

function KpiCard({
  label,
  value,
  subtext,
  dotColor,
  icon,
  iconBg,
  accentClass,
}: KpiCardProps) {
  return (
    <div className={`trades-kpi-card ${accentClass}`}>
      <div className="trades-kpi-glow" />
      <div className="trades-kpi-top">
        <span className="trades-kpi-label">{label}</span>
        <div className={`trades-kpi-icon ${iconBg}`}>{icon}</div>
      </div>
      <div className="trades-kpi-value">{value}</div>
      <p className="trades-kpi-subtext">
        <span className="trades-kpi-dot" style={{ background: dotColor }} />
        {subtext}
      </p>
    </div>
  );
}

interface TradeRowProps {
  trade: AdminTrade;
  checked: boolean;
  onCheck: (trade: AdminTrade) => void;
}

function TradeRow({ trade, checked, onCheck }: TradeRowProps) {
  return (
    <tr className="trades-table-row">
      <td className="trades-td trades-td-check">
        <input
          type="checkbox"
          className="trades-checkbox"
          checked={checked}
          onChange={() => onCheck(trade)}
        />
      </td>
      <td className="trades-td">
        <span className="trades-listing-id">#{trade.listing}</span>
      </td>
      <td className="trades-td">
        <div className="trades-user-name">{trade.buyer}</div>
      </td>
      <td className="trades-td">
        <div className="trades-user-name">{trade.seller}</div>
      </td>
      <td className="trades-td">
        <div className="trades-price">{formatKoins(trade.price)}</div>
      </td>
      <td className="trades-td">
        <div className="trades-date">{formatDateTime(trade.tradeAt)}</div>
      </td>
      <td className="trades-td trades-td-actions">
        <div className="trades-actions">
          <button
            type="button"
            className="trades-action-btn"
            title="View trade details"
          >
            <FileText size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function AdminTrades() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState<DateFilter>("ALL");
  const [sortPrice, setSortPrice] = useState<PriceSort>("DEFAULT");
  const [trades, setTrades] = useState<AdminTrade[]>([]);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getAdminTrades({
          page: currentPage,
          size: 8,
          search,
          dateFilter,
          sortPrice,
        });
        setTrades(response.content);
        setTotalPages(response.totalPages);
        setTotalElements(response.totalElements);
        setChecked(new Set());
      } catch (fetchError) {
        console.error("Failed to fetch admin trades:", fetchError);
        setTrades([]);
        setTotalPages(0);
        setTotalElements(0);
        setError("Unable to load marketplace trades.");
      } finally {
        setLoading(false);
      }
    };

    void fetchTrades();
  }, [currentPage, search, dateFilter, sortPrice]);

  const tradeKey = (trade: AdminTrade) =>
    `${trade.listing}-${trade.tradeAt}-${trade.buyer}-${trade.seller}`;

  const allChecked =
    trades.length > 0 && trades.every((trade) => checked.has(tradeKey(trade)));

  const toggleAll = () => {
    setChecked((previous) => {
      const next = new Set(previous);
      if (allChecked) {
        trades.forEach((trade) => next.delete(tradeKey(trade)));
      } else {
        trades.forEach((trade) => next.add(tradeKey(trade)));
      }
      return next;
    });
  };

  const toggleOne = (trade: AdminTrade) => {
    const key = tradeKey(trade);
    setChecked((previous) => {
      const next = new Set(previous);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const resetPage = () => setCurrentPage(0);

  const totalValue = trades.reduce((sum, trade) => sum + trade.price, 0);
  const averageValue = trades.length ? totalValue / trades.length : 0;

  return (
    <div className="trades-view">
      <header className="trades-header">
        <div>
          <p className="trades-breadcrumb">MARKETPLACE / TRADE HISTORY</p>
          <h1 className="trades-title">Marketplace trades</h1>
          <p className="trades-subtitle">
            Review completed koi sales between players.
          </p>
        </div>
      </header>

      <div className="trades-kpi-grid">
        <KpiCard
          label="TOTAL TRADES"
          value={totalElements.toLocaleString("en-US")}
          subtext="All completed marketplace trades"
          dotColor="#22c55e"
          icon={<FileText size={20} />}
          iconBg="trades-icon-green"
          accentClass="trades-accent-green"
        />
        <KpiCard
          label="PAGE VOLUME"
          value={formatKoins(totalValue)}
          subtext="Combined value on this page"
          dotColor="#3b82f6"
          icon={<FileText size={20} />}
          iconBg="trades-icon-blue"
          accentClass="trades-accent-blue"
        />
        <KpiCard
          label="TRADES ON THIS PAGE"
          value={trades.length.toLocaleString("en-US")}
          subtext="Records currently displayed"
          dotColor="#f59e0b"
          icon={<FileText size={20} />}
          iconBg="trades-icon-orange"
          accentClass="trades-accent-orange"
        />
        <KpiCard
          label="AVERAGE TRADE VALUE"
          value={formatKoins(averageValue)}
          subtext="Average value on this page"
          dotColor="#a855f7"
          icon={<FileText size={20} />}
          iconBg="trades-icon-purple"
          accentClass="trades-accent-purple"
        />
      </div>

      <div className="trades-table-card">
        <div className="trades-toolbar">
          <div className="trades-filters">
            <div className="trades-search-wrap">
              <Search size={16} className="trades-search-icon" />
              <input
                className="trades-search-input"
                placeholder="Search by buyer or seller..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  resetPage();
                }}
              />
            </div>
            <select
              className="trades-select"
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(event.target.value as DateFilter);
                resetPage();
              }}
            >
              <option value="ALL">All dates</option>
              <option value="today">Today</option>
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
            </select>
            <select
              className="trades-select"
              value={sortPrice}
              onChange={(event) => {
                setSortPrice(event.target.value as PriceSort);
                resetPage();
              }}
            >
              <option value="DEFAULT">Sort by price</option>
              <option value="ASC">Price: low to high</option>
              <option value="DESC">Price: high to low</option>
            </select>
          </div>
        </div>

        {error && <div className="inline-alert error">{error}</div>}

        <div className="trades-table-scroll">
          <table className="trades-table">
            <thead>
              <tr className="trades-thead-row">
                <th className="trades-th trades-th-check">
                  <input
                    type="checkbox"
                    className="trades-checkbox"
                    checked={allChecked}
                    onChange={toggleAll}
                  />
                </th>
                <th className="trades-th">LISTING ID</th>

                <th className="trades-th">BUYER</th>
                <th className="trades-th">SELLER</th>

                <th className="trades-th">TRADE VALUE</th>
                <th className="trades-th">TRADE DATE</th>
                <th className="trades-th trades-th-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="trades-empty">
                    Loading marketplace trades...
                  </td>
                </tr>
              ) : trades.length ? (
                trades.map((trade) => (
                  <TradeRow
                    key={tradeKey(trade)}
                    trade={trade}
                    checked={checked.has(tradeKey(trade))}
                    onCheck={toggleOne}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="trades-empty">
                    No trades match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          loading={loading}
          onPageChange={setCurrentPage}
          summary={`Showing ${trades.length ? currentPage * 8 + 1 : 0}–${currentPage * 8 + trades.length} of ${totalElements} trades`}
        />
      </div>
    </div>
  );
}
