import { Ellipsis } from "lucide-react";
import type { IKoiVarient } from "../../../../types/backend";
import styles from "./KoiDictionaryCard.module.css";

interface KoiDictionaryCardProps {
	koiVarient: IKoiVarient;
}

function KoiDictionaryCard({ koiVarient }: KoiDictionaryCardProps) {
	const toCapitalString = (text: string) => {
		const firstCharacter = text.at(0)?.toUpperCase();
		return firstCharacter + text.toLowerCase().slice(1);
	};

	return (
		<div className={styles.card}>
			<span className={styles.name}>{koiVarient.name}</span>
			<section className={styles.image}>
				<img
					src={koiVarient.imageUrl ?? "/kois/koi-empty.png"}
					alt={koiVarient.name}
				/>
			</section>
			<span className={styles.scale}>
				Fin type: {toCapitalString(koiVarient.scaleType)}
			</span>
			<span className={styles.origin}>Origin: {koiVarient.origin}</span>
			<button title="Details">
				<Ellipsis />
			</button>
		</div>
	);
}

export default KoiDictionaryCard;
