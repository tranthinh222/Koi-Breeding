import { useEffect, useState } from 'react'
import { getUserInfo } from '../api/header'

const CURRENT_USER_ID = 1

export default function ShopHeader() {
  const [username, setUsername] = useState('')
  const [exp, setExp] = useState(1)
  const [balance, setBalance] = useState<number>(0)
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

  return (
    <header className="hud">
      <div className="player">
        <div className="avatar">🧑</div>

        <div>
          <h3>{loading ? 'Loading...' : username}</h3>
          <p>{loading ? 'Loading...' : exp}</p>
        </div>
      </div>

      <div className="hud-actions">
        <div className="notification-wrapper">
          <button
            className="notification-btn"
            id="notificationBtn"
            aria-label="Notifications"
          >
            🔔
            <span className="notification-badge" id="notificationBadge">
              3
            </span>
          </button>

          <div className="notification-panel" id="notificationPanel">
            <div className="notification-header">
              <h3>Notifications</h3>
              <button id="markAllRead">Mark all as read</button>
            </div>

            <div className="notification-list">
              <div className="notification-item unread">
                <div className="notification-icon">🐟</div>
                <div>
                  <strong>New Koi available</strong>
                  <p>A new Kohaku has been added to the marketplace.</p>
                  <small>5 minutes ago</small>
                </div>
              </div>

              <div className="notification-item unread">
                <div className="notification-icon">💰</div>
                <div>
                  <strong>Purchase successful</strong>
                  <p>You bought 250 Koins successfully.</p>
                  <small>20 minutes ago</small>
                </div>
              </div>

              <div className="notification-item">
                <div className="notification-icon">🎁</div>
                <div>
                  <strong>Daily reward</strong>
                  <p>Your daily reward is ready to claim.</p>
                  <small>1 hour ago</small>
                </div>
              </div>
            </div>
          </div>
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
