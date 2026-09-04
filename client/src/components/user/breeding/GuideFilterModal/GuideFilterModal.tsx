import { X } from "lucide-react";
import type { IVariety } from "../../../../types/backend";
import styles from "./GuideFilterModal.module.css";

export interface IBreedingFilterState {
	breedingType: string;
	variety: string;
	body: string;
	scaleType: string;
}

interface FilterModalProps {
	title?: string;
	filter: IBreedingFilterState;
	varieties: IVariety[];
	setFilter: React.Dispatch<React.SetStateAction<IBreedingFilterState>>;
	onClose: () => void;
}

function GuideFilterModal({
	title = "Filter",
	filter,
	varieties,
	setFilter,
	onClose,
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

				{/* 0. Breeding Type Filter */}
				<div className={styles.filterGroup}>
					<label>Breeding Type</label>
					<select
						value={filter.breedingType}
						onChange={(e) =>
							setFilter({
								...filter,
								breedingType: e.target.value,
							})
						}
					>
						<option value="ALL">All Breeding Types</option>
						<option value="CROSS">Cross</option>
						<option value="PURE">Pure</option>
						<option value="OVERLAY">Overlay</option>
					</select>
				</div>

				{/* 1. Variety Filter */}
				<div className={styles.filterGroup}>
					<label>Variety</label>
					<select
						value={filter.variety}
						onChange={(e) =>
							setFilter({ ...filter, variety: e.target.value })
						}
					>
						<option value="ALL">All Varieties</option>
						{varieties.map((v) => (
							<option key={v.id} value={v.name}>
								{v.name}
							</option>
						))}
					</select>
				</div>

				{/* 2. Body Filter */}
				<div className={styles.filterGroup}>
					<label>Body</label>
					<select
						value={filter.body}
						onChange={(e) =>
							setFilter({ ...filter, body: e.target.value })
						}
					>
						<option value="ALL">All Body Types</option>
						<option value="STANDARD">Standard</option>
						<option value="BUTTERFLY">Butterfly</option>
					</select>
				</div>

				{/* 3. Scale Type Filter */}
				<div className={styles.filterGroup}>
					<label>Scale Type</label>
					<select
						value={filter.scaleType}
						onChange={(e) =>
							setFilter({ ...filter, scaleType: e.target.value })
						}
					>
						<option value="ALL">All Scale Types</option>
						<option value="WAGOI">Wagoi</option>
						<option value="DOITSU">Doitsu</option>
						<option value="GINRIN">Ginrin</option>
					</select>
				</div>

				<div className={styles.filterActions}>
					<button
						className={styles.btnReset}
						onClick={() => {
							setFilter({
								breedingType: "ALL",
								variety: "ALL",
								body: "ALL",
								scaleType: "ALL",
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

export default GuideFilterModal;
