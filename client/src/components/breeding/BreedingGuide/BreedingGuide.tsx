import { BookOpen, Calculator, Dna, X } from "lucide-react";
import { useEffect, useState } from "react";
import { callFetchPairRates } from "../../../api/breeding";
import { callFetchKoiVarient } from "../../../api/koiDictionary";
import { callFetchAllVarieties } from "../../../api/variety";
import type { IKoiVarient, IVariety } from "../../../types/backend";
import { toast } from "../../shared/Toast/toast";
import BreedingCalculator from "../BreedingCalculator/BreedingCalculator";
import GuideBookTabContent from "../GuideBookTabContent/GuideBookTabContent";
import styles from "./BreedingGuide.module.css";

interface BreedingGuideProps {
	onClose: () => void;
}

function BreedingGuide({ onClose }: BreedingGuideProps) {
	const [koiVarientList, setKoiVarientList] = useState<IKoiVarient[]>([]);
	const [activeTab, setActiveTab] = useState<"book" | "calculator">("book");
	const [varietyList, setVarietyList] = useState<IVariety[]>([]);

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

	useEffect(() => {
		const fetchKoiVarients = async () => {
			try {
				const response = await callFetchKoiVarient(`page=0&size=999`);
				const varients: IKoiVarient[] =
					response.data.data?.result ?? [];
				setKoiVarientList(
					varients.sort(
						(a, b) => (a.id as number) - (b.id as number),
					),
				);
			} catch (error) {
				toast.error(
					"Failed to fetch koi varients. Please try again later.",
				);
			}
		};

		fetchKoiVarients();
	}, []);

	// --- LOGIC CHO CALCULATOR ---
	const calculateResults = async (
		father: IKoiVarient,
		mother: IKoiVarient,
	) => {
		toast(
			`Breeding #${father.id}(${father.name}) + #${mother.id}(${mother.name})`,
		);

		try {
			const response = await callFetchPairRates(
				father.id as number,
				mother.id as number,
			);
			const result = response.data.data ?? [];

			return result;
		} catch (e) {
			toast.error(
				`Failed to fetch breeding result of (${father.name}, ${mother.name})`,
			);
		}

		return [];
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
					<GuideBookTabContent varietyList={varietyList} />
				)}

				{/* CONTENT KHU VỰC 2: MÁY TÍNH THỬ NGHIỆM */}
				{activeTab === "calculator" && koiVarientList.length > 0 && (
					<BreedingCalculator
						koiVarients={koiVarientList}
						onCalculate={calculateResults}
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
