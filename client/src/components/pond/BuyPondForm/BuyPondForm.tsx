import { PencilLine, X } from "lucide-react";
import { useState } from "react";
import styles from "./BuyPondForm.module.css";

interface PondDataForm {
	name: string;
	description: string;
}

interface BuyPondFormProps {
	onClose: () => void;
	onSubmit: (formData: PondDataForm, price: number) => Promise<void>;
}

type PondFormErrors = Partial<Record<keyof PondDataForm, string>>;

function BuyPondForm({ onClose, onSubmit }: BuyPondFormProps) {
	const [formData, setFormData] = useState<PondDataForm>({
		name: "",
		description: "",
	});

	const [errors, setErrors] = useState<PondFormErrors>({});
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const handleSubmit = async () => {
		setIsProcessing(true);
		await sleep(1000);
		const fieldErrors: PondFormErrors = {};
		if (formData.name.trim() == "") {
			fieldErrors.name = "Name cannot be blank";
		} else if (formData.name.trim().length > 100) {
			fieldErrors.name = "Name length cannot greater than 100 characters";
		}

		setErrors(fieldErrors);

		if (Object.keys(fieldErrors).length > 0) {
			setIsProcessing(false);
			return;
		}

		console.log("Submitted");

		await onSubmit(formData, 100);

		setIsProcessing(false);

		onClose();
	};

	const clearError = (field: keyof PondDataForm) => {
		setErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	return (
		<form className={styles.buyForm}>
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
				<span>Buy A New Pond</span>
			</div>

			{/* Form Body */}
			<div className={styles.formBody}>
				<div className={styles.imageSection}>
					<div className={styles.previewImage}>
						<img src="/pond/pond-item-1.svg" />
					</div>
					<div className={styles.price}>
						<img src="/pond/coin.svg" alt="coin" />
						<span>100</span>
					</div>
				</div>
				<div className={styles.infoSection}>
					<div className={styles.textField}>
						<span className={styles.fieldLabel}>Name</span>
						<div className={styles.inputWrapper}>
							<PencilLine />
							<input
								type="text"
								placeholder="ex. My New Pond"
								value={formData.name}
								disabled={isProcessing}
								className={`${styles.fieldInput} ${
									errors.name ? styles.inputError : ""
								}`}
								onChange={(e) => {
									setFormData((prev) => ({
										...prev,
										name: e.target.value,
									}));

									clearError("name");
								}}
							/>
						</div>
						{errors.name && (
							<span className={styles.errorLabel}>
								{errors.name}
							</span>
						)}
					</div>
					<div className={styles.textField}>
						<span className={styles.fieldLabel}>Description</span>
						<div className={styles.inputWrapper}>
							<textarea
								id={styles.messageInput}
								className={styles.descriptionTextArea}
								placeholder="Enter some description..."
								value={formData.description}
								disabled={isProcessing}
								onChange={(e) => {
									setFormData((prev) => ({
										...prev,
										description: e.target.value,
									}));
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			{/* Form Footer */}
			<div className={styles.formFooter}>
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
					<span>Purchase</span>
				</button>
			</div>
		</form>
	);
}

export default BuyPondForm;
