import { X } from "lucide-react";
import styles from "./FilterModal.module.css";

export interface IFilterState {
	gender: string;
	pondId: string;
	variety: string;
}

interface FilterModalProps {
	uniquePonds: number[];
	uniqueVarieties: string[];
	title: string;
	filter: IFilterState;
	setFilter: React.Dispatch<React.SetStateAction<IFilterState>>;
	onClose: () => void;
	lockedGender?: "MALE" | "FEMALE";
}

function FilterModal({
	uniquePonds,
	uniqueVarieties,
	title,
	filter,
	setFilter,
	onClose,
	lockedGender,
}: FilterModalProps) {
	return (
		<div className={styles.overlay} onClick={onClose}>
			<div
				className={styles.filterModal}
				onClick={(e) => e.stopPropagation()}
			>
				<div className={styles.filterHeader}>
					<h3>{title}</h3>
					<button className={styles.filterCloseBtn} onClick={onClose}>
						<X size={24} />
					</button>
				</div>
				{lockedGender ? (
					<div className={styles.filterGroup}>
						<label>Breeding role</label>
						<div className={styles.lockedGender}>
							{lockedGender === "MALE" ? "♂ Male · Father" : "♀ Female · Mother"}
						</div>
					</div>
				) : (
					<div className={styles.filterGroup}>
						<label>Gender</label>
						<select
							value={filter.gender}
							onChange={(e) =>
								setFilter({ ...filter, gender: e.target.value })
							}
						>
							<option value="ALL">All Genders</option>
							<option value="MALE">Male</option>
							<option value="FEMALE">Female</option>
						</select>
					</div>
				)}
				<div className={styles.filterGroup}>
					<label>Pond</label>
					<select
						value={filter.pondId}
						onChange={(e) =>
							setFilter({ ...filter, pondId: e.target.value })
						}
					>
						<option value="ALL">All Ponds</option>
						{uniquePonds.map((pId) => (
							<option key={pId} value={pId}>
								Pond ID: {pId}
							</option>
						))}
					</select>
				</div>
				<div className={styles.filterGroup}>
					<label>Variety</label>
					<select
						value={filter.variety}
						onChange={(e) =>
							setFilter({ ...filter, variety: e.target.value })
						}
					>
						<option value="ALL">All Varieties</option>
						{uniqueVarieties.map((vName) => (
							<option key={vName} value={vName}>
								{vName}
							</option>
						))}
					</select>
				</div>
				<div className={styles.filterActions}>
					<button
						className={styles.btnReset}
						onClick={() => {
							setFilter({
								gender: lockedGender ?? "ALL",
								pondId: "ALL",
								variety: "ALL",
							});
							onClose();
						}}
					>
						Reset
					</button>
					<button className={styles.btnApply} onClick={onClose}>
						Apply
					</button>
				</div>
			</div>
		</div>
	);
}

export default FilterModal;
