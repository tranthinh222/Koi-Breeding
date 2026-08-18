import styles from "./EmptyCard.module.css";

function EmptyCard() {
	return (
		<div className={styles.card} title="empty">
			<img
				className={styles.image}
				src={`/kois/empty-koi-1.png`}
				alt="empty-koi"
			/>
		</div>
	);
}

export default EmptyCard;
