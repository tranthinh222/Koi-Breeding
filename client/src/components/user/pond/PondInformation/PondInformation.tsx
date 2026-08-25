import {
	ArrowBigUpDash,
	Bubbles,
	CheckCheck,
	Droplets,
	Info,
	PencilLine,
	SquarePen,
	Thermometer,
	X,
} from "lucide-react";
import { useState } from "react";
import type { IPond } from "../../../../types/backend";
import styles from "./PondInformation.module.css";

interface PondDataForm {
	name: string;
	description: string;
}

interface PondInformationProps {
	pond: IPond;
	onClose: () => void;
	onEdit: (name: string, description: string) => void;
}

type PondFormErrors = Partial<Record<keyof PondDataForm, string>>;

function PondInformation({ pond, onClose, onEdit }: PondInformationProps) {
	const [formData, setFormData] = useState<PondDataForm>({
		name: pond.name,
		description: pond.description,
	});
	const [isEditing, setIsEditing] = useState<boolean>(false);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);
	const [errors, setErrors] = useState<PondFormErrors>({});

	const handleEdit = async () => {
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

		await onEdit(formData.name, formData.description);

		setIsEditing(false);
		setIsProcessing(false);
	};

	const clearError = (field: keyof PondDataForm) => {
		setErrors((prev) => {
			const next = { ...prev };
			delete next[field];
			return next;
		});
	};

	const resolveAttributeBadge = (
		attribute: keyof IPond,
	): React.JSX.Element => {
		const BadQuality: React.JSX.Element = (
			<span className={`${styles.qualityBadge} ${styles.badQuality}`}>
				Bad
			</span>
		);

		const MediumQuality: React.JSX.Element = (
			<span className={`${styles.qualityBadge} ${styles.mediumQuality}`}>
				Medium
			</span>
		);

		const GoodQuality: React.JSX.Element = (
			<span className={`${styles.qualityBadge} ${styles.goodQuality}`}>
				Good
			</span>
		);

		const PerfectQuality: React.JSX.Element = (
			<span className={`${styles.qualityBadge} ${styles.perfectQuality}`}>
				Perfect
			</span>
		);

		if (attribute === "pH") {
			if (pond.pH < 6.5 || pond.pH > 8.5) {
				return BadQuality;
			}

			if (
				(pond.pH >= 6.5 && pond.pH < 6.8) ||
				(pond.pH > 8.0 && pond.pH <= 8.5)
			) {
				return MediumQuality;
			}

			if (
				(pond.pH >= 6.8 && pond.pH < 7.0) ||
				(pond.pH > 7.5 && pond.pH <= 8.0)
			) {
				return GoodQuality;
			}

			return PerfectQuality;
		}

		if (attribute === "temperature") {
			if (pond.temperature < 15 || pond.temperature > 30) {
				return BadQuality;
			}

			if (
				(pond.temperature >= 15 && pond.temperature < 20) ||
				(pond.temperature > 28 && pond.temperature <= 30)
			) {
				return MediumQuality;
			}

			if (
				(pond.temperature >= 20 && pond.temperature < 22) ||
				(pond.temperature > 26 && pond.temperature <= 28)
			) {
				return GoodQuality;
			}

			return PerfectQuality;
		}

		if (attribute === "oxygen") {
			if (pond.oxygen < 4 || pond.oxygen > 12) {
				return BadQuality;
			}

			if (
				(pond.oxygen >= 4 && pond.oxygen < 5) ||
				(pond.oxygen > 10 && pond.oxygen <= 12)
			) {
				return MediumQuality;
			}

			if (
				(pond.oxygen >= 5 && pond.oxygen < 6) ||
				(pond.oxygen > 9 && pond.oxygen <= 10)
			) {
				return GoodQuality;
			}

			return PerfectQuality;
		}

		return <span></span>;
	};

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	return (
		<form>
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
				<Info />
				<span>Pond Information</span>
			</div>

			{/* Form Body */}
			<div className={styles.formBody}>
				<section className={styles.leftSection}>
					{!isEditing && (
						<button
							type="button"
							className={styles.editButton}
							disabled={isEditing}
							onClick={() => setIsEditing(true)}
						>
							<SquarePen />
						</button>
					)}
					<div className={styles.textField}>
						<span className={styles.fieldLabel}>Name:</span>
						{isEditing ? (
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
						) : (
							<span className={styles.fieldContent}>
								{pond.name}
							</span>
						)}
						{isEditing && errors.name && (
							<span className={styles.errorLabel}>
								{errors.name}
							</span>
						)}
					</div>
					<div className={styles.textField}>
						<span className={styles.fieldLabel}>Level:</span>
						<span className={styles.fieldContent}>
							{pond.level}
						</span>
						<button
							type="button"
							className={styles.upgradeButton}
							title="upgrade"
						>
							<ArrowBigUpDash />
						</button>
					</div>
					<div className={styles.textField}>
						<span className={styles.fieldLabel}>Capacity:</span>
						<span className={styles.fieldContent}>
							{pond.capacity}
						</span>
					</div>
					<div className={styles.descriptionField}>
						<span className={styles.fieldLabel}>Description</span>
						{isEditing ? (
							<div className={styles.inputWrapper}>
								<textarea
									id="message-input"
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
						) : (
							<div className={styles.descriptionContainer}>
								{pond.description
									.split("\n")
									.filter((para) => para.trim() !== "")
									.map((para, index) => (
										<p key={index}>{para}</p>
									))}
							</div>
						)}
					</div>
				</section>

				<section className={styles.rightSection}>
					{/* Card pH */}
					<div className={styles.statCard}>
						<div className={styles.statInfo}>
							<Droplets size={28} color="#667eea" />
							<div>
								<div className={styles.fieldLabel}>
									pH Level
								</div>
								<div className={styles.statValue}>
									{pond.pH}
								</div>
							</div>
						</div>
						{resolveAttributeBadge("pH")}
					</div>

					{/* Card Temperature */}
					<div className={styles.statCard}>
						<div className={styles.statInfo}>
							<Thermometer size={28} color="#d97706" />
							<div>
								<div className={styles.fieldLabel}>
									Temperature
								</div>
								<div className={styles.statValue}>
									{pond.temperature} °C
								</div>
							</div>
						</div>
						{resolveAttributeBadge("temperature")}
					</div>

					{/* Card Oxygen */}
					<div className={styles.statCard}>
						<div className={styles.statInfo}>
							<Bubbles size={28} color="#06b6d4" />
							<div>
								<div className={styles.fieldLabel}>
									Dissolved Oxygen
								</div>
								<div className={styles.statValue}>
									{pond.oxygen} mg/L
								</div>
							</div>
						</div>
						{resolveAttributeBadge("oxygen")}
					</div>

					{/* Card Water Quality (Progress Bar) */}
					<div
						className={`${styles.statCard} ${styles.progressCard}`}
					>
						<div className={styles.statInfo}>
							<CheckCheck size={28} color="#16a34a" />
							<div className={styles.statValue}>
								Water Quality
							</div>
						</div>
						<div className={styles.progressContainer}>
							<div
								className={styles.progressBar}
								style={{ width: `${pond.waterQuality}%` }}
							/>
							<span>{pond.waterQuality}/100</span>
						</div>
					</div>
				</section>
			</div>

			{/* Form Footer */}
			{isEditing && (
				<div className={styles.formFooter}>
					<button
						type="button"
						className={styles.cancelButton}
						onClick={() => setIsEditing(false)}
					>
						Cancel
					</button>
					<button
						type="button"
						className={styles.submitButton}
						disabled={isProcessing}
						onClick={handleEdit}
					>
						{isProcessing ? (
							<img
								className={styles.loadingIcon}
								src="/utilities/fish-loading.png"
							/>
						) : null}
						<span>Save</span>
					</button>
				</div>
			)}
		</form>
	);
}

export default PondInformation;
