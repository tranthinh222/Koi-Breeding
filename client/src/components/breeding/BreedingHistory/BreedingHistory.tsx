import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  callAdvanceBreedingEvent,
  callCancelBreedingEvent,
  callFetchBreedingHistory,
} from "../../../api/breeding";
import { getApiErrorMessage } from "../../../api/client";
import { useAuth } from "../../../context/AuthContext";
import type {
  BreedingStatus,
  BreedingType,
  IBreedingEvent,
} from "../../../types/backend";
import { toast } from "../../shared/Toast/toast";
import styles from "./BreedingHistory.module.css";

interface BreedingHistoryProps {
  onClose: () => void;
}

function BreedingHistory({ onClose }: BreedingHistoryProps) {
  const { currentUserId } = useAuth();
  const [events, setEvents] = useState<IBreedingEvent[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [filterPond, setFilterPond] = useState("ALL");
  const [filterIsEnded, setFilterIsEnded] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"DESC" | "ASC">("DESC");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [advancingEventId, setAdvancingEventId] = useState<number | null>(null);
  const [cancellingEventId, setCancellingEventId] = useState<number | null>(
    null,
  );
  const [now, setNow] = useState(() => Date.now());
  const ponds = Array.from(
    new Map(events.map((event) => [event.pond.id, event.pond])).values(),
  );

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await callFetchBreedingHistory({
          userId: currentUserId as number,
          page: currentPage - 1,
          size: 5,
          search: searchTerm || undefined,
          type: filterType === "ALL" ? undefined : (filterType as BreedingType),
          status:
            filterStatus === "ALL"
              ? undefined
              : (filterStatus as BreedingStatus),
          pondId: filterPond === "ALL" ? undefined : Number(filterPond),
          ended:
            filterIsEnded === "ALL" ? undefined : filterIsEnded === "ENDED",
          sort: `startedAt,${sortOrder.toLowerCase()}`,
        });
        setEvents(response.data.data?.result ?? []);
        setTotalPages(response.data.data?.meta.totalPages ?? 0);
      } catch {
        setEvents([]);
        toast.error("Failed to load breeding history.");
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [
    searchTerm,
    filterType,
    filterStatus,
    filterPond,
    filterIsEnded,
    sortOrder,
    currentPage,
    refreshKey,
  ]);

  const isAdvanceReady = (event: IBreedingEvent) => {
    const startedAt = new Date(event.startedAt).getTime();
    const expectedHatchDate = new Date(event.expectedHatchDate).getTime();
    const totalDuration = expectedHatchDate - startedAt;
    let dueAt: number | undefined;
    switch (event.status) {
      case "STARTED":
        dueAt = startedAt + totalDuration / 5;
        break;
      case "EGG_LAID":
        dueAt = startedAt + (totalDuration * 2) / 5;
        break;
      case "ISOLATED":
        dueAt = expectedHatchDate;
        break;
      case "HATCHED":
        dueAt = expectedHatchDate + 24 * 60 * 60 * 1000;
        break;
      default:
        return false;
    }

    return now >= dueAt;
  };

  const advance = async (event: IBreedingEvent) => {
    if (!isAdvanceReady(event) || advancingEventId !== null) return;
    setAdvancingEventId(event.id);
    try {
      await callAdvanceBreedingEvent(event.id, currentUserId as number);
      toast.success("Breeding moved to the next stage.");
      setRefreshKey((v) => v + 1);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "The next stage is not ready yet."),
      );
    } finally {
      setAdvancingEventId(null);
    }
  };

  const cancel = async (event: IBreedingEvent) => {
    if (cancellingEventId !== null) return;
    if (
      !window.confirm(
        `Cancel breeding between "${event.male.name}" and "${event.female.name}"? This cannot be undone.`,
      )
    )
      return;
    setCancellingEventId(event.id);
    try {
      await callCancelBreedingEvent(event.id, currentUserId as number);
      toast.success("Breeding event cancelled.");
      setRefreshKey((v) => v + 1);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error, "Failed to cancel breeding event."),
      );
    } finally {
      setCancellingEventId(null);
    }
  };

  const updateFilter = (setter: (value: string) => void, value: string) => {
    setter(value);
    setCurrentPage(1);
  };
  const formatDate = (date: string | Date) =>
    new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(event) => event.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} />
        </button>
        <div className={styles.titleSection}>
          <span>Breeding History</span>
        </div>
        <div className={styles.toolbar}>
          <div className={styles.searchBox}>
            <Search size={20} color="#a39c98" />
            <input
              placeholder="Search Koi name..."
              value={searchTerm}
              onChange={(e) => updateFilter(setSearchTerm, e.target.value)}
            />
          </div>
          <div className={styles.filterGroup}>
            <select
              className={styles.filterSelect}
              value={filterType}
              onChange={(e) => updateFilter(setFilterType, e.target.value)}
            >
              <option value="ALL">All Types</option>
              <option value="MANUAL">Manual</option>
              <option value="AUTOMATIC">Automatic</option>
            </select>
            <select
              className={styles.filterSelect}
              value={filterStatus}
              onChange={(e) => updateFilter(setFilterStatus, e.target.value)}
            >
              <option value="ALL">All Status</option>
              {[
                "STARTED",
                "EGG_LAID",
                "ISOLATED",
                "HATCHED",
                "COMPLETED",
                "CANCELLED",
              ].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              className={styles.filterSelect}
              value={filterPond}
              onChange={(e) => updateFilter(setFilterPond, e.target.value)}
            >
              <option value="ALL">All Ponds</option>
              {ponds.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <select
              className={styles.filterSelect}
              value={filterIsEnded}
              onChange={(e) => updateFilter(setFilterIsEnded, e.target.value)}
            >
              <option value="ALL">Any Ending State</option>
              <option value="ENDED">Finished Events</option>
              <option value="IN_PROGRESS">In Progress</option>
            </select>
            <button
              className={styles.sortBtn}
              onClick={() =>
                setSortOrder((v) => (v === "DESC" ? "ASC" : "DESC"))
              }
            >
              <ArrowDownUp size={16} />
              {sortOrder === "DESC" ? "Newest First" : "Oldest First"}
            </button>
          </div>
        </div>
        <div className={styles.historyList}>
          {loading ? (
            <h3 style={{ color: "white", textAlign: "center" }}>Loading...</h3>
          ) : events.length === 0 ? (
            <h3 style={{ color: "white", textAlign: "center" }}>
              No breeding records found.
            </h3>
          ) : (
            events.map((event) => (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventMeta}>
                  <div
                    className={`${styles.statusBadge} ${styles[`status${event.status}`]}`}
                  >
                    {event.status.replace("_", " ")}
                  </div>
                  <div className={styles.eventDate}>
                    <span>
                      Start: <strong>{formatDate(event.startedAt)}</strong>
                    </span>
                    <span>
                      Hatch:{" "}
                      <strong>{formatDate(event.expectedHatchDate)}</strong>
                    </span>
                    <span>
                      End: {event.endedAt ? formatDate(event.endedAt) : "---"}
                    </span>
                  </div>
                </div>
                <div className={styles.eventDetails}>
                  <div className={styles.parentGroup}>
                    <div className={styles.parentKoi}>
                      <img
                        src={
                          event.male.dictionary.imageUrl ??
                          "/kois/koi-fish-null.svg"
                        }
                        alt="Male Koi"
                      />
                      <div className={styles.koiMeta}>
                        <span className={styles.koiName}>
                          {event.male.name}
                        </span>
                        <span className={styles.koiId}>(♂ Male)</span>
                      </div>
                    </div>
                    <Heart size={30} className={styles.heartIcon} />
                    <div className={styles.parentKoi}>
                      <img
                        src={
                          event.female.dictionary.imageUrl ??
                          "/kois/koi-fish-null.svg"
                        }
                        alt="Female Koi"
                        style={{
                          transform: "scaleX(-1)",
                        }}
                      />
                      <div className={styles.koiMeta}>
                        <span className={styles.koiName}>
                          {event.female.name}
                        </span>
                        <span className={styles.koiId}>(♀ Female)</span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.eventExtra}>
                    <div className={styles.typeBadge}>
                      {event.breedingType} MODE
                    </div>
                    <div className={styles.pondInfo}>
                      <MapPin size={16} color="#f5b942" /> {event.pond.name}
                    </div>
                  </div>
                </div>
                {event.breedingType === "MANUAL" &&
                  !["COMPLETED", "CANCELLED"].includes(event.status) && (
                    <div className={styles.eventActions}>
                      <button
                        className={styles.sortBtn}
                        disabled={
                          advancingEventId === event.id ||
                          cancellingEventId !== null ||
                          !isAdvanceReady(event)
                        }
                        title={
                          isAdvanceReady(event)
                            ? "Advance to the next breeding stage"
                            : "This stage is not ready yet"
                        }
                        onClick={() => void advance(event)}
                      >
                        {advancingEventId === event.id
                          ? "Advancing..."
                          : "Next stage"}
                      </button>
                      <button
                        className={styles.cancelBtn}
                        disabled={
                          cancellingEventId === event.id ||
                          advancingEventId !== null
                        }
                        title="Cancel this breeding event"
                        onClick={() => void cancel(event)}
                      >
                        {cancellingEventId === event.id
                          ? "Cancelling..."
                          : "Cancel"}
                      </button>
                    </div>
                  )}
              </div>
            ))
          )}
        </div>
        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button
              className={styles.pageBtn}
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              <ChevronLeft />
            </button>
            <span className={styles.pageInfo}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              className={styles.pageBtn}
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default BreedingHistory;
