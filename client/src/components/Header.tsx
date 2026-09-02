import { useEffect, useState } from "react";
import { getUserInfo } from "../api/header";
import {
  getNotifications,
  markAllNotificationsRead,
  notificationStreamUrl,
  type AppNotification,
} from "../api/notification";
import { useAuth } from "../context/AuthContext";

export default function ShopHeader() {
  const { currentUserId } = useAuth();
  const [username, setUsername] = useState("");
  const [exp, setExp] = useState(1);
  const [balance, setBalance] = useState<number>(0);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHeaderInfo = async () => {
      if (!currentUserId) return;

      try {
        const data = await getUserInfo(currentUserId);

        setUsername(data.username);
        setBalance(data.balance);
        setExp(data.exp);
      } catch (error) {
        console.error("Failed to load header information:", error);
      } finally {
        setLoading(false);
      }
    };

    loadHeaderInfo();
  }, [currentUserId]);

  useEffect(() => {
    const updateBalance = (event: Event) => {
      setBalance((event as CustomEvent<number>).detail);
    };
    window.addEventListener("wallet:updated", updateBalance);
    return () => window.removeEventListener("wallet:updated", updateBalance);
  }, []);

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead,
  ).length;

  const markAllRead = async () => {
    try {
      if (!currentUserId) return;

      await markAllNotificationsRead(currentUserId);
      setNotifications((current) =>
        current.map((notification) => ({ ...notification, isRead: true })),
      );
    } catch (error) {
      console.error("Failed to mark notifications as read:", error);
    }
  };

  useEffect(() => {
    if (!currentUserId) return;

    let cancelled = false;

    const loadNotifications = async () => {
      try {
        const data = await getNotifications(currentUserId);

        if (!cancelled) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();

    const eventSource = new EventSource(notificationStreamUrl(currentUserId), {
      withCredentials: true,
    });

    eventSource.onopen = () => {
      console.log("Notification SSE connected");
    };

    eventSource.addEventListener("notification", (event) => {
      try {
        const notification = JSON.parse(event.data) as AppNotification;

        setNotifications((current) => [notification, ...current]);
      } catch (error) {
        console.error("Invalid notification data:", error);
      }
    });

    eventSource.onerror = (error) => {
      console.error("Notification SSE error:", error);
    };

    return () => {
      cancelled = true;
      eventSource.close();
    };
  }, [currentUserId]);

  return (
    <header className="hud">
      <div className="player">
        <div className="avatar">🧑</div>

        <div>
          <h3>{loading ? "Loading..." : username}</h3>
          <p>{loading ? "Loading..." : `Level: ${exp}`}</p>
        </div>
      </div>

      <div className="hud-actions">
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            aria-label="Notifications"
            aria-expanded={isNotificationPanelOpen}
            onClick={() => setNotificationPanelOpen((isOpen) => !isOpen)}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {isNotificationPanelOpen && (
            <div className="notification-panel show">
              <div className="notification-header">
                <h3>Notifications</h3>
                <button onClick={markAllRead} disabled={unreadCount === 0}>
                  Mark all as read
                </button>
              </div>

              <div className="notification-list">
                {notifications.length === 0 ? (
                  <p className="notification-empty">No notifications yet.</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      className={`notification-item ${notification.isRead ? "" : "unread"}`}
                      key={notification.id}
                    >
                      <div className="notification-icon">
                        {notification.type === "PURCHASE_SUCCESS" ? "🛒" : "🔔"}
                      </div>
                      <div>
                        <strong>{notification.title}</strong>
                        <p>{notification.message}</p>
                        <small>
                          {new Date(notification.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="wallet">
          <div className="gold">
            🪙 {loading ? "..." : balance.toLocaleString()}
          </div>
        </div>
      </div>
    </header>
  );
}
