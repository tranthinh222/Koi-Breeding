import React, { useEffect, useState } from "react";
import "./HomePage.css";

type User = {
  id: number;
  username: string;
  email?: string;
  birthday?: string;
  exp?: number;
  avatarUrl?: string;
};

type Wallet = { balance: number };

type Pond = {
  id: number;
  name: string;
  level: number;
  currentKoi: number;
  capacity: number;
  waterQuality: number;
};

type HomeResponse = {
  user: User;
  wallet?: Wallet | null;
  pond: Pond | null;
  breeding: any;
  featuredKoi: any[];
};

const TEMP_USER_ID = 1;

const getHomeUserId = () => {
  const idFromUrl = new URLSearchParams(window.location.search).get("id");
  return idFromUrl ?? String(TEMP_USER_ID);
};

const Home: React.FC = () => {
  const [data, setData] = useState<HomeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`/api/v1/home?id=${getHomeUserId()}`);
        if (!res.ok) {
          const message = await res.text();
          throw new Error(message || `HTTP ${res.status}`);
        }
        const json: HomeResponse = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const walletBalance = data?.wallet?.balance ?? 0;
  const koiCount = data?.featuredKoi?.length ?? 0;
  const pondCount = data?.pond ? 1 : 0;
  const profileInitial = data?.user.username.charAt(0).toUpperCase() ?? "U";
  const handleViewProfile = () => {
    window.location.href = `/profile?id=${data?.user.id ?? getHomeUserId()}`;
  };
  return (
    <>
      <main className="home-content">
        <article className="game-info">
          {loading ? (
            <div className="loading-box">Loading profile...</div>
          ) : error ? (
            <div className="error-box">{error}</div>
          ) : data ? (
            <>
              <h2>Welcome back, {data.user.username}!</h2>
              <section className="home-stats">
                <div className="home-stat-card">
                  <span>Wallet</span>
                  <strong>{walletBalance.toLocaleString()}</strong>
                </div>
                <div className="home-stat-card">
                  <span>Koi</span>
                  <strong>{koiCount}</strong>
                </div>
                <div className="home-stat-card">
                  <span>Pond</span>
                  <strong>{pondCount}</strong>
                </div>
              </section>

              <section className="breeding-card">
                <h3>Breeding</h3>
                <div className="breeding-content">
                  <div>
                    <strong>Parent A</strong>
                    <span>Not selected</span>
                  </div>
                  <div>
                    <strong>Parent B</strong>
                    <span>Not selected</span>
                  </div>
                </div>
                <button className="btn-primary breeding-action">
                  Start Breeding
                </button>
              </section>

              <section className="marketplace-card">
                <h3>Marketplace</h3>
                <p> Featured koi will appear here.</p>
              </section>
            </>
          ) : (
            <div className="error-box">No data available.</div>
          )}
        </article>
        <aside className="profile-panel">
          <div className="home-profile-avatar">
            {data?.user.avatarUrl ? (
              <img src={data.user.avatarUrl} alt={data.user.username} />
            ) : (
              <span>{profileInitial}</span>
            )}
          </div>
          <div className="profile-details">
            <p>
              <strong className="username">
                {data?.user.username ?? "Loading..."}
              </strong>
            </p>
            <p className="level"> Level {(data?.user.exp ?? 0) / 100}</p>
          </div>
          <button className="view-profile-button" onClick={handleViewProfile}>
            View Profile
          </button>
        </aside>
      </main>
    </>
  );
};

export default Home;
