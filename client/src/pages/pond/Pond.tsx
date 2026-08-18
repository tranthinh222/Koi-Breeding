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

// function drawKoi(
// 	ctx: CanvasRenderingContext2D,
// 	fish: FishState,
// 	image: HTMLImageElement,
// 	time: number,
// ) {
// 	const { x, y, angle, size, phase } = fish;
// 	const sway = Math.sin(time * 0.008 + phase);
// 	const tailWag = Math.sin(time * 0.018 + phase) * 0.22;
// 	const finWag = Math.sin(time * 0.014 + phase + 0.8) * 0.12;
// 	const scale = size / 836;
// 	ctx.save();
// 	ctx.translate(
// 		x + Math.cos(angle + Math.PI / 2) * sway * 2,
// 		y + Math.sin(angle + Math.PI / 2) * sway * 2,
// 	);
// 	// The Figma fish points left; rotate 180° to make it face its travel direction.
// 	ctx.rotate(angle + Math.PI + sway * 0.06);
// 	ctx.scale(scale, scale);

// 	// The tail occupies the far-right end of the source SVG. Draw it first from
// 	// its joint, so it can wag independently under the body.
// 	ctx.save();
// 	ctx.translate(282, 0); // source joint (x: 700, y: 170)
// 	ctx.rotate(tailWag);
// 	ctx.drawImage(image, 690, 88, 146, 104, -10, -82, 146, 104);
// 	ctx.restore();

// 	// Draw the rest of the fish without its tail area; this avoids a double tail.
// 	ctx.save();
// 	ctx.beginPath();
// 	ctx.rect(-418, -170, 710, 340);
// 	// Cut out only the fin silhouettes from the static body; rectangle crops
// 	// would pull a block of the body along with a moving fin.
// 	ctx.moveTo(-267, -95);
// 	ctx.bezierCurveTo(-242, -137, -222, -158, -211, -150);
// 	ctx.bezierCurveTo(-188, -160, -165, -170, -159, -140);
// 	ctx.lineTo(-185, -86);
// 	ctx.closePath();
// 	ctx.moveTo(-265, 95);
// 	ctx.lineTo(-185, 86);
// 	ctx.bezierCurveTo(-175, 126, -150, 156, -172, 167);
// 	ctx.bezierCurveTo(-193, 168, -237, 134, -265, 95);
// 	ctx.closePath();
// 	ctx.clip("evenodd");
// 	ctx.drawImage(image, -418, -170, 836, 340);
// 	ctx.restore();

// 	// Upper and lower fins have their own slower, softer rhythm than the tail.
// 	ctx.save();
// 	ctx.translate(-253, -92);
// 	ctx.rotate(finWag);
// 	ctx.beginPath();
// 	ctx.moveTo(-14, -3);
// 	ctx.bezierCurveTo(11, -45, 31, -66, 42, -58);
// 	ctx.bezierCurveTo(65, -68, 88, -78, 94, -48);
// 	ctx.lineTo(68, 6);
// 	ctx.closePath();
// 	ctx.clip();
// 	ctx.drawImage(image, -165, -78, 836, 340);
// 	ctx.restore();

// 	ctx.save();
// 	ctx.translate(-253, 93);
// 	ctx.rotate(-finWag * 0.85);
// 	ctx.beginPath();
// 	ctx.moveTo(-12, 2);
// 	ctx.lineTo(68, -7);
// 	ctx.bezierCurveTo(78, 33, 103, 63, 81, 74);
// 	ctx.bezierCurveTo(60, 75, 16, 41, -12, 2);
// 	ctx.closePath();
// 	ctx.clip();
// 	ctx.drawImage(image, -165, -263, 836, 340);
// 	ctx.restore();
// 	ctx.restore();
// }

// Draw upper fin function
function traceUpperFin(ctx: CanvasRenderingContext2D) {
	ctx.moveTo(-14, -3);
	ctx.bezierCurveTo(5, -50, 31, -66, 40, -60);
	ctx.bezierCurveTo(70, -92, 108, -75, 95, -55);
	ctx.lineTo(69, 6);
	ctx.closePath();
}

// Draw lower fin function
function traceLowerFin(ctx: CanvasRenderingContext2D) {
	ctx.moveTo(-14, 3);
	ctx.bezierCurveTo(5, 50, 31, 66, 40, 60);
	ctx.bezierCurveTo(70, 92, 108, 75, 95, 55);
	ctx.lineTo(69, -6);
	ctx.closePath();
}

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
	const scale = size / 836;

	ctx.save();
	ctx.translate(
		x + Math.cos(angle + Math.PI / 2) * sway * 2,
		y + Math.sin(angle + Math.PI / 2) * sway * 2,
	);
	ctx.rotate(angle + Math.PI + sway * 0.06);
	ctx.scale(scale, scale);

	// 1. Draw tail
	ctx.save();
	ctx.translate(282, 0);
	ctx.rotate(tailWag);
	ctx.drawImage(image, 690, 88, 146, 104, -10, -82, 146, 104);
	ctx.restore();

	// 2. Draw body
	ctx.save();
	ctx.beginPath();
	ctx.rect(-418, -170, 710, 340); // Rectangle frame surrounds body

	ctx.save();
	ctx.translate(-253, -92); // Shift center to upper fin joint
	traceUpperFin(ctx); // Cut a hole in the upper fin
	ctx.restore();

	ctx.save();
	ctx.translate(-253, 93); // DShift center to lower fin joint
	traceLowerFin(ctx); // Cut a hole in the lower fin
	ctx.restore();

	ctx.clip("evenodd");
	ctx.drawImage(image, -418, -170, 836, 340);
	ctx.restore();

	// 3. Draw upper fin
	ctx.save();
	ctx.translate(-253, -92);
	ctx.rotate(finWag); // remember to recover this
	// ctx.rotate(0); // remember to remove this
	ctx.beginPath();
	traceUpperFin(ctx);

	// USE THIS LINE TO DEBUG (Show red stroke around the upper fin):
	// ctx.strokeStyle = "red";
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.clip();
	ctx.drawImage(image, -165, -78, 836, 340);
	ctx.restore();

	// 4. Draw lower fin
	ctx.save();
	ctx.translate(-253, 93);
	ctx.rotate(-finWag * 0.85); // remember to recover this
	// ctx.rotate(0); // remember to remove this
	ctx.beginPath();
	traceLowerFin(ctx);

	// USE THIS LINE TO DEBUG (Show red stroke around the lower fin):
	// ctx.strokeStyle = "blue";
	ctx.lineWidth = 2;
	ctx.stroke();

	ctx.clip();
	ctx.drawImage(image, -165, -263, 836, 340);
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
		koiImage.src = "/kois/koi-fish-2.svg";

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
				size: 850, // Kích thước cực lớn để dễ soi viền cắt
				phase: 0,
				speed: 0,
				targetAngle: 0,
				turnAt: 0,
			};

			// Gọi hàm vẽ cá. Truyền time = 0 để tắt toàn bộ animation
			drawKoi(ctx, staticFish, koiImage, 0);
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
		koiImage.src = "/kois/koi-fish-2.svg";
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
				if (koiImage.complete) drawKoi(ctx, fish, koiImage, now);
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
