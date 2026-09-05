import { useEffect, useState } from "react";
import { Edit, Trash2, RotateCcw, Filter, Plus } from "lucide-react";

import ItemDialog from "./ItemDialog";

import {
  getAdminItems,
  deleteAdminItem,
  type AdminItem,
} from "../../../api/admin";

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("vi-VN").format(value) + " ₫";
};

export default function AdminItems() {
  const [items, setItems] = useState<AdminItem[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  // Bộ lọc
  const [search, setSearch] = useState("");
  const [effectFilter, setEffectFilter] = useState("ALL");
  const [sortPrice, setSortPrice] = useState("DEFAULT");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedItem, setSelectedItem] = useState<AdminItem | null>(null);
  // Fetch dữ liệu mỗi khi đổi trang hoặc thay đổi bất kỳ bộ lọc nào
  const fetchItems = async () => {
    try {
      setLoading(true);

      const response = await getAdminItems({
        page: currentPage,
        size: 8,
        search,
        itemType: categoryFilter,
        effectType: effectFilter,
        sortPrice,
      });

      setItems(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to fetch admin items:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchItems();
  }, [currentPage, search, effectFilter, categoryFilter, sortPrice]);

  // Reset filter và quay về trang đầu tiên (trang 0)
  const handleReset = () => {
    setSearch("");
    setEffectFilter("ALL");
    setSortPrice("DEFAULT");
    setCategoryFilter("ALL");
    setCurrentPage(0);
  };

  // Hàm xử lý đổi Filter: Đặt lại trang về 0 khi người dùng thay đổi tiêu chí lọc
  const handleFilterChange = (setter: (val: any) => void, value: any) => {
    setter(value);
    setCurrentPage(0);
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn xóa Item này không?",
    );

    if (!confirmed) return;

    try {
      await deleteAdminItem(id);

      alert("Xóa Item thành công");

      // Load lại danh sách
      await fetchItems();
    } catch (error) {
      console.error("Delete item failed:", error);
      alert("Xóa Item thất bại");
    }
  };

  return (
    <div className="items-view">
      {/* FILTER CARD */}
      <div className="items-filter-card">
        <div className="items-filter-row">
          <div className="items-search">
            <Filter size={18} />

            <input
              type="text"
              placeholder="Tìm kiếm theo tên vật phẩm..."
              value={search}
              onChange={(e) => handleFilterChange(setSearch, e.target.value)}
            />
          </div>

          <div className="items-filter-actions">
            <select
              value={effectFilter}
              onChange={(e) =>
                handleFilterChange(setEffectFilter, e.target.value)
              }
            >
              <option value="ALL">ALL EFFECT</option>
              <option value="FOOD">FOOD</option>
              <option value="KOI">KOI</option>
              <option value="MEDICINE">MEDICINE</option>
              <option value="CURRENCY">CURRENCY</option>
            </select>

            <select
              value={sortPrice}
              onChange={(e) => handleFilterChange(setSortPrice, e.target.value)}
            >
              <option value="DEFAULT">Sắp xếp theo giá</option>
              <option value="ASC">Giá tăng dần</option>
              <option value="DESC">Giá giảm dần</option>
            </select>

            <button
              type="button"
              className="items-reset-button"
              onClick={handleReset}
              title="Đặt lại bộ lọc"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="items-category-list">
          {[
            { id: "ALL", label: "ALL" },
            { id: "FOOD", label: "FOOD" },
            { id: "KOI", label: "KOI" },
            { id: "MEDICINE", label: "MEDICINE" },
            { id: "CURRENCY", label: "CURRENCY" },
          ].map((category) => (
            <button
              key={category.id}
              type="button"
              className={`items-category-button ${
                categoryFilter === category.id ? "active" : ""
              }`}
              onClick={() => handleFilterChange(setCategoryFilter, category.id)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>
      <div className="items-page-header">
        <button
          type="button"
          className="primary-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>
      {/* TABLE */}
      <div className="items-table-card">
        <div className="items-table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Hình ảnh</th>
                <th>Tên Item</th>
                <th>Phân loại</th>
                <th>Đơn giá</th>
                <th>Chỉ số</th>
                <th className="text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="items-empty">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : items.length > 0 ? (
                items.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="item-image">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.nameItem} />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div className="item-name">
                        <strong>{item.nameItem}</strong>
                        {item.description && <span>{item.description}</span>}
                      </div>
                    </td>

                    <td>
                      <span className="item-category">{item.itemType}</span>
                    </td>

                    <td>
                      <strong>{formatMoney(item.price)}</strong>
                    </td>

                    <td>
                      <span className="item-effect">{item.effectType}</span>
                    </td>

                    <td>
                      <div className="item-actions">
                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsEditModalOpen(true);
                          }}
                        >
                          <Edit size={17} />
                        </button>
                        <button
                          type="button"
                          className="delete"
                          title="Xóa"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="items-empty">
                    Không tìm thấy Item phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="items-pagination">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Previous
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              type="button"
              className={currentPage === index ? "active" : ""}
              onClick={() => setCurrentPage(index)}
            >
              {index + 1}
            </button>
          ))}

          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}

      {isAddModalOpen && (
        <ItemDialog
          mode="add"
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={() => {
            setCurrentPage(0);
          }}
        />
      )}

      {isEditModalOpen && selectedItem && (
        <ItemDialog
          mode="edit"
          item={selectedItem}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedItem(null);
          }}
          onSuccess={fetchItems}
        />
      )}
    </div>
  );
}
