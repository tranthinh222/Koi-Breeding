import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type {
	IKoiVarient,
	IVariety,
	KoiShape,
	ScaleType,
} from "../../../types/backend";
import { toast } from "../../share/Toast/toast";
import KoiFormBody from "./FormBody";
import FormFooter from "./FormFooter";
import styles from "./KoiForm.module.css";

interface KoiFormProps {
	koi: IKoiVarient | null;
	varietyList: IVariety[];
	onClose: () => void;
	onSubmit: (koi: IKoiVarient, image: File | null) => Promise<void>;
}

export interface KoiDataForm {
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
	image?: File;
}

export type KoiFormErrors = Partial<Record<keyof KoiDataForm, string>>;

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
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		koi && koi.imageUrl ? koi.imageUrl : null,
	);
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
		const validTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/svg+xml",
		];
		const maxSize = 10 * 1024 * 1024; // 10MB

		if (!validTypes.includes(file.type)) {
			toast.error("Only JPEG, JPG, PNG and SVG formats are allowed!");
			return;
		}

		if (file.size > maxSize) {
			toast.error("File size exceeds 10MB limit!");
			return;
		}

		console.log(`Filename: ${file?.name}`);

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
		// await sleep(1000);
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

		console.log(`Image File: ${JSON.stringify(imageFile?.name)}`);

		await onSubmit(
			{
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
			},
			imageFile,
		);

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

	// const sleep = (ms: number) =>
	// 	new Promise((resolve) => setTimeout(resolve, ms));

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

			{/* Form Header */}
			<span className={styles.title}>
				{koi != null ? `Update Koi #${koi.id}` : "Create A New Koi"}
			</span>

			{/* Form Body */}
			<KoiFormBody
				form={form}
				isProcessing={isProcessing}
				errors={errors}
				varietyList={varietyList}
				previewUrlState={[previewUrl, setPreviewUrl]}
				isDragActive={isDragActive}
				fileInputRef={fileInputRef}
				handleFileSelect={handleFileSelect}
				onDragOver={onDragOver}
				onDragLeave={onDragLeave}
				onDrop={onDrop}
				handleRemoveImage={handleRemoveImage}
				onFieldChange={setForm}
				clearError={clearError}
			/>

			{/* Form Footer */}
			<FormFooter
				submitLabel={koi != null ? "Save" : "Create"}
				isProcessing={isProcessing}
				onClose={onClose}
				onSubmit={handleSubmit}
			/>
		</div>
	);
}

export default KoiForm;
