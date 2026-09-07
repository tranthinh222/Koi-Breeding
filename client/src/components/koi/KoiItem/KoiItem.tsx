import styles from "./KoiItem.module.css";

interface IKoiItemProps {
	src: string;
	alt: string;
}

function KoiItem({ src, alt }: IKoiItemProps) {
	return (
		<>
			<div className={styles.container}>
				<img src={src} alt={alt} />
				<div className={styles.bubble1} />
				<div className={styles.bubble2} />
				<div className={styles.bubble3} />
				<div className={styles.bubble4} />
				<div className={styles.bubble5} />
				<div className={styles.bubble6} />
			</div>
		</>
	);
}

export default KoiItem;
