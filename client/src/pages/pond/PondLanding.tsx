import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CURRENT_USER_ID } from "../../api/currentUser";
import {
	callBuyPond,
	callFetchAllPonds,
	callUpdatePond,
	type IRequestBuyPondDTO,
} from "../../api/pond";
import { toast } from "../../components/share/Toast/toast";
import Toaster from "../../components/share/Toast/Toaster";
import BuyPondForm from "../../components/user/pond/BuyPondForm/BuyPondForm";
import ShopBackground from "../../components/user/ShopBackground";
import type {
	IKoi,
	IModelPagination,
	IOwner,
	IPond,
} from "../../types/backend";
import Pond from "./Pond";
import styles from "./PondLanding.module.css";

const MOCK_PONDS: IPond[] = [
	"Kohaku Pond",
	"Uia Pond",
	"A Pond",
	"Showa Pond",
	"Ronaldo Pond",
	"Pikachu Pond",
].map((name, index) => ({
	id: index + 1,
	owner: {
		id: CURRENT_USER_ID,
		username: "demo_user",
	},
	name,
	level: 10,
	capacity: index === 0 ? 15 : 10,
	waterQuality: index === 0 ? 70 : 100,
	temperature: index === 0 ? 20 : 24,
	pH: index === 0 ? 3.6 : 7.1,
	oxygen: 6.2,
	environmentScore: index === 0 ? 54 : 100,
	createdAt: new Date(),
	description: "This pond is used to raise Kohaku koi fishes",
}));

function PondLanding() {
	const navigate = useNavigate();
	const [selectedPond, setSelectedPond] = useState<IPond | null>(null);
	const [incomingKoi, setIncomingKoi] = useState<IKoi | null>(null);
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

				if (response.meta.totalElements === 0) {
					console.info(
						"No ponds returned by the backend; using frontend sample data.",
					);
					setPondList(MOCK_PONDS);
					setTotalPages(1);
					if (page !== 1) setPage(1);
					return;
				}

				setPondList(response.result);
				setTotalPages(response.meta.totalPages);
			} catch (error) {
				console.error(
					"Failed to fetch ponds; using frontend sample data:",
					error,
				);
				setPondList(MOCK_PONDS);
				setTotalPages(1);
				if (page !== 1) setPage(1);
			}
		};

		loadData();
	}, [page]);

	const fetchData = async (
		page: number,
		pageSize: number,
	): Promise<IModelPagination<IPond>> => {
		const response = await callFetchAllPonds(
			`owner=${CURRENT_USER_ID}&page=${page - 1}&size=${pageSize}`,
		);

		if (response && response.data) {
			return response.data.data as IModelPagination<IPond>;
		}

		return {
			meta: {
				page: page,
				pageSize: pageSize,
				totalPages: 0,
				totalElements: 0,
			},
			result: [],
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
		const request: IRequestBuyPondDTO = {
			name: formData.name,
			description: formData.description,
			price: price,
			ownerId: CURRENT_USER_ID,
		};

		const response = await callBuyPond(request);

		if (response && response.data) {
			const newPond: IPond = response.data.data as IPond;

			setPondList([newPond, ...pondList]);
			setHasNew((prev) => [newPond.id, ...prev]);
			toast.success("Buy new pond successfully!");
		} else {
			toast.error("Failed to buy pond!");
		}
	};

	const handleUpdatePondInformation = async (
		name: string,
		description: string,
	) => {
		const pondIndex = pondList.findIndex(
			(item) => item.id === selectedPond?.id,
		);

		const newPond: IPond = {
			id: selectedPond?.id as number,
			owner: selectedPond?.owner as IOwner,
			name: name,
			level: selectedPond?.level as number,
			capacity: selectedPond?.capacity as number,
			waterQuality: selectedPond?.waterQuality as number,
			temperature: selectedPond?.temperature as number,
			pH: selectedPond?.pH as number,
			oxygen: selectedPond?.oxygen as number,
			environmentScore: selectedPond?.environmentScore as number,
			createdAt: selectedPond?.createdAt as Date,
			description: description,
		};

		const response = await callUpdatePond(newPond);

		if (response && response.data) {
			const updatedPond: IPond = response.data.data as IPond;

			setPondList((prev) => {
				const newList = [...prev];
				newList[pondIndex] = updatedPond;
				return newList;
			});

			setSelectedPond(updatedPond);

			toast.success("Update pond successfully!");
		} else {
			toast.error("Failed to update pond information!");
		}
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
					incomingKoi={incomingKoi}
					onClose={() => {
						setSelectedPond(null);
						setIncomingKoi(null);
					}}
					onFetchPond={(page: "next" | "prev") => {
						const currentIndex = pondList.findIndex(
							(pond) => pond.id === selectedPond.id,
						);

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

						setIncomingKoi(null);

						setSelectedPond(newPond);
					}}
					onUpdatePond={handleUpdatePondInformation}
					onSwitchPond={(targetPond, koi) => {
						setIncomingKoi(koi);
						setSelectedPond(targetPond);
					}}
					onClearIncomingKoi={() => setIncomingKoi(null)}
				/>
			)}
			<Toaster />
		</>
	);
}

export default PondLanding;
