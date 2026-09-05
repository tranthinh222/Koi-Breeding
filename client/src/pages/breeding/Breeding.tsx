import { Filter, Mars, Undo2, Venus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/share/Toast/toast";
import { callCreateBreedingEvent } from "../../api/breeding";
import { CURRENT_USER_ID } from "../../api/currentUser";
import { callFetchKoisInPond } from "../../api/koi";
import { callFetchAllPonds } from "../../api/pond";
import Toaster from "../../components/share/Toast/Toaster";
import BreedingGuide from "../../components/user/breeding/BreedingGuide/BreedingGuide";
import BreedingHistory from "../../components/user/breeding/BreedingHistory/BreedingHistory";
import BreedingKoiCard from "../../components/user/breeding/BreedingKoiCard/BreedingKoiCard";
import FilterModal, {
	type IFilterState,
} from "../../components/user/breeding/FilterModal/FilterModal";
import ModeSwitcher from "../../components/user/breeding/ModeSwitcher/ModeSwitcher";
import PondSelectForm from "../../components/user/pond/PondSelectForm/PondSelectForm";
import type { IKoi, IPond } from "../../types/backend";
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
	const [isSubmitting, setIsSubmitting] = useState(false);

	useEffect(() => {
		const fetchData = async () => {
			const data: IKoi[] = await handleFetchUserKoiList();
			setKoiList(data);
		};
		fetchData();
	}, []);

	const handleFetchUserKoiList = async (): Promise<IKoi[]> => {
		try {
			const ponds = await callFetchAllPonds(`owner=${CURRENT_USER_ID}&page=0&size=100`);
			const pondList = ponds.data.data?.result ?? [];
			const responses = await Promise.all(pondList.map((pond) => callFetchKoisInPond(pond.id)));
			return responses.flatMap((response) => response.data.data ?? []);
		} catch (error) {
			toast.error("Failed to load your koi.");
			return [];
		}
	};

	const handleStartBreeding = async (targetPond: IPond) => {
		if (!slot1 || !slot2 || isSubmitting) return;
		setIsSubmitting(true);
		try {
			const response = await callCreateBreedingEvent({
				fatherId: slot1.id, motherId: slot2.id, pondId: targetPond.id,
				breedingType: isAutoMode ? "AUTOMATIC" : "MANUAL", userId: CURRENT_USER_ID,
			});
			const event = response.data.data;
			setIsSelectingPond(false); setSlot1(null); setSlot2(null);
			toast.success(`Breeding started in ${targetPond.name}${event ? ` with ${event.expectedEggCount} estimated eggs` : ""}.`);
			setKoiList((list) => list.map((koi) => koi.id === slot1.id || koi.id === slot2.id ? { ...koi, pondId: targetPond.id } : koi));
		} catch (error) {
			const message = (error as { response?: { data?: { message?: string } } }).response?.data?.message;
			toast.error(message ?? "Could not start breeding. Please check the selected pond.");
		} finally { setIsSubmitting(false); }
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
						onSubmit={(targetPond: IPond) => void handleStartBreeding(targetPond)}
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
