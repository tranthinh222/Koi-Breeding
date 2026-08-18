import { useEffect, useRef, useState } from "react";
import "./Pond.css";

interface FishState {
	x: number;
	y: number;
	angle: number;
	speed: number;
	targetAngle: number;
	turnAt: number;
	size: number;
	phase: number;
}

function makeFish(width: number, height: number): FishState {
	const angle = Math.random() * Math.PI * 2;
	const speed = 17 + Math.random() * 24;
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
	};
}

// Draw upper fin function (Bao, Thinh's style)
function traceUpperFin(ctx: CanvasRenderingContext2D) {
	ctx.moveTo(-14, -3);
	ctx.bezierCurveTo(5, -50, 31, -66, 40, -60);
	ctx.bezierCurveTo(70, -92, 108, -75, 95, -55);
	ctx.lineTo(69, 6);
	ctx.closePath();
}

// Draw lower fin function (Bao, Thinh's style)
function traceLowerFin(ctx: CanvasRenderingContext2D) {
	ctx.moveTo(-14, 3);
	ctx.bezierCurveTo(5, 50, 31, 66, 40, 60);
	ctx.bezierCurveTo(70, 92, 108, 75, 95, 55);
	ctx.lineTo(69, -6);
	ctx.closePath();
}

// Draw upper fin function (Khoa's style)
function traceNewUpperFin(ctx: CanvasRenderingContext2D) {
	ctx.moveTo(61, 2);
	ctx.lineTo(-1, 2);
	ctx.lineTo(28, -72);
	ctx.lineTo(61, -72);
	ctx.closePath();
}

// Draw lower fin function (Khoa's style)
function traceNewLowerFin(ctx: CanvasRenderingContext2D) {
	ctx.moveTo(61, -2);
	ctx.lineTo(-1, -2);
	ctx.lineTo(28, 72);
	ctx.lineTo(61, 72);
	ctx.closePath();
}

// Bao, Thinh's style
function drawKoi(
	ctx: CanvasRenderingContext2D,
	fish: FishState,
	image: HTMLImageElement,
	time: number,
) {
	const { x, y, angle, size, phase } = fish;
	const sway = Math.sin(time * 0.008 + phase);
	const tailWag = Math.sin(time * 0.018 + phase) * 0.22;
	const finWag = Math.sin(time * 0.014 + phase + 0.8) * 0.12;

	// --- CONFIGURATION PARAMETERS FOR KHOA'S STYLE ---
	// 1. Overall dimensions of image
	const IMG_W = 836;
	const IMG_H = 340;

	// 2. Tail joint coordinates (Tail pivot) - Relative to fish center
	const TAIL_PIVOT_X = 282;
	const TAIL_PIVOT_Y = 0;
	// Tail crop coordinates from source image (sx, sy, sw, sh) and draw (dx, dy, dw, dh)
	const TAIL_CROP = {
		sx: 690,
		sy: 88,
		sw: 146,
		sh: 104,
		dx: -10,
		dy: -82,
		dw: 146,
		dh: 104,
	};

	// 3. Upper & Lower fin joint coordinates - Relative to fish center
	const FIN_UP_PIVOT_X = -253;
	const FIN_UP_PIVOT_Y = -92;

	const FIN_DOWN_PIVOT_X = -253;
	const FIN_DOWN_PIVOT_Y = 93;
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
	ctx.rect(-IMG_W / 2, -IMG_H / 2, IMG_W - 126, IMG_H);

	// ==========================================
	// ENABLE DEBUG FOR BODY HERE
	// ==========================================
	// Draw yellow border showing exact rectangle containing the body
	ctx.strokeStyle = "yellow";
	ctx.lineWidth = 2;
	ctx.strokeRect(-IMG_W / 2, -IMG_H / 2, IMG_W - 126, IMG_H);
	// ==========================================

	// Cut hole for upper fin
	ctx.save();
	ctx.translate(FIN_UP_PIVOT_X, FIN_UP_PIVOT_Y);
	traceUpperFin(ctx);
	ctx.restore();

	// Cut hole for lower fin
	ctx.save();
	ctx.translate(FIN_DOWN_PIVOT_X, FIN_DOWN_PIVOT_Y);
	traceLowerFin(ctx);
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
	traceUpperFin(ctx);

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
	ctx.translate(-253, 93);
	ctx.rotate(-finWag * 0.85); // remember to recover this
	// ctx.rotate(0); // remember to remove this
	ctx.beginPath();
	traceLowerFin(ctx);

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

// Khoa's style
function drawNewKoi(
	ctx: CanvasRenderingContext2D,
	fish: FishState,
	image: HTMLImageElement,
	time: number,
) {
	const { x, y, angle, size, phase } = fish;
	const sway = Math.sin(time * 0.008 + phase);
	const tailWag = Math.sin(time * 0.018 + phase) * 0.22;
	const finWag = Math.sin(time * 0.014 + phase + 0.8) * 0.12;

	// --- CONFIGURATION PARAMETERS FOR KHOA'S STYLE ---
	// 1. Overall dimensions of image
	const IMG_W = 441;
	const IMG_H = 252;

	// 2. Tail joint coordinates (Tail pivot) - Relative to fish center
	const TAIL_PIVOT_X = 146;
	const TAIL_PIVOT_Y = 0;
	// Tail crop coordinates from source image (sx, sy, sw, sh) and draw (dx, dy, dw, dh)
	const TAIL_CROP = {
		sx: 369,
		sy: 61,
		sw: 90,
		sh: 130,
		dx: 0,
		dy: -65,
		dw: 90,
		dh: 130,
	};

	// 3. Upper & Lower fin joint coordinates - Relative to fish center
	const FIN_UP_PIVOT_X = -130;
	const FIN_UP_PIVOT_Y = -55;

	const FIN_DOWN_PIVOT_X = -130;
	const FIN_DOWN_PIVOT_Y = 55;
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
	// ENABLE DEBUG FOR TAIL HERE
	// ==========================================
	// // 1. Draw magenta border showing exact rectangle containing the tail
	// ctx.strokeStyle = "magenta";
	// ctx.lineWidth = 2;
	// ctx.strokeRect(TAIL_CROP.dx, TAIL_CROP.dy, TAIL_CROP.dw, TAIL_CROP.dh);
	// // 2. Draw a red dot at the rotation center (Tail joint)
	// ctx.fillStyle = "red";
	// ctx.beginPath();
	// ctx.arc(0, 0, 5, 0, Math.PI * 2); /// Red dot radius 5px
	// ctx.fill();
	// ==========================================

	ctx.restore();

	// ==========================================
	// 2. DRAW BODY (CUT FINS)
	// ==========================================
	ctx.save();
	ctx.beginPath();
	// Rectangle frame surrounding the entire fish
	ctx.rect(-IMG_W / 2, -IMG_H / 2, IMG_W - 73, IMG_H);

	// ==========================================
	// ENABLE DEBUG FOR BODY HERE
	// ==========================================
	// Draw yellow border showing exact rectangle containing the body
	// ctx.strokeStyle = "yellow";
	// ctx.lineWidth = 2;
	// ctx.strokeRect(-IMG_W / 2, -IMG_H / 2, IMG_W - 73, IMG_H);
	// ==========================================

	// Cut hole for upper fin
	ctx.save();
	ctx.translate(FIN_UP_PIVOT_X, FIN_UP_PIVOT_Y);
	traceNewUpperFin(ctx);
	ctx.restore();

	// Cut hole for lower fin
	ctx.save();
	ctx.translate(FIN_DOWN_PIVOT_X, FIN_DOWN_PIVOT_Y);
	traceNewLowerFin(ctx);
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
	traceNewUpperFin(ctx);

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
	traceNewLowerFin(ctx);

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

interface PondCanvasProps {
	fishCount: number;
}

// Use this function to debug fish in canvas
function DebugCanvas() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		const koiImage = new Image();

		// LƯU Ý: Chỉnh lại tên file ảnh cho đúng với thực tế của bạn
		koiImage.src = "/kois/new-koi.svg";

		koiImage.onload = () => {
			// Thiết lập kích thước canvas
			const box = (
				canvas.parentElement as HTMLElement
			).getBoundingClientRect();
			const ratio = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = box.width * ratio;
			canvas.height = box.height * ratio;
			canvas.style.width = `${box.width}px`;
			canvas.style.height = `${box.height}px`;
			ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

			// Đổ màu nền tĩnh cho hồ cá dễ nhìn
			ctx.fillStyle = "#087d9d";
			ctx.fillRect(0, 0, box.width, box.height);

			// Tạo 1 con cá khổng lồ nằm im ở giữa màn hình
			const staticFish: FishState = {
				x: box.width / 2,
				y: box.height / 2,
				angle: 0, // Nằm ngang
				size: 750, // Kích thước cực lớn để dễ soi viền cắt
				phase: 0,
				speed: 0,
				targetAngle: 0,
				turnAt: 0,
			};

			// Gọi hàm vẽ cá. Truyền time = 0 để tắt toàn bộ animation
			drawNewKoi(ctx, staticFish, koiImage, 0);
		};
	}, []);

	return <canvas ref={canvasRef} aria-label="Khung debug cá tĩnh" />;
}

function PondCanvas({ fishCount }: PondCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fishRef = useRef<FishState[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		const koiImage = new Image();
		koiImage.src = "/kois/new-koi.svg";
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
			fishRef.current = Array.from({ length: fishCount }, (_, i) =>
				makeFish(box.width, box.height),
			);
		};
		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(canvas.parentElement as HTMLElement);

		const animate = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			const { width, height } = dimensions;
			const water = ctx.createLinearGradient(0, 0, width, height);
			water.addColorStop(0, "#1ea5bd");
			water.addColorStop(0.52, "#087d9d");
			water.addColorStop(1, "#045d85");
			ctx.fillStyle = water;
			ctx.fillRect(0, 0, width, height);

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

			fishRef.current.forEach((fish) => {
				fish.turnAt -= dt;
				if (fish.turnAt <= 0) {
					fish.targetAngle += (Math.random() - 0.5) * 1.8;
					fish.turnAt = 1.5 + Math.random() * 3.6;
				}
				// Keep the entire sprite in an inset ellipse so it never disappears beyond the pond edge.
				const centerX = width / 2;
				const centerY = height / 2;
				const radiusX = width * 0.41 - fish.size * 0.62;
				const radiusY = height * 0.33 - fish.size * 0.42;
				const xDistance = fish.x - centerX;
				const yDistance = fish.y - centerY;
				const edgeDistance =
					(xDistance * xDistance) / (radiusX * radiusX) +
					(yDistance * yDistance) / (radiusY * radiusY);
				if (edgeDistance > 0.88) {
					fish.targetAngle = Math.atan2(
						centerY - fish.y,
						centerX - fish.x,
					);
				}
				let delta = Math.atan2(
					Math.sin(fish.targetAngle - fish.angle),
					Math.cos(fish.targetAngle - fish.angle),
				);
				fish.angle += Math.max(-1.2 * dt, Math.min(1.2 * dt, delta));
				fish.x += Math.cos(fish.angle) * fish.speed * dt;
				fish.y += Math.sin(fish.angle) * fish.speed * dt;
				if (koiImage.complete) drawNewKoi(ctx, fish, koiImage, now);
			});
			frame = requestAnimationFrame(animate);
		};
		frame = requestAnimationFrame(animate);
		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
		};
	}, [fishCount]);

	return <canvas ref={canvasRef} aria-label="Hồ cá koi đang chuyển động" />;
}

function Pond() {
	const [fishCount, setFishCount] = useState(12);

	return (
		<>
			<main>
				<section className="intro">
					<p className="eyebrow">KOI BREEDING · PROTOTYPE</p>
					<h1>Hồ cá koi</h1>
					<p>
						Những chú koi tự chọn hướng, quay đầu ở mép hồ và vẫy
						đuôi theo nhịp bơi.
					</p>
				</section>
				<section className="pond-shell">
					<PondCanvas fishCount={fishCount} />
					{/* <DebugCanvas /> */}
					<div className="pond-label">
						<span>Đàn koi</span>
						<strong>{fishCount} con</strong>
					</div>
				</section>
				<div className="controls">
					<label htmlFor="fish">Số lượng cá</label>
					<input
						id="fish"
						type="range"
						min="4"
						max="28"
						value={fishCount}
						onChange={(e) => setFishCount(Number(e.target.value))}
					/>
					<output>{fishCount}</output>
				</div>
			</main>
		</>
	);
}

export default Pond;
