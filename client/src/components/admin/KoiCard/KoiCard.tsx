import { Ellipsis, Venus } from "lucide-react";
import type { IKoi } from "../../types/backend";
import styles from "./KoiCard.module.css";

interface KoiCardProps {
	koi: IKoi;
}

function KoiCard({ koi }: KoiCardProps) {
	return (
		<div className={styles.card} title={koi.name}>
			<div className={styles.header}>
				<span className={styles.typeBadge}>Genuine</span>
				<div className={styles.rating}>
					<img src="/utilities/star-on.svg" alt="star" />
					<img src="/utilities/star-on.svg" alt="star" />
					<img src="/utilities/star-off.svg" alt="star" />
					<img src="/utilities/star-off.svg" alt="star" />
					<img src="/utilities/star-off.svg" alt="star" />
				</div>
			</div>
			<section className={styles.image}>
				<img
					src={`/kois/${koi.name.toLowerCase().replace(" ", "-")}.png`}
					alt="koi"
				/>
				<Venus size="30" />
			</section>
			<span className={styles.name}>{koi.name}</span>
			<span className={styles.scale}>Weight: {koi.weight} kg</span>
			<span className={styles.origin}>Length: {koi.length} cm</span>
			<button className={styles.detailButton} title="Details">
				<Ellipsis />
			</button>
		</div>
	);
}

export default KoiCard;
