import {
	ArrowLeft,
	ArrowRight,
	ArrowUpDown,
	CircleCheckBig,
	Search,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	callCreateKoiVarient,
	callCreateVariety,
	callFetchAllVarieties,
	callFetchKoiVarient,
} from "../../../config/api";
import type {
	IKoiVarient,
	IModelPagination,
	IVariety,
} from "../../../types/backend";
import Background from "../../share/Background/Background";
import KoiForm from "../KoiForm/KoiForm";
import KoiVarientRow from "../KoiVarientRow/KoiVarientRow";
import { toast } from "../Toast/toast";
import Toaster from "../Toast/Toaster";
import VarietyForm from "../VarietyForm/VarietyForm";
import styles from "./KoiVarientList.module.css";

function KoiVarientList() {
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [data, setData] = useState<IKoiVarient[]>([]);
	const [isCreateDialogOpen, setIsCreateDialogOpen] =
		useState<boolean>(false);
	const [isVarietyDialogOpen, setIsVarietyDialogOpen] =
		useState<boolean>(false);
	const [varietyList, setVarietyList] = useState<IVariety[]>([]);

	// Load the varieties for the form
	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await featchVarieties(1, 30);
				setVarietyList(
					response.result.sort(
						(a, b) => (a.id as number) - (b.id as number),
					),
				);
			} catch (error) {
				console.error("Failed to fetch data: ", JSON.stringify(error));
			}
		};

		loadData();
	}, []);

	const featchVarieties = async (
		page: number,
		pageSize: number,
	): Promise<IModelPagination<IVariety>> => {
		const response = await callFetchAllVarieties(
			`page=${page - 1}&size=${pageSize}`,
		);

		return response.data;
	};

	// Fetch the page data
	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await fetchData(page, pageSize);
				setData(response.result);
				setTotalPages(response.meta.totalPages);
			} catch (error) {
				console.error("Failed to fetch data:", error);
			}
		};

		listRef.current?.scrollTo({
			top: 0,
			behavior: "smooth",
		});

		loadData();
	}, [page, pageSize]);

	const listRef = useRef<HTMLDivElement>(null);

	const fetchData = async (
		page: number,
		pageSize: number,
	): Promise<IModelPagination<IKoiVarient>> => {
		const response = await callFetchKoiVarient(
			`page=${page - 1}&size=${pageSize}`,
		);

		return response.data;
	};

	const handlePageChange = (newPage: number) => {
		if (Number.isNaN(newPage)) {
			return;
		}

		setPage(Math.max(1, newPage));
	};

	const handleCreateKoiVarient = async (requestKoi: IKoiVarient) => {
		console.log(`List request: ${JSON.stringify(requestKoi)}`);
		const response = await callCreateKoiVarient(requestKoi);
		setData((prev) => [response.data, ...prev]);
		toast.success(
			<>
				<CircleCheckBig size="30" />
				<span>Create new koi successfully!</span>
			</>,
		);
	};

	const handleCreateVariety = async (requestVariety: IVariety) => {
		const response = await callCreateVariety(requestVariety);
		setVarietyList([response.data, ...varietyList]);
		toast.success(
			<>
				<CircleCheckBig size="30" />
				<span>Create new variety successfully!</span>
			</>,
		);
	};

	return (
		<>
			<div className={styles.container}>
				<Background />
				<div className={styles.header}>
					<div className={styles.searchPanel}>
						<div className={styles.searchWrapper}>
							<Search size="30" color="#a9acb1" />
							<input
								type="text"
								placeholder="Search by name, origin, variety, ..."
							/>
						</div>
						<button type="button" className={styles.searchButton}>
							<Search size="30" color="#ffffff" />
						</button>
						<button type="button" className={styles.searchButton}>
							<ArrowUpDown size="30" color="#ffffff" />
						</button>
					</div>
					<div className={styles.headerButtons}>
						<button
							type="button"
							onClick={() => setIsVarietyDialogOpen(true)}
						>
							Create Variety
						</button>
						<button
							type="button"
							onClick={() => setIsCreateDialogOpen(true)}
						>
							Create Koi
						</button>
					</div>
				</div>
				<div ref={listRef} className={styles.list}>
					{data.map((koi, index) => (
						<KoiVarientRow
							key={index}
							koi={koi}
							varietyList={varietyList}
						/>
					))}
				</div>
				<div className={styles.footer}>
					<div className={styles.pageSizeSelect}>
						<span>Items per page</span>
						<select
							value={pageSize}
							onChange={(e) => {
								const newPageSize = Number.parseInt(
									e.target.value,
								);

								setPageSize(newPageSize);
								setPage(1);
							}}
						>
							<option value="10">10 items</option>
							<option value="20">20 items</option>
							<option value="50">50 items</option>
							<option value="100">100 items</option>
						</select>
					</div>
					<div className={styles.pageSelect}>
						<div className={styles.pageInput}>
							<span>Page</span>
							<input
								value={page}
								type="number"
								min="1"
								max={totalPages}
								onChange={(e) =>
									handlePageChange(
										Number.parseInt(e.target.value),
									)
								}
							/>
						</div>
						<div className={styles.pageButtons}>
							<button
								type="button"
								className={styles.prevButton}
								disabled={page == 1}
								onClick={() =>
									handlePageChange(Math.max(1, page - 1))
								}
							>
								<ArrowLeft />
							</button>
							<button
								type="button"
								className={styles.nextButton}
								disabled={page == totalPages}
								onClick={() => {
									handlePageChange(
										Math.min(totalPages, page + 1),
									);
								}}
							>
								<ArrowRight />
							</button>
						</div>
					</div>
				</div>
			</div>
			{isCreateDialogOpen ? (
				<div className={styles.overlay}>
					<KoiForm
						koi={null}
						varietyList={varietyList}
						onClose={() => setIsCreateDialogOpen(false)}
						onSubmit={handleCreateKoiVarient}
					/>
				</div>
			) : null}
			{isVarietyDialogOpen && (
				<div className={styles.overlay}>
					<VarietyForm
						variety={null}
						onClose={() => setIsVarietyDialogOpen(false)}
						onSubmit={handleCreateVariety}
					/>
				</div>
			)}
			<Toaster />
		</>
	);
}

export default KoiVarientList;
