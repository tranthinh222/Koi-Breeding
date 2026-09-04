import {
	Bubbles,
	CheckCheck,
	ChevronsLeft,
	ChevronsRight,
	CircleArrowLeft,
	CircleArrowRight,
	Droplets,
	Gauge,
	Thermometer,
	Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
	callFetchKoisInPond,
	callMoveKoi,
	callReleaseKoiToPond,
} from "../../api/koi";
import { toast } from "../../components/share/Toast/toast";
import ImportKoiForm from "../../components/user/pond/ImportKoiForm/ImportKoiForm";
import { PondCanvas } from "../../components/user/pond/PondCanvas/PondCanvas";
import PondInformation from "../../components/user/pond/PondInformation/PondInformation";
import PondUpgradeForm from "../../components/user/pond/PondUpgradeForm/PondUpgradeForm";
import type {
	IItemInventory,
	IKoi,
	IKoiVarient,
	IPond,
} from "../../types/backend";
import styles from "./Pond.module.css";

interface PondProps {
	pond: IPond;
	incomingKoi?: IKoi | null;
	onClose: () => void;
	onFetchPond: (page: "next" | "prev") => void;
	onUpdatePond: (name: string, description: string) => void;
	onUpgradePond: (pondId: number) => Promise<void>;
	onSwitchPond: (targetPond: IPond, koi: IKoi) => void;
	onClearIncomingKoi: () => void;
}

function Pond({
	pond,
	incomingKoi,
	onClose,
	onFetchPond,
	onUpdatePond,
	onUpgradePond,
	onSwitchPond,
	onClearIncomingKoi,
}: PondProps) {
	const navigate = useNavigate();
	const [isInformationDialogOpen, setIsInformationDialogOpen] =
		useState<boolean>(false);
	const [koiList, setKoiList] = useState<IKoi[]>([]);
	const [isAddKoiDialogOpen, setIsAddKoiDialogOpen] =
		useState<boolean>(false);
	const [isLevelingDialogOpen, setIsLevelingDialogOpen] =
		useState<boolean>(false);
	const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);
	const [isHudExpanded, setIsHudExpanded] = useState<boolean>(true);

	useEffect(() => {
		const fetchData = async () => {
			const data: IKoi[] = await handleFetchPondKoiList();
			if (incomingKoi && !data.some((k) => k.id === incomingKoi.id)) {
				data.push({ ...incomingKoi, pondId: pond.id });
			}
			setKoiList(data);
			setIsInitialLoaded(true);
		};

		fetchData();
	}, []);

	useEffect(() => {
		if (incomingKoi) {
			const timer = setTimeout(() => {
				onClearIncomingKoi();
			}, 1000);
			return () => clearTimeout(timer);
		}
	}, [incomingKoi, onClearIncomingKoi]);

	const handleFetchPondKoiList = async (): Promise<IKoi[]> => {
		try {
			const response = await callFetchKoisInPond(pond.id);
			const backendKois = response.data.data ?? [];

			if (backendKois.length > 0) {
				return backendKois;
			}

			console.info(
				"No koi returned by the backend; using frontend sample koi.",
			);
			// return createMockKoiList(pond.id);
			return [];
		} catch (error) {
			console.error(
				"Failed to fetch pond koi; using frontend sample koi:",
				error,
			);
			return createMockKoiList(pond.id);
		}
	};

	const handleImportKoi = async (
		koiItem: IItemInventory,
		quantity: number,
	) => {
		try {
			const response = await callReleaseKoiToPond({
				pondId: pond.id,
				inventoryId: koiItem.id,
				quantity: quantity,
			});
			const newMembers: IKoi[] = response.data.data ?? [];

			if (!newMembers.length) {
				toast.error("Failed to release koi(s) to the current pond.");
				return;
			}
			setTimeout(() => {
				setKoiList((prev) => [...prev, ...newMembers]);
				toast.success(
					`Released x${quantity} ${koiItem.name.substring(6)} to current pond!`,
				);
			}, 500);
		} catch (error) {
			toast.error("Failed to release koi(s) to the current pond.");
		}
	};

	const handleMoveKoi = async (koi: IKoi, targetPond: IPond) => {
		try {
			await callMoveKoi({
				targetKoiId: koi.id,
				sourcePondId: koi.pondId,
				targetPondId: targetPond.id,
			});
			const movedKoi: IKoi = { ...koi, pondId: targetPond.id };

			setKoiList((prev) => prev.filter((k) => k.id !== koi.id));
			toast.success(`Moved ${koi.name} out of the pond!`);

			setTimeout(() => {
				onSwitchPond(targetPond, movedKoi);
			}, 400);
		} catch (error) {
			toast.error(`Failed to move ${koi.name} out of the pond.`);
		}
	};

	return (
		<>
			<main className={styles.wrapper}>
				<section className={styles.pondShell}>
					{isInitialLoaded && (
						<PondCanvas
							pondKoiList={koiList}
							pond={pond}
							justMovedKoiId={incomingKoi?.id}
							onMoveKoi={handleMoveKoi}
						/>
					)}
					{/* <DebugCanvas /> */}
					<div className={styles.coins}>
						<img src="/pond/coin.svg" alt="coin" />
						<span>9.000</span>
					</div>

					<div
						className={`${styles.statsHud} ${!isHudExpanded ? styles.collapsed : ""}`}
					>
						<button
							type="button"
							className={styles.hudToggleButton}
							onClick={() => setIsHudExpanded(!isHudExpanded)}
							title={
								isHudExpanded
									? "Collapse Stats"
									: "Expand Stats"
							}
						>
							{isHudExpanded ? (
								<ChevronsLeft />
							) : (
								<ChevronsRight />
							)}
						</button>

						<div className={styles.hudContent}>
							<div className={styles.hudItem} title="pH Level">
								<Droplets color="#667eea" /> {pond.pH}
							</div>
							<div className={styles.hudSeparator} />

							<div className={styles.hudItem} title="Temperature">
								<Thermometer color="#d97706" />{" "}
								{pond.temperature}°C
							</div>
							<div className={styles.hudSeparator} />

							<div
								className={styles.hudItem}
								title="Dissolved Oxygen"
							>
								<Bubbles color="#06b6d4" />{" "}
								{`${pond.oxygen} mg/L`}
							</div>
							<div className={styles.hudSeparator} />

							<div
								className={styles.hudItem}
								title="Water Quality"
							>
								<CheckCheck color="#16a34a" />{" "}
								{pond.waterQuality}/100
							</div>
							<div className={styles.hudSeparator} />

							<div
								className={styles.hudItem}
								title="Environment Score"
							>
								<Gauge color="#7c3aed" />{" "}
								{pond.environmentScore}/100
							</div>
						</div>
					</div>

					<div className={styles.header}>
						<button
							className={styles.navButton}
							type="button"
							title="marketplace"
							onClick={() =>
								navigate("/transactions", {
									state: { returnToPond: pond },
								})
							}
						>
							<img src="/pond/store.png" alt="store" />
						</button>
						<button
							className={styles.navButton}
							type="button"
							title="dictionary"
							onClick={() => navigate("/dictionary")}
						>
							<img src="/pond/dictionary.svg" alt="dictionary" />
						</button>
						<button
							className={styles.navButton}
							type="button"
							title="shop"
							onClick={() =>
								navigate("/shop", {
									state: { returnToPond: pond },
								})
							}
						>
							<img
								src="/pond/shopping-cart.png"
								alt="marketplace"
							/>
						</button>
					</div>
					<div className={styles.footer}>
						<button
							type="button"
							className={styles.navButton}
							title="information"
							onClick={() => setIsInformationDialogOpen(true)}
						>
							<img
								src="/pond/information-button.png"
								alt="pond info"
							/>
						</button>
						<button
							type="button"
							className={styles.navButton}
							title="inventory"
							onClick={() =>
								navigate("/inventory", {
									state: { returnToPond: pond },
								})
							}
						>
							<img src="/pond/backpack.png" alt="inventory" />
						</button>
						<button
							type="button"
							className={styles.navButton}
							title="add koi"
							onClick={() => setIsAddKoiDialogOpen(true)}
						>
							<img src="/pond/add-koi.svg" alt="add koi" />
						</button>
						<button
							type="button"
							className={styles.navButton}
							title="upgrade"
							onClick={() => setIsLevelingDialogOpen(true)}
						>
							<img src="/pond/pond-leveling.svg" alt="upgrade" />
						</button>
						<button
							type="button"
							className={styles.navButton}
							title="breeding"
							onClick={() => navigate("/breeding")}
						>
							<img src="/pond/breeding.svg" alt="breeding" />
						</button>
					</div>

					<div className={styles.back}>
						<button
							type="button"
							className={styles.navButton}
							title="back"
							onClick={() => onClose()}
						>
							<Undo2 size={50} />
						</button>
					</div>
					<div className={`${styles.prevPond} ${styles.pagination}`}>
						<button
							type="button"
							className={styles.navButton}
							title="previous"
							// disabled={true}
							onClick={() => onFetchPond("prev")}
						>
							<CircleArrowLeft size={50} />
						</button>
					</div>
					<div className={`${styles.nextPond} ${styles.pagination}`}>
						<button
							type="button"
							className={styles.navButton}
							title="next"
							// disabled={true}
							onClick={() => onFetchPond("next")}
						>
							<CircleArrowRight size={50} />
						</button>
					</div>
				</section>
			</main>
			{isInformationDialogOpen && (
				<div className={styles.overlay}>
					<PondInformation
						pond={pond}
						onClose={() => setIsInformationDialogOpen(false)}
						onEdit={onUpdatePond}
						onUpgrade={() => onUpgradePond(pond.id)}
					/>
				</div>
			)}
			{isAddKoiDialogOpen && (
				<div className={styles.overlay}>
					<ImportKoiForm
						currentQuantity={koiList.length}
						pondCapacity={pond.capacity}
						onClose={() => setIsAddKoiDialogOpen(false)}
						onSubmit={handleImportKoi}
					/>
				</div>
			)}
			{isLevelingDialogOpen && (
				<div className={styles.overlay}>
					<PondUpgradeForm
						pond={pond}
						onClose={() => setIsLevelingDialogOpen(false)}
						onSubmit={() => onUpgradePond(pond.id)}
					/>
				</div>
			)}
		</>
	);
}

export default Pond;

const MOCK_VARIENT: IKoiVarient[] = [
	{
		id: 1,
		name: "Kohaku",
		origin: "Japan",
		scaleType: "WAGOI",
		shape: "STANDARD",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 100,
		alphaPrice: 1.68,
		imageUrl: "/kois/koi-fish-kohaku.svg",
	},
	{
		id: 2,
		name: "Menkaburi Kohaku",
		origin: "Japan",
		scaleType: "WAGOI",
		shape: "STANDARD",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 110,
		alphaPrice: 1.69,
		imageUrl: "/kois/koi-fish-menkaburi-kohaku.svg",
	},
	{
		id: 3,
		name: "Inazuma Kohaku",
		origin: "Japan",
		scaleType: "WAGOI",
		shape: "STANDARD",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 180,
		alphaPrice: 1.75,
		imageUrl: "/kois/koi-fish-inazuma-kohaku.svg",
	},
];

const createMockKoiList = (pondId: number): IKoi[] =>
	Array.from({ length: 6 }, (_value, index) => {
		const koiVarient = MOCK_VARIENT[index % MOCK_VARIENT.length];

		return {
			id: -(pondId * 100 + index + 1),
			name: `${koiVarient.name} ${index + 1}`,
			age: 50 + index * 5,
			length: 7.2 + (2 * Math.random() - 1),
			weight: 0.15 + (0.06 * Math.random() - 0.03),
			health: 90,
			foodBar: 80,
			gender: index % 2 === 0 ? "MALE" : "FEMALE",
			price: koiVarient.basePrice,
			mutation: null,
			bornedAt: new Date(),
			pondId,
			lifeStage: "FRY",
			father: null,
			mother: null,
			potential: 0.8 + 0.2 * Math.random(),
			dictionary: koiVarient,
			patternScore: Math.round(20 * Math.random() + 80),
			colorScore: Math.round(10 * Math.random() + 90),
			bodyScore: Math.round(30 * Math.random() + 70),
			skinScore: Math.round(15 * Math.random() + 85),
			scaleScore: Math.round(25 * Math.random() + 75),
		};
	});
