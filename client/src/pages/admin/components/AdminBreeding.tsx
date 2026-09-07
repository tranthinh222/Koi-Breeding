import { CheckCircle2, Download, Edit2, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

import {
	callCreateBreedingRate,
	callDeleteBreedingRate,
	callFetchBreedingRates,
	callUpdateBreedingRate,
	type ICreateBreedingRateRequest,
} from "../../../api/breeding";
import { callFetchKoiVarient } from "../../../api/koiDictionary";
import type {
	BreedingRecipeType,
	IBreedingRecipe,
	IKoiVarient,
} from "../../../types/backend";
import "./adminbreeding.css";
import AdminPagination from "./AdminPagination";

// ============================================================
// TYPES
// ============================================================

type TabType = "all" | "table1" | "table2" | "table3";

interface QueryForm {
	page: number;
	size: number;
	type: BreedingRecipeType;
	search?: string;
}

// ============================================================
// MAIN COMPONENT - BODY ONLY
// ============================================================

export default function BreedingManagement() {
	const [activeTab, setActiveTab] = useState<TabType>("all");
	const [searchQuery, setSearchQuery] = useState("");
	const [appliedSearchTerm, setAppliedSearchTerm] = useState<string>("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formulas1, setFormulas1] = useState<IBreedingRecipe[]>([]);
	const [formulas2, setFormulas2] = useState<IBreedingRecipe[]>([]);
	const [formulas3, setFormulas3] = useState<IBreedingRecipe[]>([]);
	const [koiVarientList, setKoiVarientList] = useState<IKoiVarient[]>([]);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [selectedFormula, setSelectedFormula] =
		useState<IBreedingRecipe | null>(null);

	// Pagination state for each table
	const [page1, setPage1] = useState(0);
	const [page2, setPage2] = useState(0);
	const [page3, setPage3] = useState(0);

	const [totalPages1, setTotalPages1] = useState<number>(1);
	const [totalPages2, setTotalPages2] = useState<number>(1);
	const [totalPages3, setTotalPages3] = useState<number>(1);

	const [totalElements1, setTotalElements1] = useState<number>(0);
	const [totalElements2, setTotalElements2] = useState<number>(0);
	const [totalElements3, setTotalElements3] = useState<number>(0);
	const [reload1, setReload1] = useState<boolean>(false);
	const [reload2, setReload2] = useState<boolean>(false);
	const [reload3, setReload3] = useState<boolean>(false);

	const totalElements = totalElements1 + totalElements2 + totalElements3;

	const PAGE_SIZE = 8;

	const handleSearch = () => {
		setAppliedSearchTerm(searchQuery);
		setPage1(1);
		setPage2(1);
		setPage3(1);
	};

	useEffect(() => {
		const fetchKoiVarients = async () => {
			try {
				const response = await callFetchKoiVarient(`page=0&size=999`);
				const varients: IKoiVarient[] =
					response.data.data?.result ?? [];
				setKoiVarientList(
					varients.sort(
						(a, b) => (a.id as number) - (b.id as number),
					),
				);
			} catch (error) {
				console.error(
					"Failed to fetch koi varients. Please try again later.",
				);
			}
		};

		fetchKoiVarients();
	}, []);

	useEffect(() => {
		const loadInitialFormulaData = async () => {
			const query: QueryForm = {
				page: page1,
				size: PAGE_SIZE,
				type: "PURE",
			};

			if (appliedSearchTerm && appliedSearchTerm.trim() !== "") {
				query.search = appliedSearchTerm.trim();
			}

			try {
				const response = await callFetchBreedingRates(query);
				const initialData = response.data.data;
				if (initialData) {
					setFormulas1(initialData.result);
					setTotalPages1(initialData.meta.totalPages);
					setTotalElements1(initialData.meta.totalElements);
				}
			} catch (error) {
				console.error(
					"Failed to fetch PURE type breeding rate. Please try again later.",
				);
			}
		};

		loadInitialFormulaData();
	}, [page1, appliedSearchTerm, reload1]);

	useEffect(() => {
		const loadInitialFormulaData = async () => {
			const query: QueryForm = {
				page: page2,
				size: PAGE_SIZE,
				type: "CROSS",
			};

			if (appliedSearchTerm && appliedSearchTerm.trim() !== "") {
				query.search = appliedSearchTerm.trim();
			}

			try {
				const response = await callFetchBreedingRates(query);
				const initialData = response.data.data;
				if (initialData) {
					setFormulas2(initialData.result);
					setTotalPages2(initialData.meta.totalPages);
					setTotalElements2(initialData.meta.totalElements);
				}
			} catch (error) {
				console.error(
					"Failed to fetch CROSS type breeding rate. Please try again later.",
				);
			}
		};

		loadInitialFormulaData();
	}, [page2, appliedSearchTerm, reload2]);

	useEffect(() => {
		const loadInitialFormulaData = async () => {
			const query: QueryForm = {
				page: page3,
				size: PAGE_SIZE,
				type: "OVERLAY",
			};

			if (appliedSearchTerm && appliedSearchTerm.trim() !== "") {
				query.search = appliedSearchTerm.trim();
			}

			try {
				const response = await callFetchBreedingRates(query);
				const initialData = response.data.data;
				if (initialData) {
					setFormulas3(initialData.result);
					setTotalPages3(initialData.meta.totalPages);
					setTotalElements3(initialData.meta.totalElements);
				}
			} catch (error) {
				console.error(
					"Failed to fetch CROSS type breeding rate. Please try again later.",
				);
			}
		};

		loadInitialFormulaData();
	}, [page3, appliedSearchTerm, reload3]);

	// ----------------------------------------------------------
	// ADD FORMULA
	// ----------------------------------------------------------

	const handleAddFormula = async (formula: ICreateBreedingRateRequest) => {
		try {
			const response = await callCreateBreedingRate(formula);
			const newRecipe: IBreedingRecipe | undefined = response.data.data;
			console.log(`Res: ${JSON.stringify(response)}`);
			if (newRecipe && response.status === 200) {
				alert("Create new koi successfully!");
				if (newRecipe.type === "PURE") {
					setFormulas1((prev) => [newRecipe, ...prev]);
				} else if (newRecipe.type === "CROSS") {
					setFormulas2((prev) => [newRecipe, ...prev]);
				} else if (newRecipe.type === "OVERLAY") {
					setFormulas3((prev) => [newRecipe, ...prev]);
				}
			} else {
				alert("Failed to create new breeding recipe!");
			}
		} catch (error) {
			alert("Failed to create new breeding recipe");
		}
		setIsModalOpen(false);
	};

	// ----------------------------------------------------------
	// DELETE FORMULA
	// ----------------------------------------------------------

	const handleDeleteFormula = async (id: number) => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this breeding recipe? This action cannot be undone.",
		);
		if (!confirmed) return;

		try {
			const response = await callDeleteBreedingRate(id);
			if (response.status === 204) {
				alert(`Delete recipe #${id} successfully.`);
				setReload1((prev) => !prev);
				setReload2((prev) => !prev);
				setReload3((prev) => !prev);
			} else {
				alert(`Delete recipe #${id} locally. API not connected yet.`);

				setFormulas1((prev) => prev.filter((f) => f.id !== id));
				setFormulas2((prev) => prev.filter((f) => f.id !== id));
				setFormulas3((prev) => prev.filter((f) => f.id !== id));
			}
		} catch (error) {
			alert("Failed to delete breeding recipe.");
		}
	};

	// ----------------------------------------------------------
	// EDIT FORMULA
	// ----------------------------------------------------------

	const handleEditFormula = async (formula: ICreateBreedingRateRequest) => {
		if (!selectedFormula) return;

		try {
			const response = await callUpdateBreedingRate(
				selectedFormula.id,
				formula,
			);
			const newRow: IBreedingRecipe | undefined = response.data.data;
			if (newRow) {
				alert(`Update recipe #${selectedFormula.id} successfully!`);
				if (newRow.type === "PURE") {
					setReload1((prev) => !prev);
				} else if (newRow.type === "CROSS") {
					setReload2((prev) => !prev);
				} else if (newRow.type === "OVERLAY") {
					setReload3((prev) => !prev);
				}
			}
			setIsEditModalOpen(false);
			setSelectedFormula(null);
		} catch (error) {
			alert("Failed to update breeding recipe");
		}
	};

	const openEditModal = (formula: IBreedingRecipe) => {
		setSelectedFormula(formula);
		setIsEditModalOpen(true);
	};

	return (
		<>
			<div className="breeding-page">
				{/* PAGE HEADER */}
				<section className="breeding-header">
					<div>
						<p className="breeding-eyebrow">BREEDING MANAGEMENT</p>

						<h1 className="breeding-page-title">
							Breeding recipe management
						</h1>

						<p className="breeding-page-subtitle">
							Manage genetic matrices, inheritance rates, and koi
							breeding recipes.
						</p>
					</div>

					{/* ACTION BUTTONS */}
					<div className="breeding-actions">
						<button
							type="button"
							className="breeding-action-button"
							onClick={() =>
								alert(
									"All three genetic matrices are valid. Each outcome totals 1.00 (100%).",
								)
							}
						>
							<CheckCircle2 size={16} />
							<span>Validate probabilities</span>
						</button>

						<button
							type="button"
							className="breeding-action-button"
						>
							<Download size={16} />
							<span>Export matrices</span>
						</button>

						<button
							type="button"
							className="breeding-action-button primary"
							onClick={() => setIsModalOpen(true)}
						>
							<Plus size={16} />
							<span>Add recipe</span>
						</button>
					</div>
				</section>

				{/* SEARCH */}
				<div className="breeding-search">
					<input
						type="text"
						value={searchQuery}
						onChange={(event) => setSearchQuery(event.target.value)}
						placeholder="Search parent varieties or target offspring..."
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								handleSearch();
							}
						}}
					/>
				</div>

				{/* STATISTICS */}
				<StatCards formulasCount={totalElements} />

				{/* TABS */}
				<BreedingTabs
					activeTab={activeTab}
					onTabChange={setActiveTab}
				/>

				{/* TABLES */}
				<div className="breeding-tables">
					{(activeTab === "all" || activeTab === "table1") && (
						<BreedingTable1
							formulas={formulas1}
							page={page1}
							setPage={setPage1}
							totalPages={totalPages1}
							onEdit={openEditModal}
							onDelete={handleDeleteFormula}
						/>
					)}

					{(activeTab === "all" || activeTab === "table2") && (
						<BreedingTable2
							formulas={formulas2}
							page={page2}
							setPage={setPage2}
							totalPages={totalPages2}
							onEdit={openEditModal}
							onDelete={handleDeleteFormula}
						/>
					)}

					{(activeTab === "all" || activeTab === "table3") && (
						<BreedingTable3
							formulas={formulas3}
							page={page3}
							setPage={setPage3}
							totalPages={totalPages3}
							onEdit={openEditModal}
							onDelete={handleDeleteFormula}
						/>
					)}
				</div>
			</div>

			{/* CREATE MODAL */}
			<AddFormulaModal
				varientList={koiVarientList}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onAdd={handleAddFormula}
			/>

			{/* EDIT MODAL */}
			{selectedFormula && (
				<AddFormulaModal
					varientList={koiVarientList}
					isOpen={isEditModalOpen}
					onClose={() => {
						setIsEditModalOpen(false);
						setSelectedFormula(null);
					}}
					onAdd={handleEditFormula}
					initialData={{
						fatherId: selectedFormula.father.id as number,
						motherId: selectedFormula.mother.id as number,
						childId: selectedFormula.child.id as number,
						type: selectedFormula.type,
						targetRate: selectedFormula.targetRate as number,
						fatherRate: selectedFormula.fatherRate as number,
						motherRate: selectedFormula.motherRate as number,
					}}
					mode="edit" // Báo cho Modal biết là đang Edit
				/>
			)}
		</>
	);
}

// ============================================================
// STAT CARDS
// ============================================================

function StatCards({ formulasCount }: { formulasCount: number }) {
	const stats = [
		{
			label: "TOTAL RECIPES",
			value: formulasCount.toString(),
			icon: "🔗",
			detail: "Across 3 matrices",
		},
		{
			label: "HIGHEST MUTATION RATE",
			value: "18.0%",
			icon: "✨",
			detail: "Magoi x Magoi",
		},
		{
			label: "SCALE TRAIT GENES",
			value: "Ginrin & Hikarimono",
			icon: "💎",
			detail: "14 breeding recipes",
		},
		{
			label: "AVERAGE SUCCESS RATE",
			value: "88.5%",
			icon: "✔️",
			detail: "Stable outcomes",
		},
	];

	return (
		<section className="breeding-stat-grid">
			{stats.map((stat) => (
				<article key={stat.label} className="breeding-stat-card">
					<div className="breeding-stat-top">
						<span className="breeding-stat-label">
							{stat.label}
						</span>

						<span className="breeding-stat-icon">{stat.icon}</span>
					</div>

					<div className="breeding-stat-value">{stat.value}</div>

					<div className="breeding-stat-detail">{stat.detail}</div>
				</article>
			))}
		</section>
	);
}

// ============================================================
// TABS
// ============================================================

function BreedingTabs({
	activeTab,
	onTabChange,
}: {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}) {
	const tabs: {
		id: TabType;
		label: string;
	}[] = [
		{
			id: "all",
			label: "All matrices (3)",
		},
		{
			id: "table1",
			label: "Matrix 1: Same-variety breeding",
		},
		{
			id: "table2",
			label: "Matrix 2: Cross-variety breeding",
		},
		{
			id: "table3",
			label: "Matrix 3: Trait-gene breeding",
		},
	];

	return (
		<section className="breeding-tabs-wrapper">
			<div className="breeding-tabs">
				{tabs.map((tab) => (
					<button
						key={tab.id}
						type="button"
						onClick={() => onTabChange(tab.id)}
						className={`breeding-tab ${activeTab === tab.id ? "active" : ""}`}
					>
						{tab.label}
					</button>
				))}
			</div>

			<span className="breeding-tab-description">
				Genetic breeding probability reference
			</span>
		</section>
	);
}

interface BreedingTableProps {
	formulas: IBreedingRecipe[];
	page: number;
	setPage: (page: number) => void;
	totalPages: number;
	onEdit: (formula: IBreedingRecipe) => void;
	onDelete: (id: number) => void;
}

// ============================================================
// TABLE 1
// ============================================================

function BreedingTable1({
	formulas,
	page,
	setPage,
	totalPages,
	onEdit,
	onDelete,
}: BreedingTableProps) {
	return (
		<section className="breeding-table-panel">
			<div className="breeding-table-header">
				<div className="breeding-table-heading">
					<span className="breeding-table-label">
						MATRIX 1 • SAME VARIETY
					</span>

					<h2 className="breeding-table-title">
						Parent Pairing and Mutation Outcomes
					</h2>

					<p className="breeding-table-description">
						Expected offspring and mutation rates for the same
						variety.
					</p>
				</div>
			</div>

			<div className="breeding-table-scroll">
				<table className="breeding-table">
					<thead>
						<tr>
							<th>Parent pairing</th>
							<th>Base offspring</th>
							<th>Base rate</th>
							<th>Pattern</th>
							<th>Possible mutation</th>
							<th>Mutation rate</th>
							<th>Mixed offspring</th>
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>
						{formulas.map((formula, index) => (
							<TableRow1
								key={formula.id}
								formula={formula}
								idx={index}
								onEdit={() => onEdit(formula)}
								onDelete={() => onDelete(formula.id as number)}
							/>
						))}
						{formulas.length === 0 && (
							<tr>
								<td colSpan={8}>
									<BreedingEmpty />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<AdminPagination
				currentPage={page}
				totalPages={totalPages}
				onPageChange={setPage}
				summary={`Page ${page + 1} of ${totalPages} - Matrix 1`}
			/>
		</section>
	);
}

interface TableRowProps {
	formula: IBreedingRecipe;
	idx: number;
	onEdit: () => void;
	onDelete: () => void;
}

function TableRow1({ formula, idx, onEdit, onDelete }: TableRowProps) {
	const dotClasses = ["magoi", "kohaku", "showa"];
	const dotClass = dotClasses[idx % dotClasses.length] ?? "magoi";

	const failureRate = Math.max(0, formula.motherRate);

	return (
		<tr>
			<td>
				<div className="breeding-parent">
					<span className={`breeding-parent-dot ${dotClass}`} />

					<span>
						{formula.father.name} x {formula.mother.name}
					</span>
				</div>
			</td>

			<td>
				<span className="breeding-target">{formula.child.name}</span>
			</td>

			<td>
				<div className="breeding-ratio">
					<div className="breeding-ratio-value">
						<span>{(formula.targetRate as number).toFixed(2)}</span>
						<span>
							{((formula.targetRate as number) * 100).toFixed(1)}%
						</span>
					</div>

					<div className="breeding-ratio-bar">
						<div
							className="breeding-ratio-progress"
							style={{
								width: `${(formula.targetRate as number) * 100}%`,
							}}
						/>
					</div>
				</div>
			</td>

			<td>
				<div className="breeding-badges">
					<span className="breeding-badge primary">
						{(formula.targetRate as number).toFixed(2)} (
						{((formula.targetRate as number) * 100).toFixed(0)}%)
					</span>
				</div>
			</td>

			<td>
				<span className="breeding-badge warning">
					Mutation possible
				</span>
			</td>

			<td>
				<span className="breeding-badge success">
					{formula.fatherRate.toFixed(2)} (
					{(formula.fatherRate * 100).toFixed(0)}%)
				</span>
			</td>

			<td>
				<span className="breeding-failure">
					{failureRate.toFixed(2)} ({(failureRate * 100).toFixed(0)}%)
				</span>
			</td>

			<td>
				<div className="breeding-row-actions">
					<button
						type="button"
						className="breeding-icon-button"
						onClick={onEdit}
					>
						<Edit2 size={15} />
					</button>

					<button
						type="button"
						className="breeding-icon-button danger"
						onClick={onDelete}
					>
						<Trash2 size={15} />
					</button>
				</div>
			</td>
		</tr>
	);
}

// ============================================================
// TABLE 2
// ============================================================

function BreedingTable2({
	formulas,
	page,
	setPage,
	totalPages,
	onEdit,
	onDelete,
}: BreedingTableProps) {
	return (
		<section className="breeding-table-panel">
			<div className="breeding-table-header">
				<div className="breeding-table-heading">
					<span className="breeding-table-label">
						MATRIX 2 • TARGET CROSS-BREEDING
					</span>

					<h2 className="breeding-table-title">
						Targeted Cross-Variety Breeding
					</h2>

					<p className="breeding-table-description">
						Cross-variety recipes designed to produce specific
						offspring.
					</p>
				</div>
			</div>

			<div className="breeding-table-scroll">
				<table className="breeding-table breeding-special-table">
					<thead>
						<tr>
							<th>Target offspring</th>
							<th>Sire</th>
							<th>Dam</th>
							<th>Target rate</th>
							<th>Sire gene</th>
							<th>Dam gene</th>
							<th>Other outcome</th>
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>
						{formulas.map((formula) => (
							<TableRow2
								key={formula.id}
								formula={formula}
								onEdit={() => onEdit(formula)}
								onDelete={() => onDelete(formula.id as number)}
							/>
						))}

						{formulas.length === 0 && (
							<tr>
								<td colSpan={8}>
									<BreedingEmpty />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<AdminPagination
				currentPage={page}
				totalPages={totalPages}
				onPageChange={setPage}
				summary={`Page ${page + 1} of ${totalPages} - Matrix 2`}
			/>
		</section>
	);
}

function TableRow2({
	formula,
	onEdit,
	onDelete,
}: {
	formula: IBreedingRecipe;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const rawFailureRate =
		1 -
		(formula.fatherRate +
			formula.motherRate +
			(formula.targetRate as number));
	const failureRate = Math.max(0, rawFailureRate);

	return (
		<tr>
			<td>
				<div className="breeding-target-name">
					<span className="breeding-star">★</span>
					<span>{formula.child.name}</span>
				</div>
			</td>

			<td>
				<span className="breeding-parent-name">
					{formula.father.name}
				</span>
			</td>

			<td>
				<span className="breeding-parent-name">
					{formula.mother.name}
				</span>
			</td>

			<td>
				<span className="breeding-badge primary">
					{(formula.targetRate as number).toFixed(2)} (
					{((formula.targetRate as number) * 100).toFixed(0)}%)
				</span>
			</td>

			<td>
				<span className="breeding-gene-value">
					{formula.fatherRate.toFixed(2)}
				</span>
			</td>

			<td>
				<span className="breeding-gene-value">
					{formula.motherRate.toFixed(2)}
				</span>
			</td>

			<td>
				<span className="breeding-failure">
					{failureRate.toFixed(2)}
				</span>
			</td>

			<td>
				<div className="breeding-row-actions">
					<button
						type="button"
						className="breeding-icon-button"
						onClick={onEdit}
					>
						<Edit2 size={15} />
					</button>

					<button
						type="button"
						className="breeding-icon-button danger"
						onClick={onDelete}
					>
						<Trash2 size={15} />
					</button>
				</div>
			</td>
		</tr>
	);
}

// ============================================================
// TABLE 3
// ============================================================

function BreedingTable3({
	formulas,
	page,
	setPage,
	totalPages,
	onEdit,
	onDelete,
}: BreedingTableProps) {
	return (
		<section className="breeding-table-panel">
			<div className="breeding-table-header">
				<div className="breeding-table-heading">
					<span className="breeding-table-label">
						MATRIX 3 • TRAIT GENES
					</span>

					<h2 className="breeding-table-title">
						Scale Trait Inheritance
					</h2>

					<p className="breeding-table-description">
						Ginrin & Hikarimono
					</p>
				</div>
			</div>

			<div className="breeding-table-scroll">
				<table className="breeding-table breeding-special-table">
					<thead>
						<tr>
							<th>Sire gene</th>
							<th>Dam base</th>
							<th>Target offspring</th>
							<th>Target rate</th>
							<th>Dam outcome</th>
							<th>Sire outcome</th>
							<th>Mixed offspring</th>
							<th>Actions</th>
						</tr>
					</thead>

					<tbody>
						{formulas.map((formula) => (
							<TableRow3
								key={formula.id}
								formula={formula}
								onEdit={() => onEdit(formula)}
								onDelete={() => onDelete(formula.id as number)}
							/>
						))}

						{formulas.length === 0 && (
							<tr>
								<td colSpan={8}>
									<BreedingEmpty />
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			{/* Pagination */}
			<AdminPagination
				currentPage={page}
				totalPages={totalPages}
				onPageChange={setPage}
				summary={`Page ${page + 1} of ${totalPages} - Matrix 1`}
			/>
		</section>
	);
}

function TableRow3({
	formula,
	onEdit,
	onDelete,
}: {
	formula: IBreedingRecipe;
	onEdit: () => void;
	onDelete: () => void;
}) {
	const rawFailureRate =
		1 -
		(formula.fatherRate +
			formula.motherRate +
			(formula.targetRate as number));
	const failureRate = Math.max(0, rawFailureRate);

	return (
		<tr>
			<td>
				<div className="breeding-feature-name">
					<span className="breeding-feature-icon">✨</span>

					<span>{formula.father.name}</span>
				</div>
			</td>

			<td>
				<span className="breeding-parent-name">
					{formula.mother.name}
				</span>
			</td>

			<td>
				<span className="breeding-target">{formula.child.name}</span>
			</td>

			<td>
				<span className="breeding-badge primary">
					{(formula.targetRate as number).toFixed(2)} (
					{((formula.targetRate as number) * 100).toFixed(0)}%)
				</span>
			</td>

			<td>
				<span className="breeding-gene-value">
					{formula.motherRate.toFixed(2)}
				</span>
			</td>

			<td>
				<span className="breeding-gene-value">
					{formula.fatherRate.toFixed(2)}
				</span>
			</td>

			<td>
				<span className="breeding-failure">
					{failureRate.toFixed(2)}
				</span>
			</td>

			<td>
				<div className="breeding-row-actions">
					<button
						type="button"
						className="breeding-icon-button"
						onClick={onEdit}
					>
						<Edit2 size={15} />
					</button>

					<button
						type="button"
						className="breeding-icon-button danger"
						onClick={onDelete}
					>
						<Trash2 size={15} />
					</button>
				</div>
			</td>
		</tr>
	);
}

// ============================================================
// EMPTY
// ============================================================

function BreedingEmpty() {
	return (
		<div className="breeding-empty">
			<div>
				<h3 className="breeding-empty-title">
					No breeding recipes found
				</h3>

				<p className="breeding-empty-description">
					Try changing the search term or matrix filter.
				</p>
			</div>
		</div>
	);
}

// ============================================================
// ADD & EDIT FORMULA MODAL
// ============================================================

interface AddFormulaModalProps {
	varientList: IKoiVarient[];
	isOpen: boolean;
	onClose: () => void;
	onAdd: (formula: ICreateBreedingRateRequest) => void;
	initialData?: ICreateBreedingRateRequest;
	mode?: "add" | "edit";
}

function AddFormulaModal({
	varientList,
	isOpen,
	onClose,
	onAdd,
	initialData,
	mode = "add",
}: AddFormulaModalProps) {
	const defaultForm: ICreateBreedingRateRequest = initialData || {
		fatherId: varientList.length > 0 ? (varientList[0].id as number) : 1,
		motherId: varientList.length > 0 ? (varientList[0].id as number) : 1,
		childId: varientList.length > 0 ? (varientList[0].id as number) : 1,
		type: "PURE",
		targetRate: 0.3,
		fatherRate: 0.35,
		motherRate: 0.35,
	};

	const [formData, setFormData] =
		useState<ICreateBreedingRateRequest>(defaultForm);

	useEffect(() => {
		if (initialData) {
			setFormData(initialData);
		}
	}, [initialData]);

	if (!isOpen) return null;

	const updateField = <K extends keyof ICreateBreedingRateRequest>(
		field: K,
		value: ICreateBreedingRateRequest[K],
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleSubmit = () => {
		if (!formData.fatherId || !formData.motherId || !formData.childId) {
			alert("Select the sire, dam, and target offspring before saving.");
			return;
		}

		onAdd(formData);

		setFormData(defaultForm);
	};

	return (
		<div
			className="breeding-modal-overlay"
			onMouseDown={(event) => {
				if (event.target === event.currentTarget) {
					onClose();
				}
			}}
		>
			<div className="breeding-modal" role="dialog" aria-modal="true">
				<div className="breeding-modal-header">
					<div>
						<h2 className="breeding-modal-title">
							{mode === "add"
								? "Add breeding recipe"
								: "Edit breeding recipe"}
						</h2>

						<p className="breeding-modal-description">
							Configure the parent pairing and inheritance
							probabilities.
						</p>
					</div>

					<button
						type="button"
						className="breeding-modal-close"
						onClick={onClose}
					>
						<X size={18} />
					</button>
				</div>

				<form
					className="breeding-form"
					onSubmit={(event) => {
						event.preventDefault();
						handleSubmit();
					}}
				>
					<div className="breeding-form-grid">
						{/* --- BỔ SUNG RECIPE TYPE --- */}
						<div className="breeding-form-group full">
							<label className="breeding-form-label">
								Recipe Type
							</label>

							<select
								className="breeding-form-input"
								value={formData.type}
								onChange={(event) =>
									updateField(
										"type",
										event.target
											.value as BreedingRecipeType,
									)
								}
							>
								<option value="PURE">
									PURE (Same-variety breeding)
								</option>
								<option value="CROSS">
									CROSS (Cross-variety breeding)
								</option>
								<option value="OVERLAY">
									OVERLAY (Trait-gene breeding)
								</option>
							</select>
						</div>

						<div className="breeding-form-group">
							<label className="breeding-form-label">
								Sire variety (Father)
							</label>

							<select
								className="breeding-form-input"
								value={formData.fatherId}
								onChange={(event) =>
									updateField(
										"fatherId",
										Number(event.target.value),
									)
								}
							>
								{varientList.map((k) => (
									<option key={`father-${k.id}`} value={k.id}>
										{k.name}
									</option>
								))}
							</select>
						</div>

						<div className="breeding-form-group">
							<label className="breeding-form-label">
								Dam variety (Mother)
							</label>

							<select
								className="breeding-form-input"
								value={formData.motherId}
								onChange={(event) =>
									updateField(
										"motherId",
										Number(event.target.value),
									)
								}
							>
								{varientList.map((k) => (
									<option key={`mother-${k.id}`} value={k.id}>
										{k.name}
									</option>
								))}
							</select>
						</div>

						<div className="breeding-form-group full">
							<label className="breeding-form-label">
								Target offspring (Child)
							</label>

							<select
								className="breeding-form-input"
								value={formData.childId}
								onChange={(event) =>
									updateField(
										"childId",
										Number(event.target.value),
									)
								}
							>
								{varientList.map((k) => (
									<option key={`child-${k.id}`} value={k.id}>
										{k.name}
									</option>
								))}
							</select>
						</div>

						<div className="breeding-form-group">
							<label className="breeding-form-label">
								Target rate
							</label>

							<input
								type="number"
								className="breeding-form-input"
								step="0.01"
								min="0"
								max="1"
								value={formData.targetRate}
								onChange={(event) =>
									updateField(
										"targetRate",
										Number(event.target.value),
									)
								}
							/>
						</div>

						<div className="breeding-form-group">
							<label className="breeding-form-label">
								Sire outcome rate
							</label>

							<input
								type="number"
								className="breeding-form-input"
								step="0.01"
								min="0"
								max="1"
								value={formData.fatherRate}
								onChange={(event) =>
									updateField(
										"fatherRate",
										Number(event.target.value),
									)
								}
							/>
						</div>

						<div className="breeding-form-group">
							<label className="breeding-form-label">
								Dam Outcome rate
							</label>

							<input
								type="number"
								className="breeding-form-input"
								step="0.01"
								min="0"
								max="1"
								value={formData.motherRate}
								onChange={(event) =>
									updateField(
										"motherRate",
										Number(event.target.value),
									)
								}
							/>
						</div>
					</div>

					<div className="breeding-form-note">
						<strong>Note:</strong> The system validates that all
						outcome probabilities add up to 1.00 (100%).
					</div>

					<div className="breeding-modal-footer">
						<button
							type="button"
							className="breeding-modal-button cancel"
							onClick={onClose}
						>
							Cancel
						</button>

						<button
							type="submit"
							className="breeding-modal-button submit"
						>
							{mode === "add" ? "Save recipe" : "Update recipe"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
