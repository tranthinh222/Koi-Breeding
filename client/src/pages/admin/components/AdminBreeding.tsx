import { useMemo, useState } from "react";
import { X, Plus, Edit2, Trash2, CheckCircle2, Download } from "lucide-react";

import "./adminbreeding.css";

// ============================================================
// TYPES
// ============================================================

type TabType = "all" | "table1" | "table2" | "table3";

interface BreedingFormula {
  id: string;
  fatherType: string;
  motherType: string;
  target: string;
  targetRatio: number;
  motherReturn: number;
  failureRatio: number;
}

interface AddFormulaData {
  fatherType: string;
  motherType: string;
  target: string;
  targetRatio: number;
  motherReturn: number;
  failureRatio: number;
}

// ============================================================
// INITIAL DATA
// ============================================================

const INITIAL_FORMULAS: BreedingFormula[] = [
  {
    id: "1",
    fatherType: "Magoi",
    motherType: "Magoi",
    target: "Magoi",
    targetRatio: 0.78,
    motherReturn: 0.78,
    failureRatio: 0.04,
  },
  {
    id: "2",
    fatherType: "Kohaku",
    motherType: "Kohaku",
    target: "Kohaku",
    targetRatio: 0.78,
    motherReturn: 0.78,
    failureRatio: 0.13,
  },
];

// ============================================================
// MAIN COMPONENT - BODY ONLY
// ============================================================

export default function BreedingManagement() {
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formulas, setFormulas] = useState<BreedingFormula[]>(INITIAL_FORMULAS);

  // ----------------------------------------------------------
  // SEARCH
  // ----------------------------------------------------------

  const filteredFormulas = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return formulas;
    }

    return formulas.filter((formula) => {
      return (
        formula.fatherType.toLowerCase().includes(query) ||
        formula.motherType.toLowerCase().includes(query) ||
        formula.target.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, formulas]);

  // ----------------------------------------------------------
  // ADD FORMULA
  // ----------------------------------------------------------

  const handleAddFormula = (formula: AddFormulaData) => {
    const newFormula: BreedingFormula = {
      ...formula,
      id: Date.now().toString(),
    };

    setFormulas((prev) => [...prev, newFormula]);
    setIsModalOpen(false);
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
              Manage genetic matrices, inheritance rates, and koi breeding recipes.
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

            <button type="button" className="breeding-action-button">
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
          />
        </div>

        {/* STATISTICS */}
        <StatCards formulasCount={formulas.length} />

        {/* TABS */}
        <BreedingTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* TABLES */}
        <div className="breeding-tables">
          {(activeTab === "all" || activeTab === "table1") && (
            <BreedingTable1 formulas={filteredFormulas} />
          )}

          {(activeTab === "all" || activeTab === "table2") && (
            <BreedingTable2 formulas={filteredFormulas} />
          )}

          {(activeTab === "all" || activeTab === "table3") && (
            <BreedingTable3 formulas={filteredFormulas} />
          )}
        </div>
      </div>

      {/* MODAL */}
      <AddFormulaModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddFormula}
      />
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
            <span className="breeding-stat-label">{stat.label}</span>

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

// ============================================================
// TABLE 1
// ============================================================

function BreedingTable1({ formulas }: { formulas: BreedingFormula[] }) {
  return (
    <section className="breeding-table-panel">
      <div className="breeding-table-header">
        <div className="breeding-table-heading">
          <span className="breeding-table-label">MATRIX 1 • SAME VARIETY</span>

          <h2 className="breeding-table-title">
            Parent Pairing and Mutation Outcomes
          </h2>

          <p className="breeding-table-description">
            Expected offspring and mutation rates for the same variety.
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
            {formulas.slice(0, 3).map((formula, index) => (
              <TableRow1 key={formula.id} formula={formula} idx={index} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TableRow1({
  formula,
  idx,
}: {
  formula: BreedingFormula;
  idx: number;
}) {
  const dotClasses = ["magoi", "kohaku", "showa"];
  const dotClass = dotClasses[idx] ?? "magoi";

  return (
    <tr>
      <td>
        <div className="breeding-parent">
          <span className={`breeding-parent-dot ${dotClass}`} />

          <span>
            {formula.fatherType} x {formula.motherType}
          </span>
        </div>
      </td>

      <td>
        <span className="breeding-target">{formula.target}</span>
      </td>

      <td>
        <div className="breeding-ratio">
          <div className="breeding-ratio-value">
            <span>{formula.targetRatio.toFixed(2)}</span>
            <span>{(formula.targetRatio * 100).toFixed(1)}%</span>
          </div>

          <div className="breeding-ratio-bar">
            <div
              className="breeding-ratio-progress"
              style={{
                width: `${formula.targetRatio * 100}%`,
              }}
            />
          </div>
        </div>
      </td>

      <td>
        <div className="breeding-badges">
          <span className="breeding-badge primary">
            {formula.targetRatio.toFixed(2)} (
            {(formula.targetRatio * 100).toFixed(0)}%)
          </span>
        </div>
      </td>

      <td>
        <span className="breeding-badge warning">Mutation possible</span>
      </td>

      <td>
        <span className="breeding-badge success">0.18 (18%)</span>
      </td>

      <td>
        <span className="breeding-failure">
          {formula.failureRatio} ({(formula.failureRatio * 100).toFixed(0)}%)
        </span>
      </td>

      <td>
        <div className="breeding-row-actions">
          <button type="button" className="breeding-icon-button">
            <Edit2 size={15} />
          </button>

          <button type="button" className="breeding-icon-button danger">
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

function BreedingTable2({ formulas }: { formulas: BreedingFormula[] }) {
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
            Cross-variety recipes designed to produce specific offspring.
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
            <TableRow2 />

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
    </section>
  );
}

function TableRow2() {
  return (
    <tr>
      <td>
        <div className="breeding-target-name">
          <span className="breeding-star">★</span>
          <span>Showa</span>
        </div>
      </td>

      <td>
        <span className="breeding-parent-name">Kohaku</span>
      </td>

      <td>
        <span className="breeding-parent-name">Shiro Utsuri</span>
      </td>

      <td>
        <span className="breeding-badge primary">0.25 (25%)</span>
      </td>

      <td>
        <span className="breeding-gene-value">0.35</span>
      </td>

      <td>
        <span className="breeding-gene-value">0.30</span>
      </td>

      <td>
        <span className="breeding-failure">0.10</span>
      </td>

      <td>
        <div className="breeding-row-actions">
          <button type="button" className="breeding-icon-button">
            <Edit2 size={15} />
          </button>

          <button type="button" className="breeding-icon-button danger">
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
  formulas: _formulas,
}: {
  formulas: BreedingFormula[];
}) {
  const targets = ["Ginrin Kohaku", "Ginrin Sanke", "Ginrin Showa"];

  return (
    <section className="breeding-table-panel">
      <div className="breeding-table-header">
        <div className="breeding-table-heading">
          <span className="breeding-table-label">MATRIX 3 • TRAIT GENES</span>

          <h2 className="breeding-table-title">Scale Trait Inheritance</h2>

          <p className="breeding-table-description">Ginrin & Hikarimono</p>
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
            {targets.map((name) => {
              const baseName = name.replace("Ginrin ", "");

              return (
                <tr key={name}>
                  <td>
                    <div className="breeding-feature-name">
                      <span className="breeding-feature-icon">✨</span>

                      <span>Ginrin</span>
                    </div>
                  </td>

                  <td>
                    <span className="breeding-parent-name">{baseName}</span>
                  </td>

                  <td>
                    <span className="breeding-target">{name}</span>
                  </td>

                  <td>
                    <span className="breeding-badge primary">0.25 (25%)</span>
                  </td>

                  <td>
                    <span className="breeding-gene-value">0.50</span>
                  </td>

                  <td>
                    <span className="breeding-gene-value">0.10</span>
                  </td>

                  <td>
                    <span className="breeding-failure">0.15</span>
                  </td>

                  <td>
                    <div className="breeding-row-actions">
                      <button type="button" className="breeding-icon-button">
                        <Edit2 size={15} />
                      </button>

                      <button
                        type="button"
                        className="breeding-icon-button danger"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// ============================================================
// EMPTY
// ============================================================

function BreedingEmpty() {
  return (
    <div className="breeding-empty">
      <div>
        <h3 className="breeding-empty-title">No breeding recipes found</h3>

        <p className="breeding-empty-description">
          Try changing the search term or matrix filter.
        </p>
      </div>
    </div>
  );
}

// ============================================================
// ADD FORMULA MODAL
// ============================================================

function AddFormulaModal({
  isOpen,
  onClose,
  onAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (formula: AddFormulaData) => void;
}) {
  const initialForm: AddFormulaData = {
    fatherType: "",
    motherType: "",
    target: "",
    targetRatio: 0.25,
    motherReturn: 0.5,
    failureRatio: 0.1,
  };

  const [formData, setFormData] = useState<AddFormulaData>(initialForm);

  if (!isOpen) return null;

  const updateField = <K extends keyof AddFormulaData>(
    field: K,
    value: AddFormulaData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (
      !formData.fatherType.trim() ||
      !formData.motherType.trim() ||
      !formData.target.trim()
    ) {
      alert("Select the sire, dam, and target offspring before saving.");
      return;
    }

    onAdd({
      ...formData,
      fatherType: formData.fatherType.trim(),
      motherType: formData.motherType.trim(),
      target: formData.target.trim(),
    });

    setFormData(initialForm);
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
              Add breeding recipe
            </h2>

            <p className="breeding-modal-description">
              Configure the parent pairing and inheritance probabilities.
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
            <div className="breeding-form-group">
              <label className="breeding-form-label">Sire variety</label>

              <input
                type="text"
                className="breeding-form-input"
                placeholder="vd: Kohaku"
                value={formData.fatherType}
                onChange={(event) =>
                  updateField("fatherType", event.target.value)
                }
              />
            </div>

            <div className="breeding-form-group">
              <label className="breeding-form-label">Dam variety</label>

              <input
                type="text"
                className="breeding-form-input"
                placeholder="vd: Shiro Utsuri"
                value={formData.motherType}
                onChange={(event) =>
                  updateField("motherType", event.target.value)
                }
              />
            </div>

            <div className="breeding-form-group full">
              <label className="breeding-form-label">
                Target offspring
              </label>

              <input
                type="text"
                className="breeding-form-input"
                placeholder="vd: Showa"
                value={formData.target}
                onChange={(event) => updateField("target", event.target.value)}
              />
            </div>

            <div className="breeding-form-group">
              <label className="breeding-form-label">Target rate</label>

              <input
                type="number"
                className="breeding-form-input"
                step="0.01"
                min="0"
                max="1"
                value={formData.targetRatio}
                onChange={(event) =>
                  updateField("targetRatio", Number(event.target.value))
                }
              />
            </div>

            <div className="breeding-form-group">
              <label className="breeding-form-label">Dam outcome rate</label>

              <input
                type="number"
                className="breeding-form-input"
                step="0.01"
                min="0"
                max="1"
                value={formData.motherReturn}
                onChange={(event) =>
                  updateField("motherReturn", Number(event.target.value))
                }
              />
            </div>

            <div className="breeding-form-group">
              <label className="breeding-form-label">Mixed offspring rate</label>

              <input
                type="number"
                className="breeding-form-input"
                step="0.01"
                min="0"
                max="1"
                value={formData.failureRatio}
                onChange={(event) =>
                  updateField("failureRatio", Number(event.target.value))
                }
              />
            </div>
          </div>

          <div className="breeding-form-note">
            <strong>Note:</strong> The system validates that all outcome
            probabilities add up to 1.00 (100%).
          </div>

          <div className="breeding-modal-footer">
            <button
              type="button"
              className="breeding-modal-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="breeding-modal-button submit">
              Save recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
