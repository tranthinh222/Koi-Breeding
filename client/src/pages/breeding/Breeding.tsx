import { Filter, Mars, Undo2, Venus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/share/Toast/toast";
import Toaster from "../../components/share/Toast/Toaster";
import BreedingGuide from "../../components/user/breeding/BreedingGuide/BreedingGuide";
import BreedingHistory from "../../components/user/breeding/BreedingHistory/BreedingHistory";
import BreedingKoiCard from "../../components/user/breeding/BreedingKoiCard/BreedingKoiCard";
import FilterModal, {
	type IFilterState,
} from "../../components/user/breeding/FilterModal/FilterModal";
import ModeSwitcher from "../../components/user/breeding/ModeSwitcher/ModeSwitcher";
import PondSelectForm from "../../components/user/pond/PondSelectForm/PondSelectForm";
import type { IKoi, IKoiVarient, IPond } from "../../types/backend";
import styles from "./Breeding.module.css";

function Breeding() {
	const navigate = useNavigate();
	const [koiList, setKoiList] = useState<IKoi[]>([]);

	// Trạng thái hai con cá được chọn
	const [slot1, setSlot1] = useState<IKoi | null>(null);
	const [slot2, setSlot2] = useState<IKoi | null>(null);

	// Trạng thái cấu hình lai tạo
	const [isAutoMode, setIsAutoMode] = useState<boolean>(true);
	const [isSelectingPond, setIsSelectingPond] = useState<boolean>(false);

	// Trạng thái bộ lọc
	const [isFilter1Open, setIsFilter1Open] = useState(false);
	const [isFilter2Open, setIsFilter2Open] = useState(false);
	const [filter1, setFilter1] = useState<IFilterState>({
		gender: "MALE",
		pondId: "ALL",
		variety: "ALL",
	});
	const [filter2, setFilter2] = useState<IFilterState>({
		gender: "FEMALE",
		pondId: "ALL",
		variety: "ALL",
	});
	const [isGuideOpen, setIsGuideOpen] = useState(false);
	const [isHistoryOpen, setIsHistoryOpen] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const data: IKoi[] = await handleFetchUserKoiList();
			setKoiList(data);
		};
		fetchData();
	}, []);

	const handleFetchUserKoiList = async (): Promise<IKoi[]> => {
		console.info(
			"No koi returned by the backend; using frontend sample koi.",
		);
		return createMockKoiList(1);
	};

	// Logic Click chọn cá
	const handleSelectKoi = (koi: IKoi, slotNum: 1 | 2) => {
		if (
			(slotNum === 1 && slot2?.id === koi.id) ||
			(slotNum === 2 && slot1?.id === koi.id)
		) {
			toast.warning("This Koi is already selected in the other slot!");
			return;
		}
		if (slotNum === 1) {
			setSlot1(slot1?.id === koi.id ? null : koi);
		} else {
			setSlot2(slot2?.id === koi.id ? null : koi);
		}
	};

	// Logic bấm nút Breed (Thả tim)
	const handleBreedClick = () => {
		if (!slot1 || !slot2) return;
		if (slot1.gender === slot2.gender) {
			toast.warning(
				"Breeding usually requires one Male and one Female Koi!",
			);
			return;
		}
		setIsSelectingPond(true);
	};

	// Xử lý logic lọc danh sách
	const applyFilter = (list: IKoi[], filter: IFilterState) => {
		return list.filter((koi) => {
			const matchGender =
				filter.gender === "ALL" || koi.gender === filter.gender;
			const matchPond =
				filter.pondId === "ALL" ||
				koi.pondId.toString() === filter.pondId;
			const matchVariety =
				filter.variety === "ALL" ||
				koi.dictionary.name === filter.variety;
			return matchGender && matchPond && matchVariety;
		});
	};

	const filteredList1 = useMemo(
		() => applyFilter(koiList, filter1),
		[koiList, filter1],
	);
	const filteredList2 = useMemo(
		() => applyFilter(koiList, filter2),
		[koiList, filter2],
	);

	const uniquePonds = Array.from(new Set(koiList.map((k) => k.pondId)));
	const uniqueVarieties = Array.from(
		new Set(koiList.map((k) => k.dictionary.name)),
	);

	const isReadyToBreed = slot1 !== null && slot2 !== null;

	return (
		<>
			<div className={styles.mainContent}>
				{/* HEADER */}
				<div className={styles.titleSection}>
					<span>Koi Breeding</span>
				</div>

				{/* BODY */}
				<div className={styles.contentSection}>
					{/* MALE PARENT */}
					<div
						className={`${styles.parentsSection} ${styles.maleSection}`}
					>
						<div className={styles.parentHeading}>
							<Mars />
							<div>
								<h2>Father</h2>
								<span>Male Koi</span>
							</div>
						</div>
						<div className={styles.parentFilter}>
							<button
								className={styles.filterButton}
								onClick={() => setIsFilter1Open(true)}
							>
								<Filter size={18} /> Filter
							</button>
						</div>
						<div className={styles.parentList}>
							{filteredList1.length === 0 && (
								<p className={styles.emptyParentList}>
									No male koi found
								</p>
							)}
							{filteredList1.map((koi) => (
								<BreedingKoiCard
									key={koi.id}
									slot={slot1}
									koi={koi}
									isDisabled={slot2?.id === koi.id}
									onSelect={() => handleSelectKoi(koi, 1)}
									isReverse={true}
								/>
							))}
						</div>
					</div>

					{/* PANEL GIỮA: BREEDING STAGE */}
					<div className={styles.breedingSection}>
						<ModeSwitcher
							isAutoMode={isAutoMode}
							setIsAutoMode={setIsAutoMode}
						/>

						<div className={styles.mainBreedingArea}>
							<div className={styles.breedingSlotGroup}>
								<span
									className={`${styles.slotRole} ${styles.maleRole}`}
								>
									<Mars /> Father
								</span>
								<div
									className={`${styles.breedingSlot} ${styles.maleSlot}`}
									style={{
										borderColor: slot1 ? "transparent" : "",
									}}
								>
									{slot1 && (
										<img
										src={
											slot1.dictionary.imageUrl ??
											"/kois/koi-fish-null.svg"
										}
										alt="Father"
										style={{ transform: "scaleX(-1)" }}
										/>
									)}
								</div>
							</div>

							<button
								className={`${styles.heartButton} ${isReadyToBreed ? styles.ready : styles.disabled}`}
								disabled={!isReadyToBreed}
								onClick={handleBreedClick}
							>
								<img src="/pond/heart.png" alt="Breed" />
								<span className={styles.heartText}>
									{isReadyToBreed
										? "Tap to\nBreed"
										: "Select 2\nKois"}
								</span>
							</button>

							<div className={styles.breedingSlotGroup}>
								<span
									className={`${styles.slotRole} ${styles.femaleRole}`}
								>
									<Venus /> Mother
								</span>
								<div
									className={`${styles.breedingSlot} ${styles.femaleSlot}`}
									style={{
										borderColor: slot2 ? "transparent" : "",
									}}
								>
									{slot2 && (
										<img
										src={
											slot2.dictionary.imageUrl ??
											"/kois/koi-fish-null.svg"
										}
										alt="Mother"
										/>
									)}
								</div>
							</div>
						</div>

						{/* KHUNG KẾT QUẢ DỰ KIẾN (POSSIBLE RESULTS) */}
						{isReadyToBreed && (
							<div className={styles.possibleResultsContainer}>
								<span className={styles.possibleResultsTitle}>
									Possible Results
								</span>
								<div className={styles.resultsFrame}>
									{/* Bóng đen hiển thị kết quả ẩn */}
									<div className={styles.resultItem}>
										<img
											src={slot1.dictionary.imageUrl}
											className={styles.resultSilhouette}
											alt="?"
										/>
										<div
											className={styles.resultUnknownIcon}
										>
											?
										</div>
									</div>
									<div className={styles.resultItem}>
										<img
											src={slot2.dictionary.imageUrl}
											className={styles.resultSilhouette}
											alt="?"
											style={{ transform: "scaleX(-1)" }}
										/>
										<div
											className={styles.resultUnknownIcon}
										>
											?
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* FEMALE PARENT */}
					<div
						className={`${styles.parentsSection} ${styles.femaleSection}`}
					>
						<div className={styles.parentHeading}>
							<Venus />
							<div>
								<h2>Mother</h2>
								<span>Female Koi</span>
							</div>
						</div>
						<div className={styles.parentFilter}>
							<button
								className={styles.filterButton}
								onClick={() => setIsFilter2Open(true)}
							>
								<Filter size={18} /> Filter
							</button>
						</div>
						<div className={styles.parentList}>
							{filteredList2.length === 0 && (
								<p className={styles.emptyParentList}>
									No female koi found
								</p>
							)}
							{filteredList2.map((koi) => (
								<BreedingKoiCard
									key={koi.id}
									slot={slot2}
									koi={koi}
									isDisabled={slot1?.id === koi.id}
									onSelect={() => handleSelectKoi(koi, 2)}
								/>
							))}
						</div>
					</div>
				</div>

				{/* FOOTER BUTTONS */}
				<div className={styles.footerSection}>
					<div className={styles.footerLeft}>
						<button
							type="button"
							className={styles.actionBtn}
							title="Guide To Breeding"
							onClick={() => setIsGuideOpen(true)}
						>
							<img
								src="/breeding/guide-book.png"
								alt="breeding guide"
							/>
						</button>
						<button
							type="button"
							className={styles.actionBtn}
							title="Breeding History"
							onClick={() => setIsHistoryOpen(true)}
						>
							<img
								src="/breeding/history.png"
								alt="breeding history"
							/>
						</button>
					</div>
					<div className={styles.footerRight}>
						<button
							className={`${styles.actionBtn} ${styles.backBtn}`}
							onClick={() => navigate(-1)}
						>
							<div className={styles.iconBox}>
								<Undo2 size={30} />
							</div>
							Cancel
						</button>
					</div>
				</div>
			</div>

			{/* Render Filter Modals */}
			{isFilter1Open && (
				<FilterModal
					uniquePonds={uniquePonds}
					uniqueVarieties={uniqueVarieties}
					title="Filter Father"
					lockedGender="MALE"
					filter={filter1}
					setFilter={setFilter1}
					onClose={() => setIsFilter1Open(false)}
				/>
			)}
			{isFilter2Open && (
				<FilterModal
					uniquePonds={uniquePonds}
					uniqueVarieties={uniqueVarieties}
					title="Filter Mother"
					lockedGender="FEMALE"
					filter={filter2}
					setFilter={setFilter2}
					onClose={() => setIsFilter2Open(false)}
				/>
			)}

			{/* DIALOG CHỌN HỒ CÁCH LY */}
			{isSelectingPond && slot1 && (
				<div className={styles.overlay}>
					<PondSelectForm
						selectedKoi={slot1}
						currentPond={{ id: -1 } as IPond}
						onClose={() => setIsSelectingPond(false)}
						onSubmit={(targetPond: IPond) => {
							setIsSelectingPond(false);
							toast.success(
								`Parents moved to ${targetPond.name} for isolation! Breeding process started.`,
							);
						}}
					/>
				</div>
			)}
			{isGuideOpen && (
				<BreedingGuide onClose={() => setIsGuideOpen(false)} />
			)}
			{isHistoryOpen && (
				<BreedingHistory onClose={() => setIsHistoryOpen(false)} />
			)}
			<Toaster />
		</>
	);
}

export default Breeding;

// Dữ liệu Mock --------------------------
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
	Array.from({ length: 15 }, (_value, index) => {
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
			pondId: (index % 3) + 1,
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
