import { ChevronsRight, ChevronsUp, X } from "lucide-react";
import { useState } from "react";
import type { IPond } from "../../../../types/backend";
import styles from "./PondUpgradeForm.module.css";

interface PondUpgradeFormProps {
	pond: IPond;
	onClose: () => void;
	onSubmit: () => Promise<void>;
}

function PondUpgradeForm({ pond, onClose, onSubmit }: PondUpgradeFormProps) {
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const handleSubmit = async () => {
		setIsProcessing(true);
		await sleep(500);
		await onSubmit();
		setIsProcessing(false);
	};

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

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
					<ChevronsUp />
					<span>Upgrade Pond {pond.name}</span>
				</div>

				{/* Form Body */}
				<div className={styles.formBody}>
					<div className={styles.levelContent}>
						<div
							className={`${styles.levelSection} ${styles.currentLevel}`}
						>
							<span className={styles.levelLabel}>
								Level {pond.level}
							</span>
							<span>Capacity {pond.capacity}</span>
						</div>
						{20 > pond.level && (
							<>
								<ChevronsRight />
								<div
									className={`${styles.levelSection} ${styles.nextLevel}`}
								>
									<span className={styles.levelLabel}>
										Level {pond.level + 1}
									</span>
									<span>
										Capacity {pond.capacity + 1}
										<span className={styles.bonusBadge}>
											+1
										</span>
									</span>
								</div>
							</>
						)}
					</div>
					{20 > pond.level && (
						<div className={styles.priceSection}>
							<img src="/pond/coin.svg" alt="coin" />
							<span>{pond.nextLevelPrice}</span>
						</div>
					)}
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
						<span>{20 === pond.level ? "Max" : "Upgrade"}</span>
					</button>
				</div>
			</form>
		</>
	);
}

export default PondUpgradeForm;
