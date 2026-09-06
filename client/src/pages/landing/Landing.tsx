import { useState } from "react";

import ShopBackground from "../../components/user/ShopBackground";
import ShopNavigation from "../../components/user/ShopNavigation";
import AuthModal from "../../components/auth/AuthModal";

import "./Landing.css";

type AuthMode = "login" | "register";

type AuthActions = {
	onLogin: () => void;
	onRegister: () => void;
};

function Header({ onLogin, onRegister }: AuthActions) {
	return (
		<header className="navbar">
			<div className="navbar-left">
				<div className="brand">
					<img
						className="header-logo"
						src="/landing/logo.png"
						alt="logo"
					/>
				</div>
			</div>

			<div className="navbar-right">
				<button className="btn-outline" onClick={onLogin}>
					Login
				</button>

				<button className="btn-primary" onClick={onRegister}>
					Play Now
				</button>
			</div>
		</header>
	);
}

function Hero() {
	return (
		<section className="hero-section">
			<div className="hero-copy">
				<img src="/landing/logo.png" alt="logo" />
				<p>A peaceful koi pond breeding & collecting game</p>
			</div>
		</section>
	);
}

function Content({ onLogin, onRegister }: AuthActions) {
	return (
		<main className="home-content">
			<article className="game-info">
				<h2>About Koi Garden</h2>

				<p>
					Koi Garden is a relaxing game where you breed, collect and
					care for beautiful koi fish in a calm pond environment.
				</p>

				<ul>
					<li>Raise unique koi with evolving patterns and genes.</li>
					<li>
						Collect rare fish and build your personal koi sanctuary.
					</li>
					<li>Explore seasonal events and peaceful pond gameplay.</li>
					<li>Share koi codes and discover new koi with friends.</li>
				</ul>
			</article>

			<aside className="action-panel">
				<button className="btn-login" onClick={onLogin}>
					Login
				</button>

				<button className="btn-play" onClick={onRegister}>
					Play Now
				</button>
			</aside>
		</main>
	);
}

function MediaTeam() {
	return (
		<section className="media-team-section">
			<div className="media-left">
				<div className="section-heading">
					<h2>Trailer and Screenshots</h2>
				</div>

				<div className="screenshot-grid screenshot-grid-large">
					<div className="screenshot-item">
						<img
							src="/landing/koi_1.png"
							alt="Ảnh chụp màn hình 1"
						/>
					</div>

					<div className="screenshot-item">
						<img
							src="/landing/koi_2.png"
							alt="Ảnh chụp màn hình 2"
						/>
					</div>

					<div className="screenshot-item">
						<img
							src="/landing/koi_3.png"
							alt="Ảnh chụp màn hình 3"
						/>
					</div>

					<div className="screenshot-item">
						<img
							src="/landing/koi_4.png"
							alt="Ảnh chụp màn hình 4"
						/>
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
						<p>
							Core game design, pond systems, and koi genetics.
						</p>
					</div>

					<div className="team-item">
						<h3>Visual Arts</h3>
						<p>
							Art direction, animations, and UI styling.
						</p>
					</div>

					<div className="team-item">
						<h3>Community & Events</h3>
						<p>
							Seasonal updates, player engagement, and social
							features.
						</p>
					</div>

					<div className="team-item">
						<h3>QA & Support</h3>
						<p>
							Quality testing and friendly player support.
						</p>
					</div>
				</div>
			</aside>
		</section>
	);
}

function Landing() {
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

	const closeAuthModal = () => {
		setAuthOpen(false);
	};

	return (
		<>
			<ShopBackground />

			<div className="body">
				<Header
					onLogin={openLogin}
					onRegister={openRegister}
				/>

				<ShopNavigation />

				<Hero />

				<Content
					onLogin={openLogin}
					onRegister={openRegister}
				/>

				<MediaTeam />
			</div>

			{authOpen && (
				<AuthModal
					isOpen={authOpen}
					mode={authMode}
					onClose={closeAuthModal}
					onSwitchMode={setAuthMode}
				/>
			)}
		</>
	);
}

export default Landing;