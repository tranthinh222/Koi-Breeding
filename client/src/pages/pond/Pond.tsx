import {
	CircleArrowLeft,
	CircleArrowRight,
	CircleCheckBig,
	Undo2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../components/admin/Toast/toast";
import ImportKoiForm from "../../components/user/pond/ImportKoiForm/ImportKoiForm";
import PondInformation from "../../components/user/pond/PondInformation/PondInformation";
import type { IInventory, IKoi, IKoiVarient, IPond } from "../../types/backend";
import styles from "./Pond.module.css";

interface PondCanvasProps {
	pondKoiList: IKoi[];
	pond: IPond;
}

interface FishState {
	x: number;
	y: number;
	angle: number;
	speed: number;
	targetAngle: number;
	turnAt: number;
	size: number;
	phase: number;
	image: HTMLImageElement;
	spawnProgress: number;
}

interface LotusState {
	x: number;
	y: number;
	size: number;
	rotation: number;
	speed: number;
	angle: number;
}

interface Point2D {
	x: number;
	y: number;
}

interface FinTrace {
	firstPoint: Point2D;
	secondPoint: Point2D;
	thirdPoint: Point2D;
	fourthPoint: Point2D;
}

interface FishImageProperties {
	size: {
		width: number;
		height: number;
	};
	tailCrop: {
		sx: number;
		sy: number;
		sw: number;
		sh: number;
		dx: number;
		dy: number;
		dw: number;
		dh: number;
	};
	tailPivot: Point2D;
	finUpPivot: Point2D;
	finDownPivot: Point2D;
	bodyDeviation: number;
	upperFinTrace: FinTrace;
	lowerFinTrace: FinTrace;
}

interface RippleState {
	x: number;
	y: number;
	radius: number;
	alpha: number;
}

function makeFish(
	width: number,
	height: number,
	image: HTMLImageElement,
	isNew: boolean = false,
): FishState {
	const angle = Math.random() * Math.PI * 2;
	const speed = 23 + Math.random() * 24;
	const distance = Math.sqrt(Math.random()) * 0.76;
	const placement = Math.random() * Math.PI * 2;
	return {
		x: width / 2 + Math.cos(placement) * width * 0.37 * distance,
		y: height / 2 + Math.sin(placement) * height * 0.28 * distance,
		angle,
		speed,
		targetAngle: angle,
		turnAt: 1 + Math.random() * 5,
		size: 96 + Math.random() * 54,
		phase: Math.random() * Math.PI * 2,
		image: image,
		spawnProgress: isNew ? 0 : 1,
	};
}

function makeLotus(width: number, height: number): LotusState {
	return {
		x: Math.random() * width,
		y: Math.random() * height,
		size: 100 + Math.random() * 60,
		rotation: Math.random() * Math.PI * 2,
		speed: 5 + Math.random() * 10,
		angle: Math.PI / 8,
	};
}

// Draw lotus
function drawLotus(
	ctx: CanvasRenderingContext2D,
	lotus: LotusState,
	image: HTMLImageElement,
) {
	const { x, y, size, rotation } = lotus;
	const IMG_W = image.width;
	const IMG_H = image.height;
	const scale = size / IMG_W;

	ctx.save();
	ctx.translate(x, y);
	ctx.rotate(rotation);
	ctx.scale(scale, scale);

	ctx.drawImage(image, -IMG_W / 2, -IMG_H / 2, IMG_W, IMG_H);

	ctx.restore();
}

// Draw upper/lower fin function
function traceFin(ctx: CanvasRenderingContext2D, finTrace: FinTrace) {
	ctx.moveTo(finTrace.firstPoint.x, finTrace.firstPoint.y);
	ctx.lineTo(finTrace.secondPoint.x, finTrace.secondPoint.y);
	ctx.lineTo(finTrace.thirdPoint.x, finTrace.thirdPoint.y);
	ctx.lineTo(finTrace.fourthPoint.x, finTrace.fourthPoint.y);
	ctx.closePath();
}

// Draw koi function
function drawKoi(
	ctx: CanvasRenderingContext2D,
	fish: FishState,
	image: HTMLImageElement,
	time: number,
	props: FishImageProperties,
) {
	const { x, y, angle, size, phase, spawnProgress } = fish;
	const sway = Math.sin(time * 0.008 + phase);
	const tailWag = Math.sin(time * 0.018 + phase) * 0.22;
	const finWag = Math.sin(time * 0.014 + phase + 0.8) * 0.12;

	// --- CONFIGURATION PARAMETERS ---
	// 1. Overall dimensions of image
	const IMG_W = props.size.width;
	const IMG_H = props.size.height;

	// 2. Tail joint coordinates (Tail pivot) - Relative to fish center
	const TAIL_PIVOT_X = props.tailPivot.x;
	const TAIL_PIVOT_Y = props.tailPivot.y;
	// Tail crop coordinates from source image (sx, sy, sw, sh) and draw (dx, dy, dw, dh)
	const TAIL_CROP = props.tailCrop;

	// 3. Upper & Lower fin joint coordinates - Relative to fish center
	const FIN_UP_PIVOT_X = props.finUpPivot.x;
	const FIN_UP_PIVOT_Y = props.finUpPivot.y;

	const FIN_DOWN_PIVOT_X = props.finDownPivot.x;
	const FIN_DOWN_PIVOT_Y = props.finDownPivot.y;
	// -----------------------------------------

	// Calculate scale ratio based on new width and spawn progress
	const dropScale = 1 + (1 - spawnProgress) * 1.5;
	const scale = (size / IMG_W) * dropScale;

	ctx.save();
	ctx.globalAlpha = spawnProgress;
	// Body sway motion
	ctx.translate(
		x + Math.cos(angle + Math.PI / 2) * sway * 2,
		y + Math.sin(angle + Math.PI / 2) * sway * 2,
	);
	ctx.rotate(angle + Math.PI + sway * 0.06);
	ctx.scale(scale, scale);

	// ==========================================
	// 1. DRAW TAIL
	// ==========================================
	ctx.save();
	ctx.translate(TAIL_PIVOT_X, TAIL_PIVOT_Y);
	ctx.rotate(tailWag); // remember to recover this
	// ctx.rotate(0); // remember to remove this
	ctx.drawImage(
		image,
		TAIL_CROP.sx,
		TAIL_CROP.sy,
		TAIL_CROP.sw,
		TAIL_CROP.sh, // Crop from source image
		TAIL_CROP.dx,
		TAIL_CROP.dy,
		TAIL_CROP.dw,
		TAIL_CROP.dh, // Place at pivot
	);

	// ==========================================
	// ENABLE DEBUG FOR THE TAIL HERE
	// ==========================================
	// // 1. Draw a magenta border showing the exact rectangle containing the tail
	// ctx.strokeStyle = "magenta";
	// ctx.lineWidth = 2;
	// ctx.strokeRect(TAIL_CROP.dx, TAIL_CROP.dy, TAIL_CROP.dw, TAIL_CROP.dh);
	// // 2. Draw a red dot right at the rotation center (Tail joint)
	// ctx.fillStyle = "red";
	// ctx.beginPath();
	// ctx.arc(0, 0, 5, 0, Math.PI * 2); // Red dot with radius 5px
	// ctx.fill();
	// ==========================================

	ctx.restore();

	// ==========================================
	// 2. DRAW BODY (CUT FINS)
	// ==========================================
	ctx.save();
	ctx.beginPath();
	// Rectangle frame surrounding the entire fish
	ctx.rect(-IMG_W / 2, -IMG_H / 2, IMG_W - props.bodyDeviation, IMG_H);

	// ==========================================
	// ENABLE DEBUG FOR BODY HERE
	// ==========================================
	// Draw yellow border showing exact rectangle containing the body
	// ctx.strokeStyle = "yellow";
	// ctx.lineWidth = 2;
	// ctx.strokeRect(-IMG_W / 2, -IMG_H / 2, IMG_W - props.bodyDeviation, IMG_H);
	// ==========================================

	// Cut hole for upper fin
	ctx.save();
	ctx.translate(FIN_UP_PIVOT_X, FIN_UP_PIVOT_Y);
	traceFin(ctx, props.upperFinTrace);
	ctx.restore();

	// Cut hole for lower fin
	ctx.save();
	ctx.translate(FIN_DOWN_PIVOT_X, FIN_DOWN_PIVOT_Y);
	traceFin(ctx, props.lowerFinTrace);
	ctx.restore();

	// Apply cut and draw body
	ctx.clip("evenodd");
	ctx.drawImage(image, -IMG_W / 2, -IMG_H / 2, IMG_W, IMG_H);
	ctx.restore();

	// ==========================================
	// 3. DRAW UPPER FIN
	// ==========================================
	ctx.save();
	ctx.translate(FIN_UP_PIVOT_X, FIN_UP_PIVOT_Y);
	ctx.rotate(finWag); // remember to recover this
	// ctx.rotate(0); // remember to remove this
	ctx.beginPath();
	traceFin(ctx, props.upperFinTrace);

	// ==========================================
	// ENABLE DEBUG FOR THE UPPER FIN HERE
	// ==========================================
	// Show red stroke around the upper fin
	// ctx.strokeStyle = "red";
	// ctx.lineWidth = 2;
	// ctx.stroke();
	// ==========================================

	ctx.clip();
	// Translate back to draw at correct original position
	ctx.drawImage(
		image,
		-IMG_W / 2 - FIN_UP_PIVOT_X,
		-IMG_H / 2 - FIN_UP_PIVOT_Y,
		IMG_W,
		IMG_H,
	);
	ctx.restore();

	// ==========================================
	// 4. DRAW LOWER FIN
	// ==========================================
	ctx.save();
	ctx.translate(FIN_DOWN_PIVOT_X, FIN_DOWN_PIVOT_Y);
	ctx.rotate(-finWag * 0.85); // remember to recover this
	// ctx.rotate(0); // remember to remove this
	ctx.beginPath();
	traceFin(ctx, props.lowerFinTrace);

	// ==========================================
	// ENABLE DEBUG FOR THE LOWER FIN HERE
	// ==========================================
	// Show blue stroke around the lower fin
	// ctx.strokeStyle = "blue";
	// ctx.lineWidth = 2;
	// ctx.stroke();
	// ==========================================

	ctx.clip();
	// Translate back to draw at correct original position
	ctx.drawImage(
		image,
		-IMG_W / 2 - FIN_DOWN_PIVOT_X,
		-IMG_H / 2 - FIN_DOWN_PIVOT_Y,
		IMG_W,
		IMG_H,
	);
	ctx.restore();

	ctx.restore();
}

function debugDrawKoi(
	ctx: CanvasRenderingContext2D,
	fish: FishState,
	image: HTMLImageElement,
	time: number,
	props: FishImageProperties,
) {
	const { x, y, angle, size, phase } = fish;
	const sway = Math.sin(time * 0.008 + phase);
	const tailWag = Math.sin(time * 0.018 + phase) * 0.22;
	const finWag = Math.sin(time * 0.014 + phase + 0.8) * 0.12;

	// --- CONFIGURATION PARAMETERS ---
	// 1. Overall dimensions of image
	const IMG_W = props.size.width;
	const IMG_H = props.size.height;

	// 2. Tail joint coordinates (Tail pivot) - Relative to fish center
	const TAIL_PIVOT_X = props.tailPivot.x;
	const TAIL_PIVOT_Y = props.tailPivot.y;
	// Tail crop coordinates from source image (sx, sy, sw, sh) and draw (dx, dy, dw, dh)
	const TAIL_CROP = props.tailCrop;

	// 3. Upper & Lower fin joint coordinates - Relative to fish center
	const FIN_UP_PIVOT_X = props.finUpPivot.x;
	const FIN_UP_PIVOT_Y = props.finUpPivot.y;

	const FIN_DOWN_PIVOT_X = props.finDownPivot.x;
	const FIN_DOWN_PIVOT_Y = props.finDownPivot.y;
	// -----------------------------------------

	// Calculate scale ratio based on new width
	const scale = size / IMG_W;

	ctx.save();
	// Body sway motion
	ctx.translate(
		x + Math.cos(angle + Math.PI / 2) * sway * 2,
		y + Math.sin(angle + Math.PI / 2) * sway * 2,
	);
	ctx.rotate(angle + Math.PI + sway * 0.06);
	ctx.scale(scale, scale);

	// ==========================================
	// 1. DRAW TAIL
	// ==========================================
	ctx.save();
	ctx.translate(TAIL_PIVOT_X, TAIL_PIVOT_Y);
	// ctx.rotate(tailWag); // remember to recover this
	ctx.rotate(0); // remember to remove this
	ctx.drawImage(
		image,
		TAIL_CROP.sx,
		TAIL_CROP.sy,
		TAIL_CROP.sw,
		TAIL_CROP.sh, // Crop from source image
		TAIL_CROP.dx,
		TAIL_CROP.dy,
		TAIL_CROP.dw,
		TAIL_CROP.dh, // Place at pivot
	);

	// ==========================================
	// ENABLE DEBUG FOR THE TAIL HERE
	// ==========================================
	// 1. Draw a magenta border showing the exact rectangle containing the tail
	ctx.strokeStyle = "magenta";
	ctx.lineWidth = 2;
	ctx.strokeRect(TAIL_CROP.dx, TAIL_CROP.dy, TAIL_CROP.dw, TAIL_CROP.dh);
	// 2. Draw a red dot right at the rotation center (Tail joint)
	ctx.fillStyle = "red";
	ctx.beginPath();
	ctx.arc(0, 0, 5, 0, Math.PI * 2); // Red dot with radius 5px
	ctx.fill();
	// ==========================================

	ctx.restore();

	// ==========================================
	// 2. DRAW BODY (CUT FINS)
	// ==========================================
	ctx.save();
	ctx.beginPath();
	// Rectangle frame surrounding the entire fish
	ctx.rect(-IMG_W / 2, -IMG_H / 2, IMG_W - props.bodyDeviation, IMG_H);

	// ==========================================
	// ENABLE DEBUG FOR BODY HERE
	// ==========================================
	// Draw yellow border showing exact rectangle containing the body
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 2;
	ctx.strokeRect(-IMG_W / 2, -IMG_H / 2, IMG_W - props.bodyDeviation, IMG_H);
	// ==========================================

	// Cut hole for upper fin
	ctx.save();
	ctx.translate(FIN_UP_PIVOT_X, FIN_UP_PIVOT_Y);
	traceFin(ctx, props.upperFinTrace);
	ctx.restore();

	// Cut hole for lower fin
	ctx.save();
	ctx.translate(FIN_DOWN_PIVOT_X, FIN_DOWN_PIVOT_Y);
	traceFin(ctx, props.lowerFinTrace);
	ctx.restore();

	// Apply cut and draw body
	ctx.clip("evenodd");
	ctx.drawImage(image, -IMG_W / 2, -IMG_H / 2, IMG_W, IMG_H);
	ctx.restore();

	// ==========================================
	// 3. DRAW UPPER FIN
	// ==========================================
	ctx.save();
	ctx.translate(FIN_UP_PIVOT_X, FIN_UP_PIVOT_Y);
	// ctx.rotate(finWag); // remember to recover this
	ctx.rotate(0); // remember to remove this
	ctx.beginPath();
	traceFin(ctx, props.upperFinTrace);

	// ==========================================
	// ENABLE DEBUG FOR THE UPPER FIN HERE
	// ==========================================
	// Show red stroke around the upper fin
	ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	ctx.stroke();
	// ==========================================

	ctx.clip();
	// Translate back to draw at correct original position
	ctx.drawImage(
		image,
		-IMG_W / 2 - FIN_UP_PIVOT_X,
		-IMG_H / 2 - FIN_UP_PIVOT_Y,
		IMG_W,
		IMG_H,
	);
	ctx.restore();

	// ==========================================
	// 4. DRAW LOWER FIN
	// ==========================================
	ctx.save();
	ctx.translate(FIN_DOWN_PIVOT_X, FIN_DOWN_PIVOT_Y);
	// ctx.rotate(-finWag * 0.85); // remember to recover this
	ctx.rotate(0); // remember to remove this
	ctx.beginPath();
	traceFin(ctx, props.lowerFinTrace);

	// ==========================================
	// ENABLE DEBUG FOR THE LOWER FIN HERE
	// ==========================================
	// Show blue stroke around the lower fin
	ctx.strokeStyle = "blue";
	ctx.lineWidth = 2;
	ctx.stroke();
	// ==========================================

	ctx.clip();
	// Translate back to draw at correct original position
	ctx.drawImage(
		image,
		-IMG_W / 2 - FIN_DOWN_PIVOT_X,
		-IMG_H / 2 - FIN_DOWN_PIVOT_Y,
		IMG_W,
		IMG_H,
	);
	ctx.restore();

	ctx.restore();
}

// Handle lotus collision function
function handleLotusCollisions(lotuses: LotusState[]) {
	for (let i = 0; i < lotuses.length; i++) {
		for (let j = i + 1; j < lotuses.length; j++) {
			const l1 = lotuses[i];
			const l2 = lotuses[j];

			// Calculate the distance between the centers of two lotus leaves
			const dx = l2.x - l1.x;
			const dy = l2.y - l1.y;
			const distance = Math.hypot(dx, dy);

			// Total radius (multiplied by 0.95 to allow the edges of the leaves to slightly overlap for a natural look)
			const minDistance = (l1.size / 2 + l2.size / 2) * 0.75;

			if (distance < minDistance && distance > 0) {
				// 1. ANTI-PENETRATION: Push the two leaves apart so they don’t stick together
				const overlap = minDistance - distance;
				const nx = dx / distance; // X direction vector
				const ny = dy / distance; // Y direction vector

				l1.x -= nx * (overlap / 2);
				l1.y -= ny * (overlap / 2);
				l2.x += nx * (overlap / 2);
				l2.y += ny * (overlap / 2);

				// 2. CHANGE DIRECTION AND SPEED (Elastic collision)
				// Convert angle and speed into X, Y axes
				const v1x = Math.cos(l1.angle) * l1.speed;
				const v1y = Math.sin(l1.angle) * l1.speed;
				const v2x = Math.cos(l2.angle) * l2.speed;
				const v2y = Math.sin(l2.angle) * l2.speed;

				// Calculate the pushing force along the line connecting the two centers
				const p = v1x * nx + v1y * ny - (v2x * nx + v2y * ny);

				// Update the new velocity vectors
				const newV1x = v1x - p * nx;
				const newV1y = v1y - p * ny;
				const newV2x = v2x + p * nx;
				const newV2y = v2y + p * ny;

				// Update the new speed and drifting angle for the lotus leaves
				l1.speed = Math.hypot(newV1x, newV1y);
				l1.angle = Math.atan2(newV1y, newV1x);
				l2.speed = Math.hypot(newV2x, newV2y);
				l2.angle = Math.atan2(newV2y, newV2x);
			}
		}
	}
}

// Use this function to debug fish in canvas
function DebugCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		const koiImage = new Image();

		// Source image
		koiImage.src = "/kois/koi-fish-ginrin-asagi.png";

		koiImage.onload = () => {
			// Configure canvas's size
			const box = (
				canvas.parentElement as HTMLElement
			).getBoundingClientRect();
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = box.width * ratio;
			canvas.height = box.height * ratio;
			canvas.style.width = `${box.width}px`;
			canvas.style.height = `${box.height}px`;
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

			// Fill static background color for pond
			ctx.fillStyle = "#087d9d";
			ctx.fillRect(0, 0, box.width, box.height);

			// Create a giant static fish at the center of the pond
			const staticFish: FishState = {
				x: box.width / 2,
				y: box.height / 2,
				angle: 0, // Horizontal
				size: 550, // Extra-large size to easily inspect the cut edges
				phase: 0,
				speed: 0,
				targetAngle: 0,
				turnAt: 0,
				image: koiImage,
				spawnProgress: 0,
			};

			// Call drawKoi(). Pass time = 0 to turn off all animations
			debugDrawKoi(
				ctx,
				staticFish,
				koiImage,
				0,
				KOI_PROPS_MAP.get("type28") as FishImageProperties,
			);
		};
	}, []);

	return <canvas ref={canvasRef} aria-label="Khung debug cá tĩnh" />;
}

function PondCanvas({ pondKoiList, pond }: PondCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fishRef = useRef<FishState[]>([]);
	const latestKoiListRef = useRef<IKoi[]>(pondKoiList);
	const lotusRef = useRef<LotusState[]>([]);
	const ripplesRef = useRef<RippleState[]>([]);

	// 1. STATE LƯU TRỮ CON CÁ ĐANG ĐƯỢC CHỌN
	const [activeFishIndex, setActiveFishIndex] = useState<number | null>(null);

	const activeFishIndexRef = useRef<number | null>(null);

	const popupRef = useRef<HTMLDivElement>(null);

	const menuTimeoutRef = useRef<number | null>(null);

	// 2. HÀM TÍNH TOẠ ĐỘ CHUỘT THỰC TẾ TRÊN CANVAS
	const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const rect = e.currentTarget.getBoundingClientRect();
		return {
			x: e.clientX - rect.left,
			y: e.clientY - rect.top,
		};
	};

	// 3. XỬ LÝ HOVER (Đổi con trỏ thành bàn tay)
	const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const { x, y } = getMousePos(e);
		let isHovering = false;

		for (let i = 0; i < fishRef.current.length; i++) {
			const fish = fishRef.current[i];
			// Tính khoảng cách từ chuột đến tâm con cá (Hitbox hình tròn)
			const dist = Math.hypot(fish.x - x, fish.y - y);
			if (dist < fish.size / 2) {
				isHovering = true;
				break;
			}
		}

		if (canvasRef.current) {
			canvasRef.current.style.cursor = isHovering ? "pointer" : "default";
		}
	};

	// 4. XỬ LÝ CLICK (Mở menu)
	const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
		const { x, y } = getMousePos(e);
		let clickedIndex = null;

		// Duyệt ngược mảng để ưu tiên chọn con cá vẽ sau cùng (nổi lên trên cùng) nếu chúng đè lên nhau
		for (let i = fishRef.current.length - 1; i >= 0; i--) {
			const fish = fishRef.current[i];
			const dist = Math.hypot(fish.x - x, fish.y - y);
			if (dist < fish.size / 2) {
				clickedIndex = i;
				break;
			}
		}

		setActiveFishIndex(clickedIndex); // Gắn index của con cá hoặc null (ẩn menu)
		activeFishIndexRef.current = clickedIndex;

		// 1. Hủy bộ đếm giờ cũ (nếu có) để tránh lỗi đóng menu oan
		if (menuTimeoutRef.current) {
			clearTimeout(menuTimeoutRef.current);
			menuTimeoutRef.current = null;
		}

		// 2. Nếu người dùng thực sự click trúng một con cá, bắt đầu đếm 5 giây
		if (clickedIndex !== null) {
			menuTimeoutRef.current = setTimeout(() => {
				// Sau 5 giây, set cả State và Ref về null để ẩn menu
				setActiveFishIndex(null);
				activeFishIndexRef.current = null;
			}, 5000);
		}
	};

	useEffect(() => {
		latestKoiListRef.current = pondKoiList;
	}, [pondKoiList]);

	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

		const lotusImages: HTMLImageElement[] = [new Image(), new Image()];
		lotusImages[0].src = "/pond/lotus-1.svg";
		lotusImages[1].src = "/pond/lotus-2.svg";
		const backgroundImage = new Image();
		backgroundImage.src = "/pond/pond-background-2.svg";

		let frame: number;
		let last = performance.now();
		let dimensions = { width: 0, height: 0 };

		const resize = () => {
			const box = (
				canvas.parentElement as HTMLElement
			).getBoundingClientRect();
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = box.width * ratio;
			canvas.height = box.height * ratio;
			canvas.style.width = `${box.width}px`;
			canvas.style.height = `${box.height}px`;
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
			dimensions = { width: box.width, height: box.height };

			if (fishRef.current.length === 0) {
				fishRef.current = latestKoiListRef.current.map((koi) => {
					const koiImage = new Image();
					koiImage.src =
						koi.dictionary?.imageUrl || "/kois/koi-fish-null.svg";
					return makeFish(box.width, box.height, koiImage, false);
				});
			}

			if (lotusRef.current.length === 0) {
				lotusRef.current = Array.from({ length: 8 }, () =>
					makeLotus(box.width, box.height),
				);
			}
		};

		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(canvas.parentElement as HTMLElement);

		const animate = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			const { width, height } = dimensions;

			// 1. Check and release new fish into the pond
			if (
				fishRef.current.length < latestKoiListRef.current.length &&
				width > 0
			) {
				// Cắt lấy những con cá mới được import thêm vào
				const newFishes = latestKoiListRef.current.slice(
					fishRef.current.length,
				);
				newFishes.forEach((koi) => {
					const koiImage = new Image();
					koiImage.src =
						koi.dictionary?.imageUrl || "/kois/koi-fish-null.svg";

					// isNew = true -> kích hoạt spawnProgress = 0
					const newFish = makeFish(width, height, koiImage, true);
					fishRef.current.push(newFish);

					// Tạo hiệu ứng gợn nước ngay tại vị trí thả
					ripplesRef.current.push({
						x: newFish.x,
						y: newFish.y,
						radius: 10,
						alpha: 1,
					});
				});
			}

			// Draw background
			backgroundImage.width = width;
			backgroundImage.height = height;
			ctx.drawImage(backgroundImage, 0, 0, width, height);

			// soft caustic light streaks
			ctx.strokeStyle = "rgba(197, 250, 245, .13)";
			ctx.lineWidth = 2;
			for (let i = 0; i < 18; i++) {
				const yy = ((i * 57 + now * 0.015) % (height + 40)) - 20;
				ctx.beginPath();
				ctx.moveTo(0, yy);
				ctx.bezierCurveTo(
					width * 0.3,
					yy - 24,
					width * 0.7,
					yy + 28,
					width,
					yy - 8,
				);
				ctx.stroke();
			}

			// 2. UPDATE AND DRAW RIPPLES
			for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
				const r = ripplesRef.current[i];
				r.radius += 60 * dt; // Tốc độ lan rộng
				r.alpha -= 0.6 * dt; // Tốc độ mờ dần

				if (r.alpha <= 0) {
					ripplesRef.current.splice(i, 1); // Xóa gợn nước khi đã mờ hẳn
					continue;
				}

				ctx.save();
				// Vòng sóng lớn
				ctx.beginPath();
				ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha})`;
				ctx.lineWidth = 4;
				ctx.stroke();

				// Vòng sóng nhỏ bên trong (tạo độ chân thực)
				ctx.beginPath();
				ctx.arc(r.x, r.y, r.radius * 0.6, 0, Math.PI * 2);
				ctx.strokeStyle = `rgba(255, 255, 255, ${r.alpha * 0.5})`;
				ctx.lineWidth = 2;
				ctx.stroke();
				ctx.restore();
			}

			// 3. UPDATE AND DRAW FISHES
			fishRef.current.forEach((fish) => {
				// Fish's spawn progress
				if (fish.spawnProgress < 1) {
					fish.spawnProgress = Math.min(
						1,
						fish.spawnProgress + dt * 1.5,
					);
				} else {
					fish.turnAt -= dt;
					if (fish.turnAt <= 0) {
						fish.targetAngle += (Math.random() - 0.5) * 1.8;
						fish.turnAt = 1.5 + Math.random() * 3.6;
					}

					const marginX = fish.size * 0.6;
					const marginY = fish.size * 0.6;

					const isOutLeft = fish.x < marginX;
					const isOutRight = fish.x > width - marginX;
					const isOutTop = fish.y < marginY;
					const isOutBottom = fish.y > height - marginY;

					if (isOutLeft || isOutRight || isOutTop || isOutBottom) {
						const centerX = width / 2;
						const centerY = height / 2;

						fish.targetAngle = Math.atan2(
							centerY - fish.y,
							centerX - fish.x,
						);
					}

					let delta = Math.atan2(
						Math.sin(fish.targetAngle - fish.angle),
						Math.cos(fish.targetAngle - fish.angle),
					);
					fish.angle += Math.max(
						-1.2 * dt,
						Math.min(1.2 * dt, delta),
					);
					fish.x += Math.cos(fish.angle) * fish.speed * dt;
					fish.y += Math.sin(fish.angle) * fish.speed * dt;
				}

				if (fish.image && fish.image.complete) {
					drawKoi(
						ctx,
						fish,
						fish.image,
						now,
						KOI_PROPS_MAP.get("type1") as FishImageProperties,
					);
				}
			});

			handleLotusCollisions(lotusRef.current);
			lotusRef.current.forEach((lotus, i) => {
				const targetAngle = Math.PI / 8;
				const baseSpeed = 5; // Lotus's base speed

				let angleDiff = Math.atan2(
					Math.sin(targetAngle - lotus.angle),
					Math.cos(targetAngle - lotus.angle),
				);
				lotus.angle += angleDiff * 1.5 * dt; // Force rotation toward the water flow
				lotus.speed += (baseSpeed - lotus.speed) * 2 * dt; // Slow down if drifting too fast

				lotus.rotation += 0.05 * dt;
				lotus.x += Math.cos(lotus.angle) * lotus.speed * dt;
				lotus.y += Math.sin(lotus.angle) * lotus.speed * dt;

				const padding = lotus.size / 2;

				if (lotus.x > width + padding) {
					lotus.x = -padding;
				} else if (lotus.x < -padding) {
					lotus.x = width + padding;
				}

				if (lotus.y > height + padding) {
					lotus.y = -padding;
				} else if (lotus.y < -padding) {
					lotus.y = height + padding;
				}

				if (lotusImages[0].complete && lotusImages[1].complete) {
					drawLotus(ctx, lotus, lotusImages[i % 2]);
				}
			});

			if (activeFishIndexRef.current !== null && popupRef.current) {
				const activeFish = fishRef.current[activeFishIndexRef.current];
				if (activeFish) {
					// Menu sẽ bám sát cá mượt mà 60 FPS
					popupRef.current.style.left = `${activeFish.x + 20}px`;
					popupRef.current.style.top = `${activeFish.y - 40}px`;
				}
			}

			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	}, [pond]);

	useEffect(() => {
		return () => {
			if (menuTimeoutRef.current) {
				clearTimeout(menuTimeoutRef.current);
			}
		};
	}, []);

	return (
		<>
			<canvas
				ref={canvasRef}
				aria-label="Koi pond is moving"
				className={styles.pondCanvas}
				onMouseMove={handleMouseMove}
				onClick={handleClick}
			/>

			{/* MENU HTML HIỆN LÊN KHI CLICK VÀO CÁ */}
			{activeFishIndex !== null && (
				<div ref={popupRef} className={styles.fishMenu}>
					<button
						className={styles.fishInfoButton}
						onClick={() =>
							alert(`Xem thông tin cá số ${activeFishIndex}`)
						}
					>
						Thông tin
					</button>
					<button
						className={styles.fishMenuCloseButton}
						onClick={() => {
							// Ẩn menu
							setActiveFishIndex(null);
							activeFishIndexRef.current = null;

							// Xóa bộ đếm giờ
							if (menuTimeoutRef.current) {
								clearTimeout(menuTimeoutRef.current);
								menuTimeoutRef.current = null;
							}
						}}
					>
						X
					</button>
				</div>
			)}
		</>
	);
}

interface PondProps {
	pond: IPond;
	onClose: () => void;
	onFetchPond: (page: "next" | "prev") => void;
	onUpdatePond: (name: string, description: string) => void;
}

function Pond({ pond, onClose, onFetchPond, onUpdatePond }: PondProps) {
	const navigate = useNavigate();
	const [isInformationDialogOpen, setIsInformationDialogOpen] =
		useState<boolean>(false);
	const [koiList, setKoiList] = useState<IKoi[]>([]);
	const [isAddKoiDialogOpen, setIsAddKoiDialogOpen] =
		useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			const data: IKoi[] = await handleFetchPondKoiList();
			setKoiList(data);
		};

		fetchData();
	}, []);

	const handleFetchPondKoiList = async (): Promise<IKoi[]> => {
		return MOCK_KOIS;
	};

	const handleImportKoi = async (koiItem: IInventory, quantity: number) => {
		const koiVarient: IKoiVarient = MOCK_VARIENT.find(
			(varient) => varient.id === koiItem.item?.effectValue,
		) as IKoiVarient;
		const newMembers: IKoi[] = Array.from({ length: quantity }, (_v, i) => {
			return {
				id: koiList.length + i,
				name: koiVarient.name,
				age: 50,
				length: 7.2 + (2 * Math.random() - 1),
				weight: 0.15 + (0.06 * Math.random() - 0.03),
				health: 90,
				foodBar: 80,
				cureBar: 100,
				gender: "MALE",
				price: koiVarient.basePrice,
				bornedAt: new Date(),
				lifeStage: "FRY",
				potential: 0.5 * Math.random() + 0.8,
				dictionary: koiVarient,
				patternScore: Math.round(20 * Math.random() + 80),
				colorScore: Math.round(10 * Math.random() + 90),
				bodyScore: Math.round(30 * Math.random() + 70),
				skinScore: Math.round(15 * Math.random() + 85),
				scaleScore: Math.round(25 * Math.random() + 75),
			};
		});

		setTimeout(() => {
			setKoiList((prev) => [...prev, ...newMembers]);
			toast.success(
				<div className={styles.toastMessage}>
					<CircleCheckBig size="30" />
					<span>
						Released x{quantity} {koiVarient.name} to current pond!
					</span>
				</div>,
			);
		}, 500);

		// setKoiList((prev) => [...prev, ...newMembers]);
	};

	const sleep = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	return (
		<>
			<main className={styles.wrapper}>
				<section className={styles.pondShell}>
					<PondCanvas pondKoiList={koiList} pond={pond} />
					{/* <DebugCanvas /> */}
					{/* <div className={styles.pondLabel}>
						<span>Đàn koi</span>
						<strong>{fishCount} con</strong>
					</div> */}
					<div className={styles.coins}>
						<img src="/pond/coin.svg" alt="coin" />
						<span>9.000</span>
					</div>
					<div className={styles.header}>
						<button
							className={styles.navButton}
							type="button"
							title="marketplace"
							onClick={() => navigate("/transactions")}
						>
							<img src="/pond/store.png" alt="store" />
						</button>
						<button
							className={styles.navButton}
							type="button"
							title="dictionary"
							onClick={() => navigate("/dictionary")}
						>
							<img src="/pond/dictionary.svg" alt="dictionary" />
						</button>
						<button
							className={styles.navButton}
							type="button"
							title="shop"
							onClick={() => navigate("/shop")}
						>
							<img
								src="/pond/shopping-cart.png"
								alt="marketplace"
							/>
						</button>
					</div>
					<div className={styles.footer}>
						<button
							type="button"
							className={styles.navButton}
							title="information"
							onClick={() => setIsInformationDialogOpen(true)}
						>
							<img
								src="/pond/information-button.png"
								alt="pond info"
							/>
						</button>
						{/* <button
							type="button"
							className={styles.navButton}
							title="all ponds"
						>
							<img src="/pond/pond-list-1.svg" alt="pond list" />
						</button> */}
						<button
							type="button"
							className={styles.navButton}
							title="inventory"
							onClick={() => navigate("/inventory")}
						>
							<img src="/pond/backpack.png" alt="inventory" />
						</button>
						<button
							type="button"
							className={styles.navButton}
							title="add koi"
							onClick={() => setIsAddKoiDialogOpen(true)}
						>
							<img src="/pond/add-koi.svg" alt="add koi" />
						</button>
					</div>

					<div className={styles.back}>
						<button
							type="button"
							className={styles.navButton}
							title="back"
							onClick={() => onClose()}
						>
							<Undo2 size={50} />
						</button>
					</div>
					<div className={`${styles.prevPond} ${styles.pagination}`}>
						<button
							type="button"
							className={styles.navButton}
							title="previous"
							// disabled={true}
							onClick={() => onFetchPond("prev")}
						>
							<CircleArrowLeft size={50} />
						</button>
					</div>
					<div className={`${styles.nextPond} ${styles.pagination}`}>
						<button
							type="button"
							className={styles.navButton}
							title="next"
							// disabled={true}
							onClick={() => onFetchPond("next")}
						>
							<CircleArrowRight size={50} />
						</button>
					</div>
				</section>
			</main>
			{isInformationDialogOpen && (
				<div className={styles.overlay}>
					<PondInformation
						pond={pond}
						onClose={() => setIsInformationDialogOpen(false)}
						onEdit={onUpdatePond}
					/>
				</div>
			)}
			{isAddKoiDialogOpen && (
				<div className={styles.overlay}>
					<ImportKoiForm
						currentQuantity={koiList.length}
						pondCapacity={pond.capacity}
						onClose={() => setIsAddKoiDialogOpen(false)}
						onSubmit={handleImportKoi}
					/>
				</div>
			)}
		</>
	);
}

export default Pond;

const MOCK_VARIENT: IKoiVarient[] = [
	{
		id: 1,
		name: "Kohaku",
		origin: "Japan",
		scaleType: "WAGOI",
		shape: "STANDARD",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 100,
		alphaPrice: 1.68,
		imageUrl: "/kois/koi-fish-kohaku.svg",
	},
	{
		id: 2,
		name: "Menkaburi Kohaku",
		origin: "Japan",
		scaleType: "WAGOI",
		shape: "STANDARD",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 110,
		alphaPrice: 1.69,
		imageUrl: "/kois/koi-fish-menkaburi-kohaku.svg",
	},
	{
		id: 3,
		name: "Inazuma Kohaku",
		origin: "Japan",
		scaleType: "WAGOI",
		shape: "STANDARD",
		baseMaxLength: 90.0,
		baseGrowthRate: 0.015,
		midAge: 400,
		alphaWeight: 0.000015,
		basePrice: 180,
		alphaPrice: 1.75,
		imageUrl: "/kois/koi-fish-inazuma-kohaku.svg",
	},
];

const MOCK_KOIS: IKoi[] = [
	{
		id: 1,
		name: "Kohaku 1",
		age: 600,
		length: 92.5,
		weight: 5.15,
		health: 100,
		foodBar: 100,
		cureBar: 100,
		gender: "MALE",
		price: 5050,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.0,
		dictionary: MOCK_VARIENT[0],
		patternScore: 80,
		colorScore: 90,
		bodyScore: 70,
		skinScore: 85,
		scaleScore: 75,
	},
	{
		id: 2,
		name: "Menkaburi Kohaku 1",
		age: 450,
		length: 85.5,
		weight: 4.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 4320,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[1],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 3,
		name: "Inazuma Kohaku 1",
		age: 393,
		length: 68.0,
		weight: 3.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 4910,
		bornedAt: new Date(),
		lifeStage: "JUVENILE",
		potential: 1.1,
		dictionary: MOCK_VARIENT[2],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 4,
		name: "Kohaku 2",
		age: 520,
		length: 88.3,
		weight: 4.95,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 5010,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[0],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 5,
		name: "Menkaburi Kohaku 2",
		age: 405,
		length: 84.7,
		weight: 4.55,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "MALE",
		price: 4620,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[1],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 6,
		name: "Inazuma Kohaku 2",
		age: 490,
		length: 89.1,
		weight: 4.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "MALE",
		price: 4910,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[2],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 7,
		name: "Kohaku 3",
		age: 510,
		length: 87.3,
		weight: 4.8,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 5010,
		bornedAt: new Date(),
		lifeStage: "ADULT",
		potential: 1.1,
		dictionary: MOCK_VARIENT[0],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 8,
		name: "Menkaburi Kohaku 3",
		age: 205,
		length: 84.7,
		weight: 4.55,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "FEMALE",
		price: 4620,
		bornedAt: new Date(),
		lifeStage: "JUVENILE",
		potential: 1.05,
		dictionary: MOCK_VARIENT[1],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
	{
		id: 9,
		name: "Inazuma Kohaku 3",
		age: 358,
		length: 80.5,
		weight: 3.85,
		health: 90,
		foodBar: 70,
		cureBar: 90,
		gender: "MALE",
		price: 4910,
		bornedAt: new Date(),
		lifeStage: "JUVENILE",
		potential: 1.1,
		dictionary: MOCK_VARIENT[2],
		patternScore: 100,
		colorScore: 80,
		bodyScore: 75,
		skinScore: 65,
		scaleScore: 95,
	},
];

const KOI_PROPS_MAP = new Map<string, FishImageProperties>([
	[
		"type1", // All koi fishes from Bao, Thinh's style
		{
			size: {
				width: 836,
				height: 340,
			},
			tailCrop: {
				sx: 690,
				sy: 88,
				sw: 146,
				sh: 104,
				dx: -10,
				dy: -82,
				dw: 146,
				dh: 104,
			},
			tailPivot: {
				x: 282,
				y: 0,
			},
			finUpPivot: {
				x: -253,
				y: -92,
			},
			finDownPivot: {
				x: -253,
				y: 92,
			},
			bodyDeviation: 126,
			upperFinTrace: {
				firstPoint: {
					x: -14,
					y: -3,
				},
				secondPoint: {
					x: 20,
					y: -79,
				},
				thirdPoint: {
					x: 105,
					y: -79,
				},
				fourthPoint: {
					x: 69,
					y: 6,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: -14,
					y: 3,
				},
				secondPoint: {
					x: 20,
					y: 79,
				},
				thirdPoint: {
					x: 105,
					y: 79,
				},
				fourthPoint: {
					x: 69,
					y: -6,
				},
			},
		},
	],
	[
		"type2", // All goromo koi fishes, Ginrin Shiro Utsuri, Aka Bekko, Ki Bekko, Karashi, Benigoi (Khoa's style)
		{
			size: {
				width: 441,
				height: 252,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 146,
				y: 0,
			},
			finUpPivot: {
				x: -130,
				y: -55,
			},
			finDownPivot: {
				x: -130,
				y: 55,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 61,
					y: 2,
				},
				secondPoint: {
					x: -1,
					y: 2,
				},
				thirdPoint: {
					x: 28,
					y: -72,
				},
				fourthPoint: {
					x: 61,
					y: -72,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 61,
					y: -2,
				},
				secondPoint: {
					x: -1,
					y: -2,
				},
				thirdPoint: {
					x: 28,
					y: 72,
				},
				fourthPoint: {
					x: 61,
					y: 72,
				},
			},
		},
	],
	[
		"type3", // Ginrin Hi Utsuri
		{
			size: {
				width: 441,
				height: 257,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 146,
				y: -2,
			},
			finUpPivot: {
				x: -138,
				y: -54,
			},
			finDownPivot: {
				x: -138,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 61,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 1,
				},
				thirdPoint: {
					x: -6,
					y: -75,
				},
				fourthPoint: {
					x: 61,
					y: -75,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 61,
					y: -1,
				},
				secondPoint: {
					x: -1,
					y: 1,
				},
				thirdPoint: {
					x: -6,
					y: 75,
				},
				fourthPoint: {
					x: 61,
					y: 75,
				},
			},
		},
	],
	[
		"type4", // Ginrin Ki Utsuri
		{
			size: {
				width: 441,
				height: 254,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 146,
				y: -1,
			},
			finUpPivot: {
				x: -133,
				y: -54,
			},
			finDownPivot: {
				x: -133,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 62,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 1,
				},
				thirdPoint: {
					x: 4,
					y: -74,
				},
				fourthPoint: {
					x: 68,
					y: -74,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 62,
					y: -1,
				},
				secondPoint: {
					x: -1,
					y: 1,
				},
				thirdPoint: {
					x: 4,
					y: 74,
				},
				fourthPoint: {
					x: 68,
					y: 74,
				},
			},
		},
	],
	[
		"type5", // Shiro Utsuri Doitsu
		{
			size: {
				width: 444,
				height: 258,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 147,
				y: -2,
			},
			finUpPivot: {
				x: -128,
				y: -54,
			},
			finDownPivot: {
				x: -133,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 62,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 2,
				},
				thirdPoint: {
					x: 18,
					y: -75,
				},
				fourthPoint: {
					x: 68,
					y: -75,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 62,
					y: -1,
				},
				secondPoint: {
					x: -1,
					y: -2,
				},
				thirdPoint: {
					x: 18,
					y: 75,
				},
				fourthPoint: {
					x: 68,
					y: 75,
				},
			},
		},
	],
	[
		"type6", // Hi Utsuri Doitsu
		{
			size: {
				width: 442,
				height: 258,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 147,
				y: -2,
			},
			finUpPivot: {
				x: -131,
				y: -54,
			},
			finDownPivot: {
				x: -135,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 62,
					y: 1,
				},
				secondPoint: {
					x: -2,
					y: 2,
				},
				thirdPoint: {
					x: 18,
					y: -75,
				},
				fourthPoint: {
					x: 68,
					y: -75,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 62,
					y: -1,
				},
				secondPoint: {
					x: -2,
					y: -2,
				},
				thirdPoint: {
					x: 18,
					y: 75,
				},
				fourthPoint: {
					x: 68,
					y: 75,
				},
			},
		},
	],
	[
		"type7", // Ki Utsuri Doitsu
		{
			size: {
				width: 441,
				height: 256,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 146,
				y: -2,
			},
			finUpPivot: {
				x: -133,
				y: -54,
			},
			finDownPivot: {
				x: -133,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 63,
					y: 2,
				},
				secondPoint: {
					x: -1,
					y: 2,
				},
				thirdPoint: {
					x: 4,
					y: -74,
				},
				fourthPoint: {
					x: 78,
					y: -74,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 63,
					y: -1,
				},
				secondPoint: {
					x: -1,
					y: 0,
				},
				thirdPoint: {
					x: 4,
					y: 74,
				},
				fourthPoint: {
					x: 78,
					y: 74,
				},
			},
		},
	],
	[
		"type8", // Hikari Shiro Utsuri
		{
			size: {
				width: 441,
				height: 257,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 146,
				y: -2,
			},
			finUpPivot: {
				x: -131,
				y: -54,
			},
			finDownPivot: {
				x: -126,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 58,
					y: 0,
				},
				secondPoint: {
					x: 0,
					y: 1,
				},
				thirdPoint: {
					x: -10,
					y: -75,
				},
				fourthPoint: {
					x: 61,
					y: -75,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 58,
					y: 0,
				},
				secondPoint: {
					x: 0,
					y: 1,
				},
				thirdPoint: {
					x: -10,
					y: 75,
				},
				fourthPoint: {
					x: 61,
					y: 75,
				},
			},
		},
	],
	[
		"type9", // Hi Utsuri
		{
			size: {
				width: 442,
				height: 233,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 147,
				y: 10,
			},
			finUpPivot: {
				x: -130,
				y: -54,
			},
			finDownPivot: {
				x: -130,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 62,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 2,
				},
				thirdPoint: {
					x: 10,
					y: -63,
				},
				fourthPoint: {
					x: 72,
					y: -63,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 62,
					y: -1,
				},
				secondPoint: {
					x: -1,
					y: -2,
				},
				thirdPoint: {
					x: 10,
					y: 63,
				},
				fourthPoint: {
					x: 72,
					y: 63,
				},
			},
		},
	],
	[
		"type10", // Ki Utsuri
		{
			size: {
				width: 443,
				height: 248,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 147,
				y: 2,
			},
			finUpPivot: {
				x: -126,
				y: -54,
			},
			finDownPivot: {
				x: -126,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 41,
					y: 1,
				},
				secondPoint: {
					x: -2,
					y: 1,
				},
				thirdPoint: {
					x: -1,
					y: -68,
				},
				fourthPoint: {
					x: 72,
					y: -68,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 41,
					y: -1,
				},
				secondPoint: {
					x: 0,
					y: -1,
				},
				thirdPoint: {
					x: -1,
					y: 68,
				},
				fourthPoint: {
					x: 72,
					y: 68,
				},
			},
		},
	],
	[
		"type11", // Shiro Bekko
		{
			size: {
				width: 441,
				height: 236,
			},
			tailCrop: {
				sx: 369,
				sy: 61,
				sw: 90,
				sh: 130,
				dx: 0,
				dy: -65,
				dw: 90,
				dh: 130,
			},
			tailPivot: {
				x: 147,
				y: 10,
			},
			finUpPivot: {
				x: -130,
				y: -54,
			},
			finDownPivot: {
				x: -130,
				y: 54,
			},
			bodyDeviation: 73,
			upperFinTrace: {
				firstPoint: {
					x: 62,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 2,
				},
				thirdPoint: {
					x: 10,
					y: -63,
				},
				fourthPoint: {
					x: 72,
					y: -63,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 62,
					y: -1,
				},
				secondPoint: {
					x: -1,
					y: -2,
				},
				thirdPoint: {
					x: 10,
					y: 63,
				},
				fourthPoint: {
					x: 72,
					y: 63,
				},
			},
		},
	],
	[
		"type12", //
		{
			size: {
				width: 785,
				height: 395,
			},
			tailCrop: {
				sx: 662,
				sy: 108,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -90,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 270,
				y: 0,
			},
			finUpPivot: {
				x: -268,
				y: -105,
			},
			finDownPivot: {
				x: -264,
				y: 104,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 91,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 2,
				},
				thirdPoint: {
					x: 20,
					y: -92,
				},
				fourthPoint: {
					x: 56,
					y: -92,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 90,
					y: -3,
				},
				secondPoint: {
					x: -2,
					y: -2,
				},
				thirdPoint: {
					x: 20,
					y: 90,
				},
				fourthPoint: {
					x: 56,
					y: 90,
				},
			},
		},
	],
	[
		"type13", //
		{
			size: {
				width: 785,
				height: 395,
			},
			tailCrop: {
				sx: 662,
				sy: 108,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -90,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 270,
				y: 0,
			},
			finUpPivot: {
				x: -274,
				y: -99,
			},
			finDownPivot: {
				x: -270,
				y: 110,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 91,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 2,
				},
				thirdPoint: {
					x: 20,
					y: -95,
				},
				fourthPoint: {
					x: 56,
					y: -95,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 89,
					y: -2,
				},
				secondPoint: {
					x: -1,
					y: -2,
				},
				thirdPoint: {
					x: 20,
					y: 85,
				},
				fourthPoint: {
					x: 56,
					y: 85,
				},
			},
		},
	],
	[
		"type14", //
		{
			size: {
				width: 788,
				height: 395,
			},
			tailCrop: {
				sx: 662,
				sy: 108,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -90,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 270,
				y: 0,
			},
			finUpPivot: {
				x: -252,
				y: -102,
			},
			finDownPivot: {
				x: -250,
				y: 106,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 91,
					y: 1,
				},
				secondPoint: {
					x: -1,
					y: 0,
				},
				thirdPoint: {
					x: 20,
					y: -92,
				},
				fourthPoint: {
					x: 56,
					y: -92,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 89,
					y: -2,
				},
				secondPoint: {
					x: -1,
					y: -2,
				},
				thirdPoint: {
					x: 20,
					y: 85,
				},
				fourthPoint: {
					x: 56,
					y: 85,
				},
			},
		},
	],
	[
		"type15", //
		{
			size: {
				width: 785,
				height: 442,
			},
			tailCrop: {
				sx: 662,
				sy: 125,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -96,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 270,
				y: 0,
			},
			finUpPivot: {
				x: -252,
				y: -102,
			},
			finDownPivot: {
				x: -250,
				y: 106,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 102,
					y: 1,
				},
				secondPoint: {
					x: -3,
					y: 0,
				},
				thirdPoint: {
					x: 40,
					y: -115,
				},
				fourthPoint: {
					x: 76,
					y: -115,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 100,
					y: -6,
				},
				secondPoint: {
					x: -8,
					y: -6,
				},
				thirdPoint: {
					x: 35,
					y: 110,
				},
				fourthPoint: {
					x: 76,
					y: 110,
				},
			},
		},
	],
	[
		"type16", //
		{
			size: {
				width: 788,
				height: 452,
			},
			tailCrop: {
				sx: 662,
				sy: 130,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -96,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 270,
				y: 0,
			},
			finUpPivot: {
				x: -252,
				y: -102,
			},
			finDownPivot: {
				x: -250,
				y: 106,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 102,
					y: 1,
				},
				secondPoint: {
					x: -11,
					y: 0,
				},
				thirdPoint: {
					x: 32,
					y: -120,
				},
				fourthPoint: {
					x: 74,
					y: -120,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 98,
					y: -4,
				},
				secondPoint: {
					x: -12,
					y: -2,
				},
				thirdPoint: {
					x: 30,
					y: 118,
				},
				fourthPoint: {
					x: 74,
					y: 118,
				},
			},
		},
	],
	[
		"type17", //
		{
			size: {
				width: 786,
				height: 376,
			},
			tailCrop: {
				sx: 662,
				sy: 94,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -94,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 265,
				y: 0,
			},
			finUpPivot: {
				x: -262,
				y: -102,
			},
			finDownPivot: {
				x: -262,
				y: 106,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 92,
					y: 2,
				},
				secondPoint: {
					x: -10,
					y: 0,
				},
				thirdPoint: {
					x: -40,
					y: -90,
				},
				fourthPoint: {
					x: 70,
					y: -90,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 92,
					y: -2,
				},
				secondPoint: {
					x: -10,
					y: -2,
				},
				thirdPoint: {
					x: -40,
					y: 90,
				},
				fourthPoint: {
					x: 70,
					y: 90,
				},
			},
		},
	],
	[
		"type18", //
		{
			size: {
				width: 785,
				height: 441,
			},
			tailCrop: {
				sx: 662,
				sy: 125,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -96,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 270,
				y: 0,
			},
			finUpPivot: {
				x: -245,
				y: -102,
			},
			finDownPivot: {
				x: -245,
				y: 106,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 100,
					y: 2,
				},
				secondPoint: {
					x: -10,
					y: 0,
				},
				thirdPoint: {
					x: 32,
					y: -120,
				},
				fourthPoint: {
					x: 74,
					y: -120,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 96,
					y: -5,
				},
				secondPoint: {
					x: -12,
					y: -2,
				},
				thirdPoint: {
					x: 25,
					y: 115,
				},
				fourthPoint: {
					x: 74,
					y: 115,
				},
			},
		},
	],
	[
		"type19", //
		{
			size: {
				width: 1400,
				height: 693,
			},
			tailCrop: {
				sx: 1185,
				sy: 185,
				sw: 220,
				sh: 220,
				dx: 0,
				dy: -167,
				dw: 220,
				dh: 220,
			},
			tailPivot: {
				x: 480,
				y: 5,
			},
			finUpPivot: {
				x: -422,
				y: -174,
			},
			finDownPivot: {
				x: -414,
				y: 185,
			},
			bodyDeviation: 218,
			upperFinTrace: {
				firstPoint: {
					x: 155,
					y: 2,
				},
				secondPoint: {
					x: -12,
					y: -1,
				},
				thirdPoint: {
					x: 29,
					y: -170,
				},
				fourthPoint: {
					x: 90,
					y: -170,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 150,
					y: -5,
				},
				secondPoint: {
					x: -14,
					y: 1,
				},
				thirdPoint: {
					x: 25,
					y: 160,
				},
				fourthPoint: {
					x: 85,
					y: 160,
				},
			},
		},
	],
	[
		"type20", //
		{
			size: {
				width: 1400,
				height: 703,
			},
			tailCrop: {
				sx: 1185,
				sy: 185,
				sw: 220,
				sh: 220,
				dx: 0,
				dy: -175,
				dw: 220,
				dh: 220,
			},
			tailPivot: {
				x: 480,
				y: 10,
			},
			finUpPivot: {
				x: -480,
				y: -170,
			},
			finDownPivot: {
				x: -470,
				y: 190,
			},
			bodyDeviation: 218,
			upperFinTrace: {
				firstPoint: {
					x: 160,
					y: 0,
				},
				secondPoint: {
					x: -14,
					y: -1,
				},
				thirdPoint: {
					x: 29,
					y: -175,
				},
				fourthPoint: {
					x: 95,
					y: -175,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 150,
					y: -2,
				},
				secondPoint: {
					x: -16,
					y: 1,
				},
				thirdPoint: {
					x: 30,
					y: 160,
				},
				fourthPoint: {
					x: 85,
					y: 160,
				},
			},
		},
	],
	[
		"type21", //
		{
			size: {
				width: 1400,
				height: 703,
			},
			tailCrop: {
				sx: 1185,
				sy: 205,
				sw: 220,
				sh: 220,
				dx: 0,
				dy: -175,
				dw: 220,
				dh: 220,
			},
			tailPivot: {
				x: 480,
				y: 28,
			},
			finUpPivot: {
				x: -470,
				y: -155,
			},
			finDownPivot: {
				x: -450,
				y: 210,
			},
			bodyDeviation: 218,
			upperFinTrace: {
				firstPoint: {
					x: 165,
					y: 1,
				},
				secondPoint: {
					x: -18,
					y: -1,
				},
				thirdPoint: {
					x: 22,
					y: -195,
				},
				fourthPoint: {
					x: 100,
					y: -195,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 130,
					y: -2,
				},
				secondPoint: {
					x: -18,
					y: 1,
				},
				thirdPoint: {
					x: 15,
					y: 140,
				},
				fourthPoint: {
					x: 80,
					y: 140,
				},
			},
		},
	],
	[
		"type22", //
		{
			size: {
				width: 1400,
				height: 808,
			},
			tailCrop: {
				sx: 1185,
				sy: 245,
				sw: 220,
				sh: 220,
				dx: 0,
				dy: -170,
				dw: 220,
				dh: 220,
			},
			tailPivot: {
				x: 480,
				y: 13,
			},
			finUpPivot: {
				x: -480,
				y: -165,
			},
			finDownPivot: {
				x: -478,
				y: 190,
			},
			bodyDeviation: 218,
			upperFinTrace: {
				firstPoint: {
					x: 175,
					y: -3,
				},
				secondPoint: {
					x: -20,
					y: -1,
				},
				thirdPoint: {
					x: 42,
					y: -220,
				},
				fourthPoint: {
					x: 125,
					y: -220,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 170,
					y: 2,
				},
				secondPoint: {
					x: -22,
					y: 1,
				},
				thirdPoint: {
					x: 45,
					y: 205,
				},
				fourthPoint: {
					x: 110,
					y: 205,
				},
			},
		},
	],
	[
		"type23", //
		{
			size: {
				width: 1400,
				height: 776,
			},
			tailCrop: {
				sx: 1185,
				sy: 220,
				sw: 230,
				sh: 220,
				dx: 0,
				dy: -167,
				dw: 230,
				dh: 220,
			},
			tailPivot: {
				x: 480,
				y: 0,
			},
			finUpPivot: {
				x: -425,
				y: -180,
			},
			finDownPivot: {
				x: -410,
				y: 180,
			},
			bodyDeviation: 218,
			upperFinTrace: {
				firstPoint: {
					x: 170,
					y: 2,
				},
				secondPoint: {
					x: -20,
					y: -1,
				},
				thirdPoint: {
					x: 45,
					y: -205,
				},
				fourthPoint: {
					x: 120,
					y: -205,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 170,
					y: -5,
				},
				secondPoint: {
					x: -23,
					y: 1,
				},
				thirdPoint: {
					x: 45,
					y: 205,
				},
				fourthPoint: {
					x: 110,
					y: 205,
				},
			},
		},
	],
	[
		"type24", //
		{
			size: {
				width: 1400,
				height: 787,
			},
			tailCrop: {
				sx: 1185,
				sy: 245,
				sw: 220,
				sh: 220,
				dx: 0,
				dy: -166,
				dw: 220,
				dh: 220,
			},
			tailPivot: {
				x: 480,
				y: 17,
			},
			finUpPivot: {
				x: -460,
				y: -165,
			},
			finDownPivot: {
				x: -452,
				y: 198,
			},
			bodyDeviation: 218,
			upperFinTrace: {
				firstPoint: {
					x: 175,
					y: 2,
				},
				secondPoint: {
					x: -22,
					y: -1,
				},
				thirdPoint: {
					x: 42,
					y: -225,
				},
				fourthPoint: {
					x: 125,
					y: -225,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 160,
					y: -2,
				},
				secondPoint: {
					x: -24,
					y: 1,
				},
				thirdPoint: {
					x: 45,
					y: 190,
				},
				fourthPoint: {
					x: 110,
					y: 190,
				},
			},
		},
	],
	[
		"type25", //
		{
			size: {
				width: 930,
				height: 467,
			},
			tailCrop: {
				sx: 788,
				sy: 115,
				sw: 160,
				sh: 170,
				dx: 0,
				dy: -125,
				dw: 160,
				dh: 170,
			},
			tailPivot: {
				x: 325,
				y: 6,
			},
			finUpPivot: {
				x: -305,
				y: -115,
			},
			finDownPivot: {
				x: -295,
				y: 125,
			},
			bodyDeviation: 140,
			upperFinTrace: {
				firstPoint: {
					x: 92,
					y: 1,
				},
				secondPoint: {
					x: -23,
					y: -1,
				},
				thirdPoint: {
					x: 5,
					y: -115,
				},
				fourthPoint: {
					x: 50,
					y: -115,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 80,
					y: 1,
				},
				secondPoint: {
					x: -26,
					y: 1,
				},
				thirdPoint: {
					x: -5,
					y: 105,
				},
				fourthPoint: {
					x: 40,
					y: 105,
				},
			},
		},
	],
	[
		"type26", //
		{
			size: {
				width: 787,
				height: 452,
			},
			tailCrop: {
				sx: 662,
				sy: 120,
				sw: 130,
				sh: 130,
				dx: 0,
				dy: -100,
				dw: 130,
				dh: 130,
			},
			tailPivot: {
				x: 270,
				y: -5,
			},
			finUpPivot: {
				x: -278,
				y: -108,
			},
			finDownPivot: {
				x: -280,
				y: 98,
			},
			bodyDeviation: 122,
			upperFinTrace: {
				firstPoint: {
					x: 105,
					y: -2,
				},
				secondPoint: {
					x: -2,
					y: 0,
				},
				thirdPoint: {
					x: 35,
					y: -115,
				},
				fourthPoint: {
					x: 76,
					y: -115,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 108,
					y: -1,
				},
				secondPoint: {
					x: -3,
					y: -2,
				},
				thirdPoint: {
					x: 20,
					y: 125,
				},
				fourthPoint: {
					x: 86,
					y: 125,
				},
			},
		},
	],
	[
		"type27", //
		{
			size: {
				width: 1400,
				height: 761,
			},
			tailCrop: {
				sx: 1185,
				sy: 212,
				sw: 220,
				sh: 220,
				dx: 0,
				dy: -166,
				dw: 220,
				dh: 220,
			},
			tailPivot: {
				x: 480,
				y: -2,
			},
			finUpPivot: {
				x: -460,
				y: -182,
			},
			finDownPivot: {
				x: -455,
				y: 180,
			},
			bodyDeviation: 218,
			upperFinTrace: {
				firstPoint: {
					x: 155,
					y: 2,
				},
				secondPoint: {
					x: -26,
					y: -1,
				},
				thirdPoint: {
					x: 15,
					y: -195,
				},
				fourthPoint: {
					x: 90,
					y: -195,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 155,
					y: -2,
				},
				secondPoint: {
					x: -26,
					y: 1,
				},
				thirdPoint: {
					x: 15,
					y: 195,
				},
				fourthPoint: {
					x: 90,
					y: 195,
				},
			},
		},
	],
	[
		"type28", //
		{
			size: {
				width: 1400,
				height: 692,
			},
			tailCrop: {
				sx: 1185,
				sy: 170,
				sw: 220,
				sh: 220,
				dx: 0,
				dy: -172,
				dw: 220,
				dh: 220,
			},
			tailPivot: {
				x: 490,
				y: -3,
			},
			finUpPivot: {
				x: -465,
				y: -182,
			},
			finDownPivot: {
				x: -465,
				y: 180,
			},
			bodyDeviation: 212,
			upperFinTrace: {
				firstPoint: {
					x: 140,
					y: -3,
				},
				secondPoint: {
					x: -30,
					y: -1,
				},
				thirdPoint: {
					x: 45,
					y: -160,
				},
				fourthPoint: {
					x: 120,
					y: -160,
				},
			},
			lowerFinTrace: {
				firstPoint: {
					x: 145,
					y: -3,
				},
				secondPoint: {
					x: -36,
					y: -3,
				},
				thirdPoint: {
					x: 35,
					y: 165,
				},
				fourthPoint: {
					x: 150,
					y: 165,
				},
			},
		},
	],
]);
