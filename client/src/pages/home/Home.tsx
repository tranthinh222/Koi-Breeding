import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../api/user'
import { getBalanceWallet } from '../../api/wallet'
import maleAvatar from '../../assets/avatars/male_blank_avatar.png'
import femaleAvatar from '../../assets/avatars/female_blank_avatar.png'
import { useAuth } from '../../context/AuthContext'

type HomeUser = {
  id: number
  username: string
  gender?: string | null
  email?: string
  birthday?: string | null
  exp?: number
  avatarUrl?: string | null
}

type Wallet = {
  balance: number
}

type Pond = {
  id: number
  name: string
  level: number
  currentKoi: number
  capacity: number
  waterQuality: number
}

type Breeding = {
  parentA?: string
  parentB?: string
  status?: string
}

type FeaturedKoi = {
  id?: number
  name?: string
  image?: string
  rarity?: string
}

type HomeResponse = {
  user: HomeUser
  wallet?: Wallet | null
  pond: Pond | null
  breeding?: Breeding | null
  featuredKoi: FeaturedKoi[]
}

const getHomeUserId = (currentUserId: number | null) => {
  const idFromUrl = new URLSearchParams(window.location.search).get('id')
  return idFromUrl ? Number(idFromUrl) : currentUserId
}

function getLevel(exp = 0) {
  return Math.max(1, Math.floor(exp / 100))
}

function HomeStateMessage({
  type,
  message,
}: {
  type: 'loading' | 'error' | 'empty'
  message: string
}) {
  return <div className={`home-message ${type}`}>{message}</div>
}

function HomeStats({
  walletBalance,
  koiCount,
  pondCount,
}: {
  walletBalance: number
  koiCount: number
  pondCount: number
}) {
  const stats = [
    { label: 'Wallet', value: walletBalance.toLocaleString(), icon: '🪙' },
    { label: 'Koi', value: koiCount, icon: '🐟' },
    { label: 'Pond', value: pondCount, icon: '🌊' },
  ]

  return (
    <section className="home-stats" aria-label="Player stats">
      {stats.map((stat) => (
        <div className="home-stat-card" key={stat.label}>
          <span>{stat.icon}</span>
          <div>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </div>
        </div>
      ))}
    </section>
  )
}

function PondCard({ pond }: { pond: Pond | null }) {
  const occupancy = pond ? `${pond.currentKoi}/${pond.capacity}` : '0/0'
  const waterQuality = pond ? `${pond.waterQuality}%` : 'No pond'

  return (
    <section className="home-card pond-card">
      <div className="home-card-header">
        <div>
          <span className="home-eyebrow">Pond</span>
          <h3>{pond?.name ?? 'No pond yet'}</h3>
        </div>
        <strong>Lv. {pond?.level ?? 0}</strong>
      </div>

      <div className="pond-metrics">
        <div>
          <span>Koi capacity</span>
          <strong>{occupancy}</strong>
        </div>
        <div>
          <span>Water quality</span>
          <strong>{waterQuality}</strong>
        </div>
      </div>
    </section>
  )
}

function BreedingCard({ breeding }: { breeding?: Breeding | null }) {
  return (
    <section className="home-card breeding-card">
      <div className="home-card-header">
        <div>
          <span className="home-eyebrow">Breeding</span>
          <h3>{breeding?.status ?? 'Ready to pair'}</h3>
        </div>
        <button className="home-action-button">Start</button>
      </div>

      <div className="breeding-content">
        <div>
          <strong>Parent A</strong>
          <span>{breeding?.parentA ?? 'Not selected'}</span>
        </div>
        <div>
          <strong>Parent B</strong>
          <span>{breeding?.parentB ?? 'Not selected'}</span>
        </div>
      </div>
    </section>
  )
}

function MarketplacePreview({ koi }: { koi: FeaturedKoi[] }) {
  return (
    <section className="home-card marketplace-card">
      <div className="home-card-header">
        <div>
          <span className="home-eyebrow">Marketplace</span>
          <h3>Featured koi</h3>
        </div>
      </div>

      {koi.length > 0 ? (
        <div className="featured-koi-list">
          {koi.slice(0, 3).map((item, index) => (
            <div className="featured-koi" key={item.id ?? `${item.name}-${index}`}>
              {item.image ? <img src={item.image} alt={item.name ?? 'Koi'} /> : <span>🐟</span>}
              <div>
                <strong>{item.name ?? 'Unnamed koi'}</strong>
                <p>{item.rarity ?? 'Standard'}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="home-muted">Featured koi will appear here.</p>
      )}
    </section>
  )
}

function ProfilePanel({ user }: { user: HomeUser }) {
  const navigate = useNavigate()
  const fallbackAvatar = user.gender === 'MALE' ? maleAvatar : femaleAvatar
  const [avatarSrc, setAvatarSrc] = useState(user.avatarUrl || fallbackAvatar)

  useEffect(() => {
    setAvatarSrc(user.avatarUrl || fallbackAvatar)
  }, [user.avatarUrl, fallbackAvatar])

  return (
    <aside className="profile-panel">
      <div className="home-profile-avatar">
        <img
          src={avatarSrc}
          alt={user.username}
          onError={() => {
            if (avatarSrc !== fallbackAvatar) {
              setAvatarSrc(fallbackAvatar)
            }
          }}
        />
      </div>

      <div className="profile-details">
        <strong className="username">{user.username}</strong>
        <span className="level">Level {getLevel(user.exp)}</span>
      </div>

      <button className="view-profile-button" onClick={() => navigate(`/profile`)}>
        View Profile
      </button>
    </aside>
  )
}

export default function Home() {
  const { currentUserId } = useAuth()
  const [data, setData] = useState<HomeResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const loadHome = async () => {
      const userId = getHomeUserId(currentUserId)
      if (!userId) return

      try {
        setLoading(true)
        setError(null)

        const [user, wallet] = await Promise.all([
          getUser(userId),
          getBalanceWallet(userId),
        ])

        const homeData: HomeResponse = {
          user,
          wallet,
          pond: null,
          breeding: null,
          featuredKoi: [],
        }
        if (!cancelled) setData(homeData)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load home data.')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void loadHome()

    return () => {
      cancelled = true
    }
  }, [currentUserId])

  const summary = useMemo(
    () => ({
      walletBalance: data?.wallet?.balance ?? 0,
      koiCount: data?.featuredKoi?.length ?? 0,
      pondCount: data?.pond ? 1 : 0,
    }),
    [data],
  )

  return (
    <>
      <section className="title-section">
        <div className="wood-sign">
          <h1>HOME</h1>
        </div>
      </section>

      <main className="home-content">
        {loading ? (
          <HomeStateMessage type="loading" message="Loading profile..." />
        ) : error ? (
          <HomeStateMessage type="error" message={error} />
        ) : data ? (
          <>
            <section className="game-info">
              <div className="home-welcome">
                <span className="home-eyebrow">Welcome back</span>
                <h2>{data.user.username}</h2>
              </div>

              <HomeStats {...summary} />

              <div className="home-card-grid">
                <PondCard pond={data.pond} />
                <BreedingCard breeding={data.breeding} />
                <MarketplacePreview koi={data.featuredKoi ?? []} />
              </div>
            </section>

            <ProfilePanel user={data.user} />
          </>
        ) : (
          <HomeStateMessage type="empty" message="No data available." />
        )}
      </main>
    </>
  )
}
