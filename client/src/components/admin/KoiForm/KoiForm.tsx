import {
	BanknoteArrowUp,
	ChevronsUp,
	ClockArrowUp,
	CloudUpload,
	Coins,
	Earth,
	Fish,
	RulerDimensionLine,
	Trash2,
	Weight,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
	IKoiVarient,
	IVariety,
	KoiShape,
	ScaleType,
} from "../../../types/backend";
import { toast } from "../Toast/toast";
import styles from "./KoiForm.module.css";

interface KoiFormProps {
	koi: IKoiVarient | null;
	varietyList: IVariety[];
	onClose: () => void;
	onSubmit: (koi: IKoiVarient) => Promise<void>;
}

interface KoiDataForm {
	name: string;
	origin: string;
	variety: Partial<IVariety>;
	scaleType: ScaleType;
	shape: KoiShape;
	baseMaxLength: string;
	baseGrowthRate: string;
	midAge: string;
	alphaWeight: string;
	basePrice: string;
	alphaPrice: string;
}

type KoiFormErrors = Partial<Record<keyof KoiDataForm, string>>;

const scaleTypeList = ["Wagoi", "Doitsu", "Ginrin"];
const shapeList = ["Standard", "Butterfly"];

function KoiForm({ koi, varietyList, onClose, onSubmit }: KoiFormProps) {
	const [form, setForm] = useState<KoiDataForm>({
		name: koi?.name || "",
		origin: koi?.origin || "",
		variety: koi?.variety || varietyList[0],
		scaleType:
			koi?.scaleType || (scaleTypeList[0].toUpperCase() as ScaleType),
		shape: koi?.shape || (shapeList[0].toUpperCase() as KoiShape),
		baseMaxLength: `${koi?.baseMaxLength || ""}`,
		baseGrowthRate: `${koi?.baseGrowthRate || ""}`,
		midAge: `${koi?.midAge || ""}`,
		alphaWeight: `${koi?.alphaWeight || ""}`,
		basePrice: `${koi?.basePrice || ""}`,
		alphaPrice: `${koi?.alphaPrice || ""}`,
	});
	const [errors, setErrors] = useState<KoiFormErrors>({});
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragActive, setIsDragActive] = useState<boolean>(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		return () => {
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
		};
	}, [previewUrl]);

	const handleFile = (file: File) => {
		const validTypes = ["image/jpeg", "image/jpg", "image/png"];
		const maxSize = 10 * 1024 * 1024; // 10MB

		if (!validTypes.includes(file.type)) {
			toast.error("Only JPEG, JPG, PNG formats are allowed!");
			return;
		}

		if (file.size > maxSize) {
			toast.error("File size exceeds 10MB limit!");
			return;
		}

		setImageFile(file);
		setPreviewUrl(URL.createObjectURL(file));
	};

	const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			handleFile(e.target.files[0]);
			setIsDragActive(true);
		}
	};

	const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragActive(true);
	};

	const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragActive(false);
	};

	const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragActive(false);
		if (e.dataTransfer.files && e.dataTransfer.files[0]) {
			handleFile(e.dataTransfer.files[0]);
		}
	};

	const handleRemoveImage = (e: React.MouseEvent) => {
		e.stopPropagation();
		setImageFile(null);
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}

		setPreviewUrl(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const handleSubmit = async () => {
		console.log(`Variety: ${JSON.stringify(form.variety)}`);
		setIsProcessing(true);
		await sleep(1000);
		const fieldErrors: KoiFormErrors = {};
		if (form.name.trim() == "") {
			fieldErrors.name = "Name cannot be blank";
		} else if (form.name.trim().length > 100) {
			fieldErrors.name = "Name length cannot greater than 100 characters";
		}

		if (form.origin.trim() == "") {
			fieldErrors.origin = "Origin cannot be blank";
		} else if (form.origin.trim().length > 100) {
			fieldErrors.name = "Name length cannot greater than 100 characters";
		}

		if (form.baseMaxLength.trim() == "") {
			fieldErrors.baseMaxLength = "Base Max Length cannot be blank";
		} else if (!isNumber(form.baseMaxLength.trim())) {
			fieldErrors.baseMaxLength =
				"Base Max Length must be a positive real number";
		}
		const baseMaxLength = Number.parseFloat(form.baseMaxLength.trim());
		if (baseMaxLength <= 0.0) {
			fieldErrors.baseMaxLength =
				"Base Max Length must be a positive real number";
		}

		if (form.baseGrowthRate.trim() == "") {
			fieldErrors.baseGrowthRate = "Base Growth Rate cannot be blank";
		} else if (!isNumber(form.baseGrowthRate.trim())) {
			fieldErrors.baseGrowthRate =
				"Base Growth Rate must be a positive real number";
		}
		const baseGrowthRate = Number.parseFloat(form.baseGrowthRate.trim());
		if (baseGrowthRate < 0.01 || baseGrowthRate > 0.02) {
			fieldErrors.baseGrowthRate =
				"Base Growth Rate must be in range 0.01 ~ 0.02";
		}

		if (form.midAge.trim() == "") {
			fieldErrors.midAge = "Mid Age cannot be blank";
		} else if (!isInteger(form.midAge.trim())) {
			fieldErrors.midAge = "Mid Age must be a positive integer";
		}
		const midAge = Number.parseInt(form.midAge.trim());
		if (midAge < 1 || midAge > 1000) {
			fieldErrors.midAge = "Mid Age must be in range 1 ~ 1000";
		}

		if (form.alphaWeight.trim() == "") {
			fieldErrors.alphaWeight = "Alpha Weight cannot be blank";
		} else if (!isNumber(form.alphaWeight.trim())) {
			fieldErrors.alphaWeight =
				"Alpha Weight must be a positive real number";
		}
		const alphaWeight = Number.parseFloat(form.alphaWeight.trim());
		if (alphaWeight < 0.00001 || alphaWeight > 0.00002) {
			fieldErrors.alphaWeight =
				"Alpha Weight must be in range 0.00001 ~ 0.00002";
		}

		if (form.basePrice.trim() == "") {
			fieldErrors.basePrice = "Base Price cannot be blank";
		} else if (!isInteger(form.basePrice.trim())) {
			fieldErrors.basePrice = "Base Price must be a positive integer";
		}
		const basePrice = Number.parseInt(form.basePrice.trim());
		if (basePrice < 1) {
			fieldErrors.basePrice = "Base Price must be in range 1 ~ 1000";
		}

		if (form.alphaPrice.trim() == "") {
			fieldErrors.alphaPrice = "Alpha Price cannot be blank";
		} else if (!isNumber(form.alphaPrice.trim())) {
			fieldErrors.alphaPrice =
				"Alpha Price must be a positive real number";
		}
		const alphaPrice = Number.parseFloat(form.alphaPrice.trim());
		if (alphaPrice < 1.5 || alphaPrice > 2.0) {
			fieldErrors.alphaPrice = "Alpha Price must be in range 1.5 ~ 2.0";
		}

		setErrors(fieldErrors);

		if (Object.keys(fieldErrors).length > 0) {
			setIsProcessing(false);
			return;
		}

		await onSubmit({
			name: form.name,
			origin: form.origin,
			variety: {
				id: form.variety.id,
				name: form.variety.name as string,
				description: form.variety.description as string,
			},
			scaleType: form.scaleType,
			shape: form.shape,
			baseMaxLength: baseMaxLength,
			baseGrowthRate: baseGrowthRate,
			midAge: midAge,
			alphaWeight: alphaWeight,
			basePrice: basePrice,
			alphaPrice: alphaPrice,
		});

		setIsProcessing(false);

		onClose();
	};

	const isInteger = (value: string): boolean => {
		return /^-?\d+$/.test(value);
	};

	const isNumber = (value: string): boolean => {
		return /^-?\d+(\.\d+)?$/.test(value);
	};

	const clearError = (field: keyof KoiDataForm) => {
		setErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	return (
		<div className={styles.form}>
			<button
				type="button"
				className={styles.closeButton}
				onClick={onClose}
				aria-label="Close"
			>
				<X size={30} />
			</button>
			<span className={styles.title}>
				{koi != null ? `Update Koi #${koi.id}` : "Create A New Koi"}
			</span>

			<div className={styles.body}>
				<div className={styles.couple}>
					<div className={styles.firstCouple}>
						<div className={styles.textField}>
							<span className={styles.label}>Name</span>
							<div className={styles.inputWrapper}>
								<Fish size="30" color="#377394" />
								<input
									type="text"
									placeholder="ex. Kuchibeni Kohaku"
									value={form.name}
									disabled={isProcessing}
									className={`${styles.input} ${
										errors.name ? styles.inputError : ""
									}`}
									onChange={(e) => {
										setForm((prev) => ({
											...prev,
											name: e.target.value,
										}));

										clearError("name");
									}}
								/>
							</div>
							{errors.name && (
								<span className={styles.error}>
									{errors.name}
								</span>
							)}
						</div>
						<div className={styles.textField}>
							<span className={styles.label}>Origin</span>
							<div className={styles.inputWrapper}>
								<Earth size="30" color="#096649" />
								<input
									type="text"
									placeholder="ex. Japan"
									value={form.origin}
									disabled={isProcessing}
									className={`${styles.input} ${
										errors.origin ? styles.inputError : ""
									}`}
									onChange={(e) => {
										setForm((prev) => ({
											...prev,
											origin: e.target.value,
										}));

										clearError("origin");
									}}
								/>
							</div>
							{errors.origin && (
								<span className={styles.error}>
									{errors.origin}
								</span>
							)}
						</div>
					</div>
					<div
						className={`${styles.upload} ${isDragActive ? styles.dragActive : ""}`}
						onDragOver={onDragOver}
						onDragLeave={onDragLeave}
						onDrop={onDrop}
						onClick={() => fileInputRef.current?.click()}
					>
						<input
							type="file"
							accept="image/jpeg, image/jpg, image/png"
							hidden
							ref={fileInputRef}
							onChange={handleFileSelect}
						/>
						{previewUrl ? (
							<div className={styles.previewContainer}>
								<img
									src={previewUrl}
									alt="Preview"
									className={styles.previewImage}
								/>
								<button
									type="button"
									className={styles.removeImageButton}
									onClick={handleRemoveImage}
								>
									<Trash2 size="30" />
								</button>
							</div>
						) : (
							<>
								<CloudUpload
									size="100"
									className={styles.imageButton}
								/>
								<span>
									Choose a file or drag & drop it here
								</span>
								<span>JPEG, JPG, PNG formats, up to 10MB</span>
								<button
									type="button"
									className={styles.browseButton}
								>
									Browse File
								</button>
							</>
						)}
					</div>
				</div>

				<div className={styles.attributes}>
					<div className={styles.selectField}>
						<span>Variety</span>
						<select
							value={form.variety.id}
							disabled={isProcessing}
							onChange={(e) => {
								setForm((prev) => ({
									...prev,
									variety: varietyList.find(
										(u) =>
											u.id ===
											Number.parseInt(e.target.value),
									) as IVariety,
								}));
							}}
						>
							{varietyList.map((variety, index) => (
								<option key={index} value={variety.id}>
									{variety.name}
								</option>
							))}
							{varietyList.length == 0 && (
								<option>Missing variety</option>
							)}
						</select>
					</div>
					<div className={styles.seperate} />
					<div className={styles.selectField}>
						<span>Scale Type</span>
						<select
							value={form.scaleType}
							disabled={isProcessing}
							onChange={(e) => {
								setForm((prev) => ({
									...prev,
									scaleType:
										e.target.value.toUpperCase() as ScaleType,
								}));
							}}
						>
							{scaleTypeList.map((scaleType, index) => (
								<option key={index} value={scaleType}>
									{scaleType}
								</option>
							))}
						</select>
					</div>
					<div className={styles.seperate} />
					<div className={styles.selectField}>
						<span>Shape</span>
						<select
							value={form.shape}
							disabled={isProcessing}
							onChange={(e) => {
								setForm((prev) => ({
									...prev,
									shape: e.target.value.toUpperCase() as KoiShape,
								}));
							}}
						>
							{shapeList.map((shape, index) => (
								<option key={index} value={shape}>
									{shape}
								</option>
							))}
						</select>
					</div>
				</div>

				<div className={styles.couple}>
					<div className={styles.textField}>
						<span className={styles.label}>
							Base Max Length (cm)
						</span>
						<div className={styles.inputWrapper}>
							<RulerDimensionLine size="30" color="#b49429" />
							<input
								type="text"
								placeholder="ex. 90"
								value={form.baseMaxLength}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.baseMaxLength
										? styles.inputError
										: ""
								}`}
								onChange={(e) => {
									setForm((prev) => ({
										...prev,
										baseMaxLength: e.target.value,
									}));

									clearError("baseMaxLength");
								}}
							/>
						</div>
						{errors.baseMaxLength && (
							<span className={styles.error}>
								{errors.baseMaxLength}
							</span>
						)}
					</div>
					<div className={styles.textField}>
						<span className={styles.label}>
							Base Growth Rate (0.01 ~ 0.02)
						</span>
						<div className={styles.inputWrapper}>
							<ChevronsUp size="30" color="#44d131" />
							<input
								type="text"
								placeholder="ex. 0.015"
								value={form.baseGrowthRate}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.baseGrowthRate
										? styles.inputError
										: ""
								}`}
								onChange={(e) => {
									setForm((prev) => ({
										...prev,
										baseGrowthRate: e.target.value,
									}));

									clearError("baseGrowthRate");
								}}
							/>
						</div>
						{errors.baseGrowthRate && (
							<span className={styles.error}>
								{errors.baseGrowthRate}
							</span>
						)}
					</div>
				</div>

				<div className={styles.couple}>
					<div className={styles.textField}>
						<span className={styles.label}>Mid Age (days)</span>
						<div className={styles.inputWrapper}>
							<ClockArrowUp size="30" color="#aeb11a" />
							<input
								type="text"
								placeholder="ex. 300"
								value={form.midAge}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.midAge ? styles.inputError : ""
								}`}
								onChange={(e) => {
									setForm((prev) => ({
										...prev,
										midAge: e.target.value,
									}));

									clearError("midAge");
								}}
							/>
						</div>
						{errors.midAge && (
							<span className={styles.error}>
								{errors.midAge}
							</span>
						)}
					</div>
					<div className={styles.textField}>
						<span className={styles.label}>
							Alpha Weight (0.000010 ~ 0.000020)
						</span>
						<div className={styles.inputWrapper}>
							<Weight size="30" />
							<input
								type="text"
								placeholder="ex. 0.000015"
								value={form.alphaWeight}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.alphaWeight ? styles.inputError : ""
								}`}
								onChange={(e) => {
									setForm((prev) => ({
										...prev,
										alphaWeight: e.target.value,
									}));

									clearError("alphaWeight");
								}}
							/>
						</div>
						{errors.alphaWeight && (
							<span className={styles.error}>
								{errors.alphaWeight}
							</span>
						)}
					</div>
				</div>

				<div className={styles.couple}>
					<div className={styles.textField}>
						<span className={styles.label}>Base Price (Koins)</span>
						<div className={styles.inputWrapper}>
							<Coins size="30" color="#d0d236" />
							<input
								type="text"
								placeholder="ex. 150"
								value={form.basePrice}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.basePrice ? styles.inputError : ""
								}`}
								onChange={(e) => {
									setForm((prev) => ({
										...prev,
										basePrice: e.target.value,
									}));

									clearError("basePrice");
								}}
							/>
						</div>
						{errors.basePrice && (
							<span className={styles.error}>
								{errors.basePrice}
							</span>
						)}
					</div>
					<div className={styles.textField}>
						<span className={styles.label}>
							Alpha Price (1.5 ~ 2.0)
						</span>
						<div className={styles.inputWrapper}>
							<BanknoteArrowUp size="30" />
							<input
								type="text"
								placeholder="ex. 1.50"
								value={form.alphaPrice}
								disabled={isProcessing}
								className={`${styles.input} ${
									errors.alphaPrice ? styles.inputError : ""
								}`}
								onChange={(e) => {
									setForm((prev) => ({
										...prev,
										alphaPrice: e.target.value,
									}));

									clearError("alphaPrice");
								}}
							/>
						</div>
						{errors.alphaPrice && (
							<span className={styles.error}>
								{errors.alphaPrice}
							</span>
						)}
					</div>
				</div>
			</div>

			<div className={styles.footer}>
				<button
					type="button"
					className={styles.cancelButton}
					onClick={onClose}
				>
					Cancel
				</button>
				<button
					type="button"
					className={styles.submitButton}
					disabled={isProcessing}
					onClick={handleSubmit}
				>
					{isProcessing ? (
						<img
							className={styles.loadingIcon}
							src="/utilities/fish-loading.png"
						/>
					) : null}
					<span>{koi != null ? "Save" : "Create"}</span>
				</button>
			</div>
		</div>
	);
}

export default KoiForm;
