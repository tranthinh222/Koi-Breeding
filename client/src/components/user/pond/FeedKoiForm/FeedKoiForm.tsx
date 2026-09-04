import { Fish, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CURRENT_USER_ID } from "../../../../api/currentUser";
import { callFetchInventoryByType } from "../../../../api/inventory";
import type { IItemInventory, IKoi } from "../../../../types/backend";
import styles from "./FeedKoiForm.module.css";

interface FeedKoiFormProps {
	koi: IKoi;
	isProcessing: boolean;
	onClose: () => void;
	onSubmit: (food: IItemInventory) => Promise<void>;
}

function FeedKoiForm({
	koi,
	isProcessing,
	onClose,
	onSubmit,
}: FeedKoiFormProps) {
	const [foods, setFoods] = useState<IItemInventory[]>([]);
	const [selectedFood, setSelectedFood] = useState<IItemInventory | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchFoods = async () => {
			try {
				const response = await callFetchInventoryByType(
					CURRENT_USER_ID,
					"FOOD",
				);
				setFoods(response.data.data ?? []);
			} catch (error) {
				console.error("Failed to fetch food inventory:", error);
				setFoods([]);
			} finally {
				setIsLoading(false);
			}
		};

		void fetchFoods();
	}, []);

	return (
		<div className={styles.form} role="dialog" aria-modal="true">
			<button
				type="button"
				className={styles.closeButton}
				onClick={onClose}
				aria-label="Close"
			>
				<X />
			</button>

			<header className={styles.header}>
				<Fish />
				<div>
					<h2>Feed {koi.name}</h2>
					<p>Hunger: {koi.foodBar}/100</p>
				</div>
			</header>

			{isLoading ? (
				<p className={styles.message}>Loading food...</p>
			) : foods.length === 0 ? (
				<p className={styles.message}>There is no food in your inventory.</p>
			) : (
				<div className={styles.foodGrid}>
					{foods.map((food) => (
						<button
							type="button"
							key={food.id}
							className={`${styles.foodCard} ${selectedFood?.id === food.id ? styles.selected : ""}`}
							onClick={() => setSelectedFood(food)}
						>
							{food.image ? (
								<img src={food.image} alt="" />
							) : (
								<span className={styles.foodIcon}>🍤</span>
							)}
							<span>{food.name}</span>
							<small>+{food.effectValue} · x{food.quantity}</small>
						</button>
					))}
				</div>
			)}

			<button
				type="button"
				className={styles.feedButton}
				disabled={!selectedFood || isProcessing || koi.foodBar >= 100}
				onClick={() => selectedFood && void onSubmit(selectedFood)}
			>
				{isProcessing ? "Feeding..." : koi.foodBar >= 100 ? "Koi is full" : "Feed now"}
			</button>
		</div>
	);
}

export default FeedKoiForm;
