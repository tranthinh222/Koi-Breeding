import {
	BanknoteArrowUp,
	ChevronsUp,
	ClockArrowUp,
	Coins,
	Earth,
	RulerDimensionLine,
	SquarePen,
	Weight,
} from "lucide-react";
import { useState } from "react";
import type { IKoiVarient } from "../../types/backend";
import KoiForm from "../KoiForm/KoiForm";
import styles from "./KoiRow.module.css";

interface KoiDictionaryCardProps {
	koi: IKoiVarient;
}

function KoiRow({ koi }: KoiDictionaryCardProps) {
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] =
		useState<boolean>(false);

	return (
		<>
			<div className={styles.card}>
				<section className={styles.image}>
					<img
						src={`/kois/${koi.name.toLowerCase().replace(" ", "-")}.png`}
						alt="koi"
					/>
				</section>
				<div className={styles.content}>
					<div className={styles.titleBar}>
						<span className={styles.name}>{koi.name}</span>
						<button
							type="button"
							className={styles.editButton}
							onClick={() => setIsUpdateDialogOpen(true)}
						>
							<SquarePen size="30" />
						</button>
					</div>
					<div className={styles.attributes}>
						<section className={styles.leftSection}>
							<div className={styles.fieldWrapper}>
								<span className={styles.fieldLabel}>
									ID: {koi.id}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<Earth size="30" color="#096649" />
								<span>
									<strong>Origin:</strong> {koi.origin}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<span className={styles.fieldLabel}>
									Variety:
								</span>
								<span className={styles.varietyBadge}>
									{koi.variety}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<span className={styles.fieldLabel}>
									Scale Type:
								</span>
								<span className={styles.scaleBadge}>
									{koi.scaleType}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<span className={styles.fieldLabel}>
									Shape:
								</span>
								<span className={styles.shapeBadge}>
									{koi.shape}
								</span>
							</div>
						</section>
						<section className={styles.rightSection}>
							<div className={styles.fieldWrapper}>
								<RulerDimensionLine size="30" color="#b49429" />
								<span>
									<strong>Base Max Length:</strong>{" "}
									{koi.baseMaxLength} cm
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<ChevronsUp size="30" color="#44d131" />
								<span>
									<strong>Base Growth Rate:</strong>{" "}
									{koi.baseGrowthRate}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<ClockArrowUp size="30" color="#aeb11a" />
								<span>
									<strong>Mid Age:</strong> {koi.midAge} days
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<Weight size="30" />
								<span>
									<strong>Alpha Weight:</strong>{" "}
									{koi.alphaWeight}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<Coins size="30" color="#d0d236" />
								<span>
									<strong>Base Price:</strong>{" "}
									{koi.basePrice}{" "}
								</span>
								<Coins size="24" color="#d0d236" />
							</div>
							<div className={styles.fieldWrapper}>
								<BanknoteArrowUp size="30" />
								<span>
									<strong>Alpha Price:</strong>{" "}
									{koi.alphaPrice}
								</span>
							</div>
						</section>
					</div>
				</div>
			</div>
			{isUpdateDialogOpen ? (
				<div className={styles.overlay}>
					<KoiForm
						koi={koi}
						onClose={() => setIsUpdateDialogOpen(false)}
						onSubmit={(requestKoi) => {
							koi.name = requestKoi.name;
							koi.origin = requestKoi.origin;
							koi.variety = requestKoi.variety;
							koi.scaleType = requestKoi.scaleType;
							koi.shape = requestKoi.shape;
							koi.baseMaxLength = requestKoi.baseMaxLength;
							koi.baseGrowthRate = requestKoi.baseGrowthRate;
							koi.midAge = requestKoi.midAge;
							koi.alphaWeight = requestKoi.alphaWeight;
							koi.basePrice = requestKoi.basePrice;
							koi.alphaPrice = requestKoi.alphaPrice;
						}}
					/>
				</div>
			) : null}
		</>
	);
}

export default KoiRow;
