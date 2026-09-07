import { Dna } from "lucide-react";
import { useEffect, useState } from "react";
import type { IBreedingRecipe, IKoiVarient } from "../../../types/backend";
import styles from "./BreedingCalculator.module.css";

interface BreedingCalculatorProps {
	koiVarients: IKoiVarient[];
	onCalculate: (
		p1: IKoiVarient,
		p2: IKoiVarient,
	) => Promise<IBreedingRecipe[]>;
}

function BreedingCalculator({
	koiVarients,
	onCalculate,
}: BreedingCalculatorProps) {
	// State cho Calculator
	const [calcP1, setCalcP1] = useState<IKoiVarient>(
		koiVarients.at(0) as IKoiVarient,
	);
	const [calcP2, setCalcP2] = useState<IKoiVarient>(
		koiVarients.at(0) as IKoiVarient,
	);
	const [breedingResult, setBreedingResult] = useState<IBreedingRecipe[]>([]);

	const getKoiInfo = (id: number) =>
		koiVarients.find((k) => k.id === id) || {
			id: 1,
			name: "Trash/Random",
			shape: "STANDARD",
			scaleType: "WAGOI",
			variety: {
				id: 1,
				name: "Kohaku",
				description: "",
			},
			origin: "Japan",
			baseMaxLength: 90.0,
			baseGrowthRate: 0.015,
			midAge: 400,
			alphaWeight: 0.000015,
			basePrice: 100,
			alphaPrice: 1.68,
			imageUrl: "/kois/koi-fish-null.svg",
		};

	useEffect(() => {
		const handleBreeding = async () => {
			const response = await onCalculate(calcP1, calcP2);
			setBreedingResult(
				response.sort(
					(a, b) =>
						(b.targetRate as number) - (a.targetRate as number),
				),
			);
		};

		handleBreeding();
	}, [calcP1, calcP2]);

	return (
		<div className={styles.content}>
			<div className={styles.calcContainer}>
				<div className={styles.calcInputs}>
					<div className={styles.calcBox}>
						<img
							src={calcP1.imageUrl}
							className={styles.calcImage}
							style={{ transform: "scaleX(-1)" }}
							alt="P1"
						/>
						<select
							value={calcP1.id}
							onChange={(e) =>
								setCalcP1(getKoiInfo(Number(e.target.value)))
							}
						>
							{koiVarients.map((k) => (
								<option key={`p1-${k.name}`} value={k.id}>
									{k.name} (Male)
								</option>
							))}
						</select>
					</div>

					<Dna size={60} className={styles.calcHeart} />

					<div className={styles.calcBox}>
						<img
							src={calcP2.imageUrl}
							className={styles.calcImage}
							alt="P2"
						/>
						<select
							value={calcP2.id}
							onChange={(e) =>
								setCalcP2(getKoiInfo(Number(e.target.value)))
							}
						>
							{koiVarients.map((k) => (
								<option key={`p2-${k.name}`} value={k.id}>
									{k.name} (Female)
								</option>
							))}
						</select>
					</div>
				</div>

				<div className={styles.calcResults}>
					<h3>Predicted Outcomes</h3>
					{breedingResult.map((res, idx) => (
						<div key={idx} className={styles.resultRow}>
							<div className={styles.resultKoi}>
								<img
									src={res.child.imageUrl}
									alt={res.child.name}
								/>
								<span>{res.child.name}</span>
							</div>
							<div className={styles.resultBarContainer}>
								<div
									className={styles.resultBar}
									style={{
										width: `${(res.targetRate ?? 0) * 100}%`,
									}}
								></div>
							</div>
							<div className={styles.resultProb}>
								{((res.targetRate ?? 0) * 100).toFixed(1)}%
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default BreedingCalculator;
