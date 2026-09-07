import {
	ArrowUpRight,
	ChevronRight,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
	getAdminDashboard,
	getAdminUsers,
	updateAdminUserRole,
	type AdminDashboardResponse,
	type AdminRankingUserDto,
	type AdminUserDto,
	type AdminUserStatus,
} from "../../api/admin";
import { useAuth } from "../../context/AuthContext";

import femaleDefaultAvatar from "../../assets/avatars/female_blank_avatar.png";
import maleDefaultAvatar from "../../assets/avatars/male_blank_avatar.png";
import "./Admin.css";
import { AdminNavbar } from "./components/AdminNavbar";
import { AdminSidebar } from "./components/AdminSidebar";
import AdminPagination from "./components/AdminPagination";
import UserModerationModal from "./components/UserModerationModal";

// --- IMPORT CÁC COMPONENT TỪ DASHBOARD MỚI ---
import { KoiLifeStageChart } from "./components/charts/KoiLifeStageChart";
import { MarketplaceStatusChart } from "./components/charts/MarketplaceStatusChart";
import { UserGrowthChart } from "./components/charts/UserGrowthChart";
import { UserLocationChart } from "./components/charts/UserLocationChart";
import {
	DashboardGrid,
	loadDashboardLayouts,
	type Layouts,
} from "./components/dashboard/DashboardGrid";
import { Panel } from "./components/dashboard/Panel";

import AdminTransactions from "./components/AdminTransactions";

import AdminBreeding from "./components/AdminBreeding";
import AdminDictionary from "./components/AdminDictionary";
import AdminItems from "./components/AdminItems";
import AdminTrades from "./components/AdminTrades";
import AdminAccount from "./components/AdminAccount";
import AdminSettings, { type AdminPreferences } from "./components/AdminSettings";

export type MenuTab =
	| "dashboard"
	| "users"
	| "breeding"
	| "dictionary"
	| "items"
	| "transactions"
	| "trade";
export type OtherTab = "settings" | "account";
type AdminView = MenuTab | OtherTab;

interface PanelDescriptor {
	id: string;
	title: string;
	subtitle: string;
	value: string;
	change: string;
	caption: string;
	trend: "up" | "down" | "flat";
	accent: string;
}

// --- CONFIG CHO LƯỚI KÉO THẢ MỚI ---
// Đổi key để trình duyệt tạo lại lưới layout mới
const STORAGE_KEY = "koi-admin-dashboard-layout-v4";

const DEFAULT_LAYOUTS: Layouts = {
	lg: [
		{ i: "users", x: 0, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
		{ i: "marketplace", x: 6, y: 0, w: 6, h: 4, minW: 3, minH: 3 },
		{ i: "lifestage", x: 0, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
		{ i: "location", x: 6, y: 4, w: 6, h: 4, minW: 3, minH: 3 },
	],
	md: [
		{ i: "users", x: 0, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
		{ i: "marketplace", x: 4, y: 0, w: 4, h: 4, minW: 3, minH: 3 },
		{ i: "lifestage", x: 0, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
		{ i: "location", x: 4, y: 4, w: 4, h: 4, minW: 3, minH: 3 },
	],
	sm: [
		{ i: "users", x: 0, y: 0, w: 4, h: 4, minW: 2, minH: 3 },
		{ i: "marketplace", x: 0, y: 4, w: 4, h: 4, minW: 2, minH: 3 },
		{ i: "lifestage", x: 0, y: 8, w: 4, h: 4, minW: 2, minH: 3 },
		{ i: "location", x: 0, y: 12, w: 4, h: 4, minW: 2, minH: 3 },
	],
};

function formatNumber(value: number | null | undefined) {
	return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function formatMoney(value: number | null | undefined) {
	return new Intl.NumberFormat("en-US").format(value ?? 0);
}

function getStatusTone(status: AdminUserStatus | null) {
	return status === "BANNED" ? "status-banned" : "status-active";
}

function formatRole(role: AdminUserDto["role"]) {
	return role === "SUPER_ADMIN" ? "Super Admin" : role === "ADMIN" ? "Admin" : "User";
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

function buildDashboardPanels(
	dashboard: AdminDashboardResponse | null,
): PanelDescriptor[] {
	const usersGrowth = dashboard?.users.growthPercent;
	const shopGrowth = dashboard?.shopPurchases.growthPercent;
	const marketGrowth = dashboard?.marketplaceTrades.growthPercent;

	return [
		{
			id: "users",
			title: "Total users",
			subtitle: "All registered accounts",
			value: formatNumber(dashboard?.users.total),
			change:
				usersGrowth == null
					? `${(dashboard?.users.delta ?? 0) >= 0 ? "+" : ""}${formatNumber(dashboard?.users.delta)}`
					: `${usersGrowth >= 0 ? "+" : ""}${usersGrowth.toFixed(1)}%`,
			trend:
				(dashboard?.users.delta ?? 0) > 0
					? "up"
					: (dashboard?.users.delta ?? 0) < 0
						? "down"
						: "flat",
			accent: "blue",
			caption: "Compared with the previous month.",
		},
		{
			id: "shop",
			title: "Koin payments",
			subtitle: "All payment orders",
			value: formatNumber(dashboard?.shopPurchases.total),
			change:
				shopGrowth == null
					? `${(dashboard?.shopPurchases.delta ?? 0) >= 0 ? "+" : ""}${formatNumber(dashboard?.shopPurchases.delta)}`
					: `${shopGrowth >= 0 ? "+" : ""}${shopGrowth.toFixed(1)}%`,
			trend:
				(dashboard?.shopPurchases.delta ?? 0) > 0
					? "up"
					: (dashboard?.shopPurchases.delta ?? 0) < 0
						? "down"
						: "flat",
			accent: "amber",
			caption: "Compared with the previous month.",
		},
		{
			id: "market",
			title: "Marketplace trades",
			subtitle: "Completed player-to-player trades",
			value: formatNumber(dashboard?.marketplaceTrades.total),
			change:
				marketGrowth == null
					? `${(dashboard?.marketplaceTrades.delta ?? 0) >= 0 ? "+" : ""}${formatNumber(dashboard?.marketplaceTrades.delta)}`
					: `${marketGrowth >= 0 ? "+" : ""}${marketGrowth.toFixed(1)}%`,
			trend:
				(dashboard?.marketplaceTrades.delta ?? 0) > 0
					? "up"
					: (dashboard?.marketplaceTrades.delta ?? 0) < 0
						? "down"
						: "flat",
			accent: "emerald",
			caption: "Compared with the previous month.",
		},
		{
			id: "koi",
			title: "Highest-level player",
			subtitle: "Current progression leader",
			value: dashboard?.highestLevelUser
				? `Lv. ${dashboard.highestLevelUser.level}`
				: "—",
			change: dashboard?.highestLevelUser?.username ?? "No data",
			trend: "flat",
			accent: "violet",
			caption: "Current platform progression leader.",
		},
	];
}

function Admin() {
	useEffect(() => {
		document.body.classList.add("admin-page");
		return () => document.body.classList.remove("admin-page");
	}, []);

	const { currentUser } = useAuth();
	const [activeView, setActiveView] = useState<AdminView>("dashboard");
	const [theme, setTheme] = useState<"light" | "dark">(() => {
		const saved = localStorage.getItem("theme") as "light" | "dark" | null;
		if (saved === "light" || saved === "dark") return saved;
		return window.matchMedia("(prefers-color-scheme: dark)").matches
			? "dark"
			: "light";
	});
	const [adminPreferences, setAdminPreferences] = useState<AdminPreferences>(() => {
		try { return JSON.parse(localStorage.getItem("koi-admin-preferences") ?? "") as AdminPreferences; }
		catch { return { notifications: true, compactTables: false }; }
	});

	// State Layout cho Grid Dashboard Mới
	const [layouts, setLayouts] = useState<Layouts>(() =>
		loadDashboardLayouts(STORAGE_KEY, DEFAULT_LAYOUTS),
	);

	// State quản lý xem biểu đồ nào đang mở full-screen
	const [fullScreenChart, setFullScreenChart] = useState<string | null>(null);

	const [panelMenuOpenId, setPanelMenuOpenId] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(
		null,
	);
	const [dashboardLoading, setDashboardLoading] = useState(true);
	const [dashboardError, setDashboardError] = useState<string | null>(null);
	const [lastDashboardUpdate, setLastDashboardUpdate] = useState<Date | null>(null);

	const [users, setUsers] = useState<AdminUserDto[]>([]);
	const [usersLoading, setUsersLoading] = useState(true);
	const [usersError, setUsersError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [pageSize] = useState(8);
	const [totalPages, setTotalPages] = useState(1);

	const [statusModal, setStatusModal] = useState<{
		isOpen: boolean;
		action: "ban" | "unban" | "delete" | "restore";
		userId: number;
	}>({
		isOpen: false,
		action: "ban",
		userId: 1,
	});

	// Bắt buộc truyền targetAction vào để không bao giờ bị nhầm
	const openStatusModal = (
		user: AdminUserDto,
		targetAction: "ban" | "unban" | "delete" | "restore",
	) => {
		setStatusModal({
			isOpen: true,
			action: targetAction,
			userId: user.id,
		});
	};
	const panelDescriptors = useMemo(
		() => buildDashboardPanels(dashboard),
		[dashboard],
	);

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
		localStorage.setItem("koi-admin-preferences", JSON.stringify(adminPreferences));
	}, [adminPreferences]);

	useEffect(() => {
		let cancelled = false;

		const loadDashboard = async () => {
			setDashboardLoading(true);
			setDashboardError(null);
			try {
				const response = await getAdminDashboard(3, 3);
				if (!cancelled) {
					setDashboard(response);
					setLastDashboardUpdate(new Date());
				}
			} catch {
				if (!cancelled)
					setDashboardError(
						"Unable to load dashboard data from the database.",
					);
			} finally {
				if (!cancelled) setDashboardLoading(false);
			}
		};

		const loadChartData = async () => {
			try {
				/*
				 * Lấy dữ liệu dạng <TimeSeriesPoint[]> cho UserGrowthChart
				 * VD:
				 * const res = await apiClient.get('/admin/charts/user-growth');
				 * if (!cancelled) setUserGrowthData(res.data.data);
				 */
				/*
				 * Lấy dữ liệu dạng <BreedingPoint[]> cho BreedingSuccessChart
				 * VD:
				 * const res = await apiClient.get('/admin/charts/breeding-success');
				 * if (!cancelled) setBreedingData(res.data.data);
				 */
				/*
				 * Lấy dữ liệu dạng <TransactionSlice[]> cho TransactionMixChart
				 * VD:
				 * const res = await apiClient.get('/admin/charts/transaction-mix');
				 * if (!cancelled) setTransactionData(res.data.data);
				 */
				/*
				 * Lấy dữ liệu dạng <RevenuePoint[]> cho RevenueAreaChart
				 * VD:
				 * const res = await apiClient.get('/admin/charts/revenue');
				 * if (!cancelled) setRevenueData(res.data.data);
				 */
			} catch (error) {
				console.error("Unable to load chart data:", error);
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
				if (!cancelled)
					setUsersError("Unable to load users from the database.");
			} finally {
				if (!cancelled) setUsersLoading(false);
			}
		};

		void loadDashboard();
		void loadChartData();
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
			setLastDashboardUpdate(new Date());
		} catch {
			setDashboardError(
				"Unable to load dashboard data from the database.",
			);
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

	const changeUserRole = async (user: AdminUserDto) => {
		const nextRole = user.role === "ADMIN" ? "USER" : "ADMIN";
		const action = nextRole === "ADMIN" ? "promote" : "remove admin access from";
		if (!window.confirm(`Do you want to ${action} ${user.username}?`)) return;

		setUsersError(null);
		try {
			const updatedUser = await updateAdminUserRole(user.id, nextRole);
			setUsers((current) =>
				current.map((item) => (item.id === updatedUser.id ? updatedUser : item)),
			);
		} catch (error: any) {
			setUsersError(
				error?.response?.data?.message || "Unable to update the user's role.",
			);
		}
	};

	const adminProfileName = currentUser?.username ?? "Admin";
	const adminProfileEmail = currentUser?.email ?? "admin@koi-breeding.local";
	const adminProfileRole = currentUser?.role ?? "ADMIN";
	const adminProfileAvatar =
		currentUser?.avatarUrl ??
		(currentUser?.gender === "MALE"
			? maleDefaultAvatar
			: femaleDefaultAvatar);

	return (
		<div
			className={`admin-shell ${theme === "dark" ? "theme-dark" : "theme-light"} ${adminPreferences.compactTables ? "compact-tables" : ""}`}
		>
			<AdminSidebar
				activeView={activeView}
				onSelectView={setActiveView}
			/>

			<main className="admin-main">
				<AdminNavbar
					searchTerm={searchTerm}
					onSearchChange={setSearchTerm}
					adminName={adminProfileName}
					adminRole={adminProfileRole}
					adminEmail={adminProfileEmail}
					adminAvatar={adminProfileAvatar}
					adminId={currentUser?.id ?? null}
					notificationsEnabled={adminPreferences.notifications}
				/>

				<section className="admin-content">
					{activeView === "dashboard" && (
						<div className="dashboard-view">
							<div className="page-heading">
								<div>
									<p className="eyebrow">Overview</p>
									<h1>Dashboard</h1>
									<p className="page-description">
										Monitor player activity, shop purchases, and marketplace performance.
									</p>
								</div>
								<div className="dashboard-heading-actions">
									<div className="dashboard-update-info">
										<strong>This month</strong>
										<span>
											{lastDashboardUpdate
												? `Updated ${lastDashboardUpdate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
												: "Waiting for data"}
										</span>
									</div>
									<button
										type="button"
										className="primary-button"
										onClick={refreshDashboard}
										disabled={dashboardLoading}
									>
										{dashboardLoading ? "Refreshing…" : "Refresh data"}
										<ArrowUpRight size={16} />
									</button>
								</div>
							</div>

							{dashboardError ? (
								<div className="inline-alert error">
									{dashboardError}
								</div>
							) : null}

							<div className="panel-grid panel-grid-metrics">
								{panelDescriptors.map((panel) => (
									<article
										key={panel.id}
										className={`dashboard-panel accent-${panel.accent}`}
									>
										<PanelHeader
											title={panel.title}
											subtitle={panel.subtitle}
											panelId={panel.id}
											openPanelMenu={panelMenuOpenId}
											setOpenPanelMenu={
												setPanelMenuOpenId
											}
										/>
										<div className="panel-body">
											<div className="panel-value-row">
												<strong>{panel.value}</strong>
												<span
													className={`panel-trend trend-${panel.trend}`}
												>
													{panel.change}
												</span>
											</div>
											<p>
												{dashboardLoading
													? "Updating platform data…"
													: panel.caption}
											</p>
										</div>
									</article>
								))}
							</div>
							<div className="dashboard-section-header">
								<div>
									<h2>Platform trends</h2>
									<p>Drag or resize cards to personalize your dashboard.</p>
								</div>
							</div>

							<div className="dashboard-grid-wrapper">
								<DashboardGrid
									layouts={layouts}
									onLayoutChange={(_current, all) =>
										setLayouts(all)
									}
									storageKey={STORAGE_KEY}
								>
									<Panel
										key="users"
										panelId="chart-users"
										title="New users"
										subtitle="Registration trend over the last six months"
										openPanelMenu={panelMenuOpenId}
										setOpenPanelMenu={setPanelMenuOpenId}
										onView={() =>
											setFullScreenChart("users")
										}
									>
										{!dashboard?.userGrowthChart?.length ? (
											<div
												className="empty-state dashboard-chart-state"
											>
												{dashboardLoading
													? "Loading user growth…"
													: "No user growth data is available yet."}
											</div>
										) : (
											<UserGrowthChart
												data={dashboard.userGrowthChart}
											/>
										)}
									</Panel>

									<Panel
										key="marketplace"
										panelId="chart-marketplace"
										title="Marketplace activity"
										subtitle="Listing outcomes over the last seven days"
										openPanelMenu={panelMenuOpenId}
										setOpenPanelMenu={setPanelMenuOpenId}
										onView={() => setFullScreenChart("marketplace")}
									>
										{!dashboard?.marketplaceChart?.length ? (
											<div className="empty-state dashboard-chart-state">
												{dashboardLoading
													? "Loading marketplace activity…"
													: "No marketplace activity is available yet."}
											</div>
										) : (
											<MarketplaceStatusChart
												data={dashboard.marketplaceChart}
											/>
										)}
									</Panel>

									<Panel
										key="lifestage"
										panelId="chart-lifestage"
										title="Koi life stages"
										subtitle="Koi population grouped by life stage"
										openPanelMenu={panelMenuOpenId}
										setOpenPanelMenu={setPanelMenuOpenId}
										onView={() =>
											setFullScreenChart("lifestage")
										}
									>
										{!dashboard?.koiLifeStageChart
											?.length ? (
											<div
												className="empty-state dashboard-chart-state"
											>
												{dashboardLoading
													? "Loading koi life stages…"
													: "No koi life-stage data is available yet."}
											</div>
										) : (
											<KoiLifeStageChart
												data={
													dashboard.koiLifeStageChart
												}
											/>
										)}
									</Panel>

									<Panel
										key="location"
										panelId="chart-location"
										title="Player locations"
										subtitle="Registered players by province or city"
										openPanelMenu={panelMenuOpenId}
										setOpenPanelMenu={setPanelMenuOpenId}
										onView={() =>
											setFullScreenChart("location")
										}
									>
										{!dashboard?.locationChart?.length ? (
											<div
												className="empty-state dashboard-chart-state"
											>
												{dashboardLoading
													? "Loading player locations…"
													: "No player location data is available yet."}
											</div>
										) : (
											<UserLocationChart
												data={dashboard.locationChart}
											/>
										)}
									</Panel>
								</DashboardGrid>
							</div>

							<div className="dashboard-section-header">
								<div>
									<h2>Highlights</h2>
									<p>Quick access to leading players and high-value activity.</p>
								</div>
							</div>

							<div className="panel-grid panel-grid-secondary">
								<article className="dashboard-panel ranking-panel">
									<PanelHeader
										title="Top players"
										subtitle="Players with the highest progression"
										panelId="top-users"
										openPanelMenu={panelMenuOpenId}
										setOpenPanelMenu={setPanelMenuOpenId}
									/>
									{dashboard?.topUsers?.length ? (
										<div className="ranking-list">
											{dashboard.topUsers.map(
												(user, index) => (
													<RankingRow
														key={user.id}
														rank={index + 1}
														user={user}
													/>
												),
											)}
										</div>
									) : (
										<div className="empty-state">
											No ranked players are available yet.
										</div>
									)}
									<button
										type="button"
										className="view-more-button"
										onClick={() => setActiveView("users")}
									>
										View all users
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
											{dashboard.topTransactions.map(
												(transaction) => (
													<div
														key={`${transaction.source}-${transaction.id}`}
														className="transaction-item"
													>
														<div>
															<span className="transaction-source">
																{
																	transaction.source
																}
															</span>
															<strong>
																{
																	transaction.title
																}
															</strong>
															<span className="transaction-note">
																{transaction.description ??
																	"Live transaction record"}
															</span>
														</div>
														<span className="transaction-amount">
															{formatMoney(
																transaction.amount,
															)}{" "}
													Koins
														</span>
													</div>
												),
											)}
										</div>
									) : (
										<div className="empty-state">
											No top transactions available yet.
										</div>
									)}
									<button
										type="button"
										className="view-more-button"
										onClick={() => setActiveView("transactions")}
									>
										View transactions
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
										<MetricSummary
											label="Users this month"
											value={
												dashboard?.users.currentMonth
											}
											previous={
												dashboard?.users.previousMonth
											}
										/>
										<MetricSummary
											label="Koin payments this month"
											value={
												dashboard?.shopPurchases
													.currentMonth
											}
											previous={
												dashboard?.shopPurchases
													.previousMonth
											}
										/>
										<MetricSummary
											label="Marketplace trades this month"
											value={
												dashboard?.marketplaceTrades
													.currentMonth
											}
											previous={
												dashboard?.marketplaceTrades
													.previousMonth
											}
										/>
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
									<h1>Manage users, access, and account status.</h1>
								</div>
								<button
									type="button"
									className="primary-button"
									onClick={() => refreshUsers(page)}
								>
									Refresh users
									<ArrowUpRight size={16} />
								</button>
							</div>

							{usersError ? (
								<div className="inline-alert error">
									{usersError}
								</div>
							) : null}

							<div className="user-section-list">
								{usersLoading ? (
									<div className="empty-state">
										Loading users from the database...
									</div>
								) : filteredUsers.length ? (
									filteredUsers.map((user) => (
										<article
											key={user.id}
											className="user-section-card"
										>
											<div className="user-section-main">
												<div className="user-section-avatar">
													{user.avatarUrl ? (
														<img
															src={user.avatarUrl}
															alt={user.username}
														/>
													) : (
														user.username.slice(
															0,
															1,
														)
													)}
												</div>
												<div className="user-section-copy">
													<div className="user-section-title-row">
														<strong>
															{user.username}
														</strong>
														<span
															className={`user-status ${getStatusTone(user.status)}`}
														>
															{user.status ??
																"ACTIVE"}
														</span>
													</div>
													<p>{user.email}</p>
													<div className="user-meta-row">
														<span>
											Role: {formatRole(user.role)}
														</span>
														<span>
															Level:{" "}
													{user.level ?? 1}
														</span>
														<span>
															Updated{" "}
															{formatRelativeTime(
																user.updatedAt,
															)}
														</span>
													</div>
												</div>
											</div>
							<div className="user-actions">
								{currentUser?.role === "SUPER_ADMIN" &&
									user.role !== "SUPER_ADMIN" ? (
									<button
										type="button"
										className="action-button neutral"
										onClick={() => void changeUserRole(user)}
									>
										{user.role === "ADMIN" ? "Remove admin role" : "Promote to admin"}
									</button>
								) : null}
								{user.role === "SUPER_ADMIN" ? (
									<span className="protected-account-note">
										Protected account
									</span>
								) : user.status === "ACTIVE" ? (
													<>
														<button
															type="button"
															className="action-button danger"
															onClick={() =>
																openStatusModal(
																	user,
																	"ban",
																)
															}
														>
															Ban
														</button>
														<button
															type="button"
															className="action-button danger"
															onClick={() =>
																openStatusModal(
																	user,
																	"delete",
																)
															}
														>
															Delete
														</button>
													</>
												) : user.status === "BANNED" ? (
													<>
														<button
															type="button"
															className="action-button success"
															onClick={() =>
																openStatusModal(
																	user,
																	"unban",
																)
															}
														>
															Unban
														</button>
														<button
															type="button"
															className="action-button danger"
															onClick={() =>
																openStatusModal(
																	user,
																	"delete",
																)
															}
														>
															Delete
														</button>
													</>
												) : (
													<button
														type="button"
														className="action-button success"
														onClick={() =>
															openStatusModal(
																user,
																"restore",
															)
														}
													>
														Restore
													</button>
												)}
											</div>
										</article>
									))
								) : (
									<div className="empty-state">
										No user matches the current search.
									</div>
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
								onSuccess={() => refreshUsers()}
							/>
							<AdminPagination
								currentPage={Math.max(page - 1, 0)}
								totalPages={totalPages}
								onPageChange={(nextPage) =>
									void refreshUsers(nextPage + 1)
								}
							/>
						</div>
					)}

					{activeView === "breeding" && <AdminBreeding />}

					{activeView === "dictionary" && <AdminDictionary />}

					{activeView === "items" && <AdminItems />}
					{activeView === "transactions" && <AdminTransactions />}
					{activeView === "trade" && <AdminTrades />}
					{activeView === "settings" && (
						<AdminSettings theme={theme} onThemeChange={setTheme} preferences={adminPreferences} onPreferencesChange={setAdminPreferences} />
					)}

					{activeView === "account" && (
						<AdminAccount />
					)}
					{/* --- FULLSCREEN CHART MODAL --- */}
					{fullScreenChart && (
						<div
							className="chart-modal-overlay"
							onClick={() => setFullScreenChart(null)}
						>
							<div
								className="chart-modal-content"
								onClick={(e) => e.stopPropagation()}
							>
								<div className="chart-modal-header">
									<h2>
										{fullScreenChart === "users" &&
											"New users"}
										{fullScreenChart === "lifestage" &&
											"Koi life stages"}
										{fullScreenChart === "location" &&
											"Player locations"}
										{fullScreenChart === "marketplace" &&
											"Marketplace activity"}
									</h2>
									<button
										type="button"
										className="close-button"
										onClick={() => setFullScreenChart(null)}
									>
										✕
									</button>
								</div>
								<div className="chart-modal-body">
									{fullScreenChart === "users" && (
										<UserGrowthChart
											data={
												dashboard?.userGrowthChart || []
											}
										/>
									)}
									{fullScreenChart === "lifestage" && (
										<KoiLifeStageChart
											data={
												dashboard?.koiLifeStageChart ||
												[]
											}
										/>
									)}
									{fullScreenChart === "location" && (
										<UserLocationChart
											data={
												dashboard?.locationChart || []
											}
										/>
									)}
									{fullScreenChart === "marketplace" && (
										<MarketplaceStatusChart
											data={dashboard?.marketplaceChart || []}
										/>
									)}
								</div>
							</div>
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
}: {
	title: string;
	subtitle: string;
	panelId: string;
	openPanelMenu: string | null;
	setOpenPanelMenu: (value: string | null) => void;
}) {
	return (
		<div className="panel-header">
			<div>
				<h3>{title}</h3>
				<p>{subtitle}</p>
			</div>
		</div>
	);
}

function RankingRow({
	rank,
	user,
}: {
	rank: number;
	user: AdminRankingUserDto;
}) {
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
						<img src={user.avatarUrl} alt={user.username} />
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
				<strong>{formatNumber(user.level)}</strong>
				<span>LEVEL</span>
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
