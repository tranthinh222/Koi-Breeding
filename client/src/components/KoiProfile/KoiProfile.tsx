import { ChevronRight, Venus } from "lucide-react";
import type { Koi } from "../../types";
import styles from "./KoiProfile.module.css";

interface KoiProfileProps {
	koi: Koi;
}

function KoiProfile({ koi }: KoiProfileProps) {
	return (
		<div className={styles.card}>
			<div className={styles.section1}>
				<section className={styles.image}>
					<img
						src={`/kois/${koi.name.toLowerCase().replace(" ", "-")}.png`}
						alt="koi"
					/>
				</section>
				<div className={styles.header}>
					<div className={styles.titleBar}>
						<span className={styles.name}>{koi.name}</span>
						<Venus size="30" />
					</div>
					<div className={styles.ratingType}>
						<div className={styles.rating}>
							<img src="/utilities/star-on.svg" alt="star" />
							<img src="/utilities/star-on.svg" alt="star" />
							<img src="/utilities/star-off.svg" alt="star" />
							<img src="/utilities/star-off.svg" alt="star" />
							<img src="/utilities/star-off.svg" alt="star" />
						</div>
						<span className={styles.typeBadge}>Genuine</span>
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
					{koi.dictionary?.scaleType || ""}
				</span>
				<span>
					Shape: <br />
					{koi.dictionary?.shape || ""}
				</span>
				<span>
					Age: <br />
					{koi.age} days
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
							<ChevronRight size="25" />
							<div className={styles.parentCardHeader}>
								<span>Father:</span>
							</div>
							<section className={styles.parentImage}>
								<img
									src={`/kois/${koi.name.toLowerCase().replace(" ", "-")}.png`}
									alt="koi"
								/>
							</section>
							<span className={styles.parentVarient}>
								{koi.father?.dictionary?.name ||
									"Kuchibeni-Kohaku"}
							</span>
						</div>
						<div className={styles.parentCard}>
							<ChevronRight size="25" />
							<div className={styles.parentCardHeader}>
								<span>Mother:</span>
							</div>
							<section className={styles.parentImage}>
								<img
									src={`/kois/${koi.name.toLowerCase().replace(" ", "-")}.png`}
									alt="koi"
								/>
							</section>
							<span className={styles.parentVarient}>
								{koi.mother?.dictionary?.name || "Taisho Sanke"}
							</span>
						</div>
					</div>
				</section>
			</div>
		</div>
	);
}

export default KoiProfile;
