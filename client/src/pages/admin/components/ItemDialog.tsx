import { useEffect, useState } from "react";
import { X, Upload } from "lucide-react";

import {
  addAdminItem,
  updateAdminItem,
  type AdminItem,
} from "../../../api/admin";

import "./itemdialog.css";

interface ItemDialogProps {
  mode: "add" | "edit";
  item?: AdminItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ItemDialog({
  mode,
  item,
  onClose,
  onSuccess,
}: ItemDialogProps) {
  const [imageUrl, setImageUrl] = useState("");
  const [nameItem, setNameItem] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState("FOOD");
  const [price, setPrice] = useState<number>(0);
  const [effectType, setEffectType] = useState("GROWTH");

  const [loading, setLoading] = useState(false);

  // =========================
  // FILL DATA KHI EDIT
  // =========================
  useEffect(() => {
    if (mode === "edit" && item) {
      setImageUrl(item.imageUrl || "");
      setNameItem(item.nameItem || "");
      setDescription(item.description || "");
      setItemType(item.itemType || "FOOD");
      setPrice(item.price || 0);
      setEffectType(item.effectType || "GROWTH");
    }

    // Reset form khi Add
    if (mode === "add") {
      setImageUrl("");
      setNameItem("");
      setDescription("");
      setItemType("FOOD");
      setPrice(0);
      setEffectType("GROWTH");
    }
  }, [mode, item]);

  // =========================
  // IMAGE
  // =========================
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    try {
      const previewUrl = URL.createObjectURL(file);

      setImageUrl(previewUrl);

      // TODO:
      // upload Cloudinary
      // setImageUrl(response.url);
    } catch (error) {
      console.error("Upload image failed:", error);
    }
  };

  // =========================
  // SUBMIT
  // =========================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const itemData = {
        imageUrl,
        nameItem,
        description,
        itemType,
        price,
        effectType,
      };

      if (mode === "add") {
        await addAdminItem(itemData);
        alert("Thêm Item thành công");
      }

      if (mode === "edit" && item) {
        await updateAdminItem(item.id, itemData);
        alert("Cập nhật Item thành công");
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Item operation failed:", error);

      alert(mode === "add" ? "Thêm Item thất bại" : "Cập nhật Item thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="add-item-dialog">
        {/* HEADER */}
        <div className="dialog-header">
          <div>
            <h2>{mode === "add" ? "Add New Item" : "Edit Item"}</h2>

            <p>
              {mode === "add"
                ? "Thêm vật phẩm mới vào hệ thống"
                : "Chỉnh sửa thông tin vật phẩm"}
            </p>
          </div>

          <button type="button" className="dialog-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="dialog-body">
            {/* IMAGE */}
            <div className="form-group">
              <label>Hình ảnh</label>

              <div className="image-upload-area">
                {imageUrl ? (
                  <img src={imageUrl} alt="Preview" className="image-preview" />
                ) : (
                  <div className="image-placeholder">
                    <Upload size={32} />
                    <span>Upload Image</span>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* NAME */}
            <div className="form-group">
              <label>Tên Item</label>

              <input
                type="text"
                value={nameItem}
                onChange={(e) => setNameItem(e.target.value)}
                placeholder="Nhập tên Item..."
                required
              />
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Mô tả</label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả..."
                rows={3}
              />
            </div>

            <div className="form-row">
              {/* TYPE */}
              <div className="form-group">
                <label>Loại Item</label>

                <select
                  value={itemType}
                  onChange={(e) => setItemType(e.target.value)}
                >
                  <option value="FOOD">FOOD</option>
                  <option value="KOI">KOI</option>
                  <option value="MEDICINE">MEDICINE</option>
                  <option value="CURRENCY">CURRENCY</option>
                </select>
              </div>

              {/* PRICE */}
              <div className="form-group">
                <label>Giá</label>

                <input
                  type="number"
                  min="0"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
            </div>

            {/* EFFECT */}
            <div className="form-group">
              <label>Effect Type</label>

              <select
                value={effectType}
                onChange={(e) => setEffectType(e.target.value)}
              >
                <option value="GROWTH">GROWTH</option>
                <option value="HEALTH">HEALTH</option>
                <option value="WATER_QUALITY">WATER QUALITY</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
          </div>

          {/* FOOTER */}
          <div className="dialog-footer">
            <button type="button" className="cancel-button" onClick={onClose}>
              Cancel
            </button>

            <button type="submit" className="primary-button" disabled={loading}>
              {loading
                ? mode === "add"
                  ? "Adding..."
                  : "Updating..."
                : mode === "add"
                  ? "Add Item"
                  : "Update Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
