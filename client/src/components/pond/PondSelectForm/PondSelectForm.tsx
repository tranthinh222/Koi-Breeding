import { MapPin, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { callFetchAllPonds } from "../../../api/pond";
import { useAuth } from "../../../context/AuthContext";
import type { IKoi, IModelPagination, IPond } from "../../../types/backend";
import { toast } from "../../shared/Toast/toast";
import styles from "./PondSelectForm.module.css";

interface PondSelectFormProps {
  selectedKoi: IKoi;
  currentPond: IPond;
  onClose: () => void;
  onSubmit: (targetPond: IPond, targetKoi: IKoi) => void;
}

function PondSelectForm({
  selectedKoi,
  currentPond,
  onClose,
  onSubmit,
}: PondSelectFormProps) {
  const { currentUserId } = useAuth();
  const [pondList, setPondList] = useState<IPond[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);

  // Fetch the page data
  useEffect(() => {
    const loadData = async () => {
      if (!currentUserId) {
        setPondList([]);
        return;
      }

      try {
        const response = await fetchData(page, 6);

        if (response.meta.totalElements === 0) {
          console.info(
            "No ponds returned by the backend; using frontend sample data.",
          );
          // setPondList(MOCK_PONDS);
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
        // setPondList(MOCK_PONDS);
        setTotalPages(1);
        if (page !== 1) setPage(1);
      }
    };

    loadData();
  }, [currentUserId, page]);

  const fetchData = async (
    page: number,
    pageSize: number,
  ): Promise<IModelPagination<IPond>> => {
    const response = await callFetchAllPonds(
      `owner=${currentUserId}&page=${page - 1}&size=${pageSize}`,
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

  const handleMoveKoi = async (pond: IPond) => {
    if (pond.id === currentPond.id) {
      toast(`Koi ${selectedKoi.name} is still in this pond.`);
      return;
    }
    if (pond.currentQuantity === pond.capacity) {
      toast.error(`Destination pond (${pond.name}) is currently full.`);
      return;
    }

    onSubmit(pond, selectedKoi);
  };

  return (
    <>
      <div className={styles.container}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <X size={30} />
        </button>

        {/* Form Header */}
        <div className={styles.formHeader}>
          <span className={styles.title}>Choose A Pond To Move Koi</span>
          <div className={styles.searchPanel}>
            <div className={styles.searchWrapper}>
              <Search size="30" color="#a9acb1" />
              <input type="text" placeholder="Search by name" />
            </div>
            <button type="button" className={styles.searchButton}>
              <Search size="30" color="#ffffff" />
            </button>
          </div>
        </div>

        <div className={styles.pondGrid}>
          {pondList.slice(0, 6).map((pond, index) => (
            <div
              key={pond.id}
              className={styles.pondItem}
              onClick={() => {
                handleMoveKoi(pond);
              }}
              title={pond.name}
            >
              <img src={`/pond/pond-item-${index + 1}.svg`} alt={pond.name} />
              <span className={styles.pondLabel}>{pond.name}</span>
              {pond.id === currentPond.id && <MapPin />}
            </div>
          ))}
        </div>

        <div className={styles.paginationFooter}>
          <button
            type="button"
            className={styles.prevButton}
            disabled={page === 1}
            onClick={() => handlePageChange(Math.max(1, page - 1))}
          >
            Previous
          </button>
          <button
            type="button"
            className={styles.nextButton}
            disabled={page === totalPages}
            onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default PondSelectForm;
