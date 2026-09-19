import { ArrowLeft, Mars, Venus, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { callFetchOwnedKoiProfile } from "../../../api/koi";
import { getApiErrorMessage } from "../../../api/client";
import { toast } from "../../shared/Toast/toast";
import type { IKoi, IKoiParent } from "../../../types/backend";
import styles from "./KoiProfile.module.css";

interface KoiProfileProps {
	koi: IKoi;
	onClose: () => void;
}

function KoiProfile({ koi: rootKoi, onClose }: KoiProfileProps) {
	const [history, setHistory] = useState<IKoi[]>([]);
	const [loadingParentId, setLoadingParentId] = useState<number | null>(null);
	const requestVersion = useRef(0);
	const pending = useRef(false);
	const contentRef = useRef<HTMLDivElement>(null);
	const koi = history.at(-1) ?? rootKoi;

	useEffect(() => {
		setHistory([]);
		setLoadingParentId(null);
		pending.current = false;
		return () => { requestVersion.current++; };
	}, [rootKoi.id]);

	useEffect(() => { contentRef.current?.scrollTo(0, 0); }, [koi.id]);

	const openParent = async (parent: IKoiParent | null) => {
		if (!parent?.isBelongToUser || pending.current) return;
		pending.current = true;
		setLoadingParentId(parent.id);
		const version = ++requestVersion.current;
		try {
			const response = await callFetchOwnedKoiProfile(parent.id);
			if (version !== requestVersion.current) return;
			const profile = response.data.data;
			if (!profile || profile.id !== parent.id) throw new Error("Failed to load parent profile.");
			setHistory((previous) => [...previous, profile]);
		} catch (error) {
			if (version === requestVersion.current) toast.error(getApiErrorMessage(error, "Failed to load parent profile."));
		} finally {
			if (version === requestVersion.current) {
				pending.current = false;
				setLoadingParentId(null);
			}
		}
	};
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
				{history.length > 0 && <button type="button" className={styles.backButton}
					disabled={loadingParentId !== null} onClick={() => setHistory((previous) => previous.slice(0, -1))}>
					<ArrowLeft size={18} /> Back to {history.at(-2)?.name ?? rootKoi.name}
				</button>}
				<button
					type="button"
					className={styles.closeButton}
					onClick={() => { requestVersion.current++; onClose(); }}
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
							{([ ["Father", koi.father], ["Mother", koi.mother] ] as const).map(([label, parent]) => (
								<button key={label} type="button" className={styles.parentCard}
									disabled={!parent?.isBelongToUser || loadingParentId !== null}
									onClick={() => void openParent(parent)}
									title={!parent ? "Parent unknown" : parent.isBelongToUser ? `View ${label.toLowerCase()}'s profile` : "This parent is not owned by you"}>
									<span className={styles.parentCardHeader}>{label}:</span>
									<span className={styles.parentImage}>
										<img src={parent?.imageUrl ?? "/kois/koi-empty.png"} alt={label.toLowerCase()} />
									</span>
									<span className={styles.parentVarient}>{parent?.name ?? "Unknown"}</span>
									<small aria-live="polite">{loadingParentId === parent?.id ? "Loading..."
										: !parent ? "Parent unknown" : parent.isBelongToUser ? "View profile" : "Not owned by you"}</small>
								</button>
							))}
						</div>
					</section>
				</div>
			</div>
		</div>
	);
}

export default KoiProfile;
