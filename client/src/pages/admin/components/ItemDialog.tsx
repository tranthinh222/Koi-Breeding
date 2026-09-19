import { Upload, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "../../../components/shared/Toast/toast";
import ImageEditor from "../../profile/ImageEditor";

import {
	addAdminItem,
	updateAdminItem,
	uploadAdminItemImage,
	type AdminItem,
} from "../../../api/admin";

import { callFetchKoiVarient } from "../../../api/koiDictionary";
import "./ItemDialog.css";

interface ItemDialogProps {
	mode: "add" | "edit";
	item?: AdminItem | null;
	onClose: () => void;
	onSuccess: () => void;
}

export default function ItemDialog({
	mode,
	item,
	onClose,
	onSuccess,
}: ItemDialogProps) {
	const [imageUrl, setImageUrl] = useState("");
	const [nameItem, setNameItem] = useState("");
	const [description, setDescription] = useState("");
	const [itemType, setItemType] = useState("FOOD");
	const [price, setPrice] = useState<number>(0);
	const [effectType, setEffectType] = useState("GROWTH");
	const [effectValue, setEffectValue] = useState("");
	const [dictionaryOptions, setDictionaryOptions] = useState<
		{ id: number; name: string; description?: string; imageUrl?: string }[]
	>([]);
	const [dictionaryLoading, setDictionaryLoading] = useState(false);
	const [dictionaryError, setDictionaryError] = useState("");
	const [dictionaryRetry, setDictionaryRetry] = useState(0);

	useEffect(() => {
		if (itemType !== "KOI") return;
		let cancelled = false;
		setDictionaryLoading(true);
		setDictionaryError("");
		setDictionaryOptions([]);
		const load = async () => {
			try {
				const options: {
					id: number;
					name: string;
					description?: string;
					imageUrl?: string;
				}[] = [];
				let page = 0;
				let totalPages = 1;
				do {
					const response = await callFetchKoiVarient(
						`page=${page}&size=100&sort=id,asc`,
					);
					if (cancelled) return;
					const data = response.data.data;
					if (!data) throw new Error("Missing dictionary data");
					for (const entry of data.result) {
						if (entry.id != null)
							options.push({
								id: entry.id,
								name: entry.name,
								description: entry.variety?.description,
								imageUrl: entry.imageUrl,
							});
					}
					totalPages = data.meta.totalPages;
					page++;
				} while (page < totalPages);
				setDictionaryOptions(options);
			} catch {
				if (!cancelled)
					setDictionaryError("Unable to load Dictionary entries.");
			} finally {
				if (!cancelled) setDictionaryLoading(false);
			}
		};
		void load();
		return () => {
			cancelled = true;
		};
	}, [itemType, dictionaryRetry]);

	const selectedDictionary =
		itemType === "KOI"
			? dictionaryOptions.find(
					(entry) => entry.id === Number(effectValue),
				)
			: undefined;
	const itemImageUrl =
		itemType === "KOI" ? (selectedDictionary?.imageUrl ?? "") : imageUrl;

	const [loading, setLoading] = useState(false);
	const [uploading, setUploading] = useState(false);
	const [selectedImage, setSelectedImage] = useState<string | null>(null);

	// =========================
	// FILL DATA KHI EDIT
	// =========================
	useEffect(() => {
		if (mode === "edit" && item) {
			setImageUrl(item.imageUrl || "");
			setNameItem(item.nameItem || "");
			setDescription(item.description || "");
			setItemType(item.itemType || "FOOD");
			setPrice(item.price || 0);
			setEffectType(item.effectType || "GROWTH");
			setEffectValue(
				item.effectValue == null ? "" : String(item.effectValue),
			);
		}

		// Reset form khi Add
		if (mode === "add") {
			setImageUrl("");
			setNameItem("");
			setDescription("");
			setItemType("FOOD");
			setPrice(0);
			setEffectType("GROWTH");
			setEffectValue("");
		}
	}, [mode, item]);

	// =========================
	// IMAGE
	// =========================
	const closePreview = () => {
		if (selectedImage) URL.revokeObjectURL(selectedImage);
		setSelectedImage(null);
	};

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];

		if (!file) return;

		if (!file.type.startsWith("image/")) {
			toast.error("Please choose a valid image file.");
			e.target.value = "";
			return;
		}
		if (file.size > 10 * 1024 * 1024) {
			toast.error("The image must be smaller than 10 MB.");
			e.target.value = "";
			return;
		}

		setSelectedImage(URL.createObjectURL(file));
		e.target.value = "";
	};

	const handlePreviewSave = async (blob: Blob) => {
		setUploading(true);
		try {
			const file = new File([blob], `admin-item-${Date.now()}.jpg`, {
				type: "image/jpeg",
			});
			const uploadedUrl = await uploadAdminItemImage(file);
			setImageUrl(uploadedUrl);
			toast.success("Image uploaded successfully.");
		} catch (error: any) {
			console.error("Upload image failed:", error);
			setImageUrl(item?.imageUrl ?? "");
			toast.error(
				error?.response?.data?.message ??
					error?.message ??
					"Unable to upload the image. Please try again.",
			);
		} finally {
			setUploading(false);
			closePreview();
		}
	};

	// =========================
	// SUBMIT
	// =========================
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		const value = Number(effectValue);
		if (
			itemType === "KOI" &&
			(dictionaryLoading ||
				dictionaryError ||
				!dictionaryOptions.some((entry) => entry.id === value))
		) {
			toast.error("Please select an available Dictionary entry.");
			return;
		}
		if (
			!effectValue.trim() ||
			!Number.isFinite(value) ||
			value < 0 ||
			value > 99999999.99 ||
			!/^\d+(\.\d{1,2})?$/.test(effectValue)
		) {
			toast.error(
				"Enter an effect value from 0 to 99,999,999.99 with at most 2 decimal places.",
			);
			return;
		}

		try {
			if (uploading) return;
			setLoading(true);

			const itemData = {
				imageUrl: itemImageUrl,
				nameItem,
				description,
				itemType,
				price,
				effectType,
				effectValue: value,
			};

			if (mode === "add") {
				await addAdminItem(itemData);
				alert("Item created successfully.");
			}

			if (mode === "edit" && item) {
				await updateAdminItem(item.id, itemData);
				alert("Item updated successfully.");
			}

			onSuccess();
			onClose();
		} catch (error) {
			console.error("Item operation failed:", error);

			alert(
				mode === "add"
					? "Unable to create the item."
					: "Unable to update the item.",
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<>
			<div className="dialog-overlay item-dialog-overlay">
				<div className="add-item-dialog">
					{/* HEADER */}
					<div className="dialog-header">
						<div>
							<h2>
								{mode === "add" ? "Add New Item" : "Edit Item"}
							</h2>

							<p>
								{mode === "add"
									? "Add a new item to the shop catalog"
									: "Update item details"}
							</p>
						</div>

						<button
							type="button"
							className="dialog-close"
							onClick={onClose}
						>
							<X size={20} />
						</button>
					</div>

					<form onSubmit={handleSubmit}>
						<div className="dialog-body">
							{/* IMAGE */}
							<div className="form-group">
								<label>Image</label>

								<div className="image-upload-area">
									{itemImageUrl ? (
										<img
											src={itemImageUrl}
											alt="Preview"
											className="image-preview"
										/>
									) : (
										<div className="image-placeholder">
											<Upload size={32} />
											<span>
												{itemType === "KOI"
													? dictionaryLoading
														? "Loading Dictionary image…"
														: selectedDictionary
															? "This Dictionary entry has no image"
															: "Select a Dictionary entry to display its image"
													: "Upload Image"}
											</span>
										</div>
									)}

									<input
										type="file"
										accept="image/jpeg,image/png,image/webp,image/svg+xml"
										onChange={handleImageChange}
										disabled={
											uploading ||
											loading ||
											itemType === "KOI"
										}
									/>
									{uploading && (
										<div className="image-upload-status">
											Uploading image…
										</div>
									)}
								</div>
							</div>

							{/* NAME */}
							<div className="form-group">
								<label>Item name</label>

								<input
									type="text"
									value={nameItem}
									onChange={(e) =>
										setNameItem(e.target.value)
									}
									placeholder="Enter an item name"
									required
								/>
							</div>

							{/* DESCRIPTION */}
							<div className="form-group">
								<label>Description</label>

								<textarea
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									placeholder="Describe the item"
									rows={3}
								/>
							</div>

							<div className="form-row">
								{/* TYPE */}
								<div className="form-group">
									<label>Item category</label>

									<select
										value={itemType}
										onChange={(e) => {
											if (
												itemType === "KOI" &&
												e.target.value !== "KOI"
											) {
												setNameItem("");
												setDescription("");
												setEffectType("GROWTH");
											}
											setItemType(e.target.value);
											setEffectValue("");
										}}
									>
										<option value="FOOD">FOOD</option>
										<option value="KOI">KOI</option>
										<option value="MEDICINE">
											MEDICINE
										</option>
										<option value="CURRENCY">
											CURRENCY
										</option>
									</select>
								</div>

								{/* PRICE */}
								<div className="form-group">
									<label>Price</label>

									<input
										type="number"
										min="0"
										value={price}
										onChange={(e) =>
											setPrice(Number(e.target.value))
										}
										required
									/>
								</div>
							</div>

							<div
								className={
									itemType === "KOI" ? "form-row" : undefined
								}
							>
								{itemType === "KOI" && (
									<div className="form-group">
										<label htmlFor="item-dictionary">
											Dictionary
										</label>
										<select
											id="item-dictionary"
											required
											value={
												dictionaryOptions.some(
													(entry) =>
														String(entry.id) ===
														effectValue,
												)
													? effectValue
													: ""
											}
											disabled={
												dictionaryLoading ||
												!!dictionaryError
											}
											onChange={(event) => {
												setEffectValue(
													event.target.value,
												);
												if (
													event.target.value
														.length !== 0
												) {
													const id =
														event.target.value;
													const target =
														dictionaryOptions.find(
															(entry) =>
																String(
																	entry.id,
																) === id,
														);
													setNameItem(
														target
															? `Koi - ${target.name}`
															: "",
													);
													setDescription(
														target
															? (target.description ??
																	"")
															: "",
													);
													setEffectType("OTHER");
												}
											}}
										>
											<option value="">
												{dictionaryLoading
													? "Loading Dictionary…"
													: "Select a koi variety"}
											</option>
											{dictionaryOptions.map((entry) => (
												<option
													key={entry.id}
													value={entry.id}
												>
													{entry.id} — {entry.name}
												</option>
											))}
										</select>
										{dictionaryError ? (
											<div role="alert">
												{dictionaryError}{" "}
												<button
													type="button"
													className="cancel-button"
													onClick={() =>
														setDictionaryRetry(
															(value) =>
																value + 1,
														)
													}
												>
													Retry
												</button>
											</div>
										) : !dictionaryLoading &&
										  dictionaryOptions.length === 0 ? (
											<small>
												No Dictionary entries available.
												Create one first.
											</small>
										) : !dictionaryLoading &&
										  effectValue &&
										  !dictionaryOptions.some(
												(entry) =>
													String(entry.id) ===
													effectValue,
										  ) ? (
											<small role="alert">
												The saved Dictionary ID is
												unavailable. Select another
												entry.
											</small>
										) : null}
									</div>
								)}
								<div className="form-group">
									<label htmlFor="item-effect-value">
										Effect value
									</label>
									<input
										id="item-effect-value"
										type="number"
										min="0"
										max="99999999.99"
										step="0.01"
										required
										value={effectValue}
										readOnly={itemType === "KOI"}
										aria-describedby="item-effect-value-help"
										onChange={(event) =>
											setEffectValue(event.target.value)
										}
									/>
									<small id="item-effect-value-help">
										{itemType === "KOI"
											? "Automatically filled from the selected Dictionary entry."
											: itemType === "CURRENCY"
												? "Number of Koins granted per purchase."
												: itemType === "MEDICINE"
													? "Amount restored per use (HP for HEALTH medicine)."
													: "Amount of the selected effect per unit (food restores the food bar)."}
									</small>
								</div>
							</div>

							{/* EFFECT */}
							<div className="form-group">
								<label>Effect Type</label>

								<select
									value={effectType}
									onChange={(e) =>
										setEffectType(e.target.value)
									}
								>
									<option value="GROWTH">GROWTH</option>
									<option value="HEALTH">HEALTH</option>
									<option value="WATER_QUALITY">
										WATER QUALITY
									</option>
									<option value="COOLING">COOLING</option>
									<option value="HEATING">HEATING</option>
									<option value="MUTATION">MUTATION</option>
									<option value="OTHER">OTHER</option>
								</select>
							</div>
						</div>

						{/* FOOTER */}
						<div className="dialog-footer">
							<button
								type="button"
								className="cancel-button"
								onClick={onClose}
							>
								Cancel
							</button>

							<button
								type="submit"
								className="primary-button"
								disabled={
									loading ||
									uploading ||
									(itemType === "KOI" &&
										(dictionaryLoading ||
											!!dictionaryError ||
											!dictionaryOptions.some(
												(entry) =>
													entry.id ===
													Number(effectValue),
											)))
								}
							>
								{loading
									? mode === "add"
										? "Adding..."
										: "Updating..."
									: mode === "add"
										? "Add Item"
										: "Update Item"}
							</button>
						</div>
					</form>
				</div>
			</div>
			{selectedImage && (
				<ImageEditor
					image={selectedImage}
					title="Preview item image"
					cropShape="rect"
					aspect={1}
					onCancel={closePreview}
					onSave={(blob) => void handlePreviewSave(blob)}
				/>
			)}
		</>
	);
}
