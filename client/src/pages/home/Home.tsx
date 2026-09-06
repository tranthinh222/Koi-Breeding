import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getPonds } from "../../api/pond";
import { getBalanceWallet } from "../../api/wallet";
import PondsIcon from "../../assets/icons/water.svg";
import ShopIcon from "../../assets/icons/shop.svg";
import StoreIcon from "../../assets/icons/storefront.svg";
import { useAuth } from "../../context/AuthContext";
import type { IPond } from "../../types/backend";

import "../../style/global.css";
import "./Home.css";

type HomeData = {
  balance: number;
  ponds: IPond[];
};

const getLevel = (exp = 0) => Math.max(1, Math.floor(exp / 100));

export default function Home() {
  const { currentUser, currentUserId } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState<HomeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadHome = async () => {
      if (!currentUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const [wallet, pondPage] = await Promise.all([
          getBalanceWallet(currentUserId),
          getPonds(0, 100, currentUserId),
        ]);

        if (!cancelled) {
          setData({
            balance: wallet.balance,
            ponds: pondPage.result.filter(
              (pond) => pond.owner?.id === currentUserId,
            ),
          });
        }
      } catch (requestError) {
        console.error("Failed to load home:", requestError);
        if (!cancelled) setError("We could not load your sanctuary.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadHome();
    return () => {
      cancelled = true;
    };
  }, [currentUserId, refreshKey]);

  const ponds = data?.ponds ?? [];
  const totalKoi = useMemo(
    () => ponds.reduce((total, pond) => total + (pond.currentQuantity ?? 0), 0),
    [ponds],
  );
  const activePond = ponds[0] ?? null;
  const exp = currentUser?.exp ?? 0;
  const expProgress = Math.max(0, Math.min(100, exp % 100));

  const nextStep = !activePond
    ? {
        icon: "🌊",
        title: "Create your first pond",
        description: "A pond is the foundation of your koi sanctuary.",
        action: "Go to My Ponds",
        onClick: () => navigate("/pond"),
      }
    : totalKoi === 0
      ? {
          icon: "🐟",
          title: "Add your first koi",
          description: "Visit the Shop, purchase a koi, then place it in your starter pond.",
          action: "Visit the Shop",
          onClick: () => navigate("/shop"),
        }
      : totalKoi < 2
        ? {
            icon: "🌱",
            title: "Grow your collection",
            description: "Care for your koi and add another fish when you are ready.",
            action: "Open My Pond",
            onClick: () => navigate("/pond", { state: { openPond: activePond } }),
          }
        : {
            icon: "♥",
            title: "Ready for breeding",
            description: "Choose two compatible adult koi and start a breeding event.",
            action: "Open Breeding Lab",
            onClick: () => navigate("/breeding"),
          };

  if (loading) {
    return <main className="home-body"><div className="home-status-card"><span>🐟</span><h2>Loading your sanctuary...</h2></div></main>;
  }

  if (error || !data || !currentUser) {
    return (
      <main className="home-body">
        <div className="home-status-card error">
          <span>⚠️</span>
          <h2>Sanctuary unavailable</h2>
          <p>{error ?? "Your account information is unavailable."}</p>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)}>Try Again</button>
        </div>
      </main>
    );
  }

  return (
    <main className="home-body home-dashboard">
      <section className="home-welcome">
        <div>
          <span className="home-eyebrow">Koi Sanctuary</span>
          <h1>Welcome back, {currentUser.username}</h1>
          <p>Here is what is happening in your sanctuary today.</p>
        </div>
        <button type="button" onClick={() => navigate("/profile")}>View Profile</button>
      </section>

      <section className="home-overview" aria-label="Sanctuary overview">
        <article className="home-overview-card">
          <span className="home-overview-icon">🪙</span>
          <div><small>Koins</small><strong>{data.balance.toLocaleString("en-US")}</strong></div>
        </article>
        <article className="home-overview-card">
          <span className="home-overview-icon"><img src={PondsIcon} alt="" /></span>
          <div><small>Ponds</small><strong>{ponds.length}</strong></div>
        </article>
        <article className="home-overview-card">
          <span className="home-overview-icon">🐟</span>
          <div><small>Koi</small><strong>{totalKoi}</strong></div>
        </article>
        <article className="home-overview-card level-card">
          <span className="home-overview-icon">⭐</span>
          <div className="home-level-summary">
            <small>Level {getLevel(exp)}</small>
            <strong>{expProgress} / 100 EXP</strong>
            <div className="home-exp-track"><span style={{ width: `${expProgress}%` }} /></div>
          </div>
        </article>
      </section>

      <section className="home-focus-grid">
        <article className="home-panel home-continue-panel">
          <div className="home-panel-heading">
            <div><span className="home-eyebrow">Continue Playing</span><h2>{activePond ? "Your current pond" : "Start your sanctuary"}</h2></div>
            {ponds.length > 1 && <button type="button" className="home-text-button" onClick={() => navigate("/pond")}>View all ponds</button>}
          </div>

          {activePond ? (
            <div className="home-active-pond">
              <div className="home-pond-visual"><img src={PondsIcon} alt="" /><span>Level {activePond.level}</span></div>
              <div className="home-pond-summary">
                <h3>{activePond.name}</h3>
                <p>{activePond.description || "Your peaceful home for raising koi."}</p>
                <div className="home-pond-metrics">
                  <span><small>Koi</small><strong>{activePond.currentQuantity}/{activePond.capacity}</strong></span>
                  <span><small>Water</small><strong>{activePond.waterQuality}%</strong></span>
                  <span><small>Temperature</small><strong>{Number(activePond.temperature).toFixed(1)}°C</strong></span>
                  <span><small>Environment</small><strong>{activePond.environmentScore}/100</strong></span>
                </div>
                <button type="button" className="home-primary-button" onClick={() => navigate("/pond", { state: { openPond: activePond } })}>Open Pond</button>
              </div>
            </div>
          ) : (
            <div className="home-panel-empty"><span>🌊</span><h3>No pond available</h3><p>Create a pond to begin raising koi.</p><button type="button" className="home-primary-button" onClick={() => navigate("/pond")}>Go to My Ponds</button></div>
          )}
        </article>

        <aside className="home-panel home-next-step">
          <span className="home-eyebrow">Recommended Next Step</span>
          <div className="home-next-icon">{nextStep.icon}</div>
          <h2>{nextStep.title}</h2>
          <p>{nextStep.description}</p>
          <button type="button" className="home-primary-button" onClick={nextStep.onClick}>{nextStep.action}</button>
        </aside>
      </section>

      <section className="home-shortcuts">
        <button type="button" onClick={() => navigate("/shop")}><img src={StoreIcon} alt="" /><span><strong>Shop</strong><small>Food, medicine and koi</small></span><b>→</b></button>
        <button type="button" onClick={() => navigate("/marketplace")}><img src={ShopIcon} alt="" /><span><strong>Marketplace</strong><small>Buy and sell with keepers</small></span><b>→</b></button>
        <button type="button" onClick={() => navigate("/inventory")}><span className="home-shortcut-emoji">🎒</span><span><strong>Inventory</strong><small>Manage your supplies</small></span><b>→</b></button>
      </section>
    </main>
  );
}
