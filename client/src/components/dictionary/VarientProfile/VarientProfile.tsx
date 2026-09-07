import { Clock, Coins, Earth, Ruler, X } from "lucide-react";
import type { IKoiVarient } from "../../../types/backend";
import styles from "./VarientProfile.module.css";

interface VarientProfileProps {
	varient: IKoiVarient;
	onClose: () => void;
}

function VarientProfile({ varient, onClose }: VarientProfileProps) {
	const toCapitalString = (text: string) => {
		if (!text) return "";
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.card} onClick={(e) => e.stopPropagation()}>
				<button
					type="button"
					className={styles.closeButton}
					onClick={onClose}
					aria-label="Close"
				>
					<X size={28} strokeWidth={3} />
				</button>

				{/* HEADER: Image & Core Info */}
				<div className={styles.header}>
					<div className={styles.imageContainer}>
						<img
							src={varient.imageUrl ?? "/kois/koi-empty.png"}
							alt={varient.name}
						/>
					</div>

					<div className={styles.headerInfo}>
						<h2 className={styles.name}>{varient.name}</h2>

						<div className={styles.badges}>
							<span
								className={`${styles.badge} ${styles.badgeOrigin}`}
							>
								<Earth size={16} /> {varient.origin}
							</span>
							<span
								className={`${styles.badge} ${styles.badgeVariety}`}
							>
								{varient.variety?.name ?? "Unknown"}
							</span>
							<span
								className={`${styles.badge} ${styles.badgeScale}`}
							>
								{toCapitalString(varient.scaleType)}
							</span>
							<span
								className={`${styles.badge} ${styles.badgeShape}`}
							>
								{toCapitalString(varient.shape)}
							</span>
						</div>
					</div>
				</div>

				<div className={styles.seperate}>
					<div className={styles.line} />
					<span>Base Statistics</span>
					<div className={styles.line} />
				</div>

				{/* STATS GRID: Detailed Base Info (Chỉ giữ lại 3 thông số) */}
				<div className={styles.statsGrid}>
					<div className={styles.statBox}>
						<div className={styles.statIcon}>
							<Ruler size={22} />
						</div>
						<div className={styles.statInfo}>
							<span className={styles.statLabel}>Max Length</span>
							<span className={styles.statValue}>
								{varient.baseMaxLength} cm
							</span>
						</div>
					</div>

					<div className={styles.statBox}>
						<div className={styles.statIcon}>
							<Clock size={22} />
						</div>
						<div className={styles.statInfo}>
							<span className={styles.statLabel}>Mid Age</span>
							<span className={styles.statValue}>
								{varient.midAge} Days
							</span>
						</div>
					</div>

					<div className={styles.statBox}>
						<div className={styles.statIcon}>
							<Coins size={22} color="#d97706" />
						</div>
						<div className={styles.statInfo}>
							<span className={styles.statLabel}>Base Price</span>
							<span
								className={`${styles.statValue} ${styles.highlightGold}`}
							>
								{varient.basePrice} 🪙
							</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VarientProfile;
