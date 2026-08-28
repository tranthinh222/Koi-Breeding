import { CircleArrowLeft, CircleArrowRight, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { callFetchKoisInPond, callReleaseKoiToPond } from "../../api/koi";
import { toast } from "../../components/share/Toast/toast";
import ImportKoiForm from "../../components/user/pond/ImportKoiForm/ImportKoiForm";
import { PondCanvas } from "../../components/user/pond/PondCanvas/PondCanvas";
import PondInformation from "../../components/user/pond/PondInformation/PondInformation";
import type {
	IItemInventory,
	IKoi,
	IKoiVarient,
	IPond,
} from "../../types/backend";
import styles from "./Pond.module.css";

interface PondProps {
	pond: IPond;
	onClose: () => void;
	onFetchPond: (page: "next" | "prev") => void;
	onUpdatePond: (name: string, description: string) => void;
}

function Pond({ pond, onClose, onFetchPond, onUpdatePond }: PondProps) {
	const navigate = useNavigate();
	const [isInformationDialogOpen, setIsInformationDialogOpen] =
		useState<boolean>(false);
	const [koiList, setKoiList] = useState<IKoi[]>([]);
	const [isAddKoiDialogOpen, setIsAddKoiDialogOpen] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			const data: IKoi[] = await handleFetchPondKoiList();
			setKoiList(data);
		};

		fetchData();
	}, []);

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
			return createMockKoiList(pond.id);
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
		const koiVarient: IKoiVarient = MOCK_VARIENT.find(
			(varient) => varient.id === koiItem.effectValue,
		) as IKoiVarient;

		console.log("Is called");

		const response = await callReleaseKoiToPond({
			pondId: pond.id,
			inventoryId: koiItem.id,
			quantity: quantity,
		});

		if (response && response.data) {
			const newMembers: IKoi[] = response.data.data as IKoi[];
			setTimeout(() => {
				setKoiList((prev) => [...prev, ...newMembers]);
				toast.success(
					`Released x${quantity} ${koiVarient.name} to current pond!`,
				);
			}, 500);
		} else {
			toast.error("Failed to release koi(s) to the current pond.");
		}
	};

	return (
		<>
			<main className={styles.wrapper}>
				<section className={styles.pondShell}>
					<PondCanvas pondKoiList={koiList} pond={pond} />
					{/* <DebugCanvas /> */}
					<div className={styles.coins}>
						<img src="/pond/coin.svg" alt="coin" />
						<span>9.000</span>
					</div>
					<div className={styles.header}>
						<button
							className={styles.navButton}
							type="button"
							title="marketplace"
							onClick={() => navigate("/transactions")}
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
							onClick={() => navigate("/shop")}
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
						{/* <button
							type="button"
							className={styles.navButton}
							title="all ponds"
						>
							<img src="/pond/pond-list-1.svg" alt="pond list" />
						</button> */}
						<button
							type="button"
							className={styles.navButton}
							title="inventory"
							onClick={() => navigate("/inventory")}
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
			cureBar: 100,
			gender: index % 2 === 0 ? "MALE" : "FEMALE",
			price: koiVarient.basePrice,
			mutation: null,
			bornedAt: new Date(),
			pondId,
			lifeStage: "FRY",
			fatherId: null,
			motherId: null,
			potential: 0.8 + 0.2 * Math.random(),
			dictionary: koiVarient,
			patternScore: Math.round(20 * Math.random() + 80),
			colorScore: Math.round(10 * Math.random() + 90),
			bodyScore: Math.round(30 * Math.random() + 70),
			skinScore: Math.round(15 * Math.random() + 85),
			scaleScore: Math.round(25 * Math.random() + 75),
		};
	});
