import React, { useState } from "react";
// import { PageShell } from "./KoiFlowShared";
import "../../style/breeding.css";

type Koi = {
  name: string;
  level: number;
  image: string;
};

const koiPool: Koi[] = [
  {
    name: "Kohaku",
    level: 15,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA2ZTFswHRUWsKdqQRHaFK66F67Xn42ffFTZa7msf6dwPQRY20XqIzHCBVwvm8tFCp4_u9dwBAAfwQ5leeuIlz9gaCkC3sXFnCWqtaVKsdNktbwpx4Vvre7B4Soyh-BgONnjtmdUzZI0sWRNBU9FqfN47NYejp2my49b0USXq38XkFrvFJfd0xOmkpl4t2KSuY0YLAFzRrmowe_JblZI1IsWXtdvImbZX0j5O9f9wQSNS6O33vLXfg6WQ",
  },
  {
    name: "Sanke",
    level: 12,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBjl0uFcnqdx0oF4bfSadDnhM7CmwJPMLGgcCoTJhInWUeduB1j7kRYOtVj6pAbvs_98Eyq_qeRmdDIukmAsPt9r1EcTXPgIXcXXnVD8uNMKfZ3LPBqRdR0E09wgoq03mZVBO5Eok7D1FjpQ3MTYktcfP9N2N3cYxN6wLfcOueUcKHm44QJip6WRMySisVqy5xpy6jnSSaMO5wy7AFUfasRp8qCfe1ukBh9zGyzVHHgOaF5R8n3fG_kA",
  },
];

const discoveries = [
  ["Platinum Ogon", "Uncommon", "2 hours ago", "🐠"],
  ["Showa Sanshoku", "Rare", "Yesterday", "🐟"],
  ["Asagi", "Common", "2 days ago", "🦈"],
];

export default function Breeding() {
  const [parents, setParents] = useState<Array<Koi | null>>([null, null]);
  const [breeding, setBreeding] = useState(false);

  const selectParent = (index: number) => {
    const available = koiPool.find(
      (koi) => !parents.some((p) => p?.name === koi.name),
    );
    if (!available) return;

    setParents((current) => {
      const next = [...current];
      next[index] = available;
      return next;
    });
  };

  const clearParent = (index: number) => {
    setParents((current) => {
      const next = [...current];
      next[index] = null;
      return next;
    });
  };

  const canBreed = parents.every(Boolean);

  return (
    // <PageShell
    //   active="breeding"
    //   title="Breeding"
    //   subtitle="Create the next generation of your koi."
    // >
    <main className="koi-page-content breeding-page">
      <section className="breeding-hero">
        <div className="breeding-hero-copy">
          <span className="home-eyebrow">Koi Breeding</span>
          <h2>Nurture the Next Generation</h2>
          <p>
            Select two compatible koi to breed a new companion for your pond.
            Discover rare patterns and vibrant colors.
          </p>

          <button
            className="home-action-button"
            type="button"
            disabled={!canBreed || breeding}
            onClick={() => setBreeding(true)}
          >
            💗 {breeding ? "Breeding Started" : "Start Breeding"}
          </button>
        </div>

        <div className="breeding-slots">
          {[0, 1].map((index) => {
            const parent = parents[index];

            return (
              <React.Fragment key={index}>
                {index === 1 && <span className="breeding-x">×</span>}

                {parent ? (
                  <button
                    className="breeding-slot selected"
                    type="button"
                    onClick={() => clearParent(index)}
                  >
                    <img src={parent.image} alt={parent.name} />
                    <strong>{parent.name}</strong>
                    <small>Lv. {parent.level}</small>
                  </button>
                ) : (
                  <button
                    className="breeding-slot"
                    type="button"
                    onClick={() => selectParent(index)}
                  >
                    <span className="breeding-add">＋</span>
                    <span>Select Koi</span>
                  </button>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </section>

      <div className="breeding-layout">
        <section className="home-card breeding-incubator">
          <div className="home-card-header">
            <div>
              <span className="home-eyebrow">Incubation</span>
              <h3>Active Incubators</h3>
            </div>
            <strong>1 / 4 Slots Used</strong>
          </div>

          <div className="incubator-card">
            <div className="incubator-koi">🐟</div>
            <div className="incubator-info">
              <strong>Rare Chance</strong>
              <span>Kohaku Lv. 15 × Sanke Lv. 12</span>
              <div className="progress-track">
                <div className="progress-value" style={{ width: "64%" }} />
              </div>
              <small>Hatching in 00:14:32</small>
            </div>
            <button className="home-action-button" type="button">
              ✨
            </button>
          </div>

          <button className="unlock-slot" type="button">
            ＋ Unlock Slot <span>🪙 500 Coins</span>
          </button>
        </section>

        <aside className="home-card discovery-card">
          <div className="home-card-header">
            <div>
              <span className="home-eyebrow">auto_awesome</span>
              <h3>Recent Discoveries</h3>
            </div>
          </div>

          <div className="discovery-list">
            {discoveries.map(([name, rarity, time, emoji]) => (
              <div className="discovery-item" key={name}>
                <div className="discovery-avatar">{emoji}</div>
                <div>
                  <strong>{name}</strong>
                  <p>
                    <span className={`rarity ${rarity.toLowerCase()}`}>
                      {rarity}
                    </span>
                    <span>{time}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="history-button" type="button">
            View Complete History
          </button>
        </aside>
      </div>
    </main>
    // </PageShell>
  );
}
