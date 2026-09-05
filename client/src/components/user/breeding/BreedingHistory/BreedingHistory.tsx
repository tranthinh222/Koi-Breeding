import {
	ArrowDownUp,
	ChevronLeft,
	ChevronRight,
	Heart,
	MapPin,
	Search,
	X,
} from "lucide-react";
import { useMemo, useState } from "react";
import type { IBreedingEvent } from "../../../../types/backend";
import styles from "./BreedingHistory.module.css";

// --- MOCK DATA DỰA THEO IBreedingEvent ---
const MOCK_HISTORY: IBreedingEvent[] = [
	{
		id: 1,
		user: { id: 1, username: "Player1" },
		male: {
			id: 101,
			name: "Kohaku M1",
			gender: "MALE",
			age: 2,
			length: 10,
			weight: 1,
			health: 100,
			foodBar: 100,
			price: 0,
			mutation: null,
			bornedAt: new Date(),
			pondId: 1,
			lifeStage: "ADULT",
			father: null,
			mother: null,
			potential: 1,
			patternScore: 90,
			colorScore: 90,
			bodyScore: 90,
			skinScore: 90,
			scaleScore: 90,
			dictionary: {
				name: "Kohaku",
				origin: "Japan",
				scaleType: "WAGOI",
				shape: "STANDARD",
				baseMaxLength: 90,
				baseGrowthRate: 0.015,
				midAge: 400,
				alphaWeight: 0.000015,
				basePrice: 100,
				alphaPrice: 1.68,
				imageUrl: "/kois/koi-fish-kohaku.svg",
			},
		},
		female: {
			id: 102,
			name: "Shiro F1",
			gender: "FEMALE",
			age: 2,
			length: 12,
			weight: 1.2,
			health: 100,
			foodBar: 100,
			price: 0,
			mutation: null,
			bornedAt: new Date(),
			pondId: 1,
			lifeStage: "ADULT",
			father: null,
			mother: null,
			potential: 1,
			patternScore: 90,
			colorScore: 90,
			bodyScore: 90,
			skinScore: 90,
			scaleScore: 90,
			dictionary: {
				name: "Shiro Utsuri",
				origin: "Japan",
				scaleType: "WAGOI",
				shape: "STANDARD",
				baseMaxLength: 90,
				baseGrowthRate: 0.015,
				midAge: 400,
				alphaWeight: 0.000015,
				basePrice: 100,
				alphaPrice: 1.68,
				imageUrl: "/kois/koi-fish-shiro-utsuri.svg",
			},
		},
		pond: { id: 2, name: "Isolation Pond A" },
		breedingType: "MANUAL",
		status: "COMPLETED",
		startedAt: new Date("2024-05-10T08:00:00"),
		expectedHatchDate: new Date("2024-05-15T08:00:00"),
		endedAt: new Date("2024-05-16T10:00:00"),
	},
	{
		id: 2,
		user: { id: 1, username: "Player1" },
		male: {
			id: 201,
			name: "Asagi Boy",
			gender: "MALE",
			age: 3,
			length: 15,
			weight: 1.5,
			health: 100,
			foodBar: 100,
			price: 0,
			mutation: null,
			bornedAt: new Date(),
			pondId: 1,
			lifeStage: "ADULT",
			father: null,
			mother: null,
			potential: 1,
			patternScore: 90,
			colorScore: 90,
			bodyScore: 90,
			skinScore: 90,
			scaleScore: 90,
			dictionary: {
				name: "Asagi",
				origin: "Japan",
				scaleType: "WAGOI",
				shape: "STANDARD",
				baseMaxLength: 90,
				baseGrowthRate: 0.015,
				midAge: 400,
				alphaWeight: 0.000015,
				basePrice: 100,
				alphaPrice: 1.68,
				imageUrl: "/kois/koi-fish-asagi.svg",
			},
		},
		female: {
			id: 202,
			name: "Doitsu Girl",
			gender: "FEMALE",
			age: 3,
			length: 14,
			weight: 1.4,
			health: 100,
			foodBar: 100,
			price: 0,
			mutation: null,
			bornedAt: new Date(),
			pondId: 1,
			lifeStage: "ADULT",
			father: null,
			mother: null,
			potential: 1,
			patternScore: 90,
			colorScore: 90,
			bodyScore: 90,
			skinScore: 90,
			scaleScore: 90,
			dictionary: {
				name: "Doitsu",
				origin: "Japan",
				scaleType: "DOITSU",
				shape: "STANDARD",
				baseMaxLength: 90,
				baseGrowthRate: 0.015,
				midAge: 400,
				alphaWeight: 0.000015,
				basePrice: 100,
				alphaPrice: 1.68,
				imageUrl: "/kois/koi-fish-doitsu.svg",
			},
		},
		pond: { id: 3, name: "Love Pond B" },
		breedingType: "AUTOMATIC",
		status: "EGG_LAID",
		startedAt: new Date("2024-05-18T09:30:00"),
		expectedHatchDate: new Date("2024-05-23T09:30:00"),
		endedAt: new Date("1970-01-01T00:00:00"), // Đại diện cho chưa kết thúc (hoặc null tùy Backend của bạn)
	},
];

interface BreedingHistoryProps {
	onClose: () => void;
}

function BreedingHistory({ onClose }: BreedingHistoryProps) {
	// const navigate = useNavigate();

	// --- STATE LỌC & TÌM KIẾM ---
	const [searchTerm, setSearchTerm] = useState("");
	const [filterType, setFilterType] = useState("ALL");
	const [filterStatus, setFilterStatus] = useState("ALL");
	const [filterPond, setFilterPond] = useState("ALL");
	const [filterIsEnded, setFilterIsEnded] = useState("ALL"); // ALL | ENDED | IN_PROGRESS

	// --- STATE SẮP XẾP ---
	const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC"); // Mới nhất xếp trước

	// --- STATE PHÂN TRANG ---
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 5;

	// Lấy danh sách các hồ có trong lịch sử để làm Filter Option
	const uniquePonds = Array.from(
		new Set(MOCK_HISTORY.map((h) => h.pond.name)),
	);

	// --- LOGIC XỬ LÝ MẢNG LỊCH SỬ ---
	const processedHistory = useMemo(() => {
		let result = [...MOCK_HISTORY]; // Thay MOCK_HISTORY bằng state chứa data gọi từ API

		// 1. Tìm kiếm (Tìm theo ID sự kiện, Tên cá nam, Tên cá nữ)
		if (searchTerm) {
			const term = searchTerm.toLowerCase();
			result = result.filter(
				(h) =>
					h.id.toString().includes(term) ||
					h.male.name.toLowerCase().includes(term) ||
					h.female.name.toLowerCase().includes(term),
			);
		}

		// 2. Lọc theo các tiêu chí (Dropdown)
		result = result.filter((h) => {
			const matchType =
				filterType === "ALL" || h.breedingType === filterType;
			const matchStatus =
				filterStatus === "ALL" || h.status === filterStatus;
			const matchPond =
				filterPond === "ALL" || h.pond.name === filterPond;

			// Xử lý cờ Ended (Giả sử nếu endedAt khác năm 1970 hoặc khác null thì là đã kết thúc)
			const isEnded =
				h.endedAt && new Date(h.endedAt).getFullYear() > 2000;
			let matchEnded = true;
			if (filterIsEnded === "ENDED") matchEnded = isEnded;
			if (filterIsEnded === "IN_PROGRESS") matchEnded = !isEnded;

			return matchType && matchStatus && matchPond && matchEnded;
		});

		// 3. Sắp xếp theo StartedAt
		result.sort((a, b) => {
			const timeA = new Date(a.startedAt).getTime();
			const timeB = new Date(b.startedAt).getTime();
			return sortOrder === "DESC" ? timeB - timeA : timeA - timeB;
		});

		return result;
	}, [
		searchTerm,
		filterType,
		filterStatus,
		filterPond,
		filterIsEnded,
		sortOrder,
	]);

	// Cắt mảng theo trang
	const totalPages = Math.ceil(processedHistory.length / ITEMS_PER_PAGE);
	const currentEvents = processedHistory.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	// Helper Format Date
	const formatDate = (date: Date) => {
		const d = new Date(date);
		return d.toLocaleString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true, // Hiển thị theo định dạng AM/PM
		});
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				<button className={styles.closeBtn} onClick={onClose}>
					<X size={24} />
				</button>
				{/* HEADER */}
				<div className={styles.titleSection}>
					<span>Breeding History</span>
				</div>

				{/* TOOLBAR: SEARCH & FILTERS */}
				<div className={styles.toolbar}>
					<div className={styles.searchBox}>
						<Search size={20} color="#a39c98" />
						<input
							type="text"
							placeholder="Search Koi name..."
							value={searchTerm}
							onChange={(e) => {
								setSearchTerm(e.target.value);
								setCurrentPage(1);
							}}
						/>
					</div>

					<div className={styles.filterGroup}>
						<select
							className={styles.filterSelect}
							value={filterType}
							onChange={(e) => {
								setFilterType(e.target.value);
								setCurrentPage(1);
							}}
						>
							<option value="ALL">All Types</option>
							<option value="MANUAL">Manual</option>
							<option value="AUTOMATIC">Automatic</option>
						</select>

						<select
							className={styles.filterSelect}
							value={filterStatus}
							onChange={(e) => {
								setFilterStatus(e.target.value);
								setCurrentPage(1);
							}}
						>
							<option value="ALL">All Status</option>
							<option value="STARTED">Started</option>
							<option value="EGG_LAID">Egg Laid</option>
							<option value="ISOLATED">Isolated</option>
							<option value="HATCHED">Hatched</option>
							<option value="COMPLETED">Completed</option>
							<option value="CANCELLED">Cancelled</option>
						</select>

						<select
							className={styles.filterSelect}
							value={filterPond}
							onChange={(e) => {
								setFilterPond(e.target.value);
								setCurrentPage(1);
							}}
						>
							<option value="ALL">All Ponds</option>
							{uniquePonds.map((pond) => (
								<option key={pond} value={pond}>
									{pond}
								</option>
							))}
						</select>

						<select
							className={styles.filterSelect}
							value={filterIsEnded}
							onChange={(e) => {
								setFilterIsEnded(e.target.value);
								setCurrentPage(1);
							}}
						>
							<option value="ALL">Any Ending State</option>
							<option value="ENDED">Finished Events</option>
							<option value="IN_PROGRESS">In Progress</option>
						</select>

						<button
							className={styles.sortBtn}
							onClick={() =>
								setSortOrder((prev) =>
									prev === "DESC" ? "ASC" : "DESC",
								)
							}
							title="Sort by Date"
						>
							<ArrowDownUp size={16} />
							{sortOrder === "DESC"
								? "Newest First"
								: "Oldest First"}
						</button>
					</div>
				</div>

				{/* EVENT LIST */}
				<div className={styles.historyList}>
					{currentEvents.length === 0 ? (
						<h3
							style={{
								color: "white",
								textAlign: "center",
								marginTop: "50px",
							}}
						>
							No breeding records found.
						</h3>
					) : (
						currentEvents.map((event) => {
							const isEnded =
								event.endedAt &&
								new Date(event.endedAt).getFullYear() > 2000;

							return (
								<div
									key={event.id}
									className={styles.eventCard}
								>
									{/* Left: Meta Info */}
									<div className={styles.eventMeta}>
										<div
											className={`${styles.statusBadge} ${styles[`status${event.status}`]}`}
										>
											{event.status.replace("_", " ")}
										</div>
										<div className={styles.eventDate}>
											<span>
												Start:{" "}
												<strong>
													{formatDate(
														event.startedAt,
													)}
												</strong>
											</span>
											<span>
												Hatch:{" "}
												<strong>
													{formatDate(
														event.expectedHatchDate,
													)}
												</strong>
											</span>
											<span>
												End:{" "}
												{isEnded
													? formatDate(event.endedAt)
													: "---"}
											</span>
										</div>
									</div>

									{/* Right: Breeding Details */}
									<div className={styles.eventDetails}>
										<div className={styles.parentGroup}>
											{/* Male */}
											<div className={styles.parentKoi}>
												<img
													src={
														event.male.dictionary
															.imageUrl
													}
													alt="Male Koi"
												/>
												<div className={styles.koiMeta}>
													<span
														className={
															styles.koiName
														}
													>
														{event.male.name}
													</span>
													<span
														className={styles.koiId}
													>
														(♂ Male)
													</span>
												</div>
											</div>

											<Heart
												size={30}
												className={styles.heartIcon}
											/>

											{/* Female */}
											<div className={styles.parentKoi}>
												<img
													src={
														event.female.dictionary
															.imageUrl
													}
													alt="Female Koi"
													style={{
														transform: "scaleX(-1)",
													}}
												/>
												<div className={styles.koiMeta}>
													<span
														className={
															styles.koiName
														}
													>
														{event.female.name}
													</span>
													<span
														className={styles.koiId}
													>
														(♀ Female)
													</span>
												</div>
											</div>
										</div>

										{/* Extra Tags */}
										<div className={styles.eventExtra}>
											<div className={styles.typeBadge}>
												{event.breedingType} MODE
											</div>
											<div
												className={styles.pondInfo}
												title="Isolation Pond"
											>
												<MapPin
													size={16}
													color="#f5b942"
												/>{" "}
												{event.pond.name}
											</div>
										</div>
									</div>
								</div>
							);
						})
					)}
				</div>

				{/* PAGINATION */}
				{totalPages > 1 && (
					<div className={styles.pagination}>
						<button
							className={styles.pageBtn}
							disabled={currentPage === 1}
							onClick={() => setCurrentPage((p) => p - 1)}
						>
							<ChevronLeft />
						</button>
						<span className={styles.pageInfo}>
							Page {currentPage} of {totalPages}
						</span>
						<button
							className={styles.pageBtn}
							disabled={currentPage === totalPages}
							onClick={() => setCurrentPage((p) => p + 1)}
						>
							<ChevronRight />
						</button>
					</div>
				)}
			</div>
		</div>
	);
}

export default BreedingHistory;
