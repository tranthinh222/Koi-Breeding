import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import KoiVarientList from "./components/admin/KoiVarientList/KoiVarientList";
import AppLayout from "./components/AppLayout";
import Dictionary from "./pages/dictionary/Dictionary";
import Inventory from "./pages/inventory/Inventory";
import TransactionHistory from "./pages/marketplace/TransactionHistory";
import Payment from "./pages/payment/payment";
import Pond from "./pages/pond/Pond";
import Shop from "./pages/shop/Shop";
import "./style/global.css";

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route element={<AppLayout />}>
						<Route path="/shop" element={<Shop />} />
						<Route path="/inventory" element={<Inventory />} />
						<Route
							path="/transactions"
							element={<TransactionHistory />}
						/>
					</Route>

					<Route
						path="/admin/dictionary"
						element={<KoiVarientList />}
					/>

					<Route path="/pond" element={<Pond />} />

					<Route path="/dictionary" element={<Dictionary />} />

					<Route path="/payment/:itemId" element={<Payment />} />

					<Route path="/" element={<Navigate to="/shop" replace />} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;
