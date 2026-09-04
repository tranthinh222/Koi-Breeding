import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  ChevronRight,
  MoreHorizontal,
  SlidersHorizontal,
  SunMedium,
  MoonStar,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import {
  getAdminDashboard,
  getAdminUsers,
  updateAdminUser,
  type AdminDashboardResponse,
  type AdminRankingUserDto,
  type AdminUserDto,
  type AdminUserStatus,
} from "../../api/admin";
import { AdminNavbar } from "./components/AdminNavbar";
import { AdminSidebar } from "./components/AdminSidebar";
import "../../style/admin.css";
import maleDefaultAvatar from '../../assets/avatars/male_blank_avatar.png'
import femaleDefaultAvatar from '../../assets/avatars/female_blank_avatar.png'

import UserModerationModal from "./components/UserModerationModal";

export type MenuTab = "dashboard" | "users" | "breeding" | "origin";
export type OtherTab = "settings" | "account";
type AdminView = MenuTab | OtherTab;
type PanelAction = "View" | "Edit" | "Refresh";

interface PanelDescriptor {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  change: string;
  trend: "up" | "down" | "flat";
  accent: string;
}

function formatNumber(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function formatMoney(value: number | null | undefined) {
  return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function getLevel(exp: number | null | undefined) {
  return Math.max(1, Math.floor((exp ?? 0) / 100));
}

function getStatusTone(status: AdminUserStatus | null) {
  return status === "BANNED" ? "status-banned" : "status-active";
}

function formatRelativeTime(dateValue: string | null | undefined) {
  if (!dateValue) return "Unknown";
  const value = new Date(dateValue);
  if (Number.isNaN(value.getTime())) return "Unknown";

  const diffMs = Date.now() - value.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  return `${diffDays} days ago`;
}

function buildDashboardPanels(dashboard: AdminDashboardResponse | null): PanelDescriptor[] {
  const usersGrowth = dashboard?.users.growthPercent;
  const shopGrowth = dashboard?.shopPurchases.growthPercent;
  const marketGrowth = dashboard?.marketplaceTrades.growthPercent;

  return [
    {
      id: "users",
      title: "Total Users",
      subtitle: "Growth vs previous month",
      value: formatNumber(dashboard?.users.total),
      change:
        usersGrowth == null
          ? `${dashboard?.users.delta ?? 0 >= 0 ? "+" : ""}${formatNumber(dashboard?.users.delta)}`
          : `${usersGrowth >= 0 ? "+" : ""}${usersGrowth.toFixed(1)}%`,
      trend: (dashboard?.users.delta ?? 0) > 0 ? "up" : (dashboard?.users.delta ?? 0) < 0 ? "down" : "flat",
      accent: "blue",
    },
    {
      id: "shop",
      title: "Shop Purchases",
      subtitle: "Paid orders this month",
      value: formatNumber(dashboard?.shopPurchases.total),
      change:
        shopGrowth == null
          ? `${dashboard?.shopPurchases.delta ?? 0 >= 0 ? "+" : ""}${formatNumber(dashboard?.shopPurchases.delta)}`
          : `${shopGrowth >= 0 ? "+" : ""}${shopGrowth.toFixed(1)}%`,
      trend:
        (dashboard?.shopPurchases.delta ?? 0) > 0
          ? "up"
          : (dashboard?.shopPurchases.delta ?? 0) < 0
            ? "down"
            : "flat",
      accent: "amber",
    },
    {
      id: "market",
      title: "Marketplace Trades",
      subtitle: "Completed trade volume",
      value: formatNumber(dashboard?.marketplaceTrades.total),
      change:
        marketGrowth == null
          ? `${dashboard?.marketplaceTrades.delta ?? 0 >= 0 ? "+" : ""}${formatNumber(dashboard?.marketplaceTrades.delta)}`
          : `${marketGrowth >= 0 ? "+" : ""}${marketGrowth.toFixed(1)}%`,
      trend:
        (dashboard?.marketplaceTrades.delta ?? 0) > 0
          ? "up"
          : (dashboard?.marketplaceTrades.delta ?? 0) < 0
            ? "down"
            : "flat",
      accent: "emerald",
    },
    {
      id: "koi",
      title: "Highest Level User",
      subtitle: "Top level account in the system",
      value: dashboard?.highestLevelUser ? `Lv. ${dashboard.highestLevelUser.level}` : "Lv. 1",
      change: dashboard?.highestLevelUser?.username ?? "No data",
      trend: "flat",
      accent: "violet",
    },
  ];
}

function Admin() {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState<AdminView>("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
  const saved = localStorage.getItem("theme") as "light" | "dark" | null;
    if (saved === "light" || saved === "dark") return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [panelMenuOpenId, setPanelMenuOpenId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState<string | null>(null);
  const [users, setUsers] = useState<AdminUserDto[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    action: "ban" | "unban";
    userId: number;
  }>({
    isOpen: false,
    action: "ban",
    userId: 1,
  });

  const openStatusModal = (user: AdminUserDto) => {
    setStatusModal({
      isOpen: true,
      action: user.status === 'ACTIVE' ? 'ban' : 'unban',
      userId: user.id,
    });
  };
  const panelDescriptors = useMemo(() => buildDashboardPanels(dashboard), [dashboard]);

  const filteredUsers = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase();
    if (!normalizedTerm) return users;

    return users.filter((user) => {
      return [user.username, user.email, user.status ?? "", user.role]
        .join(" ")
        .toLowerCase()
        .includes(normalizedTerm);
    });
  }, [searchTerm, users]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  
  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      setDashboardLoading(true);
      setDashboardError(null);
      try {
        const response = await getAdminDashboard(3, 3);
        if (!cancelled) setDashboard(response);
      } catch {
        if (!cancelled) setDashboardError("Unable to load dashboard data from the database.");
      } finally {
        if (!cancelled) setDashboardLoading(false);
      }
    };

    const loadUsers = async () => {
      setUsersLoading(true);
      setUsersError(null);
      try {
        const response = await getAdminUsers(page, pageSize);
        if (!cancelled) {
          setUsers(response.result ?? []);
          setTotalPages(response.meta?.totalPages ?? 1);
        }
      } catch {
        if (!cancelled) setUsersError("Unable to load users from the database.");
      } finally {
        if (!cancelled) setUsersLoading(false);
      }
    };

    void loadDashboard();
    void loadUsers();

    return () => {
      cancelled = true;
    };
  }, [page, pageSize]);

  const refreshDashboard = async () => {
    setDashboardLoading(true);
    setDashboardError(null);
    try {
      const response = await getAdminDashboard(3, 3);
      setDashboard(response);
    } catch {
      setDashboardError("Unable to load dashboard data from the database.");
    } finally {
      setDashboardLoading(false);
    }
  };

  const refreshUsers = async (nextPage = page) => {
    setUsersLoading(true);
    setUsersError(null);
    try {
      const response = await getAdminUsers(nextPage, pageSize);
      setUsers(response.result ?? []);
      setPage(nextPage);
      setTotalPages(response.meta?.totalPages ?? 1);
    } catch {
      setUsersError("Unable to load users from the database.");
    } finally {
      setUsersLoading(false);
    }
  };

  const adminProfileName = currentUser?.username ?? "Admin";
  const adminProfileEmail = currentUser?.email ?? "admin@koi-breeding.local";
  const adminProfileRole = currentUser?.role ?? "ADMIN";
  const adminProfileAvatar = currentUser?.avatarUrl ?? (currentUser?.gender === "MALE" ? maleDefaultAvatar : femaleDefaultAvatar);

  return (
    <div className={`admin-shell ${theme === "dark" ? "theme-dark" : "theme-light"}`}>
      <AdminSidebar activeView={activeView} onSelectView={setActiveView} />

      <main className="admin-main">
        <AdminNavbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          adminName={adminProfileName}
          adminRole={adminProfileRole}
          adminEmail={adminProfileEmail}
          adminAvatar={adminProfileAvatar}
        />

        <section className="admin-content">
          {activeView === "dashboard" && (
            <div className="dashboard-view">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Dashboard</p>
                  <h1>Control the game, economy, and community in one place.</h1>
                </div>
                <button type="button" className="primary-button" onClick={refreshDashboard}>
                  Refresh data
                  <ArrowUpRight size={16} />
                </button>
              </div>

              {dashboardError ? <div className="inline-alert error">{dashboardError}</div> : null}

              <div className="panel-grid panel-grid-metrics">
                {panelDescriptors.map((panel) => (
                  <article key={panel.id} className={`dashboard-panel accent-${panel.accent}`}>
                    <PanelHeader
                      title={panel.title}
                      subtitle={panel.subtitle}
                      panelId={panel.id}
                      openPanelMenu={panelMenuOpenId}
                      setOpenPanelMenu={setPanelMenuOpenId}
                    />
                    <div className="panel-body">
                      <div className="panel-value-row">
                        <strong>{panel.value}</strong>
                        <span className={`panel-trend trend-${panel.trend}`}>{panel.change}</span>
                      </div>
                      <p>{dashboardLoading ? "Loading database snapshot..." : "Updated from the live dashboard endpoint."}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="panel-grid panel-grid-secondary">
                <article className="dashboard-panel ranking-panel">
                  <PanelHeader
                    title="Top users"
                    subtitle="Top 3 strongest users from the database"
                    panelId="top-users"
                    openPanelMenu={panelMenuOpenId}
                    setOpenPanelMenu={setPanelMenuOpenId}
                  />
                  {dashboard?.topUsers?.length ? (
                    <div className="ranking-list">
                      {dashboard.topUsers.map((user, index) => (
                        <RankingRow key={user.id} rank={index + 1} user={user} />
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">No top users available yet.</div>
                  )}
                  <button type="button" className="view-more-button" onClick={() => setActiveView("users")}>
                    View more
                    <ChevronRight size={16} />
                  </button>
                </article>

                <article className="dashboard-panel top-transaction-panel">
                  <PanelHeader
                    title="Top transactions"
                    subtitle="Most expensive shop and marketplace records"
                    panelId="top-transactions"
                    openPanelMenu={panelMenuOpenId}
                    setOpenPanelMenu={setPanelMenuOpenId}
                  />
                  {dashboard?.topTransactions?.length ? (
                    <div className="transaction-list">
                      {dashboard.topTransactions.map((transaction) => (
                        <div key={`${transaction.source}-${transaction.id}`} className="transaction-item">
                          <div>
                            <span className="transaction-source">{transaction.source}</span>
                            <strong>{transaction.title}</strong>
                            <span className="transaction-note">{transaction.description ?? "Live transaction record"}</span>
                          </div>
                          <span className="transaction-amount">{formatMoney(transaction.amount)} VND</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="empty-state">No top transactions available yet.</div>
                  )}
                  <button type="button" className="view-more-button" onClick={() => setActiveView("users")}>
                    View more
                    <ChevronRight size={16} />
                  </button>
                </article>

                <article className="dashboard-panel activity-panel">
                  <PanelHeader
                    title="Growth summary"
                    subtitle="User, shop, and marketplace movement"
                    panelId="growth-summary"
                    openPanelMenu={panelMenuOpenId}
                    setOpenPanelMenu={setPanelMenuOpenId}
                  />
                  <div className="metric-summary-list">
                    <MetricSummary label="Users this month" value={dashboard?.users.currentMonth} previous={dashboard?.users.previousMonth} />
                    <MetricSummary label="Shop purchases" value={dashboard?.shopPurchases.currentMonth} previous={dashboard?.shopPurchases.previousMonth} />
                    <MetricSummary label="Marketplace trades" value={dashboard?.marketplaceTrades.currentMonth} previous={dashboard?.marketplaceTrades.previousMonth} />
                  </div>
                </article>
              </div>
            </div>
          )}

          {activeView === "users" && (
            <div className="users-view">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Users</p>
                  <h1>Manage active and banned users from the database.</h1>
                </div>
                <button type="button" className="primary-button" onClick={() => refreshUsers(page)}>
                  Refresh users
                  <ArrowUpRight size={16} />
                </button>
              </div>

              {usersError ? <div className="inline-alert error">{usersError}</div> : null}

              <div className="user-section-list">
                {usersLoading ? (
                  <div className="empty-state">Loading users from the database...</div>
                ) : filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <article key={user.id} className="user-section-card">
                      <div className="user-section-main">
                        <div className="user-section-avatar">
                          {user.avatarUrl ? <img src={user.avatarUrl} alt={user.username} /> : user.username.slice(0, 1)}
                        </div>
                        <div className="user-section-copy">
                          <div className="user-section-title-row">
                            <strong>{user.username}</strong>
                            <span className={`user-status ${getStatusTone(user.status)}`}>{user.status ?? "ACTIVE"}</span>
                          </div>
                          <p>{user.email}</p>
                          <div className="user-meta-row">
                            <span>Role: {user.role}</span>
                            <span>Level: {getLevel(user.exp)}</span>
                            <span>{formatNumber(user.exp)} EXP</span>
                            <span>Updated {formatRelativeTime(user.updatedAt)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="user-actions">
                        <button
                          type="button"
                          className={`action-button ${user.status === "ACTIVE" ? "danger" : "success"}`}
                          onClick={() => openStatusModal(user)}
                        >
                          {user.status === "ACTIVE" ? "Ban" : "Unban"}
                        </button>
                        <button type="button" className="action-button neutral">
                          Edit
                        </button>
                        <button type="button" className="icon-button">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="empty-state">No user matches the current search.</div>
                )}
              </div>
                {/* Ban / Unban Modal */}
                <UserModerationModal
                  isOpen={statusModal.isOpen}
                  action={statusModal.action}
                  userId={statusModal.userId}
                  onClose={() =>
                    setStatusModal((prev) => ({
                      ...prev,
                      isOpen: false,
                    }))
                  }
                />
              <div className="pagination-row">
                <span>
                  Showing page {page} of {Math.max(totalPages, 1)}
                </span>
                <div className="pagination-actions">
                  <button
                    type="button"
                    className="page-button"
                    onClick={() => void refreshUsers(Math.max(page - 1, 1))}
                    disabled={page <= 1}
                  >
                    Prev
                  </button>
                  <button type="button" className="page-button is-active">
                    {page}
                  </button>
                  <button
                    type="button"
                    className="page-button"
                    onClick={() => void refreshUsers(Math.min(page + 1, totalPages))}
                    disabled={page >= totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeView === "breeding" && (
            <div className="feature-placeholder">
              <p className="eyebrow">Breeding</p>
              <h1>Breeding management area</h1>
              <p>Use this space for breeding rules, approvals, and lineage moderation.</p>
            </div>
          )}

          {activeView === "origin" && (
            <div className="feature-placeholder">
              <p className="eyebrow">Origin</p>
              <h1>Koi origin management area</h1>
              <p>Use this space for variety origins, taxonomy, and origin content control.</p>
            </div>
          )}

          {activeView === "settings" && (
            <div className="settings-page">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Settings</p>
                  <h1>Theme and admin behavior settings.</h1>
                </div>
              </div>

              <article className="settings-card settings-card-inline">
                <div className="settings-header">
                  <div>
                    <p className="eyebrow">Theme</p>
                    <h2>Switch display mode</h2>
                  </div>
                  <SlidersHorizontal size={18} />
                </div>
                <div className="settings-toggle-row">
                  <button
                    type="button"
                    className={`settings-toggle ${theme === "light" ? "is-active" : ""}`}
                    onClick={() => setTheme("light")}
                  >
                    <SunMedium size={16} />
                    Light
                  </button>
                  <button
                    type="button"
                    className={`settings-toggle ${theme === "dark" ? "is-active" : ""}`}
                    onClick={() => setTheme("dark")}
                  >
                    <MoonStar size={16} />
                    Dark
                  </button>
                </div>
                <label className="settings-option">
                  <input type="checkbox" defaultChecked />
                  <span>Show admin notifications in the header</span>
                </label>
                <label className="settings-option">
                  <input type="checkbox" defaultChecked />
                  <span>Keep panel menus available on hover</span>
                </label>
              </article>
            </div>
          )}

          {activeView === "account" && (
            <div className="settings-page">
              <div className="page-heading">
                <div>
                  <p className="eyebrow">Account</p>
                  <h1>Admin profile and security.</h1>
                </div>
              </div>

              <aside className="settings-card account-card settings-card-inline">
                <div className="settings-header">
                  <div>
                    <p className="eyebrow">Account</p>
                    <h2>Admin profile</h2>
                  </div>
                  <UserCircle2 size={18} />
                </div>
                <div className="account-profile">
                  <img src={adminProfileAvatar} alt={adminProfileName} />
                  <div>
                    <strong>{adminProfileName}</strong>
                    <span>{adminProfileEmail}</span>
                  </div>
                </div>
                <div className="account-actions">
                  <button type="button" className="action-button neutral">
                    Edit profile
                  </button>
                  <button type="button" className="action-button success">
                    Security
                  </button>
                </div>
              </aside>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function PanelHeader({
  title,
  subtitle,
  panelId,
  openPanelMenu,
  setOpenPanelMenu,
}: {
  title: string;
  subtitle: string;
  panelId: string;
  openPanelMenu: string | null;
  setOpenPanelMenu: (value: string | null) => void;
}) {
  const isOpen = openPanelMenu === panelId;
  const actions: PanelAction[] = ["View", "Edit", "Refresh"];

  return (
    <div className="panel-header">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="panel-options-wrap">
        <button type="button" className="panel-options-trigger" onClick={() => setOpenPanelMenu(isOpen ? null : panelId)}>
          <MoreHorizontal size={16} />
        </button>

        {isOpen && (
          <div className="panel-options-menu">
            {actions.map((action) => (
              <button key={action} type="button" className="panel-option-item" onClick={() => setOpenPanelMenu(null)}>
                {action}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RankingRow({ rank, user }: { rank: number; user: AdminRankingUserDto }) {
return (
  <div className="ranking-item">
    <div
      className={`ranking-order ${
        rank === 1
          ? "gold"
          : rank === 2
          ? "silver"
          : rank === 3
          ? "bronze"
          : "normal"
      }`}
    >
      #{rank}
    </div>

    <div className="ranking-user">
      <div className="ranking-avatar">
        {user.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={user.username}
          />
        ) : (
          user.username.slice(0, 1)
        )}
      </div>

      <div>
        <strong>{user.username}</strong>
        <span>Lv. {user.level}</span>
      </div>
    </div>

    <div className="ranking-stat">
      <span>{formatNumber(user.exp)} EXP</span>
    </div>
  </div>
);
}

function MetricSummary({
  label,
  value,
  previous,
}: {
  label: string;
  value: number | undefined;
  previous: number | undefined;
}) {
  const delta = (value ?? 0) - (previous ?? 0);

  return (
    <div className="metric-summary-row">
      <div>
        <strong>{label}</strong>
        <span>{formatNumber(value)}</span>
      </div>
      <small className={delta >= 0 ? "trend-up" : "trend-down"}>
        {delta >= 0 ? "+" : ""}
        {formatNumber(delta)} vs prev month
      </small>
    </div>
  );
}

export default Admin;