import styles from "./KoiForm.module.css";

interface FormFooterProps {
	submitLabel: string;
	isProcessing: boolean;

	onClose: () => void;
	onSubmit: () => void;
}

function FormFooter({
	submitLabel,
	isProcessing,
	onClose,
	onSubmit,
}: FormFooterProps) {
	return (
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
				onClick={onSubmit}
			>
				{isProcessing ? (
					<img
						className={styles.loadingIcon}
						src="/utilities/fish-loading.png"
					/>
				) : null}
				<span>{submitLabel}</span>
			</button>
		</div>
	);
}

export default FormFooter;
