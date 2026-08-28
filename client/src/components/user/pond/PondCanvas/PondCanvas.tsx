import { useEffect, useRef, useState } from "react";
import type { IKoi, IPond } from "../../../../types/backend";
import KoiProfile from "../../KoiProfile/KoiProfile";
import styles from "./PondCanvas.module.css";
import {
	debugDrawKoi,
	drawKoi,
	drawLotus,
	handleLotusCollisions,
	KOI_PROPS_MAP,
	makeFish,
	makeLotus,
} from "./PondCanvasLogic";

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

interface PondCanvasProps {
	pondKoiList: IKoi[];
	pond: IPond;
}

// Use this function to debug fish in canvas
function DebugCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		const koiImage = new Image();

		// Source image
		koiImage.src = "/kois/koi-fish-soragoi.png";

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
				KOI_PROPS_MAP.get("type14") as FishImageProperties,
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

	const [activeKoiProfile, setActiveKoiProfile] = useState<IKoi | null>(null);

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
						onClick={() => {
							setActiveKoiProfile(
								latestKoiListRef.current.at(
									activeFishIndex,
								) as IKoi,
							);
						}}
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
			{activeKoiProfile !== null && (
				<div className={styles.overlay}>
					<KoiProfile
						koi={activeKoiProfile}
						onClose={() => setActiveKoiProfile(null)}
					/>
				</div>
			)}
		</>
	);
}

export { DebugCanvas, PondCanvas };
