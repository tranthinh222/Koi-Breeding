import { Mars, Venus, X } from "lucide-react";
import type { IKoi } from "../../../types/backend";
import styles from "./KoiProfile.module.css";

interface KoiProfileProps {
	koi: IKoi;
	onClose: () => void;
}

function KoiProfile({ koi, onClose }: KoiProfileProps) {
	const normalizeScore = (score: number) =>
		Number.isFinite(score) ? Math.min(100, Math.max(0, score)) : 0;
	const beautifulScore = Math.round(
		(normalizeScore(koi.patternScore) * 35 +
			normalizeScore(koi.colorScore) * 25 +
			normalizeScore(koi.bodyScore) * 20 +
			normalizeScore(koi.skinScore) * 10 +
			normalizeScore(koi.scaleScore) * 10) /
			100,
	);
	const rating =
		beautifulScore < 20
			? 1
			: beautifulScore < 40
				? 2
				: beautifulScore < 70
					? 3
					: beautifulScore < 90
						? 4
						: 5;
	const classification = koi.mutation
		? "Mutated"
		: koi.father && koi.mother
			? "Hybrid"
			: "Genuine";
	const classificationDescription = koi.mutation
		? `Mutation: ${koi.mutation.name}`
		: koi.father && koi.mother
			? "Bred from two known parents"
			: "No complete parent lineage recorded";

	const toCapitalString = (text: string) => {
		const firstCharacter = text.at(0)?.toUpperCase();
		return firstCharacter + text.toLowerCase().slice(1);
	};

	return (
		<div
			className={styles.card}
			role="dialog"
			aria-modal="true"
			aria-label={`Koi profile: ${koi.name}`}
		>
			<div className={styles.toolbar}>
				<button
					type="button"
					className={styles.closeButton}
					onClick={onClose}
					aria-label="Close"
				>
					<X size={30} />
				</button>
			</div>
			<div
				className={styles.content}
				tabIndex={0}
				role="region"
				aria-label="Koi details"
			>
				<div className={styles.section1}>
					<section className={styles.image}>
						<img
							src={`${koi.dictionary?.imageUrl ?? "/kois/koi-empty.png"}`}
							alt="koi"
						/>
					</section>
					<div className={styles.header}>
						<div className={styles.titleBar}>
							<span className={styles.name}>{koi.name}</span>
							{koi.gender === "FEMALE" ? (
								<Venus size="40" color="#d87093" />
							) : (
								<Mars size="40" color="#5a8bf5" />
							)}
						</div>
						<div className={styles.ratingType}>
							<div
								className={styles.rating}
								role="img"
								aria-label={`${rating} out of 5 stars; BeautifulScore ${beautifulScore.toFixed(2)} out of 100`}
								title={`Beautiful Score: ${beautifulScore.toFixed(0)}/100`}
							>
								{Array.from({ length: 5 }, (_, index) => (
									<img
										key={index}
										src={`/utilities/star-${index < rating ? "on" : "off"}.svg`}
										alt=""
									/>
								))}
							</div>
							<span
								className={styles.typeBadge}
								title={classificationDescription}
							>
								{classification}
							</span>
						</div>
						<p className={styles.beautifulScore}>
							Beautiful Score: {beautifulScore.toFixed(0)}/100
						</p>
						<div className={styles.statsContainer}>
							<div className={styles.statRow}>
								<span className={styles.statLabel}>Health</span>
								<div className={styles.progressContainer}>
									<div
										className={`${styles.progressBar} ${styles.healthBar}`}
										style={{ width: `${koi.health}%` }}
									/>
									<span>{koi.health}/100</span>
								</div>
							</div>

							<div className={styles.statRow}>
								<span className={styles.statLabel}>Hunger</span>
								<div className={styles.progressContainer}>
									<div
										className={`${styles.progressBar} ${styles.foodBar}`}
										style={{ width: `${koi.foodBar}%` }}
									/>
									<span>{koi.foodBar}/100</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				<section className={styles.section2}>
					<span>
						Variant:
						<br /> {koi.dictionary?.name || ""}
					</span>
					<span>
						Scale Type: <br />
						{toCapitalString(koi.dictionary?.scaleType || "")}
					</span>
					<span>
						Shape: <br />
						{toCapitalString(koi.dictionary?.shape || "")}
					</span>
					<span>
						Age: <br />
						{koi.age} days ({toCapitalString(koi.lifeStage || "")})
					</span>
					<span>
						Length: <br />
						{koi.length.toFixed(1)} cm
					</span>
					<span>
						Weight: <br />
						{koi.weight.toFixed(2)} kg
					</span>
				</section>

				<div className={styles.seperate}>
					<div className={styles.line} />
					<span>Genetics & Lineage</span>
					<div className={styles.line} />
				</div>

				<div className={styles.section3}>
					<section className={styles.mutation}>
						<span className={styles.label}>Mutation</span>
						<span className={styles.mutationType}>
							Doitsu Fin: <br />
							None
						</span>
						<span className={styles.mutationType}>
							Ginrin:
							<br /> None
						</span>
						<span className={styles.mutationType}>
							Longfin: <br />
							None
						</span>
					</section>
					<section className={styles.pedigree}>
						<div className={styles.pedigreeInfo}>
							<span className={styles.label}>Pedigree</span>
							<span className={styles.origin}>
								Origin: {koi.dictionary?.origin || ""}
							</span>
						</div>
						<div className={styles.parents}>
							<div className={styles.parentCard}>
								<div className={styles.parentCardHeader}>
									<span>Father:</span>
								</div>
								<section className={styles.parentImage}>
									<img
										src={`${koi.father ? (koi.father.imageUrl ?? "/kois/koi-empty.png") : "/kois/koi-empty.png"}`}
										alt="father"
									/>
								</section>
								<span className={styles.parentVarient}>
									{koi.father ? koi.father.name : "Unknown"}
								</span>
							</div>
							<div className={styles.parentCard}>
								<div className={styles.parentCardHeader}>
									<span>Mother:</span>
								</div>
								<section className={styles.parentImage}>
									<img
										src={`${koi.mother ? (koi.mother.imageUrl ?? "/kois/koi-empty.png") : "/kois/koi-empty.png"}`}
										alt="mother"
									/>
								</section>
								<span className={styles.parentVarient}>
									{koi.mother ? koi.mother.name : "Unknown"}
								</span>
							</div>
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

export default KoiProfile;
