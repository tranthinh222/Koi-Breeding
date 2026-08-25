import { PencilLine, X } from "lucide-react";
import { useState } from "react";
import "./BuyPondForm.css";

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
		<form>
			<button
				type="button"
				className="close-button"
				onClick={onClose}
				aria-label="Close"
			>
				<X size={30} />
			</button>

			{/* Form Header */}
			<div className="form-header">
				<span>Buy A New Pond</span>
			</div>

			{/* Form Body */}
			<div className="form-body">
				<div className="image-section">
					<div className="preview-image">
						<img src="/pond/pond-item-1.svg" />
					</div>
					<div className="price">
						<img src="/pond/coin.svg" alt="coin" />
						<span>100</span>
					</div>
				</div>
				<div className="info-section">
					<div className="text-field">
						<span className="field-label">Name</span>
						<div className="input-wrapper">
							<PencilLine />
							<input
								type="text"
								placeholder="ex. My New Pond"
								value={formData.name}
								disabled={isProcessing}
								className={`field-input ${
									errors.name ? "input-error" : ""
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
							<span className="error-label">{errors.name}</span>
						)}
					</div>
					<div className="text-field">
						<span className="field-label">Description</span>
						<div className="input-wrapper">
							<textarea
								id="message-input"
								className="description-textarea"
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
			<div className="form-footer">
				<button
					type="button"
					className="cancel-button"
					onClick={onClose}
				>
					Cancel
				</button>
				<button
					type="button"
					className="submit-button"
					disabled={isProcessing}
					onClick={handleSubmit}
				>
					{isProcessing ? (
						<img
							className="loading-icon"
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
