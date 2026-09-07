import { useEffect, useState } from "react";
import { Edit, Trash2, RotateCcw, Filter, Plus } from "lucide-react";

import ItemDialog from "./ItemDialog";
import AdminPagination from "./AdminPagination";

import {
  getAdminItems,
  deleteAdminItem,
  type AdminItem,
} from "../../../api/admin";

const formatMoney = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value) + " Koins";
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
      "Delete this item? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      await deleteAdminItem(id);

      alert("Item deleted successfully.");

      // Load lại danh sách
      await fetchItems();
    } catch (error) {
      console.error("Delete item failed:", error);
      alert("Unable to delete the item.");
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
              placeholder="Search items by name..."
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
              <option value="ALL">All effects</option>
              <option value="FOOD">Food</option>
              <option value="KOI">Koi</option>
              <option value="MEDICINE">Medicine</option>
              <option value="CURRENCY">Currency</option>
            </select>

            <select
              value={sortPrice}
              onChange={(e) => handleFilterChange(setSortPrice, e.target.value)}
            >
              <option value="DEFAULT">Sort by price</option>
              <option value="ASC">Price: low to high</option>
              <option value="DESC">Price: high to low</option>
            </select>

            <button
              type="button"
              className="items-reset-button"
              onClick={handleReset}
              title="Reset filters"
            >
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        {/* CATEGORY */}
        <div className="items-category-list">
          {[
            { id: "ALL", label: "All" },
            { id: "FOOD", label: "Food" },
            { id: "KOI", label: "Koi" },
            { id: "MEDICINE", label: "Medicine" },
            { id: "CURRENCY", label: "Currency" },
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
        <div className="items-page-heading-copy">
          <h2>Shop catalog</h2>
          <p>Manage items, pricing, and gameplay effects.</p>
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} />
          Add item
        </button>
      </div>
      {/* TABLE */}
      <div className="items-table-card">
        <div className="items-table-wrapper">
          <table className="items-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Item</th>
                <th>Category</th>
                <th>Price</th>
                <th>Effect</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="items-empty">
                    Loading items...
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
                          <span>No image</span>
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
                          title="Edit item"
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
                          title="Delete item"
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
                    No items match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        loading={loading}
        onPageChange={setCurrentPage}
      />

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
