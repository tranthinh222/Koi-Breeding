import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPayment } from '../../api/payment'
import type { CreatedPayment } from '../../api/payment'
import { useAuth } from '../../context/AuthContext'
import './payment.css'

const Payment = () => {
  const { itemId } = useParams<{ itemId: string }>()
  const navigate = useNavigate()
  const { currentUserId, loading: authLoading } = useAuth()

  const [payment, setPayment] = useState<CreatedPayment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPayment = async () => {
      if (authLoading) return

      try {
        if (!itemId) {
          throw new Error('Item ID is missing')
        }
        if (!currentUserId) {
          throw new Error('Please login before creating a payment')
        }

        const data = await createPayment(currentUserId, Number(itemId))

        setPayment(data)
      } catch (err) {
        console.error('Failed to create payment:', err)
        setError('Unable to create payment. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadPayment()
  }, [authLoading, currentUserId, itemId])

  if (loading || authLoading) {
    return (
      <main className="payment-page">
        <div className="payment-card">
          <div className="payment-header">
            <h1>KOI PAYMENT</h1>
            <p>Creating your payment...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error || !payment) {
    return (
      <main className="payment-page">
        <div className="payment-card">
          <div className="payment-header">
            <h1>KOI PAYMENT</h1>
            <p>{error ?? 'Payment could not be created.'}</p>
          </div>

          <div className="payment-footer">
            <button className="cancel-btn" onClick={() => navigate('/shop')}>
              Back to Shop
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <div>
      <div className="cloud cloud-one"></div>
      <div className="cloud cloud-two"></div>

      <main className="payment-page">
        <section className="payment-card">
          <div className="payment-header">
            <span
              className="back-link"
              onClick={() => navigate('/shop')}
              style={{ cursor: 'pointer' }}
            >
              ← Back to Shop
            </span>

            <h1>KOI PAYMENT</h1>
            <p>Complete your purchase</p>
          </div>

          <div className="payment-content">
            {/* ================= ORDER SUMMARY ================= */}

            <section className="order-summary">
              <div className="section-title">
                <span>🛒</span>
                <h2>Order Summary</h2>
              </div>

              <div className="product-box">
                <div className="product-image">🪙</div>

                <div className="product-info">
                  <h3>Koins Pack</h3>

                  <p>Receive Koins after successful payment.</p>

                  <span className="coin-reward">
                    Payment #{payment.orderCode}
                  </span>
                </div>
              </div>

              <div className="summary-row">
                <span>Payment code</span>

                <strong>PAY{payment.orderCode}</strong>
              </div>

              <div className="summary-row">
                <span>Payment amount</span>

                <strong>{payment.amount.toLocaleString('vi-VN')} VND</strong>
              </div>

              <div className="summary-row total">
                <span>Total</span>

                <strong>{payment.amount.toLocaleString('vi-VN')} VND</strong>
              </div>
            </section>

            {/* ================= QR ================= */}

            <section className="qr-section">
              <div className="section-title">
                <span>📱</span>
                <h2>Scan to Pay</h2>
              </div>

              <div className="qr-card">
                {/* REAL VIETQR */}

                <div className="qr-real">
                  <img src={payment.qrUrl} alt="VietQR payment QR code" />
                </div>

                <p className="scan-title">Scan this QR code</p>

                <p className="scan-note">
                  Use your banking app to complete the payment.
                </p>

                <div className="payment-status">
                  <span className="status-dot"></span>

                  <span>Waiting for payment...</span>
                </div>
              </div>

              <div className="payment-info-card">
                <div className="info-row">
                  <span className="info-icon">🏦</span>

                  <div>
                    <strong>Payment method</strong>

                    <small>Scan the VietQR code using your banking app.</small>
                  </div>
                </div>

                <div className="info-row">
                  <span className="info-icon">💬</span>

                  <div>
                    <strong>Payment content</strong>

                    <small>PAY{payment.orderCode}</small>
                  </div>
                </div>

                <div className="info-row">
                  <span className="info-icon">⚡</span>

                  <div>
                    <strong>Automatic confirmation</strong>

                    <small>
                      Your Koins will be added after the payment is confirmed.
                    </small>
                  </div>
                </div>

                <div className="info-row">
                  <span className="info-icon">🛡️</span>

                  <div>
                    <strong>Safe & secure</strong>

                    <small>
                      Keep this payment window open until the transaction is
                      completed.
                    </small>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <div className="payment-footer">
            <div className="secure-note">
              <span>🔒</span>

              <div>
                <strong>Secure payment</strong>

                <p>Your payment is processed securely.</p>
              </div>
            </div>

            <button className="cancel-btn" onClick={() => navigate('/shop')}>
              Cancel Payment
            </button>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Payment
