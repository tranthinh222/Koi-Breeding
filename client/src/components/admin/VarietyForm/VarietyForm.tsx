import { Fish, X } from "lucide-react";
import { useState } from "react";
import type { IVariety } from "../../../types/backend";
import styles from "./VarietyForm.module.css";

interface KoiFormProps {
	variety: IVariety | null;
	onClose: () => void;
	onSubmit: (variety: IVariety) => Promise<void>;
}

interface VarietyDataForm {
	name: string;
	description: string;
}

type VarietyFormErrors = Partial<Record<keyof VarietyDataForm, string>>;

function VarietyForm({ variety, onClose, onSubmit }: KoiFormProps) {
	const [form, setForm] = useState<VarietyDataForm>({
		name: variety?.name || "",
		description: variety?.description || "",
	});
	const [errors, setErrors] = useState<VarietyFormErrors>({});
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const handleSubmit = async () => {
		setIsProcessing(true);
		await sleep(1000);
		const fieldErrors: VarietyFormErrors = {};
		if (form.name.trim() == "") {
			fieldErrors.name = "Name cannot be blank";
		} else if (form.name.trim().length > 100) {
			fieldErrors.name = "Name length cannot greater than 100 characters";
		}

		setErrors(fieldErrors);

		if (Object.keys(fieldErrors).length > 0) {
			setIsProcessing(false);
			return;
		}

		console.log("Submitted");

		await onSubmit({
			name: form.name,
			description: form.description,
		});

		setIsProcessing(false);

		onClose();
	};

	const clearError = (field: keyof VarietyDataForm) => {
		setErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	return (
		<form className={styles.form}>
			<button
				type="button"
				className={styles.closeButton}
				onClick={onClose}
				aria-label="Close"
			>
				<X size="30" />
			</button>
			<span className={styles.title}>
				{variety != null
					? `Update Variety #${variety.id}`
					: "Create A New Variety"}
			</span>
			<div className={styles.body}>
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
					<span className={styles.label}>Description</span>
					<div className={styles.inputWrapper}>
						<textarea
							id="message-input"
							className={styles.description}
							placeholder="Enter some description..."
							// rows={5}
							// cols={40}
							value={form.description}
							onChange={(e) => {
								setForm((prev) => ({
									...prev,
									description: e.target.value,
								}));
							}}
						/>
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
					<span>{variety != null ? "Save" : "Create"}</span>
				</button>
			</div>
		</form>
	);
}

export default VarietyForm;
