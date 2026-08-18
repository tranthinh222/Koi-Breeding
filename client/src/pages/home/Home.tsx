import { useState } from "react";
import "../../style/global.css";

import AuthModal from "../../components/auth/AuthModal";

type AuthMode = "login" | "register";

export default function Home() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  const openLogin = () => {
    setAuthMode("login");
    setAuthOpen(true);
  };

  const openRegister = () => {
    setAuthMode("register");
    setAuthOpen(true);
  };

  return (
    <>
      <section className="title-section">
        <div className="wood-sign">
          <h1>HOME</h1>
          <p>Welcome to Koi Garden!</p>
        </div>
      </section>

      <main className="home-content">
        <article className="game-info">
          <h2>About Koi Garden</h2>
          <p>
            Koi Garden is a relaxing game where you breed, collect and care for
            beautiful koi fish in a calm pond environment.
          </p>
          <ul>
            <li>Raise unique koi with evolving patterns and genes.</li>
            <li>Collect rare fish and build your personal koi sanctuary.</li>
            <li>Explore seasonal events and peaceful pond gameplay.</li>
            <li>Share koi codes and discover new koi with friends.</li>
          </ul>
        </article>

        <aside className="action-panel">
          <button className="btn-login" onClick={openLogin}>
            Login
          </button>
          <button className="btn-login" onClick={openRegister}>
            Sign Up
          </button>
          <button className="btn-play">Play Now</button>
        </aside>
      </main>

      {/* ========================= */}
      {/* Media & Team */}
      {/* ========================= */}

      <section className="media-team-section">
        <div className="media-left">
          <div className="section-heading">
            <h2>Trailer and Screenshots</h2>
          </div>

          <div className="screenshot-grid screenshot-grid-large">
            <div className="screenshot-item">
              <img src="/images/koi_1.png" alt="Ảnh chụp màn hình 1" />
            </div>
            <div className="screenshot-item">
              <img src="/images/koi_2.png" alt="Ảnh chụp màn hình 2" />
            </div>
            <div className="screenshot-item">
              <img src="/images/koi_3.png" alt="Ảnh chụp màn hình 3" />
            </div>
            <div className="screenshot-item">
              <img src="/images/koi_4.png" alt="Ảnh chụp màn hình 4" />
            </div>
          </div>
        </div>

        <aside className="media-right">
          <div className="section-heading">
            <h2>Developer Team</h2>
          </div>
          <div className="team-panel">
            <div className="team-item">
              <h3>Koi Garden Studio</h3>
              <p>Core game design, pond systems, and koi genetics.</p>
            </div>
            <div className="team-item">
              <h3>Visual Arts</h3>
              <p>Art direction, animations, and UI styling.</p>
            </div>
            <div className="team-item">
              <h3>Community & Events</h3>
              <p>Seasonal updates, player engagement, and social features.</p>
            </div>
            <div className="team-item">
              <h3>QA & Support</h3>
              <p>Quality testing and friendly player support.</p>
            </div>
          </div>
        </aside>
      </section>

      <AuthModal
        isOpen={authOpen}
        mode={authMode}
        onClose={() => setAuthOpen(false)}
        onSwitchMode={setAuthMode}
      />
    </>
  );
}
