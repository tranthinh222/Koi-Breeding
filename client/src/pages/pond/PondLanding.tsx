import { CircleCheckBig } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/admin/Toast/toast";
import Toaster from "../../components/admin/Toast/Toaster";
import BuyPondForm from "../../components/user/pond/BuyPondForm/BuyPondForm";
import ShopBackground from "../../components/user/ShopBackground";
import type { IModelPagination, IPond } from "../../types/backend";
import Pond from "./Pond";
import styles from "./PondLanding.module.css";

function PondLanding() {
	const navigate = useNavigate();
	const [selectedPond, setSelectedPond] = useState<IPond | null>(null);
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [pondList, setPondList] = useState<IPond[]>([]);
	const [isBuyPondDialogOpen, setIsBuyPondDialogOpen] =
		useState<boolean>(false);
	const [hasNew, setHasNew] = useState<number[]>([]);

	// Fetch the page data
	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await fetchData(page, 6);
				setPondList(response.result);
				setTotalPages(response.meta.totalPages);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		loadData();
	}, [page]);

	const fetchData = async (
		page: number,
		pageSize: number,
	): Promise<IModelPagination<IPond>> => {
		// const response = await callFetchKoiVarient(
		//     `page=${page - 1}&size=${pageSize}`,
		// );

		// if (response && response.data) {
		//     return response.data.data as IModelPagination<IKoiVarient>;
		// }

		// return {
		//     meta: {
		//         page: page,
		//         pageSize: pageSize,
		//         totalPages: 0,
		//         totalElements: 0,
		//     },
		//     result: [],
		// };
		return {
			meta: {
				page: page,
				pageSize: pageSize,
				totalPages: Math.ceil(mockData.length / 6),
				totalElements: 0,
			},
			result: mockData,
		};
	};

	const handlePageChange = (newPage: number) => {
		if (Number.isNaN(newPage)) {
			return;
		}

		setPage(Math.max(1, newPage));
	};

	const handleBuyPond = async (
		formData: { name: string; description: string },
		price: number,
	) => {
		// const response = await callCreateVariety(requestVariety);
		// setVarietyList([response.data.data as IVariety, ...varietyList]);

		const newPond: IPond = {
			id: pondList.length,
			name: formData.name,
			level: 0,
			capacity: 0,
			waterQuality: 0,
			temperature: 0,
			pH: 0,
			oxygen: 0,
			createdAt: new Date(),
			description: formData.description,
		};

		setPondList([newPond, ...pondList]);
		setHasNew((prev) => [newPond.id, ...prev]);
		toast.success(
			<>
				<CircleCheckBig size="30" />
				<span>Buy new pond successfully!</span>
			</>,
		);
	};

	const handleUpdatePond = async (name: string, description: string) => {
		const pondIndex = pondList.findIndex(
			(item) => item.id === selectedPond?.id,
		);

		const newPond: IPond = {
			id: selectedPond?.id as number,
			name: name,
			level: selectedPond?.level as number,
			capacity: selectedPond?.capacity as number,
			waterQuality: selectedPond?.waterQuality as number,
			temperature: selectedPond?.temperature as number,
			pH: selectedPond?.pH as number,
			oxygen: selectedPond?.oxygen as number,
			createdAt: selectedPond?.createdAt as Date,
			description: description,
		};

		setPondList((prev) => {
			const newList = [...prev];
			newList[pondIndex] = newPond;
			return newList;
		});

		setSelectedPond(newPond);

		toast.success(
			<>
				<CircleCheckBig size="30" />
				<span>Update pond successfully!</span>
			</>,
		);
	};

	return (
		<>
			{selectedPond == null ? (
				<>
					<div className={styles.mainContent}>
						<div className={styles.titleSection}>
							<span>All Ponds</span>
						</div>

						<div className={styles.buyPond}>
							<button
								type="button"
								className={styles.buyPondButton}
								onClick={() => setIsBuyPondDialogOpen(true)}
								title="buy pond"
							>
								<img
									src="/pond/buy-pond-button.svg"
									alt="buy pond"
								/>
							</button>
						</div>

						<button
							type="button"
							className={styles.backButton}
							onClick={() => navigate("/")}
						>
							Back
						</button>

						<div className={styles.pondGrid}>
							{pondList.slice(0, 6).map((pond, index) => (
								<div
									key={pond.id}
									className={styles.pondItem}
									onClick={() => {
										console.log(
											`Selected pond: id='${pond.id}' | name='${pond.name}'`,
										);
										setSelectedPond(pond);
									}}
									title={pond.name}
								>
									<img
										src={`${hasNew.includes(pond.id) ? "/pond/pond-new.svg" : `/pond/pond-item-${index + 1}.svg`}`}
										alt={pond.name}
									/>
									<span className={styles.pondLabel}>
										{pond.name}
									</span>
								</div>
							))}
						</div>

						<div className={styles.paginationFooter}>
							<button
								type="button"
								className={styles.prevButton}
								disabled={page === 1}
								onClick={() =>
									handlePageChange(Math.max(1, page - 1))
								}
							>
								Previous
							</button>
							<button
								type="button"
								className={styles.nextButton}
								disabled={page === totalPages}
								onClick={() =>
									handlePageChange(
										Math.min(totalPages, page + 1),
									)
								}
							>
								Next
							</button>
						</div>
					</div>
					<ShopBackground />
					{isBuyPondDialogOpen && (
						<div className={styles.overlay}>
							<BuyPondForm
								onClose={() => setIsBuyPondDialogOpen(false)}
								onSubmit={handleBuyPond}
							/>
						</div>
					)}
				</>
			) : (
				<Pond
					key={selectedPond.id}
					pond={selectedPond}
					onClose={() => setSelectedPond(null)}
					onFetchPond={(page: "next" | "prev") => {
						const currentIndex = pondList.findIndex(
							(pond) => pond.id === selectedPond.id,
						);
						console.log(`CurrentIndex: ${currentIndex}`);
						if (
							(currentIndex === 0 && page === "prev") ||
							(currentIndex === pondList.length - 1 &&
								page === "next")
						) {
							return selectedPond;
						}

						const newPond = pondList.at(
							currentIndex + (page === "next" ? 1 : -1),
						) as IPond;

						setSelectedPond(newPond);
					}}
					onUpdatePond={handleUpdatePond}
				/>
			)}
			<Toaster />
		</>
	);
}

export default PondLanding;

const mockData: IPond[] = [
	{
		id: 1,
		name: "Kohaku Pond",
		level: 10,
		capacity: 15,
		waterQuality: 70,
		temperature: 20,
		pH: 3.6,
		oxygen: 6.2,
		createdAt: new Date(),
		description:
			"This pond is used to raise Kohaku koi fishes.\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes\nThis pond is used to raise Kohaku koi fishes",
	},
	{
		id: 2,
		name: "Uia Pond",
		level: 10,
		capacity: 10,
		waterQuality: 100,
		temperature: 24,
		pH: 7.1,
		oxygen: 6.2,
		createdAt: new Date(),
		description: "This pond is used to raise Kohaku koi fishes",
	},
	{
		id: 3,
		name: "A Pond",
		level: 10,
		capacity: 10,
		waterQuality: 100,
		temperature: 24,
		pH: 7.1,
		oxygen: 6.2,
		createdAt: new Date(),
		description: "This pond is used to raise Kohaku koi fishes",
	},
	{
		id: 4,
		name: "Showa Pond",
		level: 10,
		capacity: 10,
		waterQuality: 100,
		temperature: 24,
		pH: 7.1,
		oxygen: 6.2,
		createdAt: new Date(),
		description: "This pond is used to raise Kohaku koi fishes",
	},
	{
		id: 5,
		name: "Ronaldo Pond",
		level: 10,
		capacity: 10,
		waterQuality: 100,
		temperature: 24,
		pH: 7.1,
		oxygen: 6.2,
		createdAt: new Date(),
		description: "This pond is used to raise Kohaku koi fishes",
	},
	{
		id: 6,
		name: "Pikachu Pond",
		level: 10,
		capacity: 10,
		waterQuality: 100,
		temperature: 24,
		pH: 7.1,
		oxygen: 6.2,
		createdAt: new Date(),
		description: "This pond is used to raise Kohaku koi fishes",
	},
];
