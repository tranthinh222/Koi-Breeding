import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import KoiVarientList from "./components/admin/KoiVarientList/KoiVarientList";
import AppLayout from "./components/AppLayout";
import Breeding from "./pages/breeding/Breeding";
import Dictionary from "./pages/dictionary/Dictionary";
import Inventory from "./pages/inventory/Inventory";
import TransactionHistory from "./pages/marketplace/TransactionHistory";
import Payment from "./pages/payment/payment";
import PondLanding from "./pages/pond/PondLanding";
import Shop from "./pages/shop/Shop";
import Landing from "./pages/landing/Landing";
import Marketplace from "./pages/marketplace/Marketplace";
import MarketAddList from "./components/marketplace/MarketAddList";
import MarketListing from "./components/marketplace/MarketListing";
import Profile from "./pages/profile/Profile";
import "./style/global.css";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<AppLayout />}>
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
						element={<KoiVarientList />}
					/>

					<Route path="/pond" element={<PondLanding />} />

					<Route path="/dictionary" element={<Dictionary />} />

					<Route path="/breeding" element={<Breeding />} />

					<Route path="/payment/:itemId" element={<Payment />} />
					<Route path="/landing" element={<Landing />} />
					<Route path="/login" element={<Landing initialAuthMode="login" />} />
					<Route path="/register" element={<Landing initialAuthMode="register" />} />

					<Route path="/" element={<Navigate to="/shop" replace />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
