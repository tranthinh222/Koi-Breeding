import { useState } from "react";
import Cropper from "react-easy-crop";
import "./ImageEditor.css";

// ==========================================
// HÀM TIỆN ÍCH ĐỂ TẠO ẢNH MỚI TỪ CANVAS
// ==========================================
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous"); // Tránh lỗi CORS nếu ảnh từ domain khác
    image.src = url;
  });

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
  flip = { horizontal: false, vertical: false },
): Promise<Blob | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) return null;

  const rotRad = (rotation * Math.PI) / 180;

  // Tính toán khung giới hạn (bounding box) cho ảnh sau khi xoay
  const bBoxWidth =
    Math.abs(Math.cos(rotRad)) * image.width +
    Math.abs(Math.sin(rotRad)) * image.height;
  const bBoxHeight =
    Math.abs(Math.sin(rotRad)) * image.width +
    Math.abs(Math.cos(rotRad)) * image.height;

  // Gán kích thước canvas bằng với bounding box
  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  // Dịch chuyển điểm gốc của canvas ra giữa để xoay và lật ảnh
  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);
  ctx.translate(-image.width / 2, -image.height / 2);

  // Vẽ ảnh gốc đã được xoay và lật lên canvas tạm
  ctx.drawImage(image, 0, 0);

  // Tạo canvas thứ 2 để chứa vùng ảnh chính xác bị cắt (crop)
  const croppedCanvas = document.createElement("canvas");
  const croppedCtx = croppedCanvas.getContext("2d");

  if (!croppedCtx) return null;

  croppedCanvas.width = pixelCrop.width;
  croppedCanvas.height = pixelCrop.height;

  // Tính toán lại tọa độ cắt nếu ảnh bị lật
  const cropX = flip.horizontal
    ? bBoxWidth - pixelCrop.width - pixelCrop.x
    : pixelCrop.x;

  const cropY = flip.vertical
    ? bBoxHeight - pixelCrop.height - pixelCrop.y
    : pixelCrop.y;

  // Cắt ảnh từ canvas tạm sang canvas chính
  croppedCtx.drawImage(
    canvas,
    cropX,
    cropY,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  // Xuất ra thành Blob file ảnh mới (định dạng JPEG)
  return new Promise((resolve) => {
    croppedCanvas.toBlob((blob) => {
      resolve(blob);
    }, "image/jpeg");
  });
}

// ==========================================
// COMPONENT GIAO DIỆN CHÍNH
// ==========================================
interface ImageEditorProps {
  image: string;
  onCancel: () => void;
  onSave: (file: Blob) => void;
}

function ImageEditor({ image, onCancel, onSave }: ImageEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Thêm State lật ảnh
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const onCropComplete = (_: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  // Hàm xử lý lưu ảnh
  const handleApply = async () => {
    if (!croppedAreaPixels) return;

    try {
      setIsProcessing(true); // Disable các nút trong lúc đang xử lý canvas

      // Gọi hàm tiện ích để render ra bức ảnh mới
      const croppedBlob = await getCroppedImg(
        image,
        croppedAreaPixels,
        rotation,
        {
          horizontal: flipH,
          vertical: flipV,
        },
      );

      if (croppedBlob) {
        // Gửi blob (ảnh mới) ra ngoài cho hàm handleSaveCroppedImage
        onSave(croppedBlob);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý ảnh:", error);
      onCancel();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="image-editor-overlay">
      <div className="image-editor">
        <div className="image-editor-header">
          <h2>Edit Avatar</h2>
          <button className="cancel-header-button" onClick={onCancel}>
            ✕
          </button>
        </div>

        <div
          className="crop-container"
          style={{ position: "relative", height: "300px", overflow: "hidden" }}
        >
          {/* Bao bọc Cropper trong một div và lật UI bằng CSS */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              transform: `scale(${flipH ? -1 : 1}, ${flipV ? -1 : 1})`,
              transition: "transform 0.3s ease",
            }}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              rotation={rotation}
              aspect={1}
              cropShape="round"
              showGrid={true}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
            />
          </div>
        </div>

        <div className="editor-controls">
          {/* --- Zoom Control --- */}
          <div className="editor-control">
            <span>Zoom</span>
            <input
              type="range"
              min={1}
              max={5}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
            />
          </div>

          {/* --- Rotation Control (Góc tùy ý) --- */}
          <div className="editor-control">
            <span>Rotation ({rotation}°)</span>
            <input
              type="range"
              min={0}
              max={360}
              step={1}
              value={rotation}
              onChange={(e) => setRotation(Number(e.target.value))}
            />
          </div>

          {/* --- Flip Controls --- */}
          <div className="flip-controls">
            <button
              className="flip-horizontal"
              onClick={() => setFlipH(!flipH)}
            >
              {flipH ? "Unflip H ↔" : "Flip H ↔"}
            </button>

            <button className="flip-vertical" onClick={() => setFlipV(!flipV)}>
              {flipV ? "Unflip V ↕" : "Flip V ↕"}
            </button>
          </div>
        </div>

        <div className="image-editor-actions">
          <button
            className="cancel-button"
            onClick={onCancel}
            disabled={isProcessing}
          >
            Cancel
          </button>

          <button
            className="save-button"
            onClick={handleApply}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Apply"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageEditor;
