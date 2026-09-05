import { BookOpen, Calculator, Dna, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { callFetchAllVarieties } from "../../../../api/variety";
import type {
	IBreedingRecipe,
	IKoiVarient,
	IVariety,
} from "../../../../types/backend";
import { toast } from "../../../share/Toast/toast";
import BreedingCalculator from "../BreedingCalculator/BreedingCalculator";
import GuideBookTabContent from "../GuideBookTabContent/GuideBookTabContent";
import type { IBreedingFilterState } from "../GuideFilterModal/GuideFilterModal";
import GuideFilterModal from "../GuideFilterModal/GuideFilterModal";
import styles from "./BreedingGuide.module.css";

// --- MOCK DATA DỰA TRÊN Breeding_Table.md ---

const KOI_DB: IKoiVarient[] = [
	{
		id: 1,
		name: "Kohaku",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 1,
			name: "Kohaku",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 100,
		alphaPrice: 1.68,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787898045/uploads/dictionaries/p381ajo0i7lwby1gvkqq.svg",
	},
	{
		id: 2,
		name: "Menkaburi Kohaku",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 1,
			name: "Kohaku",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 110,
		alphaPrice: 1.69,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787898119/uploads/dictionaries/ibnfkr5m6tet8l2x2utp.svg",
	},
	{
		id: 34,
		name: "Shiro Utsuri Doitsu",
		shape: "STANDARD",
		scaleType: "DOITSU",
		variety: {
			id: 6,
			name: "Utsuri",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 85.0,
		baseGrowthRate: 0.0138,
		midAge: 440,
		alphaWeight: 0.000015,
		basePrice: 230,
		alphaPrice: 1.88,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787900283/uploads/dictionaries/vgvmcxrsjqsioavxqui3.svg",
	},
	{
		id: 12,
		name: "Tancho Showa",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 2,
			name: "Tancho",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.0138,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 260,
		alphaPrice: 1.95,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787899107/uploads/dictionaries/dqw1timfyngdyiaurwkk.svg",
	},
	{
		id: 54,
		name: "Konjo Asagi",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 13,
			name: "Asagi",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 85.0,
		baseGrowthRate: 0.0148,
		midAge: 480,
		alphaWeight: 0.000015,
		basePrice: 180,
		alphaPrice: 1.74,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787903283/uploads/dictionaries/xt8zqqxntlp1rky1vxaq.png",
	},

	{
		id: 26,
		name: "Goromo",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 5,
			name: "Goromo",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 85.0,
		baseGrowthRate: 0.014,
		midAge: 450,
		alphaWeight: 0.000015,
		basePrice: 170,
		alphaPrice: 1.78,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787899897/uploads/dictionaries/iregklsuczak6fmdlhgd.svg",
	},
	{
		id: 7,
		name: "Tancho Kohaku",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 1,
			name: "Kohaku",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.0149,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 220,
		alphaPrice: 1.9,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787898604/uploads/dictionaries/af9gaf2orqjfa7927kgx.svg",
	},
	{
		id: 10,
		name: "Ginrin Kohaku",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 1,
			name: "Kohaku",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.0148,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 170,
		alphaPrice: 1.75,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787898705/uploads/dictionaries/lzxvv9y3tyni50av6mby.svg",
	},
	{
		id: 61,
		name: "Ginrin",
		shape: "STANDARD",
		scaleType: "GINRIN",
		variety: {
			id: 16,
			name: "Ginrin",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 85.0,
		baseGrowthRate: 0.015,
		midAge: 410,
		alphaWeight: 0.000015,
		basePrice: 180,
		alphaPrice: 1.72,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787903467/uploads/dictionaries/malnjw4fiwcsxgwby4jx.svg",
	},
	{
		id: 37,
		name: "Hikari Shiro Utsuri",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 7,
			name: "Hikari Utsuri",
			description: "",
		},
		origin: "Japan",
		baseMaxLength: 85.0,
		baseGrowthRate: 0.0137,
		midAge: 430,
		alphaWeight: 0.000015,
		basePrice: 240,
		alphaPrice: 1.86,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787900946/uploads/dictionaries/d4x32uepcneyfxrz45ub.svg",
	},
	{
		id: 48,
		name: "Platinum Ogon",
		shape: "STANDARD",
		scaleType: "WAGOI",
		variety: {
			id: 12,
			name: "Hikari Muji",
			description:
				"Cá Koi Hikari Muji (hay Hikari Mono) là dòng cá đơn sắc đặc trưng với lớp vảy kim loại ánh kim rực rỡ, toàn thân chỉ có một màu duy nhất. Đây là nhóm Ogon trong hệ Kawarimono, nổi bật bởi sự óng ánh của vảy và màu sắc thuần khiết, tạo nên vẻ đẹp sang trọng và mạnh mẽ. Vây cá cùng màu với thân, đồng đều và sáng bóng, làm tăng thêm sự hài hòa tổng thể.\\nMột Hikari Muji đẹp phải có màu sắc đồng đều, ánh kim rõ rệt, vảy đều và sáng, thân hình cân đối, khỏe mạnh. Dòng này có nhiều biến thể theo màu sắc: Platinum Ogon (trắng ánh kim), Nezu Ogon (đen ánh kim), Yamabuki Ogon (vàng ánh kim), Hi Ogon (đỏ ánh kim), Orenji Ogon (cam ánh kim), và Mukashi Ogon (xám bạc ánh kim).\\nHikari Muji được yêu thích bởi sự đơn giản nhưng nổi bật, mang lại điểm nhấn mạnh mẽ trong hồ Koi. Với ánh kim lấp lánh và màu sắc thuần khiết, chúng tượng trưng cho sự thịnh vượng, sang trọng và quyền lực, trở thành một trong những giống Koi giá trị cao trong bộ sưu tập.",
		},
		origin: "Japan",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.0162,
		midAge: 360,
		alphaWeight: 0.000016,
		basePrice: 170,
		alphaPrice: 1.66,
		imageUrl:
			"https://res.cloudinary.com/djmcluh5n/image/upload/v1787903110/uploads/dictionaries/u0vaxmss6nzwpps7nkwl.png",
	},
];

const RECIPES: IBreedingRecipe[] = [
	{
		id: 0,
		father: KOI_DB[0],
		mother: KOI_DB[2],
		child: KOI_DB[3],
		type: "CROSS",
		childRate: 0.005,
		fatherRate: 0.35,
		motherRate: 0.3,
	},
	{
		id: 1,
		father: KOI_DB[0],
		mother: KOI_DB[4],
		child: KOI_DB[5],
		type: "CROSS",
		childRate: 0.005,
		fatherRate: 0.35,
		motherRate: 0.3,
	},
	{
		id: 2,
		father: KOI_DB[0],
		mother: KOI_DB[0],
		child: KOI_DB[0],
		type: "PURE",
		childRate: 0.88,
		fatherRate: 0.0,
		motherRate: 0.0,
	},
	{
		id: 3,
		father: KOI_DB[0],
		mother: KOI_DB[0],
		child: KOI_DB[6],
		type: "PURE",
		childRate: 0.05,
		fatherRate: 0.0,
		motherRate: 0.0,
	},
	{
		id: 4,
		father: KOI_DB[8],
		mother: KOI_DB[0],
		child: KOI_DB[7],
		type: "OVERLAY",
		childRate: 0.3,
		fatherRate: 0.1,
		motherRate: 0.6,
	},
	{
		id: 5,
		father: KOI_DB[10],
		mother: KOI_DB[2],
		child: KOI_DB[9],
		type: "OVERLAY",
		childRate: 0.3,
		fatherRate: 0.1,
		motherRate: 0.6,
	},
];

interface BreedingGuideProps {
	onClose: () => void;
}

function BreedingGuide({ onClose }: BreedingGuideProps) {
	const [activeTab, setActiveTab] = useState<"book" | "calculator">("book");
	const [varietyList, setVarietyList] = useState<IVariety[]>([]);

	// State cho Recipe Book
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const ITEMS_PER_PAGE = 6;

	// State cho Filter Modal (Tái sử dụng FilterModal)
	const [isFilterOpen, setIsFilterOpen] = useState(false);
	const [filterState, setFilterState] = useState<IBreedingFilterState>({
		breedingType: "ALL",
		variety: "ALL",
		body: "ALL",
		scaleType: "ALL",
	});

	// State cho Calculator
	const [calcP1, setCalcP1] = useState(KOI_DB[0].name);
	const [calcP2, setCalcP2] = useState(KOI_DB[1].name);

	const isFiltering =
		filterState.breedingType !== "ALL" ||
		filterState.variety !== "ALL" ||
		filterState.body !== "ALL" ||
		filterState.scaleType !== "ALL";

	// --- LOGIC CHO RECIPE BOOK ---
	const filteredRecipes = useMemo(() => {
		return RECIPES.filter((r) => {
			const targetInfo = r.child;

			// 1. Lọc theo chữ Search (Tìm kiếm theo Target Name)
			const matchSearch = r.child.name
				.toLowerCase()
				.includes(searchTerm.toLowerCase());

			// 2. Lọc theo bảng Filter Modal
			const matchBreedingType =
				filterState.breedingType === "ALL" ||
				r.type === filterState.breedingType;
			const matchVariety =
				filterState.variety === "ALL" ||
				targetInfo.name === filterState.variety;
			const matchBody =
				filterState.body === "ALL" ||
				targetInfo.shape === filterState.body;
			const matchScale =
				filterState.scaleType === "ALL" ||
				targetInfo.scaleType === filterState.scaleType;

			return (
				matchSearch &&
				matchBreedingType &&
				matchVariety &&
				matchBody &&
				matchScale
			);
		});
	}, [searchTerm, filterState]);

	const totalPages = Math.ceil(filteredRecipes.length / ITEMS_PER_PAGE);
	const currentRecipes = filteredRecipes.slice(
		(currentPage - 1) * ITEMS_PER_PAGE,
		currentPage * ITEMS_PER_PAGE,
	);

	useEffect(() => {
		const fetchVarieties = async () => {
			try {
				const response = await callFetchAllVarieties(`page=0&size=30`);
				const varietyList: IVariety[] =
					response.data.data?.result ?? MOCK_VARIETIES;
				setVarietyList(
					varietyList.sort(
						(a, b) => (a.id as number) - (b.id as number),
					),
				);
			} catch (error) {
				toast.error(
					"Failed to fetch varieties. Please try again later.",
				);
			}
		};

		fetchVarieties();
	}, []);

	// --- LOGIC CHO CALCULATOR ---
	const calculateResults = () => {
		if (calcP1 === calcP2) {
			// Lai cùng loài
			const sameRecipe = RECIPES.find(
				(r) => r.type === "PURE" && r.father.name === calcP1,
			);
			if (sameRecipe) {
				const results = [
					{ name: sameRecipe.child.name, prob: sameRecipe.childRate ?? sameRecipe.targetRate ?? 0 },
				];
				// sameRecipe.mutations?.forEach((m) =>
				// 	results.push({ name: m.name, prob: m.prob }),
				// );
				const totalKnown = results.reduce((sum, r) => sum + r.prob, 0);
				results.push({ name: "Trash/Random", prob: 1 - totalKnown });
				return results;
			}
			return [
				{ name: calcP1, prob: 0.8 },
				{ name: "Trash/Random", prob: 0.2 },
			];
		}

		// Lai chéo
		// Kiểm tra khớp đúng công thức (P1 là Bố, P2 là Mẹ)
		let recipe = RECIPES.find(
			(r) =>
				r.type === "CROSS" &&
				r.father.name === calcP1 &&
				r.mother.name === calcP2,
		);
		let isReversed = false;

		// Kiểm tra ngược (P1 là Mẹ, P2 là Bố)
		if (!recipe) {
			recipe = RECIPES.find(
				(r) =>
					r.type === "CROSS" &&
					r.father.name === calcP2 &&
					r.mother.name === calcP1,
			);
			isReversed = true;
		}

		if (recipe) {
			// Luật: Đổi chỗ bố mẹ thì x 0.25 cho mục tiêu, bố, mẹ.
			const multiplier = isReversed ? 0.25 : 1;
			const pTarget = (recipe.childRate || 0) * multiplier;
			const pP1 = (recipe.fatherRate || 0) * multiplier;
			const pP2 = (recipe.motherRate || 0) * multiplier;
			const pTrash = 1 - (pTarget + pP1 + pP2);

			return [
				{ name: recipe.child.name, prob: pTarget },
				{ name: recipe.father.name, prob: pP1 },
				{ name: recipe.mother.name, prob: pP2 },
				{ name: "Trash/Random", prob: Math.max(0, pTrash) },
			];
		}

		// Không có công thức
		return [
			{ name: calcP1, prob: 0.4 },
			{ name: calcP2, prob: 0.4 },
			{ name: "Trash/Random", prob: 0.2 },
		];
	};

	return (
		<div className={styles.overlay} onClick={onClose}>
			<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
				{/* HEADER */}
				<div className={styles.header}>
					<div className={styles.headerTitle}>
						<Dna size={36} color="#f2e943" />
						Breeding Guide
					</div>
					<button className={styles.closeBtn} onClick={onClose}>
						<X size={24} />
					</button>
				</div>

				{/* TABS */}
				<div className={styles.tabs}>
					<button
						className={`${styles.tabBtn} ${activeTab === "book" ? styles.active : ""}`}
						onClick={() => setActiveTab("book")}
					>
						<BookOpen size={20} /> Recipe Book
					</button>
					<button
						className={`${styles.tabBtn} ${activeTab === "calculator" ? styles.active : ""}`}
						onClick={() => setActiveTab("calculator")}
					>
						<Calculator size={20} /> Calculator Tester
					</button>
				</div>

				{/* CONTENT KHU VỰC 1: SÁCH HƯỚNG DẪN */}
				{activeTab === "book" && (
					<GuideBookTabContent
						currentRecipes={currentRecipes}
						currentPage={currentPage}
						setCurrentPage={setCurrentPage}
						totalPages={totalPages}
						searchTerm={searchTerm}
						setSearchTerm={setSearchTerm}
						isFiltering={isFiltering}
						setIsFilterOpen={setIsFilterOpen}
					/>
				)}

				{/* CONTENT KHU VỰC 2: MÁY TÍNH THỬ NGHIỆM */}
				{activeTab === "calculator" && (
					<BreedingCalculator
						calcP1={calcP1}
						setCalcP1={setCalcP1}
						calcP2={calcP2}
						setCalcP2={setCalcP2}
						koiVarients={KOI_DB}
						onCalculate={calculateResults}
					/>
				)}
				{isFilterOpen && (
					<GuideFilterModal
						title="Filter Target Koi"
						filter={filterState}
						varieties={varietyList}
						setFilter={(newFilter) => {
							setFilterState(newFilter);
							setCurrentPage(1); // Trở về trang 1 khi filter đổi
						}}
						onClose={() => setIsFilterOpen(false)}
					/>
				)}
			</div>
		</div>
	);
}

export default BreedingGuide;

const MOCK_VARIETIES = [
	{ id: 1, name: "Kohaku", description: "" },
	{ id: 2, name: "Tancho", description: "" },
	{ id: 3, name: "Taisho Sanke", description: "" },
	{ id: 4, name: "Showa Sanshoku", description: "" },
	{ id: 5, name: "Goromo", description: "" },
	{ id: 6, name: "Utsuri", description: "" },
	{ id: 7, name: "Hikari Utsuri", description: "" },
	{ id: 8, name: "Bekko", description: "" },
	{ id: 9, name: "Karashi", description: "" },
	{ id: 10, name: "Benigoi", description: "" },
	{ id: 11, name: "Chagoi", description: "" },
	{ id: 12, name: "Hikari Muji", description: "" },
	{ id: 13, name: "Asagi", description: "" },
	{ id: 14, name: "Shusui", description: "" },
	{ id: 15, name: "Goshiki", description: "" },
	{ id: 16, name: "Ginrin", description: "" },
	{ id: 17, name: "Hikarimoyo", description: "" },
	{ id: 18, name: "Kawarimono", description: "" },
];
