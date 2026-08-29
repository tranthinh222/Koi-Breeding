import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyCard from "../../components/user/dictionary/EmptyCard/EmptyCard";
import KoiDictionaryCard from "../../components/user/dictionary/KoiDictionaryCard/KoiDictionaryCard";
import type { IKoiVarient, IModelPagination } from "../../types/backend";
import styles from "./Dictionary.module.css";
import { callFetchKoiVarient } from "../../api/koiDictionary";

function Dictionary() {
	const navigate = useNavigate();

	const [page, setPage] = useState<number>(1);
	const [pageSize] = useState<number>(8);
	const [totalPages, setTotalPages] = useState<number>(1);

	const [data, setData] = useState<IKoiVarient[]>([]);
	const [incomingData, setIncomingData] = useState<IKoiVarient[]>([]);

	const [isFlippedPrev, setIsFlippedPrev] = useState<boolean>(false);
	const [isFlippedNext, setIsFlippedNext] = useState<boolean>(false);
	const [isProcessing, setIsProcessing] = useState<boolean>(false);

	const bookPrevRef = useRef<HTMLDivElement>(null);
	const bookNextRef = useRef<HTMLDivElement>(null);

	const fetchDictionaryData = async (
		targetPage: number,
	): Promise<IModelPagination<IKoiVarient> | null> => {
		try {
			const response = await callFetchKoiVarient(
				`page=${targetPage - 1}&size=${pageSize}`,
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

			return varientData;
		} catch (error) {
			console.error("Failed to fetch data:", error);
			return null;
		}
	};

	// Fetch the page data
	useEffect(() => {
		const loadInitialData = async () => {
			setIsProcessing(true);
			const initialData = await fetchDictionaryData(1);
			if (initialData) {
				setData(initialData.result);
				setTotalPages(initialData.meta.totalPages);
			}
			setIsProcessing(false);
		};

		loadInitialData();
	}, []);

	const handlePrev = async () => {
		setIsProcessing(true);
		const prevPage = page - 1;
		const previousData = await fetchDictionaryData(prevPage);

		if (previousData) {
			setIncomingData(previousData.result);
			setIsFlippedPrev(true);
		} else {
			setIsProcessing(false);
		}
	};

	const handleNext = async () => {
		setIsProcessing(true);
		const nextPage = page + 1;
		const nextData = await fetchDictionaryData(nextPage);

		if (nextData) {
			setIncomingData(nextData.result);
			setIsFlippedNext(true);
		} else {
			setIsProcessing(false);
		}
	};

	const handlePrevTransitionEnd = () => {
		if (!isFlippedPrev) {
			return;
		}

		const bookElement = bookPrevRef.current;
		if (!bookElement) {
			return;
		}

		bookElement.style.transition = "none";

		setData(incomingData);
		setPage((prev) => prev - 1);
		setIsFlippedPrev(false);

		void bookElement.offsetHeight;
		bookElement.style.transition = "";
		setIsProcessing(false);
	};

	const handleNextTransitionEnd = () => {
		if (!isFlippedNext) {
			return;
		}

		const bookElement = bookNextRef.current;
		if (!bookElement) {
			return;
		}

		console.log("Adu");

		bookElement.style.transition = "none";

		setData(incomingData);
		setPage((prev) => prev + 1);
		setIsFlippedNext(false);

		void bookElement.offsetHeight;
		bookElement.style.transition = "";
		setIsProcessing(false);
	};

	return (
		<main className={styles.screen}>
			<button
				type="button"
				className={styles.backButton}
				onClick={() => navigate(-1)}
				aria-label="Go back to the previous page"
			>
				<span aria-hidden="true">←</span>
				Back
			</button>
			<div className={styles.cover}>
				<div className={styles.flipGroup}>
					<button
						className={styles.flipButton}
						onClick={handlePrev}
						disabled={page === 1 || isProcessing}
					>
						Flip Prev
					</button>
					<button
						className={styles.flipButton}
						onClick={handleNext}
						disabled={page === totalPages || isProcessing}
					>
						Flip Next
					</button>
				</div>

				<div
					className={styles.sideContainer}
					style={{ zIndex: isFlippedPrev ? 20 : 1 }}
				>
					<div
						className={`${styles.bookWrapper} ${styles.bookWrapperLeft}`}
					>
						<section
							className={`${styles.page} ${styles.pageLeft}`}
						>
							{(isFlippedPrev ? incomingData : data)
								.slice(0, 4)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={256 - index}
											koiVarient={item}
										/>
									) : (
										<EmptyCard key={256 - index} />
									),
								)}
						</section>
					</div>
					<div
						ref={bookPrevRef}
						className={`${styles.bookWrapper} ${styles.bookWrapperLeft} ${isFlippedPrev ? `${styles.bookWrapperEffect} ${styles.isFlippedPrev}` : ""}`}
						onTransitionEnd={handlePrevTransitionEnd}
					>
						<section
							className={`${styles.page} ${styles.pageLeft} ${styles.pageLeftFront}`}
						>
							{data
								.slice(0, 4)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={index}
											koiVarient={item}
										/>
									) : (
										<EmptyCard key={index} />
									),
								)}
						</section>
						<section
							className={`${styles.page} ${styles.pageLeft} ${styles.pageLeftBack}`}
						>
							{incomingData
								.slice(4, 8)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={8 - index}
											koiVarient={item}
										/>
									) : (
										<EmptyCard key={8 - index} />
									),
								)}
						</section>
					</div>
				</div>

				<div
					className={styles.sideContainer}
					style={{ zIndex: isFlippedNext ? 20 : 1 }}
				>
					<div
						className={`${styles.bookWrapper} ${styles.bookWrapperRight}`}
					>
						<section
							className={`${styles.page} ${styles.pageRight}`}
						>
							{(isFlippedNext ? incomingData : data)
								.slice(4, 8)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={512 - index}
											koiVarient={item}
										/>
									) : (
										<EmptyCard key={512 - index} />
									),
								)}
						</section>
					</div>
					<div
						ref={bookNextRef}
						className={`${styles.bookWrapper} ${styles.bookWrapperRight} ${isFlippedNext ? `${styles.bookWrapperEffect} ${styles.isFlippedNext}` : ""}`}
						onTransitionEnd={handleNextTransitionEnd}
					>
						<section
							className={`${styles.page} ${styles.pageRight} ${styles.pageRightFront}`}
						>
							{data
								.slice(4, 8)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={1024 - index}
											koiVarient={item}
										/>
									) : (
										<EmptyCard key={1024 - index} />
									),
								)}
						</section>
						<section
							className={`${styles.page} ${styles.pageRight} ${styles.pageRightBack}`}
						>
							{incomingData
								.slice(0, 4)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={192 - index}
											koiVarient={item}
										/>
									) : (
										<EmptyCard key={192 - index} />
									),
								)}
						</section>
					</div>
				</div>
			</div>
		</main>
	);
}

export default Dictionary;

// const MOCK_VARIENT: IKoiVarient = {
// 	id: 1,
// 	name: "Kuchibeni-Kohaku",
// 	origin: "Japan",
// 	scaleType: "WAGOI",
// 	shape: "STANDARD",
// 	baseMaxLength: 0,
// 	baseGrowthRate: 0,
// 	midAge: 0,
// 	alphaWeight: 0,
// 	basePrice: 0,
// 	alphaPrice: 0,
// 	imageUrl: "/kois/koi-fish-kuchibeni-kohaku.svg",
// };
