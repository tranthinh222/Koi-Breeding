import type { IKoi } from "../../../../types/backend";
import styles from "./BreedingKoiCard.module.css";

interface BreedingKoiCardProps {
	isReverse?: boolean;
	isDisabled?: boolean;
	slot: IKoi | null;
	koi: IKoi;
	onSelect: () => void;
}

function BreedingKoiCard({
	slot,
	koi,
	onSelect,
	isReverse,
	isDisabled,
}: BreedingKoiCardProps) {
	return (
		<div
			className={`${styles.koiCard} ${slot?.id === koi.id ? styles.selected : ""} ${isDisabled ? styles.disabled : ""}`}
			onClick={() => onSelect()}
		>
			<div className={styles.koiLevel}>{koi.age}</div>
			<img
				src={koi.dictionary.imageUrl ?? "/kois/koi-fish-null.svg"}
				className={styles.koiImage}
				alt="koi"
				style={isReverse ? { transform: "scaleX(-1)" } : {}}
			/>
			<div className={styles.koiInfo}>
				<span className={styles.koiName}>{koi.dictionary.name}</span>
				<div className={styles.koiTags}>
					<span
						className={`${styles.genderTag} ${styles[`gender${koi.gender}`]}`}
					>
						{koi.gender === "MALE" ? "♂ Male" : "♀ Female"}
					</span>
				</div>
			</div>
		</div>
	);
}

export default BreedingKoiCard;
