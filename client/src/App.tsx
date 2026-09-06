import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import KoiVarientList from "./components/admin/KoiVarientList/KoiVarientList";
import AppLayout from "./components/layout/AppLayout";
import Breeding from "./pages/breeding/Breeding";
import Dictionary from "./pages/dictionary/Dictionary";
import Inventory from "./pages/inventory/Inventory";
import TransactionHistory from "./pages/marketplace/TransactionHistory";
import Payment from "./pages/payment/Payment";
import PondLanding from "./pages/pond/PondLanding";
import Shop from "./pages/shop/Shop";
import Landing from "./pages/landing/Landing";
import Marketplace from "./pages/marketplace/Marketplace";
import MarketAddList from "./pages/marketplace/SellKoi";
import MarketListing from "./pages/marketplace/MyListings";
import Profile from "./pages/profile/Profile";
import Home from "./pages/home/Home";
import { useAuth } from "./context/AuthContext";
import type { ReactNode } from "react";
import "./style/global.css";

function RequireAuth({ children }: { children: ReactNode }) {
	const { currentUser, loading } = useAuth();

	if (loading) {
		return (
			<main className="auth-loading-screen" role="status" aria-live="polite">
				<div className="auth-loading-card">
					<span className="auth-loading-fish" aria-hidden="true">🐟</span>
					<h1>Returning to your sanctuary</h1>
					<p>Checking your session...</p>
				</div>
			</main>
		);
	}
	if (!currentUser) return <Navigate to="/login" replace />;

	return children;
}

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route
						element={
							<RequireAuth>
								<AppLayout />
							</RequireAuth>
						}
					>
						<Route path="/home" element={<Home />} />
						<Route path="/shop" element={<Shop />} />
						<Route path="/inventory" element={<Inventory />} />
						<Route path="/marketplace" element={<Marketplace />} />
						<Route path="/sell" element={<MarketAddList />} />
						<Route path="/buy" element={<MarketListing />} />
						<Route path="/profile" element={<Profile />} />
						<Route path="/profile/:userId" element={<Profile />} />
						<Route
							path="/transactions"
							element={<TransactionHistory />}
						/>
					</Route>

					<Route
						path="/admin/dictionary"
						element={
							<RequireAuth>
								<KoiVarientList />
							</RequireAuth>
						}
					/>

					<Route
						path="/pond"
						element={<RequireAuth><PondLanding /></RequireAuth>}
					/>

					<Route
						path="/dictionary"
						element={<RequireAuth><Dictionary /></RequireAuth>}
					/>

					<Route
						path="/breeding"
						element={<RequireAuth><Breeding /></RequireAuth>}
					/>

					<Route
						path="/payment/:itemId"
						element={<RequireAuth><Payment /></RequireAuth>}
					/>
					<Route path="/landing" element={<Landing />} />
					<Route path="/login" element={<Landing initialAuthMode="login" />} />
					<Route path="/register" element={<Landing initialAuthMode="register" />} />

					<Route path="/" element={<Navigate to="/login" replace />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
