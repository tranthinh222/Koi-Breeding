import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getUser } from "../../api/user";
import { getBalanceWallet } from "../../api/wallet";
import { getPonds } from "../../api/pond";

import maleAvatar from "../../assets/avatars/male_blank_avatar.png";
import femaleAvatar from "../../assets/avatars/female_blank_avatar.png";

import { useAuth } from "../../context/AuthContext";

import PondsIcon from "../../assets/icons/water.svg";
import StoreIcon from "../../assets/icons/storefront.svg";
import ShopIcon from "../../assets/icons/shop.svg";

import { logoutRequest } from "../../api/auth";

import "../../style/global.css";
import "../../style/home.css";

import type { IPond } from "../../types/backend";

type HomeUser = {
  id: number;
  username: string;
  gender?: string | null;
  email?: string;
  birthday?: string | null;
  exp?: number;
  avatarUrl?: string | null;
};

type Wallet = {
  balance: number;
};

type HomeResponse = {
  user: HomeUser;
  wallet?: Wallet | null;
  ponds: IPond[];
};

export default function Home() {
  const { currentUserId } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pondPage, setPondPage] = useState(0);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);

  const pageSize = 2;

  const getHomeUserId = () => {
    const idFromUrl = new URLSearchParams(window.location.search).get("id");

    return idFromUrl ? Number(idFromUrl) : currentUserId;
  };

  useEffect(() => {
    let cancelled = false;

    const loadHome = async () => {
      const userId = getHomeUserId();

      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const [user, wallet, pondPageData] = await Promise.all([
          getUser(userId),
          getBalanceWallet(userId),
          getPonds(0, 100),
        ]);

        const ownedPonds = pondPageData.result.filter(
          (pond: IPond) => !pond.owner || pond.owner.id === userId,
        );

        const homeData: HomeResponse = {
          user,
          wallet,
          ponds: ownedPonds.length > 0 ? ownedPonds : pondPageData.result,
        };

        if (!cancelled) {
          setData(homeData);
          setPondPage(0);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load home data.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadHome();

    return () => {
      cancelled = true;
    };
  }, [currentUserId]);

  const user = data?.user;

  const fallbackAvatar = user?.gender === "MALE" ? maleAvatar : femaleAvatar;

  useEffect(() => {
    if (user) {
      setAvatarSrc(user.avatarUrl || fallbackAvatar);
    }
  }, [user?.avatarUrl, user?.gender]);

  const ponds = data?.ponds ?? [];

  const pondCount = ponds.length;

  const totalPondPages = Math.max(1, Math.ceil(ponds.length / pageSize));

  const visiblePonds = useMemo(() => {
    return ponds.slice(pondPage * pageSize, pondPage * pageSize + pageSize);
  }, [ponds, pondPage]);

  const getLevel = (exp = 0) => {
    return Math.max(1, Math.floor(exp / 100));
  };

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

  if (loading) {
    return (
      <main className="home-body">
        <div className="home-layout">
          <div className="home-main">
            <div className="home-state-message text-on-surface">
              Loading home...
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="home-body">
        <div className="home-layout">
          <div className="home-main">
            <div className="home-state-message text-error">{error}</div>
          </div>
        </div>
      </main>
    );
  }
  if (!data || !user) {
    return (
      <main className="home-body">
        <div className="home-layout">
          <div className="home-main">
            <div className="home-state-message text-on-surface-variant">
              No data available
            </div>
          </div>
        </div>
      </main>
    );
  }
  return (
    <main className="home-body">
      <section className="title-section">
        <div className="wood-sign">
          <h1>HOME</h1>
          <p>Koi Sanctuary</p>
        </div>
      </section>
      <div className="home-layout">
        <section className="home-main">
          <div className="stats-row">
            <div className="wood-panel stat-card">
              <div className="stat-icon fish-icon">🐟</div>

              <div>
                <strong>Total Fish</strong>
                <span className="home-stat-value">--</span>
              </div>
            </div>

            <div className="wood-panel stat-card">
              <div className="stat-icon">
                <img src={PondsIcon} alt="Ponds" />
              </div>

              <div>
                <strong>Ponds Owned</strong>

                <span className="home-stat-value">{pondCount}</span>
              </div>
            </div>
          </div>
          <section className="home-box ponds-section">
            <div className="wood-sign section-title">
              <h2>My Ponds</h2>

              {ponds.length > 0 && (
                <div className="pond-navigation">
                  <button
                    type="button"
                    disabled={pondPage === 0}
                    onClick={() => setPondPage((page) => Math.max(0, page - 1))}
                  >
                    ‹
                  </button>

                  <button
                    type="button"
                    disabled={pondPage >= totalPondPages - 1}
                    onClick={() =>
                      setPondPage((page) =>
                        Math.min(totalPondPages - 1, page + 1),
                      )
                    }
                  >
                    ›
                  </button>
                </div>
              )}
            </div>

            {ponds.length === 0 ? (
              <div className="ponds-empty">
                <div className="tab-icon-box">
                  <img className="icon-medium" src={PondsIcon} alt="Ponds" />
                </div>

                <h3>No ponds yet</h3>

                <p>Create your first pond and start raising koi.</p>

                <button
                  className="pond-button"
                  onClick={() => navigate("/ponds")}
                >
                  Go to Ponds
                </button>
              </div>
            ) : (
              <div className="pond-grid">
                {visiblePonds.map((pond) => (
                  <article className="pond-card" key={pond.id}>
                    <div className="pond-image">
                      <div className="pond-image-placeholder">
                        <img src={PondsIcon} alt="Pond" />
                      </div>

                      <span className="capacity">
                        Capacity: {pond.capacity}
                      </span>
                    </div>

                    <div className="pond-content">
                      <div>
                        <h4>{pond.name}</h4>

                        <p>Pond Level {pond.level}</p>
                      </div>

                      <div className="pond-info">
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
                          <strong>
                            {Number(pond.temperature).toFixed(1)}
                            °C
                          </strong>
                        </div>

                        <div>
                          <span>pH / O2</span>
                          <strong>
                            {Number(pond.pH).toFixed(1)}
                            {" / "}
                            {Number(pond.oxygen).toFixed(2)}
                          </strong>
                        </div>
                      </div>

                      <button
                        className="pond-button"
                        onClick={() => navigate(`/ponds/${pond.id}`)}
                      >
                        View Pond Details
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
          <section className="home-box breeding-section">
            <div className="wood-sign section-title">
              <h2>Breeding Lab</h2>
            </div>

            <div className="breeding-area">
              <div className="breeding-slot">
                <div className="koi-slot">
                  <span className="slot-plus">+</span>
                </div>

                <span>Select Parent</span>
              </div>

              <div className="breeding-icon">♥</div>

              <div className="breeding-slot">
                <div className="koi-slot">
                  <span className="slot-plus">+</span>
                </div>

                <span>Select Parent</span>
              </div>

              <div className="breeding-arrow">→</div>

              <div className="breeding-slot">
                <span className="result-question">?</span>

                <span className="potential-result">Potential Result</span>
              </div>
            </div>

            <button
              className="pond-button breeding-home-button"
              onClick={() => navigate("/breeding")}
            >
              Open Breeding Lab
            </button>
          </section>
          <div className="quick-access">
            <button
              className="wood-panel quick-button"
              onClick={() => navigate("/shop")}
            >
              <img src={StoreIcon} alt="" />

              <strong>Visit Items Shop</strong>
            </button>

            <button
              className="wood-panel quick-button"
              onClick={() => navigate("/marketplace")}
            >
              <img src={ShopIcon} alt="" />

              <strong>Go to Marketplace</strong>
            </button>
          </div>
        </section>
        <aside className="home-sidebar">
          <section className="wood-panel profile-card">
            <div className="profile-avatar">
              <img
                src={avatarSrc ?? fallbackAvatar}
                alt={user.username}
                onError={() => {
                  if (avatarSrc !== fallbackAvatar) {
                    setAvatarSrc(fallbackAvatar);
                  }
                }}
              />
            </div>

            <h2>{user.username}</h2>

            <p>Level {getLevel(user.exp)}</p>

            <button
              className="btn-primary"
              onClick={() => navigate("/profile")}
            >
              View Profile
            </button>

            <button className="logout-button" onClick={handleLogout}>
              Sign out
            </button>
          </section>
          <section className="home-box">
            <div className="wood-sign">
              <h3>Top Keepers</h3>
            </div>

            <div className="home-empty-sidebar">
              <p>Leaderboard coming soon</p>
            </div>
          </section>
          <section className="home-box">
            <div className="wood-sign">
              <h3>Most Beautiful</h3>
            </div>

            <div className="home-empty-sidebar">
              <p>No featured koi yet</p>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
