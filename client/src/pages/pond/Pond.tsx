import { useEffect, useRef, useState } from "react";
import "./Pond.css";

interface PondCanvasProps {
	fishCount: number;
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

function makeFish(width: number, height: number): FishState {
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

function PondCanvas({ fishCount }: PondCanvasProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fishRef = useRef<FishState[]>([]);
	const lotusRef = useRef<LotusState[]>([]);

	useEffect(() => {
		const canvas = canvasRef.current as HTMLCanvasElement;
		const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
		const koiImage = new Image();
		koiImage.src = "/kois/koi-fish-ginrin-asagi.png";

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

			fishRef.current = Array.from({ length: fishCount }, (_, _i) =>
				makeFish(box.width, box.height),
			);

			lotusRef.current = Array.from({ length: 8 }, (_, _i) =>
				makeLotus(box.width, box.height),
			);
		};
		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(canvas.parentElement as HTMLElement);

		const animate = (now: number) => {
			const dt = Math.min((now - last) / 1000, 0.05);
			last = now;
			const { width, height } = dimensions;

			backgroundImage.width = width;
			backgroundImage.height = height;
			const water = ctx.drawImage(backgroundImage, 0, 0, width, height);

			// const water = ctx.createLinearGradient(0, 0, width, height);
			// water.addColorStop(0, "#1ea5bd");
			// water.addColorStop(0.52, "#087d9d");
			// water.addColorStop(1, "#045d85");
			// ctx.fillStyle = water;
			// ctx.fillRect(0, 0, width, height);

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
				// const centerX = width / 2;
				// const centerY = height / 2;
				// const radiusX = width * 0.41 - fish.size * 0.62;
				// const radiusY = height * 0.33 - fish.size * 0.42;
				// const xDistance = fish.x - centerX;
				// const yDistance = fish.y - centerY;
				// const edgeDistance =
				// 	(xDistance * xDistance) / (radiusX * radiusX) +
				// 	(yDistance * yDistance) / (radiusY * radiusY);

				// if (edgeDistance > 0.88) {
				// 	fish.targetAngle = Math.atan2(
				// 		centerY - fish.y,
				// 		centerX - fish.x,
				// 	);
				// }

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
				fish.angle += Math.max(-1.2 * dt, Math.min(1.2 * dt, delta));
				fish.x += Math.cos(fish.angle) * fish.speed * dt;
				fish.y += Math.sin(fish.angle) * fish.speed * dt;
				if (koiImage.complete)
					drawKoi(
						ctx,
						fish,
						koiImage,
						now,
						KOI_PROPS_MAP.get("type28") as FishImageProperties,
					);
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
