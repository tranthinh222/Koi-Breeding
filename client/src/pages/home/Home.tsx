import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../../api/user'
import { getBalanceWallet } from '../../api/wallet'
import { getPonds } from '../../api/pond'
import maleAvatar from '../../assets/avatars/male_blank_avatar.png'
import femaleAvatar from '../../assets/avatars/female_blank_avatar.png'
import { useAuth } from '../../context/AuthContext'
import {logoutRequest} from '../../api/auth'
import '../../style/home.css'
import '../../style/global.css'

import type { IPond } from '../../types/backend'

import StoreIcon from '../../assets/icons/storefront.svg'
import ArrowOutward from '../../assets/icons/arrow_outward.svg'
import ShopIcon from '../../assets/icons/shop.svg'
import PondsIcon from '../../assets/icons/water.svg'
// ------
// Types
// ------

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
  ponds: IPond[]
  breeding?: Breeding | null
  featuredKoi: FeaturedKoi[]
}

// ------
// Helpers (kept from the legacy Home.tsx)
// ------

const getHomeUserId = (currentUserId: number | null) => {
  const idFromUrl = new URLSearchParams(window.location.search).get('id')
  return idFromUrl ? Number(idFromUrl) : currentUserId
}

function getLevel(exp = 0) {
  return Math.max(1, Math.floor(exp / 100))
}

// ------
// Small presentational pieces
// ------

/** Loading / error / empty banner shown in place of the main content. */
function HomeStateMessage({
  type,
  message,
}: {
  type: 'loading' | 'error' | 'empty'
  message: string
}) {
  const tone =
    type === 'error'
      ? 'text-error'
      : type === 'empty'
        ? 'text-on-surface-variant'
        : 'text-on-surface'

  return (
    <div className={`glass-card rounded-[32px] p-10 text-center font-body-lg text-body-lg ${tone}`}>
      {message}
    </div>
  )
}

function PondMiniCard({ pond }: { pond: IPond }) {
  return (
    <article className="pond-mini-card">
      <div className="pond-mini-card-header">
        <div>
          <span className="home-eyebrow">Pond</span>
          <h5>{pond.name}</h5>
        </div>
        <strong>Lv. {pond.level}</strong>
      </div>

      <div className="pond-mini-metrics">
        <div>
          <span>Capacity</span>
          <strong>{pond.capacity}</strong>
        </div>
        <div>
          <span>Water</span>
          <strong>{pond.waterQuality}%</strong>
        </div>
        <div>
          <span>Temp</span>
          <strong>{Number(pond.temperature).toFixed(1)}°C</strong>
        </div>
        <div>
          <span>pH / Oxygen</span>
          <strong>
            {Number(pond.pH).toFixed(1)} / {Number(pond.oxygen).toFixed(2)}
          </strong>
        </div>
      </div>
    </article>
  )
}

function PondsPreviewPanel({
  ponds,
  onNavigate,
}: {
  ponds: IPond[]
  onNavigate: () => void
}) {
  const pageSize = 2
  const [page, setPage] = useState(0)

  const totalPages = Math.max(1, Math.ceil(ponds.length / pageSize))

  useEffect(() => {
    setPage(0)
  }, [ponds])

  const visiblePonds = useMemo(
    () => ponds.slice(page * pageSize, page * pageSize + pageSize),
    [page, ponds],
  )

  if (ponds.length === 0) {
    return (
      <a
        className="glass-card tab-card ponds-empty-card"
        href="#"
        onClick={(e) => {
          e.preventDefault()
          onNavigate()
        }}
      >
        <div className="ponds-empty-top">
          <div className="tab-icon-box">
            <img className='icon-medium' src={PondsIcon} alt='ponds'/>
          </div>
          <img className="tab-arrow ponds-arrow" src={ArrowOutward} alt="arrow_outward" />
        </div>

        <div className="ponds-empty-copy">
          <h4>Ponds</h4>
          <p>Create your first pond and start raising koi.</p>
        </div>
      </a>
    )
  }

  return (
    <section className="glass-card ponds-card">
      <div className="ponds-card-header">
        <div>
          <span className="featured-badge">PONDS</span>
          <h4 className="featured-title">Your ponds</h4>
          <p className="featured-desc">Browse two ponds at a time.</p>
        </div>

        <div className="ponds-pager">
          <span className="ponds-page-meta">
            {page + 1}/{totalPages}
          </span>
          <button
            className="ponds-page-button"
            type="button"
            onClick={() => setPage((current) => Math.max(0, current - 1))}
            disabled={page === 0}
          >
            ←
          </button>
          <button
            className="ponds-page-button"
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages - 1, current + 1))}
            disabled={page >= totalPages - 1}
          >
            →
          </button>
        </div>
      </div>

      <div className="ponds-grid">
        {visiblePonds.map((pond) => (
          <PondMiniCard key={pond.id} pond={pond} />
        ))}
      </div>
    </section>
  )
}

// ------
// Page
// ------
function ProfilePanel({ user }: { user: HomeUser }) {
  const navigate = useNavigate()
  const fallbackAvatar = user.gender === 'MALE' ? maleAvatar : femaleAvatar
  const [avatarSrc, setAvatarSrc] = useState(user.avatarUrl || fallbackAvatar)

  useEffect(() => {
    setAvatarSrc(user.avatarUrl || fallbackAvatar)
  }, [user.avatarUrl, fallbackAvatar])

  const handleLogout = async () => {
    try {
      await logoutRequest();

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  const goToProfile = () => navigate('/profile')
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
      <div className='profile-action'>
        <button className="view-profile-button" onClick={goToProfile}>
          View Profile
        </button>
        <button className="logout-button" onClick={handleLogout}>
            Sign out
        </button>
      </div>
    </aside>
  )
}

export default function Home() {
  const { currentUserId } = useAuth()
  const navigate = useNavigate()
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

        const [user, wallet, pondPage] = await Promise.all([
          getUser(userId),
          getBalanceWallet(userId),
          getPonds(0, 100),
        ])
        const ownedPonds = pondPage.result.filter(
          (pond) => !pond.owner || pond.owner.id === userId,
        )

        const homeData: HomeResponse = {
          user,
          wallet,
          ponds: ownedPonds.length > 0 ? ownedPonds : pondPage.result,
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

  const user = data?.user
  const featuredKoi = data?.featuredKoi?.[0]
  const ponds = data?.ponds ?? []

  return (
    <div className='page-wrapper'>
          {/* TopAppBar */}
          <header className="title-section">
            <div className="wood-sign">
              <div className="koi-title-container"></div>
              <h1 className="koi-title-desktop">HOME</h1>
                <p>User Info</p>
              <h1 className='koi-title-mobile'>HOME</h1>
            </div>
          </header>
          <main className='container'>
            
            {loading ? (
              <div className='full-width'>
                <HomeStateMessage type="loading" message='Loading profile...'/>
              </div>
            ) : error ? (
              <div className='full-width'>
                <HomeStateMessage type="error" message={error}/>
              </div>
            ) : data && user ? (
              <div className="dashboard-wrapper">
                <div className="main-content">
                  <div className="left-column">
                    <div className="glass-card featured-card">
                      <div>
                        <span className="featured-badge">
                          {featuredKoi?.rarity?.toUpperCase() ?? 'FEATURED'}
                        </span>
                        <h4 className="featured-title">
                          {featuredKoi?.name ?? 'No featured Koi yet'}
                        </h4>
                        <p className="featured-desc">Ready for breeding</p>
                      </div>
                        {featuredKoi?.image ? (
                          <img className="featured-img" src={featuredKoi.image} alt={featuredKoi.name ?? 'Koi'} />
                        ) : (
                          <button className="breeding-action-button" onClick={(e) => {e.preventDefault(); navigate('/breeding')}}>Start Breeding</button>
                        )}
                    </div>
                    <PondsPreviewPanel ponds={ponds} onNavigate={() => navigate('/ponds')} />
                  </div>
                  {/* Tabs Section */}
                  <div className="right-column">
                    {/* Marketplace Tab */}
                    <a className="glass-card tab-card tab-marketplace" href="#" onClick={(e) => { e.preventDefault(); navigate('/marketplace'); }}>
                      <div className="tab-bg-gradient-market" />
                      <div className="tab-header">
                        <div className="tab-icon-box">
                          <img className='icon-medium' src={StoreIcon} alt='storefront'></img>
                        </div>
                        <img className='tab-arrow' src={ArrowOutward} alt='arrow_outward' />
                      </div>
                      <div className="tab-content">
                        <h3 className="tab-title">Marketplace</h3>
                        <p className="tab-desc">Trade rare breeds and expand your collection with other masters.</p>
                      </div>
                      <div className="tab-bg-icon">
                        <img className='icon-medium' src={StoreIcon} alt='storefront'></img>
                      </div>
                    </a>

                    {/* Shop Tab */}
                    <a className="glass-card tab-card tab-shop" href="#" onClick={(e) => { e.preventDefault(); navigate('/shop'); }}>
                      <div className="tab-bg-gradient-shop" />
                      <div className="tab-header">
                        <div className="tab-icon-box">
                          <img className='icon-medium' src={ShopIcon} alt='shopping_bag'/>
                        </div>
                        <img className='tab-arrow' src={ArrowOutward} alt='arrow_outward' />
                      </div>
                      <div className="tab-content">
                        <h3 className="tab-title">Shop</h3>
                        <p className="tab-desc">Purchase premium food, pond decorations, and utility items.</p>
                      </div>
                      <div className="tab-bg-icon">
                        <img src={ShopIcon} alt='shop'></img>
                      </div>
                    </a>
                  </div>
                </div>

                <div className="sidebar">
                  <ProfilePanel user={data.user} />
                </div>
                
              </div>
            ) : (
              <div className='full-width'>
                <HomeStateMessage type="empty" message='No data available' />
              </div>
            )}
          </main>
    </div>
  )
}
