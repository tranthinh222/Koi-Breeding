import { useEffect, useState } from 'react'
import { CURRENT_USER_ID } from '../api/currentUser'
import { getUserInfo } from '../api/header'
import {
  getNotifications,
  markAllNotificationsRead,
  notificationStreamUrl,
  type AppNotification,
} from '../api/notification'

export default function ShopHeader() {
  const [username, setUsername] = useState('')
  const [exp, setExp] = useState(1)
  const [balance, setBalance] = useState<number>(0)
  const [notifications, setNotifications] = useState<AppNotification[]>([])
  const [isNotificationPanelOpen, setNotificationPanelOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHeaderInfo = async () => {
      try {
        const data = await getUserInfo(CURRENT_USER_ID)

        setUsername(data.username)
        setBalance(data.balance)
        setExp(data.exp)
      } catch (error) {
        console.error('Failed to load header information:', error)
      } finally {
        setLoading(false)
      }
    }

    loadHeaderInfo()
  }, [])

  useEffect(() => {
    getNotifications(CURRENT_USER_ID)
      .then(setNotifications)
      .catch((error) => console.error('Failed to load notifications:', error))

    const eventSource = new EventSource(notificationStreamUrl(CURRENT_USER_ID))
    eventSource.addEventListener('notification', (event) => {
      const notification = JSON.parse(event.data) as AppNotification
      setNotifications((current) => [notification, ...current])
    })
    eventSource.onerror = () => {
      console.error('Notification stream disconnected; the browser will retry.')
    }

    return () => eventSource.close()
  }, [])

  useEffect(() => {
    const updateBalance = (event: Event) => {
      setBalance((event as CustomEvent<number>).detail)
    }
    window.addEventListener('wallet:updated', updateBalance)
    return () => window.removeEventListener('wallet:updated', updateBalance)
  }, [])

  const unreadCount = notifications.filter((notification) => !notification.isRead).length

  const markAllRead = async () => {
    try {
      await markAllNotificationsRead(CURRENT_USER_ID)
      setNotifications((current) => current.map((notification) => ({ ...notification, isRead: true })))
    } catch (error) {
      console.error('Failed to mark notifications as read:', error)
    }
  }

  return (
    <header className="hud">
      <div className="player">
        <div className="avatar">🧑</div>

        <div>
          <h3>{loading ? 'Loading...' : username}</h3>
          <p>{loading ? 'Loading...' : `Level: ${exp}`}</p>
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
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {isNotificationPanelOpen && <div className="notification-panel show">
            <div className="notification-header">
              <h3>Notifications</h3>
              <button onClick={markAllRead} disabled={unreadCount === 0}>Mark all as read</button>
            </div>

            <div className="notification-list">
              {notifications.length === 0 ? <p className="notification-empty">No notifications yet.</p> : notifications.map((notification) => (
                <div className={`notification-item ${notification.isRead ? '' : 'unread'}`} key={notification.id}>
                  <div className="notification-icon">{notification.type === 'PURCHASE_SUCCESS' ? '🛒' : '🔔'}</div>
                  <div>
                    <strong>{notification.title}</strong>
                    <p>{notification.message}</p>
                    <small>{new Date(notification.createdAt).toLocaleString()}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>}
        </div>

        <div className="wallet">
          <div className="gold">
            🪙 {loading ? '...' : balance.toLocaleString()}
          </div>
        </div>
      </div>
    </header>
  )
}
