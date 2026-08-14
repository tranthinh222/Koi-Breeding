import styles from "./Background.module.css";

function Background() {
	return (
		<>
			<div className={`${styles.cloud} ${styles.cloud1}`}></div>
			<div className={`${styles.cloud} ${styles.cloud2}`}></div>
			<div className={`${styles.cloud} ${styles.cloud3}`}></div>

			<div className={styles.background}>
				<div className={styles.grass}></div>

				<div className={`${styles.pond} ${styles.pond1}`}></div>
				<div className={`${styles.pond} ${styles.pond2}`}></div>
				<div className={`${styles.pond} ${styles.pond3}`}></div>

				<div className={`${styles.trees} ${styles.treesLeft}`}></div>

				<div className={`${styles.trees} ${styles.treesRight}`}></div>
			</div>
		</>
	);
}

export default Background;
