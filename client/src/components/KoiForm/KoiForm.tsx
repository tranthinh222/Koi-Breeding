import {
	BanknoteArrowUp,
	ChevronsUp,
	ClockArrowUp,
	Coins,
	Earth,
	Fish,
	RulerDimensionLine,
	Weight,
	X,
} from "lucide-react";
import { useState } from "react";
import type { IKoiVarient } from "../../types/backend";
import styles from "./KoiForm.module.css";

interface KoiFormProps {
	koi: IKoiVarient | null;
	onClose: () => void;
	onSubmit: (koi: IKoiVarient) => void;
}

interface KoiDataForm {
	name: string;
	origin: string;
	variety: string;
	scaleType: string;
	shape: string;
	baseMaxLength: string;
	baseGrowthRate: string;
	midAge: string;
	alphaWeight: string;
	basePrice: string;
	alphaPrice: string;
}

type KoiFormErrors = Partial<Record<keyof KoiDataForm, string>>;

const varietyList = [
	"Kohaku",
	"Tancho",
	"Taisho Sanke",
	"Showa Sanshoku",
	"Goromo",
	"Utsuri",
	"Hikari Utsuri",
	"Bekko",
	"Karashi",
	"Benigoi",
	"Chagoi",
	"Hikari Muji",
	"Asagi",
	"Shusui",
	"Goshiki",
	"Ginrin",
	"Hikarimoyo",
	"Kawarimono",
];
const scaleTypeList = ["Wagoi", "Doitsu", "Ginrin"];
const shapeList = ["Standard", "Butterfly"];

function KoiForm({ koi, onClose, onSubmit }: KoiFormProps) {
	const [form, setForm] = useState<KoiDataForm>({
		name: koi?.name || "",
		origin: koi?.origin || "",
		variety: koi?.variety || varietyList[0],
		scaleType: koi?.scaleType || scaleTypeList[0],
		shape: koi?.shape || shapeList[0],
		baseMaxLength: `${koi?.baseMaxLength || ""}`,
		baseGrowthRate: `${koi?.baseGrowthRate || ""}`,
		midAge: `${koi?.midAge || ""}`,
		alphaWeight: `${koi?.alphaWeight || ""}`,
		basePrice: `${koi?.basePrice || ""}`,
		alphaPrice: `${koi?.alphaPrice || ""}`,
	});
	const [errors, setErrors] = useState<KoiFormErrors>({});
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const handleSubmit = async () => {
		setIsProcessing(true);
		await sleep(10000);
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

		console.log("Submitted");

		onSubmit({
			id: koi != null ? koi.id : 0,
			name: form.name,
			origin: form.origin,
			variety: form.variety,
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
				{koi != null
					? `Update IKoiVarient #${koi.id}`
					: "Create A New Koi"}
			</span>
			<div className={styles.couple}>
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
						<span className={styles.error}>{errors.name}</span>
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
						<span className={styles.error}>{errors.origin}</span>
					)}
				</div>
			</div>
			<div className={styles.attributes}>
				<div className={styles.selectField}>
					<span>Variety</span>
					<select
						value={form.variety}
						disabled={isProcessing}
						onChange={(e) => {
							setForm((prev) => ({
								...prev,
								variety: e.target.value,
							}));
						}}
					>
						{varietyList.map((variety, index) => (
							<option key={index} value={variety}>
								{variety}
							</option>
						))}
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
								variety: e.target.value,
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
								shape: e.target.value,
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
					<span className={styles.label}>Base Max Length (cm)</span>
					<div className={styles.inputWrapper}>
						<RulerDimensionLine size="30" color="#b49429" />
						<input
							type="text"
							placeholder="ex. 90"
							value={form.baseMaxLength}
							disabled={isProcessing}
							className={`${styles.input} ${
								errors.baseMaxLength ? styles.inputError : ""
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
								errors.baseGrowthRate ? styles.inputError : ""
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
						<span className={styles.error}>{errors.midAge}</span>
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
						<span className={styles.error}>{errors.basePrice}</span>
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
