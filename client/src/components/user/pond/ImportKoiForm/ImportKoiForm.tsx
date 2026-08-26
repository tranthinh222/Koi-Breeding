import { Import, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { IInventory } from "../../../../types/backend";
import { toast } from "../../../share/Toast/toast";
import styles from "./ImportKoiForm.module.css";

interface ImportKoiFormProps {
	currentQuantity: number;
	pondCapacity: number;
	onClose: () => void;
	onSubmit: (koiItem: IInventory, quantity: number) => void;
}

function ImportKoiForm({
	currentQuantity,
	pondCapacity,
	onClose,
	onSubmit,
}: ImportKoiFormProps) {
	const [koiItemList, setKoiItemList] = useState<IInventory[]>([]);
	const [selectedItem, setSelectedItem] = useState<IInventory | null>(null);
	const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

	useEffect(() => {
		const fetchData = async () => {
			const data: IInventory[] = await handleFetchUserInventory();
			setKoiItemList(data);
		};

		fetchData();
	}, []);

	const handleFetchUserInventory = async (): Promise<IInventory[]> => {
		return MOCK_KOI_ITEM;
	};

	const handleImport = () => {
		if (
			selectedItem !== null &&
			selectedQuantity + currentQuantity > pondCapacity
		) {
			toast.error(
				`The pond is currently full. You can release exactly ${pondCapacity - currentQuantity} more fish(es).`,
			);

			return;
		}
		if (selectedItem !== null) {
			onSubmit(selectedItem, selectedQuantity);
			onClose();
		}
	};

	return (
		<>
			<form className={styles.form}>
				<button
					type="button"
					className={styles.closeButton}
					onClick={onClose}
					aria-label="Close"
				>
					<X size={30} />
				</button>

				{/* Form Header */}
				<div className={styles.formHeader}>
					<Import />
					<span>Import Koi To Pond</span>
				</div>

				{/* Form Body */}
				<div className={styles.formBody}>
					{/* Item list */}
					<div className={styles.itemGrid}>
						{koiItemList.map((item) => (
							<div
								key={item.id}
								className={`${styles.itemCell} ${selectedItem != null && selectedItem.id === item.id ? styles.selectedCell : ""}`}
								title={item.item?.name}
								onClick={() => {
									if (
										selectedItem != null &&
										selectedItem.id === item.id
									) {
										setSelectedItem(null);
									} else {
										setSelectedItem(item);
									}
								}}
							>
								<img
									src="https://res.cloudinary.com/djmcluh5n/image/upload/v1786629266/uploads/items/cxnccf0exmmyaf0ddf5e.svg"
									alt={item.item?.name}
								/>
								<span title={`x${item.quantity}`}>
									x{item.quantity}
								</span>
							</div>
						))}
					</div>

					{/* Detail Panel */}
					{selectedItem && (
						<aside className={styles.detailCard}>
							<div className={styles.detailTitle}>
								<span>Item Details</span>
							</div>
							<div className={styles.detailContent}>
								<div className={styles.detailImage}>
									<img
										src="https://res.cloudinary.com/djmcluh5n/image/upload/v1786629266/uploads/items/cxnccf0exmmyaf0ddf5e.svg"
										alt={selectedItem?.item?.name}
									/>
								</div>
								<h2>{selectedItem?.item?.name}</h2>
								<div className={styles.itemDescription}>
									{selectedItem?.item?.description
										.split("\n")
										.filter((para) => para.trim() !== "")
										.map((para, index) => (
											<p key={index}>{para}</p>
										))}
								</div>
								<div className={styles.detailQuantity}>
									<div className={styles.quantitySection}>
										<span>Quantity</span>
										<div
											className={styles.quantityModifier}
										>
											<button
												type="button"
												className={
													styles.reduceQuantityButton
												}
												title="reduce"
												disabled={
													1 === selectedQuantity
												}
												onClick={() =>
													setSelectedQuantity(
														(prev) =>
															Math.max(
																1,
																prev - 1,
															),
													)
												}
											>
												<Minus />
											</button>
											<span>{selectedQuantity}</span>
											<button
												type="button"
												className={
													styles.addQuantityButton
												}
												title="add"
												disabled={
													selectedItem.quantity ===
													selectedQuantity
												}
												onClick={() =>
													setSelectedQuantity(
														(prev) =>
															Math.min(
																selectedItem.quantity,
																prev + 1,
															),
													)
												}
											>
												<Plus />
											</button>
										</div>
									</div>
									<input
										min="1"
										max={selectedItem?.quantity}
										step="1"
										className={styles.quantitySlider}
										type="range"
										value={selectedQuantity}
										onChange={(e) => {
											const quantity: number =
												Number.parseInt(e.target.value);
											setSelectedQuantity(quantity);
										}}
									/>
								</div>
								<button
									type="button"
									className={styles.importButton}
									title="use item"
									onClick={handleImport}
								>
									Import x{selectedQuantity}
								</button>
							</div>
						</aside>
					)}
				</div>
			</form>
		</>
	);
}

export default ImportKoiForm;

const MOCK_KOI_ITEM: IInventory[] = [
	{
		id: 1,
		item: {
			id: 1,
			name: "Koi - Kohaku",
			price: 100,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 1,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 2,
		item: {
			id: 2,
			name: "Koi - Menkaburi Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 2,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 3,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 4,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 5,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 6,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 7,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 8,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 9,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 10,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 11,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 12,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 13,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 14,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 15,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 16,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 17,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 18,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 19,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 20,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 21,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 22,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 23,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 24,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 25,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 26,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 27,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 28,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 29,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 30,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
	{
		id: 31,
		item: {
			id: 3,
			name: "Koi - Inazuma Kohaku",
			price: 110,
			usageLimit: 0,
			itemType: "KOI",
			effectType: "GROWTH",
			effectValue: 3,
			description: "Classic white Koi with vivid red Hi markings.",
		},
		quantity: 3,
	},
];
