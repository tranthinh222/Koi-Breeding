import styles from "./ModeSwitcher.module.css";

interface ModeSwitcherProps {
	isAutoMode: boolean;
	setIsAutoMode: React.Dispatch<React.SetStateAction<boolean>>;
}

function ModeSwitcher({ isAutoMode, setIsAutoMode }: ModeSwitcherProps) {
	return (
		<div className={styles.switchContainer}>
			<span
				className={`${styles.switchLabel} ${!isAutoMode ? styles.active : ""}`}
			>
				Manual
			</span>
			<label className={styles.switch}>
				<input
					type="checkbox"
					checked={isAutoMode}
					onChange={() => setIsAutoMode(!isAutoMode)}
				/>
				<span className={styles.slider}></span>
			</label>
			<span
				className={`${styles.switchLabel} ${isAutoMode ? styles.active : ""}`}
			>
				Auto
			</span>
		</div>
	);
}

export default ModeSwitcher;
