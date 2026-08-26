import { CircleArrowLeft, CircleArrowRight, Undo2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/share/Toast/toast";
import ImportKoiForm from "../../components/user/pond/ImportKoiForm/ImportKoiForm";
import { PondCanvas } from "../../components/user/pond/PondCanvas/PondCanvas";
import PondInformation from "../../components/user/pond/PondInformation/PondInformation";
import type { IInventory, IKoi, IKoiVarient, IPond } from "../../types/backend";
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
		return MOCK_KOIS;
	};

	const handleImportKoi = async (koiItem: IInventory, quantity: number) => {
		const koiVarient: IKoiVarient = MOCK_VARIENT.find(
			(varient) => varient.id === koiItem.item?.effectValue,
		) as IKoiVarient;
		const newMembers: IKoi[] = Array.from({ length: quantity }, (_v, i) => {
			return {
				id: koiList.length + i,
				name: koiVarient.name,
				age: 50,
				length: 7.2 + (2 * Math.random() - 1),
				weight: 0.15 + (0.06 * Math.random() - 0.03),
				health: 90,
				foodBar: 80,
				cureBar: 100,
				gender: "MALE",
				price: koiVarient.basePrice,
				bornedAt: new Date(),
				lifeStage: "FRY",
				potential: 0.5 * Math.random() + 0.8,
				dictionary: koiVarient,
				patternScore: Math.round(20 * Math.random() + 80),
				colorScore: Math.round(10 * Math.random() + 90),
				bodyScore: Math.round(30 * Math.random() + 70),
				skinScore: Math.round(15 * Math.random() + 85),
				scaleScore: Math.round(25 * Math.random() + 75),
			};
		});

		setTimeout(() => {
			setKoiList((prev) => [...prev, ...newMembers]);
			toast.success(
				`Released x${quantity} ${koiVarient.name} to current pond!`,
			);
		}, 500);
	};

	return (
		<>
			<main className={styles.wrapper}>
				<section className={styles.pondShell}>
					<PondCanvas pondKoiList={koiList} pond={pond} />
					{/* <DebugCanvas /> */}
					{/* <div className={styles.pondLabel}>
						<span>Đàn koi</span>
						<strong>{fishCount} con</strong>
					</div> */}
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

const MOCK_KOIS: IKoi[] = [
	{
		id: 1,
		name: "Kohaku 1",
		age: 600,
		length: 92.5,
		weight: 5.15,
		health: 100,
		foodBar: 100,
		cureBar: 100,
		gender: "MALE",
		price: 5050,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.0,
		dictionary: MOCK_VARIENT[0],
		patternScore: 80,
		colorScore: 90,
		bodyScore: 70,
		skinScore: 85,
		scaleScore: 75,
	},
	{
		id: 2,
		name: "Menkaburi Kohaku 1",
		age: 450,
		length: 85.5,
		weight: 4.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 4320,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[1],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 3,
		name: "Inazuma Kohaku 1",
		age: 393,
		length: 68.0,
		weight: 3.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 4910,
		bornedAt: new Date(),
		lifeStage: "JUVENILE",
		potential: 1.1,
		dictionary: MOCK_VARIENT[2],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 4,
		name: "Kohaku 2",
		age: 520,
		length: 88.3,
		weight: 4.95,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 5010,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[0],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 5,
		name: "Menkaburi Kohaku 2",
		age: 405,
		length: 84.7,
		weight: 4.55,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "MALE",
		price: 4620,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[1],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 6,
		name: "Inazuma Kohaku 2",
		age: 490,
		length: 89.1,
		weight: 4.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "MALE",
		price: 4910,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[2],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 7,
		name: "Kohaku 3",
		age: 510,
		length: 87.3,
		weight: 4.8,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 5010,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[0],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 8,
		name: "Menkaburi Kohaku 3",
		age: 205,
		length: 84.7,
		weight: 4.55,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 4620,
		bornedAt: new Date(),
		lifeStage: "JUVENILE",
		potential: 1.05,
		dictionary: MOCK_VARIENT[1],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 9,
		name: "Inazuma Kohaku 3",
		age: 358,
		length: 80.5,
		weight: 3.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "MALE",
		price: 4910,
		bornedAt: new Date(),
		lifeStage: "JUVENILE",
		potential: 1.1,
		dictionary: MOCK_VARIENT[2],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
];
