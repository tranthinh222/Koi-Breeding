import { Import, Minus, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { CURRENT_USER_ID } from "../../../../api/currentUser";
import { callFetchInventoryByType } from "../../../../api/inventory";
import type { IItemInventory } from "../../../../types/backend";
import { toast } from "../../../share/Toast/toast";
import KoiItem from "../../KoiItem/KoiItem";
import styles from "./ImportKoiForm.module.css";

interface ImportKoiFormProps {
	currentQuantity: number;
	pondCapacity: number;
	onClose: () => void;
	onSubmit: (koiItem: IItemInventory, quantity: number) => void;
}

function ImportKoiForm({
	currentQuantity,
	pondCapacity,
	onClose,
	onSubmit,
}: ImportKoiFormProps) {
	const [koiItemList, setKoiItemList] = useState<IItemInventory[]>([]);
	const [selectedItem, setSelectedItem] = useState<IItemInventory | null>(
		null,
	);
	const [selectedQuantity, setSelectedQuantity] = useState<number>(1);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await callFetchInventoryByType(
					CURRENT_USER_ID,
					"KOI",
				);
				const itemList: IItemInventory[] = response.data.data ?? [];

				if (itemList.length > 0) {
					setKoiItemList(itemList);
					return;
				}

				console.info(
					"No item returned by the backend; using frontend sample items.",
				);
				setKoiItemList(createMockItemInventory());
			} catch (error) {
				console.error(
					"Failed to fetch user inventory; using frontend sample items:",
					error,
				);
				setKoiItemList(createMockItemInventory());
			}
		};

		fetchData();
	}, []);

	const createMockItemInventory = (): IItemInventory[] => {
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
								title={item.name}
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
								{/* <img src={`${item.image}`} alt={item.name} /> */}
								<KoiItem
									src={item.image ?? "/kois/koi-empty.pnd"}
									alt={item.name}
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
									{/* <img
										src={`${selectedItem.image}`}
										alt={selectedItem.name}
									/> */}
									<KoiItem
										src={
											selectedItem.image ??
											"/kois/koi-empty.pnd"
										}
										alt={selectedItem.name}
									/>
								</div>
								<h2>{selectedItem.name}</h2>
								<div className={styles.itemDescription}>
									{selectedItem.description
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

const MOCK_KOI_ITEM: IItemInventory[] = [
	{
		id: 1,
		itemId: 1,
		name: "Koi - Kohaku",
		price: 100,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 1,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 2,
		itemId: 2,
		name: "Koi - Menkaburi Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 2,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 3,
		itemId: 3,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 4,
		itemId: 4,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 5,
		itemId: 5,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 6,
		itemId: 6,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 7,
		itemId: 7,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 8,
		itemId: 8,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 9,
		itemId: 9,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
	{
		id: 10,
		itemId: 10,
		name: "Koi - Inazuma Kohaku",
		price: 110,
		itemType: "KOI",
		effectType: "GROWTH",
		effectValue: 3,
		description: "Classic white Koi with vivid red Hi markings.",
		quantity: 3,
	},
];
