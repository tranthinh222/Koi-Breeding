import { Bell, CheckCheck, ChevronDown, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  getNotifications,
  markAllNotificationsRead,
  notificationStreamUrl,
  type AppNotification,
} from "../../../api/notification";

interface AdminNavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  adminName: string;
  adminRole: string;
  adminEmail: string;
  adminAvatar: string;
  adminId: number | null;
  notificationsEnabled: boolean;
}

export function AdminNavbar({
  searchTerm,
  onSearchChange,
  adminName,
  adminRole,
  adminEmail,
  adminAvatar,
  adminId,
  notificationsEnabled,
}: AdminNavbarProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!adminId || !notificationsEnabled) { setNotifications([]); setIsOpen(false); return; }
    let active = true;
    setLoading(true);
    getNotifications(adminId)
      .then((items) => { if (active) setNotifications(items ?? []); })
      .catch((error) => console.error("Unable to load admin notifications:", error))
      .finally(() => { if (active) setLoading(false); });

    const stream = new EventSource(notificationStreamUrl(adminId), { withCredentials: true });
    stream.addEventListener("notification", (event) => {
      const item = JSON.parse((event as MessageEvent).data) as AppNotification;
      setNotifications((current) => [item, ...current.filter((entry) => entry.id !== item.id)]);
    });
    return () => { active = false; stream.close(); };
  }, [adminId, notificationsEnabled]);

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const unreadCount = notifications.filter((item) => !item.isRead).length;
  const markAllRead = async () => {
    if (!adminId || unreadCount === 0) return;
    await markAllNotificationsRead(adminId);
    setNotifications((current) => current.map((item) => ({ ...item, isRead: true })));
  };

  return (
    <header className="admin-navbar">
      <div className="navbar-search">
        <Search size={18} />
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search dashboard, user, function..."
        />
      </div>

      <div className="navbar-actions">
        {notificationsEnabled && <div className="admin-notification-wrap" ref={panelRef}>
          <button type="button" className="notification-button" aria-label={`Notifications, ${unreadCount} unread`} aria-expanded={isOpen} onClick={() => setIsOpen((value) => !value)}>
            <Bell size={18} />
            {unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
          </button>
          {isOpen && <section className="admin-notification-panel">
            <div className="admin-notification-header"><div><strong>Notifications</strong><span>{unreadCount} unread</span></div><div><button type="button" onClick={() => void markAllRead()} disabled={!unreadCount} title="Mark all as read"><CheckCheck size={17} /></button><button type="button" onClick={() => setIsOpen(false)} title="Close"><X size={17} /></button></div></div>
            <div className="admin-notification-list">
              {loading ? <p className="admin-notification-empty">Loading notifications…</p> : notifications.length === 0 ? <p className="admin-notification-empty">You are all caught up.</p> : notifications.map((item) => <article key={item.id} className={`admin-notification-item ${item.isRead ? "" : "unread"}`}>
                <span className="admin-notification-icon">{item.type === "PURCHASE_SUCCESS" ? "🛒" : item.type === "DEPOSIT_SUCCESS" ? "💰" : item.type.includes("BREEDING") ? "🐟" : "🔔"}</span>
                <div><strong>{item.title}</strong><p>{item.message}</p><time>{new Date(item.createdAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}</time></div>
              </article>)}
            </div>
          </section>}
        </div>}
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
