import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import type { IBreedingRecipe } from "../../../../types/backend";
import BreedingRecipeCard from "../BreedingRecipeCard/BreedingRecipeCard";
import styles from "./GuideBookTabContent.module.css";

interface GuideBookTabContentProps {
	currentRecipes: IBreedingRecipe[];
	currentPage: number;
	setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
	totalPages: number;
	searchTerm: string;
	setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
	isFiltering: boolean;
	setIsFilterOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function GuideBookTabContent({
	currentRecipes,
	currentPage,
	setCurrentPage,
	totalPages,
	searchTerm,
	setSearchTerm,
	isFiltering,
	setIsFilterOpen,
}: GuideBookTabContentProps) {
	return (
		<div className={styles.content}>
			<div className={styles.toolbar}>
				<div className={styles.searchBar}>
					<Search size={20} color="#a39c98" />
					<input
						type="text"
						placeholder="Search target koi..."
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setCurrentPage(1);
						}}
					/>
				</div>
				<button
					className={styles.filterButton}
					onClick={() => setIsFilterOpen(true)}
				>
					<Filter size={18} />
					Filter Target
					{isFiltering && (
						<span className={styles.activeFilterBadge}>!</span>
					)}
				</button>
			</div>

			<div className={styles.recipeGrid}>
				{currentRecipes.map((r) => (
					<BreedingRecipeCard key={r.id} recipe={r} />
				))}
			</div>

			<div className={styles.pagination}>
				<button
					className={styles.pageBtn}
					disabled={currentPage === 1}
					onClick={() => setCurrentPage((p) => p - 1)}
				>
					<ChevronLeft />
				</button>
				<span className={styles.pageInfo}>
					Page {currentPage} of {Math.max(1, totalPages)}
				</span>
				<button
					className={styles.pageBtn}
					disabled={currentPage === totalPages || totalPages === 0}
					onClick={() => setCurrentPage((p) => p + 1)}
				>
					<ChevronRight />
				</button>
			</div>
		</div>
	);
}

export default GuideBookTabContent;
