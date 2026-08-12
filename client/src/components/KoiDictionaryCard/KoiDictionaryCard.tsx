import { Ellipsis } from "lucide-react";
import type { KoiVarient } from "../../types";
import styles from "./KoiDictionaryCard.module.css";

interface KoiDictionaryCardProps {
	koi: KoiVarient;
}

function KoiDictionaryCard({ koi }: KoiDictionaryCardProps) {
	return (
		<div className={styles.card}>
			<span className={styles.name}>Kuchibeni-Kohaku</span>
			<section className={styles.image}>
				<img
					src={`/kois/${koi.name.toLowerCase().replace(" ", "-")}.png`}
					alt="koi"
				/>
			</section>
			<span className={styles.scale}>Fin type: Wagoi</span>
			<span className={styles.origin}>Origin: Japan</span>
			<button title="Details">
				<Ellipsis />
			</button>
		</div>
	);
}

export default KoiDictionaryCard;
