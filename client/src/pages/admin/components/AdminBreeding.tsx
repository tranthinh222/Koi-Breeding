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
              Quản lý công thức phối giống
            </h1>

            <p className="breeding-page-subtitle">
              Quản lý ma trận di truyền, tỷ lệ lai và công thức sinh sản cá Koi.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className="breeding-actions">
            <button
              type="button"
              className="breeding-action-button"
              onClick={() =>
                alert(
                  "Đã kiểm tra toàn bộ 3 bảng ma trận di truyền: Tổng xác suất các nhánh đạt chuẩn 1.00 (100%)!",
                )
              }
            >
              <CheckCircle2 size={16} />
              <span>Kiểm tra tỷ lệ 100%</span>
            </button>

            <button type="button" className="breeding-action-button">
              <Download size={16} />
              <span>Xuất ma trận</span>
            </button>

            <button
              type="button"
              className="breeding-action-button primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} />
              <span>Thêm công thức</span>
            </button>
          </div>
        </section>

        {/* SEARCH */}
        <div className="breeding-search">
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Tìm dòng bố mẹ, con mục tiêu..."
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
      label: "TỔNG CÔNG THỨC",
      value: formulasCount.toString(),
      icon: "🔗",
      detail: "3 Bảng ma trận",
    },
    {
      label: "ĐỘT BIẾN CAO NHẤT",
      value: "18.0%",
      icon: "✨",
      detail: "Magoi x Magoi",
    },
    {
      label: "GEN ĐẶC TÍNH VẢY",
      value: "Ginrin & Hikarimono",
      icon: "💎",
      detail: "14 công thức lai",
    },
    {
      label: "TỈ LỆ THÀNH CÔNG TB",
      value: "88.5%",
      icon: "✔️",
      detail: "Tỉ lệ ổn định",
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
      label: "Tất cả bảng (3)",
    },
    {
      id: "table1",
      label: "Bảng 1: Lai Cùng Loài",
    },
    {
      id: "table2",
      label: "Bảng 2: Lai Khác Loài",
    },
    {
      id: "table3",
      label: "Bảng 3: Lai Gen Đặc Tính",
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
        Quy chuẩn nhân giống di truyền thực tế 1:1
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
          <span className="breeding-table-label">BẢNG 1 • MA TRẬN 1</span>

          <h2 className="breeding-table-title">
            Bố x Mẹ (Cùng loài) & Tỉ lệ Đột biến
          </h2>

          <p className="breeding-table-description">
            Quy chuẩn lai cùng loài và tỉ lệ xuất hiện cá con.
          </p>
        </div>
      </div>

      <div className="breeding-table-scroll">
        <table className="breeding-table">
          <thead>
            <tr>
              <th>(1) Bố x Mẹ</th>
              <th>(2) Con Cơ Bản</th>
              <th>(3) Tỉ Lệ</th>
              <th>(4) Họa Tiết</th>
              <th>(5) Đột Biến Khả Thi</th>
              <th>(6) Tổng Đột Biến</th>
              <th>(7) Cá Tạp</th>
              <th>Thao tác</th>
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
        <span className="breeding-badge warning">Có thể đột biến</span>
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
            BẢNG 2 • TARGET CROSS-BREEDING
          </span>

          <h2 className="breeding-table-title">
            Lai Khác Loài Ra Con Mục Tiêu
          </h2>

          <p className="breeding-table-description">
            Công thức lai khác loài để tạo ra dòng cá mục tiêu.
          </p>
        </div>
      </div>

      <div className="breeding-table-scroll">
        <table className="breeding-table breeding-special-table">
          <thead>
            <tr>
              <th>Con Mục Tiêu</th>
              <th>Bố</th>
              <th>Mẹ</th>
              <th>Tỉ Lệ Target</th>
              <th>Gen Bố</th>
              <th>Gen Mẹ</th>
              <th>Thất Bại</th>
              <th>Thao tác</th>
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
          <span className="breeding-table-label">BẢNG 3 • SPECIAL GENE</span>

          <h2 className="breeding-table-title">Lai Gen Đặc Tính (Vảy)</h2>

          <p className="breeding-table-description">Ginrin & Hikarimono</p>
        </div>
      </div>

      <div className="breeding-table-scroll">
        <table className="breeding-table breeding-special-table">
          <thead>
            <tr>
              <th>Gen Bố</th>
              <th>Nền Mẹ</th>
              <th>Con Mục Tiêu</th>
              <th>Tỉ Lệ Target</th>
              <th>Trả Về Mẹ</th>
              <th>Ra Bố</th>
              <th>Cá Tạp</th>
              <th>Thao tác</th>
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
        <h3 className="breeding-empty-title">Không có dữ liệu</h3>

        <p className="breeding-empty-description">
          Không tìm thấy công thức phối giống phù hợp.
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
      alert("Vui lòng nhập đầy đủ dòng cá bố, dòng cá mẹ và con mục tiêu.");
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
              Thêm công thức phối giống mới
            </h2>

            <p className="breeding-modal-description">
              Cấu hình công thức và tỉ lệ di truyền.
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
              <label className="breeding-form-label">Dòng Cá Bố</label>

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
              <label className="breeding-form-label">Dòng Cá Mẹ</label>

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
                Con Mục Tiêu (Target)
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
              <label className="breeding-form-label">Tỉ Lệ Target</label>

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
              <label className="breeding-form-label">Trả Về Mẹ</label>

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
              <label className="breeding-form-label">Cá Tạp</label>

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
            <strong>* Lưu ý:</strong> Hệ thống sẽ tự động đối soát tổng xác suất
            các nhánh con = 1.0 (100%).
          </div>

          <div className="breeding-modal-footer">
            <button
              type="button"
              className="breeding-modal-button cancel"
              onClick={onClose}
            >
              Hủy
            </button>

            <button type="submit" className="breeding-modal-button submit">
              Lưu công thức
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
