import {
	BanknoteArrowUp,
	ChevronsUp,
	CircleCheckBig,
	CircleX,
	ClockArrowUp,
	Coins,
	Earth,
	RulerDimensionLine,
	SquarePen,
	Weight,
} from "lucide-react";
import { useState } from "react";
import {
	callUpdateKoiVarient,
	callUploadKoiVarientImage,
} from "../../../api/koiDictionary";
import type { IKoiVarient, IVariety } from "../../../types/backend";
import KoiForm from "../KoiForm/KoiForm";
import { toast } from "../Toast/toast";
import Toaster from "../Toast/Toaster";
import styles from "./KoiVarientRow.module.css";

interface KoiDictionaryCardProps {
	koi: IKoiVarient;
	varietyList: IVariety[];
}

function KoiVarientRow({ koi, varietyList }: KoiDictionaryCardProps) {
	const [isUpdateDialogOpen, setIsUpdateDialogOpen] =
		useState<boolean>(false);

	const handleUpdateKoiVarient = async (
		requestKoi: IKoiVarient,
		image: File | null,
	) => {
		if (image) {
			const imageResponse = await callUploadKoiVarientImage(image);
			if (imageResponse && imageResponse.data) {
				requestKoi.imageUrl = imageResponse.data.data?.url as string;
			} else {
				toast.error(
					<>
						<CircleX size="30" />
						<span>Failed to update koi varient's image!</span>
					</>,
				);
			}
		}

		const koiToUpdate: IKoiVarient = {
			id: koi.id,
			name: requestKoi.name,
			origin: requestKoi.origin,
			variety: requestKoi.variety,
			scaleType: requestKoi.scaleType,
			shape: requestKoi.shape,
			baseMaxLength: requestKoi.baseMaxLength,
			baseGrowthRate: requestKoi.baseGrowthRate,
			midAge: requestKoi.midAge,
			alphaWeight: requestKoi.alphaWeight,
			basePrice: requestKoi.basePrice,
			alphaPrice: requestKoi.alphaPrice,
			imageUrl: requestKoi.imageUrl,
		};

		await callUpdateKoiVarient(koiToUpdate);

		handleUpdateAttributes(koiToUpdate);

		toast.success(
			<>
				<CircleCheckBig size="30" />
				<span>Update koi #${koi.id} successfully!</span>
			</>,
		);
	};

	const handleUpdateAttributes = (requestKoi: IKoiVarient) => {
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
		koi.imageUrl = requestKoi.imageUrl;
	};

	const toCapitalString = (text: string) => {
		const firstCharacter = text.at(0)?.toUpperCase();
		return firstCharacter + text.toLowerCase().slice(1);
	};

	return (
		<>
			<div className={styles.card}>
				<section className={styles.image}>
					<img
						src={`${koi && koi.imageUrl ? koi.imageUrl : "/kois/koi-empty.png"}`}
						alt="koi-varient"
						onError={(e) => {
							e.currentTarget.src = "/kois/koi-empty.png";
						}}
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
									{koi.variety?.name || ""}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<span className={styles.fieldLabel}>
									Scale Type:
								</span>
								<span className={styles.scaleBadge}>
									{toCapitalString(koi.scaleType)}
								</span>
							</div>
							<div className={styles.fieldWrapper}>
								<span className={styles.fieldLabel}>
									Shape:
								</span>
								<span className={styles.shapeBadge}>
									{toCapitalString(koi.shape)}
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
						varietyList={varietyList}
						onClose={() => setIsUpdateDialogOpen(false)}
						onSubmit={handleUpdateKoiVarient}
					/>
				</div>
			) : null}
			<Toaster />
		</>
	);
}

export default KoiVarientRow;
