import { ChevronLeft, ChevronRight, Filter, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { callFetchBreedingRates } from "../../../api/breeding";
import type {
  BreedingRecipeType,
  IBreedingRecipe,
  IVariety,
} from "../../../types/backend";
import { toast } from "../../shared/Toast/toast";
import BreedingRecipeCard from "../BreedingRecipeCard/BreedingRecipeCard";
import type { IBreedingFilterState } from "../GuideFilterModal/GuideFilterModal";
import GuideFilterModal from "../GuideFilterModal/GuideFilterModal";
import styles from "./GuideBookTabContent.module.css";

interface QueryForm {
  page: number;
  size: number;
  search?: string;
  type?: BreedingRecipeType;
  varietyId?: number;
  shape?: string;
  scaleType?: string;
}

interface GuideBookTabContentProps {
  varietyList: IVariety[];
}

function GuideBookTabContent({ varietyList }: GuideBookTabContentProps) {
  const [breedingRecipeList, setBreedingRecipeList] = useState<
    IBreedingRecipe[]
  >([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const ITEMS_PER_PAGE = 6;

  // State cho Filter Modal (Tái sử dụng FilterModal)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterState, setFilterState] = useState<IBreedingFilterState>({
    breedingType: "ALL",
    variety: "ALL",
    body: "ALL",
    scaleType: "ALL",
  });

  const isFiltering =
    filterState.breedingType !== "ALL" ||
    filterState.variety !== "ALL" ||
    filterState.body !== "ALL" ||
    filterState.scaleType !== "ALL";

  const handleSearch = () => {
    setAppliedSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  useEffect(() => {
    const loadInitialBreedingRecipeData = async () => {
      const query: QueryForm = {
        page: currentPage - 1,
        size: ITEMS_PER_PAGE,
      };

      if (appliedSearchTerm && appliedSearchTerm.trim() !== "") {
        query.search = appliedSearchTerm.trim();
      }

      if (isFiltering) {
        if (filterState.breedingType !== "ALL") {
          query.type = filterState.breedingType as BreedingRecipeType;
        }

        if (filterState.variety !== "ALL") {
          query.varietyId = (
            varietyList.find((v) => v.name === filterState.variety) as IVariety
          ).id;
        }

        if (filterState.body !== "ALL") {
          query.shape = filterState.body;
        }

        if (filterState.scaleType !== "ALL") {
          query.scaleType = filterState.scaleType;
        }
      }

      try {
        setIsProcessing(true);
        const response = await callFetchBreedingRates(query);
        const initialData = response.data.data;
        if (initialData) {
          setBreedingRecipeList(initialData.result);
          setTotalPages(initialData.meta.totalPages);
        }
        setIsProcessing(false);
      } catch (error) {
        setIsProcessing(false);
        toast.error("Failed to fetch koi varients. Please try again later.");
      }
    };

    loadInitialBreedingRecipeData();
  }, [currentPage, filterState, appliedSearchTerm]);

  return (
    <>
      <div className={styles.content}>
        <div className={styles.toolbar}>
          <div className={styles.searchBar}>
            <Search size={20} color="#a39c98" />
            <input
              type="text"
              placeholder="Search target koi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
          </div>
          <button
            type="button"
            className={styles.searchBtn}
            onClick={handleSearch}
            disabled={isProcessing}
          >
            <Search size={20} color="#ffffff" />
          </button>
          <button
            className={styles.filterButton}
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter size={18} />
            Filter Target
            {isFiltering && <span className={styles.activeFilterBadge}>!</span>}
          </button>
        </div>

        <div className={styles.recipeGrid}>
          {breedingRecipeList.map((r) => (
            <BreedingRecipeCard key={r.id} recipe={r} />
          ))}
        </div>

        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            disabled={currentPage === 1 || isProcessing}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <ChevronLeft />
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} of {Math.max(1, totalPages)}
          </span>
          <button
            className={styles.pageBtn}
            disabled={currentPage === totalPages || isProcessing}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <ChevronRight />
          </button>
        </div>
      </div>
      {isFilterOpen && (
        <GuideFilterModal
          title="Filter Target Koi"
          filter={filterState}
          varieties={varietyList}
          setFilter={(newFilter) => {
            setFilterState(newFilter);
            setCurrentPage(1);
          }}
          onClose={() => setIsFilterOpen(false)}
        />
      )}
    </>
  );
}

export default GuideBookTabContent;
