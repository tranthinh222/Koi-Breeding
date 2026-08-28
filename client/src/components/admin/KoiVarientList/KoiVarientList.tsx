import { ArrowLeft, ArrowRight, ArrowUpDown, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	callCreateKoiVarient,
	callFetchKoiVarient,
	callUploadKoiVarientImage,
} from "../../../api/koiDictionary";
import { callCreateVariety, callFetchAllVarieties } from "../../../api/variety";
import type {
	IKoiVarient,
	IModelPagination,
	IVariety,
} from "../../../types/backend";
import Background from "../../share/Background/Background";
import { toast } from "../../share/Toast/toast";
import Toaster from "../../share/Toast/Toaster";
import KoiForm from "../KoiForm/KoiForm";
import KoiVarientRow from "../KoiVarientRow/KoiVarientRow";
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
				const response = await callFetchAllVarieties(`page=0&size=30`);
				const varietyList: IVariety[] =
					response.data.data?.result ?? [];
				setVarietyList(
					varietyList.sort(
						(a, b) => (a.id as number) - (b.id as number),
					),
				);
			} catch (error) {
				console.error("Failed to fetch data: ", JSON.stringify(error));
			}
		};

		loadData();
	}, []);

	// Fetch the page data
	useEffect(() => {
		const loadData = async () => {
			try {
				const response = await callFetchKoiVarient(
					`page=${page - 1}&size=${pageSize}`,
				);
				const varientData: IModelPagination<IKoiVarient> = response.data
					.data ?? {
					meta: {
						page: page,
						pageSize: pageSize,
						totalPages: 0,
						totalElements: 0,
					},
					result: [],
				};

				setData(varientData.result);
				setTotalPages(varientData.meta.totalPages);
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

	const handlePageChange = (newPage: number) => {
		if (Number.isNaN(newPage)) {
			return;
		}

		setPage(Math.max(1, newPage));
	};

	const handleCreateKoiVarient = async (
		requestKoi: IKoiVarient,
		image: File | null,
	) => {
		if (image) {
			const imageResponse = await callUploadKoiVarientImage(image);
			if (imageResponse && imageResponse.data) {
				requestKoi.imageUrl = imageResponse.data.data?.url as string;
			} else {
				toast.error("Failed to upload koi varient's image!");
			}
		}

		try {
			const response = await callCreateKoiVarient(requestKoi);
			const koiVarient: IKoiVarient | undefined = response.data.data;
			if (koiVarient) {
				setData((prev) => [koiVarient, ...prev]);
				toast.success("Create new koi successfully!");
			} else {
				toast.error("Failed to create new koi varient!");
			}
		} catch (error) {
			toast.error("Failed to create new koi varient!");
		}
	};

	const handleCreateVariety = async (requestVariety: IVariety) => {
		try {
			const response = await callCreateVariety(requestVariety);
			const koiVariety: IVariety | undefined = response.data.data;
			if (koiVariety) {
				setVarietyList([koiVariety, ...varietyList]);
				toast.success("Create new variety successfully!");
			} else {
				toast.error("Failed to create new koi variety!");
			}
		} catch (error) {
			toast.error("Failed to create new koi variety!");
		}
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
							<span>{`/ ${totalPages}`}</span>
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
