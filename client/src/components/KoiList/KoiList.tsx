import { ArrowLeft, ArrowRight, ArrowUpDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { callCreateKoiVarient, callFetchKoiVarient } from "../../config/api";
import type { IKoiVarient, IModelPagination } from "../../types/backend";
import KoiForm from "../KoiForm/KoiForm";
import KoiRow from "../KoiRow/KoiRow";
import styles from "./KoiList.module.css";

// const kois: IKoiVarient[] = [
// 	{
// 		id: 1,
// 		name: "Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.015,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 100,
// 		alphaPrice: 1.68,
// 	},
// 	{
// 		id: 2,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 3,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 4,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 5,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 6,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 7,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 8,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 9,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 10,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 11,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 12,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 13,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 14,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 15,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// 	{
// 		id: 16,
// 		name: "Kuchibeni Kohaku",
// 		origin: "Japan",
// 		variety: { id: 1, name: "Kohaku", description: "lol" },
// 		scaleType: "Wagoi",
// 		shape: "Standard",
// 		baseMaxLength: 90.0,
// 		baseGrowthRate: 0.0149,
// 		midAge: 400,
// 		alphaWeight: 0.000015,
// 		basePrice: 120,
// 		alphaPrice: 1.7,
// 	},
// ];

function KoiList() {
	const [page, setPage] = useState<number>(1);
	const [pageSize, setPageSize] = useState<number>(10);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [data, setData] = useState<IKoiVarient[]>([]);
	const [isCreateDialogOpen, setIsCreateDialogOpen] =
		useState<boolean>(false);

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
		const response = await callCreateKoiVarient(requestKoi);
		setData((prev) => [response.data, ...prev]);
	};

	return (
		<>
			<div className={styles.container}>
				<div className={`${styles.cloud} ${styles.cloud1}`}></div>
				<div className={`${styles.cloud} ${styles.cloud2}`}></div>
				<div className={`${styles.cloud} ${styles.cloud3}`}></div>

				<div className={styles.background}>
					<div className={styles.grass}></div>

					<div className={`${styles.pond} ${styles.pond1}`}></div>
					<div className={`${styles.pond} ${styles.pond2}`}></div>
					<div className={`${styles.pond} ${styles.pond3}`}></div>

					<div
						className={`${styles.trees} ${styles.treesLeft}`}
					></div>

					<div
						className={`${styles.trees} ${styles.treesRight}`}
					></div>
				</div>
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
					<button
						type="button"
						className={styles.createButton}
						onClick={() => setIsCreateDialogOpen(true)}
					>
						Create Koi
					</button>
				</div>
				<div ref={listRef} className={styles.list}>
					{data.map((koi, index) => (
						<KoiRow key={index} koi={koi} />
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
						onClose={() => setIsCreateDialogOpen(false)}
						onSubmit={handleCreateKoiVarient}
					/>
				</div>
			) : null}
		</>
	);
}

export default KoiList;
