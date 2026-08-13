import { useEffect, useState } from 'react'
import { getBalanceWallet } from '../api/wallet'

const CURRENT_USER_ID = 1

export default function ShopHeader() {
  const [balance, setBalance] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBalance = async () => {
      try {
        const data = await getBalanceWallet(CURRENT_USER_ID)

        setBalance(data.balance)
      } catch (error) {
        console.error('Failed to load wallet balance:', error)
      } finally {
        setLoading(false)
      }
    }

    loadBalance()
  }, [])

  return (
    <header className="hud">
      <div className="player">
        <div className="avatar">🧑</div>

        <div>
          <h3>Koi Master</h3>
          <p>Level: 18</p>
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
      </div>
    </header>
  )
}
