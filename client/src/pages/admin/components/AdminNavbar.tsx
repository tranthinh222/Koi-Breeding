// import { Bell, CheckCheck, ChevronDown, Search, X } from "lucide-react";
// import { useEffect, useRef, useState } from "react";
// import {
//   getNotifications,
//   markAllNotificationsRead,
//   notificationStreamUrl,
//   type AppNotification,
// } from "../../../api/notification";

// interface AdminNavbarProps {
//   searchTerm: string;
//   onSearchChange: (value: string) => void;
//   adminName: string;
//   adminRole: string;
//   adminEmail: string;
//   adminAvatar: string;
//   adminId: number | null;
//   notificationsEnabled: boolean;
// }

// export function AdminNavbar({
//   searchTerm,
//   onSearchChange,
//   adminName,
//   adminRole,
//   adminEmail,
//   adminAvatar,
//   adminId,
//   notificationsEnabled,
// }: AdminNavbarProps) {
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [isOpen, setIsOpen] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const panelRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     if (!adminId || !notificationsEnabled) { setNotifications([]); setIsOpen(false); return; }
//     let active = true;
//     setLoading(true);
//     getNotifications(adminId)
//       .then((items) => { if (active) setNotifications(items ?? []); })
//       .catch((error) => console.error("Unable to load admin notifications:", error))
//       .finally(() => { if (active) setLoading(false); });

//     const stream = new EventSource(notificationStreamUrl(adminId), { withCredentials: true });
//     stream.addEventListener("notification", (event) => {
//       const item = JSON.parse((event as MessageEvent).data) as AppNotification;
//       setNotifications((current) => [item, ...current.filter((entry) => entry.id !== item.id)]);
//     });
//     return () => { active = false; stream.close(); };
//   }, [adminId, notificationsEnabled]);

//   useEffect(() => {
//     const close = (event: MouseEvent) => {
//       if (panelRef.current && !panelRef.current.contains(event.target as Node)) setIsOpen(false);
//     };
//     document.addEventListener("mousedown", close);
//     return () => document.removeEventListener("mousedown", close);
//   }, []);

//   const unreadCount = notifications.filter((item) => !item.isRead).length;
//   const markAllRead = async () => {
//     if (!adminId || unreadCount === 0) return;
//     await markAllNotificationsRead(adminId);
//     setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
//   };

//   return (
//     <header className="admin-navbar">
//       <div className="navbar-search">
//         <Search size={18} />
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={(event) => onSearchChange(event.target.value)}
//           placeholder="Search dashboard, user, function..."
//         />
//       </div>

//       <div className="navbar-actions">
//         {notificationsEnabled && <div className="admin-notification-wrap" ref={panelRef}>
//           <button type="button" className="notification-button" aria-label={`Notifications, ${unreadCount} unread`} aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
//             <Bell size={18} />
//             {unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
//           </button>
//           {isOpen && <section className="admin-notification-panel">
//             <div className="admin-notification-header"><div><strong>Notifications</strong><span>{unreadCount} unread</span></div><div><button type="button" onClick={() => void markAllRead()} disabled={!unreadCount} title="Mark all as read"><CheckCheck size={17} /></button><button type="button" onClick={() => setIsOpen(false)} title="Close"><X size={17} /></button></div></div>
//             <div className="admin-notification-list">
//               {loading ? <p className="admin-notification-empty">Loading notifications…</p> : notifications.length === 0 ? <p className="admin-notification-empty">You are all caught up.</p> : notifications.map((item) => <article key={item.id} className={`admin-notification-item ${item.isRead ? "" : "unread"}`}>
//                 <span className="admin-notification-icon">{item.type === "PURCHASE_SUCCESS" ? "🛒" : item.type === "DEPOSIT_SUCCESS" ? "💰" : item.type.includes("BREEDING") ? "🐟" : "🔔"}</span>
//                 <div><strong>{item.title}</strong><p>{item.message}</p><time>{new Date(item.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time></div>
//               </article>)}
//             </div>
//           </section>}
//         </div>}
//         <div className="admin-profile">
//           <img src={adminAvatar} alt={adminName} />
//           <div>
//             <strong>{adminName}</strong>
//             <span>{adminRole}</span>
//             <small>{adminEmail}</small>
//           </div>
//           <ChevronDown size={16} />
//         </div>
//       </div>
//     </header>
//   );
// }

import { Bell, CheckCheck, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	getNotifications,
	markAllNotificationsRead,
	notificationStreamUrl,
	type AppNotification,
} from "../../../api/notification";
import type { MenuTab, OtherTab } from "../Admin";

type AdminView = MenuTab | OtherTab;

interface AdminNavbarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
	onNavigate: (view: AdminView) => void;
	adminName: string;
	adminRole: string;
	adminEmail: string;
	adminAvatar: string;
	adminId?: number | null;
	notificationsEnabled?: boolean;
}

// Danh sách các Menu có thể tìm kiếm được
const SEARCHABLE_TABS: { id: AdminView; label: string; icon: string }[] = [
	{ id: "dashboard", label: "Dashboard", icon: "📊" },
	{ id: "users", label: "Users Management", icon: "👥" },
	{ id: "breeding", label: "Breeding Recipes", icon: "🧬" },
	{ id: "dictionary", label: "Koi Dictionary", icon: "📖" },
	{ id: "items", label: "Shop Catalog", icon: "🛍️" },
	{ id: "transactions", label: "Shop Transactions", icon: "💳" },
	{ id: "trade", label: "Marketplace Trades", icon: "🤝" },
	{ id: "settings", label: "Settings", icon: "⚙️" },
	{ id: "account", label: "Account Profile", icon: "👤" },
];

export function AdminNavbar({
	searchTerm,
	onSearchChange,
	onNavigate,
	adminName,
	adminRole,
	adminEmail,
	adminAvatar,
	adminId,
	notificationsEnabled = true,
}: AdminNavbarProps) {
	// ==========================================
	// 1. STATE & LOGIC CHO THANH SEARCH (GLOBAL NAV)
	// ==========================================
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Xử lý click ra ngoài để đóng Search Dropdown
	useEffect(() => {
		const handleClickOutsideSearch = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutsideSearch);
		return () =>
			document.removeEventListener("mousedown", handleClickOutsideSearch);
	}, []);

	const filteredTabs = SEARCHABLE_TABS.filter((tab) =>
		tab.label.toLowerCase().includes(searchTerm.toLowerCase()),
	);

	const handleSelectTab = (id: AdminView) => {
		onNavigate(id);
		setIsDropdownOpen(false);
	};

	// ==========================================
	// 2. STATE & LOGIC CHO THÔNG BÁO (NOTIFICATIONS)
	// ==========================================
	const [notifications, setNotifications] = useState<AppNotification[]>([]);
	const [isNotifOpen, setIsNotifOpen] = useState(false);
	const [notifLoading, setNotifLoading] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!adminId || !notificationsEnabled) {
			setNotifications([]);
			setIsNotifOpen(false);
			return;
		}
		let active = true;
		setNotifLoading(true);

		getNotifications(adminId)
			.then((items) => {
				if (active) setNotifications(items ?? []);
			})
			.catch((error) =>
				console.error("Unable to load admin notifications:", error),
			)
			.finally(() => {
				if (active) setNotifLoading(false);
			});

		// SSE Stream real-time
		const stream = new EventSource(notificationStreamUrl(adminId), {
			withCredentials: true,
		});
		stream.addEventListener("notification", (event) => {
			const item = JSON.parse(
				(event as MessageEvent).data,
			) as AppNotification;
			setNotifications((current) => [
				item,
				...current.filter((entry) => entry.id !== item.id),
			]);
		});
		return () => {
			active = false;
			stream.close();
		};
	}, [adminId, notificationsEnabled]);

	// Xử lý click ra ngoài để đóng Notification Panel
	useEffect(() => {
		const closeNotif = (event: MouseEvent) => {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target as Node)
			) {
				setIsNotifOpen(false);
			}
		};
		document.addEventListener("mousedown", closeNotif);
		return () => document.removeEventListener("mousedown", closeNotif);
	}, []);

	const unreadCount = notifications.filter((item) => !item.isRead).length;

	const markAllRead = async () => {
		if (!adminId || unreadCount === 0) return;
		await markAllNotificationsRead(adminId);
		setNotifications((current) =>
			current.map((item) => ({ ...item, isRead: true })),
		);
	};

	return (
		<header className="admin-navbar">
			{/* Khung Search */}
			<div className="navbar-search" ref={dropdownRef}>
				<Search size={18} color="var(--text-muted)" />
				<input
					value={searchTerm}
					onChange={(e) => {
						onSearchChange(e.target.value);
						setIsDropdownOpen(true);
					}}
					onFocus={() => setIsDropdownOpen(true)}
					placeholder="Search dashboard, users, functions..."
				/>

				{/* Khung Dropdown Gợi ý */}
				{isDropdownOpen && searchTerm.trim() !== "" && (
					<div className="navbar-search-dropdown">
						{filteredTabs.length > 0 ? (
							filteredTabs.map((tab) => (
								<button
									key={tab.id}
									type="button"
									className="search-dropdown-item"
									onClick={() => handleSelectTab(tab.id)}
								>
									<span className="search-dropdown-icon">
										{tab.icon}
									</span>
									<span className="search-dropdown-label">
										{tab.label}
									</span>
								</button>
							))
						) : (
							<div className="search-dropdown-empty">
								No matching tabs found for "{searchTerm}"
							</div>
						)}
					</div>
				)}
			</div>

			<div className="navbar-actions">
				{/* Chuông Thông Báo */}
				{notificationsEnabled && (
					<div className="admin-notification-wrap" ref={panelRef}>
						<button
							type="button"
							className="notification-button"
							aria-label={`Notifications, ${unreadCount} unread`}
							aria-expanded={isNotifOpen}
							onClick={() => setIsNotifOpen((value) => !value)}
						>
							<Bell size={18} />
							{unreadCount > 0 && (
								<span className="notification-count">
									{unreadCount > 99 ? "99+" : unreadCount}
								</span>
							)}
						</button>

						{isNotifOpen && (
							<section className="admin-notification-panel">
								<div className="admin-notification-header">
									<div>
										<strong>Notifications</strong>
										<span>{unreadCount} unread</span>
									</div>
									<div>
										<button
											type="button"
											onClick={() => void markAllRead()}
											disabled={!unreadCount}
											title="Mark all as read"
										>
											<CheckCheck size={17} />
										</button>
										<button
											type="button"
											onClick={() =>
												setIsNotifOpen(false)
											}
											title="Close"
										>
											<X size={17} />
										</button>
									</div>
								</div>
								<div className="admin-notification-list">
									{notifLoading ? (
										<p className="admin-notification-empty">
											Loading notifications…
										</p>
									) : notifications.length === 0 ? (
										<p className="admin-notification-empty">
											You are all caught up.
										</p>
									) : (
										notifications.map((item) => (
											<article
												key={item.id}
												className={`admin-notification-item ${
													item.isRead ? "" : "unread"
												}`}
											>
												<span className="admin-notification-icon">
													{item.type ===
													"PURCHASE_SUCCESS"
														? "🛒"
														: item.type ===
															  "DEPOSIT_SUCCESS"
															? "💰"
															: item.type.includes(
																		"BREEDING",
																  )
																? "🐟"
																: "🔔"}
												</span>
												<div>
													<strong>
														{item.title}
													</strong>
													<p>{item.message}</p>
													<time>
														{new Date(
															item.createdAt,
														).toLocaleString(
															"en-GB",
															{
																dateStyle:
																	"medium",
																timeStyle:
																	"short",
															},
														)}
													</time>
												</div>
											</article>
										))
									)}
								</div>
							</section>
						)}
					</div>
				)}

				{/* Admin Profile */}
				<div className="admin-profile">
					<img src={adminAvatar} alt={adminName} />
					<div>
						<strong>{adminName}</strong>
						<span>{adminRole}</span>
						<small>{adminEmail}</small>
					</div>
					<ChevronDown size={16} />
				</div>
			</div>
		</header>
	);
}
