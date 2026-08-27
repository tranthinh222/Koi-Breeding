import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import EmptyCard from "../../components/user/dictionary/EmptyCard/EmptyCard";
import KoiDictionaryCard from "../../components/user/dictionary/KoiDictionaryCard/KoiDictionaryCard";
import type { IKoiVarient } from "../../types/backend";
import styles from "./Dictionary.module.css";

function Dictionary() {
	const navigate = useNavigate();
	const koi: IKoiVarient = {
		id: 1,
		name: "Kuchibeni-Kohaku",
		origin: "Japan",
		scaleType: "WAGOI",
		shape: "STANDARD",
		baseMaxLength: 0,
		baseGrowthRate: 0,
		midAge: 0,
		alphaWeight: 0,
		basePrice: 0,
		alphaPrice: 0,
	};
	const [, setPage] = useState<number>(0);
	const [data] = useState<(IKoiVarient | null)[]>([
		koi,
		koi,
		koi,
		koi,
		koi,
		koi,
		koi,
		koi,
	]);
	const [isFlippedPrev, setIsFlippedPrev] = useState<boolean>(false);
	const [isFlippedNext, setIsFlippedNext] = useState<boolean>(false);

	const bookPrevRef = useRef<HTMLDivElement>(null);
	const bookNextRef = useRef<HTMLDivElement>(null);

	const handlePrevTransitionEnd = () => {
		if (!isFlippedPrev) {
			return;
		}

		const bookElement = bookPrevRef.current;
		if (!bookElement) {
			return;
		}

		console.log("Adu");

		bookElement.style.transition = "none";

		setIsFlippedPrev(false);

		setPage((prev) => prev - 1);

		void bookElement.offsetHeight;

		bookElement.style.transition = "";
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

		setIsFlippedNext(false);

		setPage((prev) => prev + 1);

		void bookElement.offsetHeight;

		bookElement.style.transition = "";
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
						onClick={() => {
							setIsFlippedPrev(!isFlippedPrev);
						}}
						disabled={isFlippedPrev || isFlippedNext}
					>
						Flip Prev
					</button>
					<button
						className={styles.flipButton}
						onClick={() => {
							setIsFlippedNext(!isFlippedNext);
						}}
						disabled={isFlippedPrev || isFlippedNext}
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
							{data
								.slice(0, 4)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={256 - index}
											koi={item}
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
											koi={item}
										/>
									) : (
										<EmptyCard key={index} />
									),
								)}
						</section>
						<section
							className={`${styles.page} ${styles.pageLeft} ${styles.pageLeftBack}`}
						>
							{data
								.slice(4, 8)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={8 - index}
											koi={item}
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
							{data
								.slice(4, 8)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={512 - index}
											koi={item}
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
											koi={item}
										/>
									) : (
										<EmptyCard key={1024 - index} />
									),
								)}
						</section>
						<section
							className={`${styles.page} ${styles.pageRight} ${styles.pageRightBack}`}
						>
							{data
								.slice(0, 4)
								.map((item, index) =>
									item ? (
										<KoiDictionaryCard
											key={192 - index}
											koi={item}
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
