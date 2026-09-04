import { Dna } from "lucide-react";
import type { IKoiVarient } from "../../../../types/backend";
import styles from "./BreedingCalculator.module.css";

interface BreedingCalculatorProps {
	calcP1: string;
	setCalcP1: React.Dispatch<React.SetStateAction<string>>;
	calcP2: string;
	setCalcP2: React.Dispatch<React.SetStateAction<string>>;
	koiVarients: IKoiVarient[];
	onCalculate: (
		p1: string,
		p2: string,
	) => {
		name: string;
		prob: number;
	}[];
}

function BreedingCalculator({
	calcP1,
	setCalcP1,
	calcP2,
	setCalcP2,
	koiVarients,
	onCalculate,
}: BreedingCalculatorProps) {
	const getKoiInfo = (name: string) =>
		koiVarients.find((k) => k.name === name) || {
			id: 1,
			name: name,
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

	return (
		<div className={styles.content}>
			<div className={styles.calcContainer}>
				<div className={styles.calcInputs}>
					<div className={styles.calcBox}>
						<img
							src={getKoiInfo(calcP1).imageUrl}
							className={styles.calcImage}
							alt="P1"
						/>
						<select
							value={getKoiInfo(calcP1).name}
							onChange={(e) => setCalcP1(e.target.value)}
						>
							{koiVarients.map((k) => (
								<option key={`p1-${k.name}`} value={k.name}>
									{k.name} (Male)
								</option>
							))}
						</select>
					</div>

					<Dna size={60} className={styles.calcHeart} />

					<div className={styles.calcBox}>
						<img
							src={getKoiInfo(calcP2).imageUrl}
							className={styles.calcImage}
							style={{ transform: "scaleX(-1)" }}
							alt="P2"
						/>
						<select
							value={calcP2}
							onChange={(e) => setCalcP2(e.target.value)}
						>
							{koiVarients.map((k) => (
								<option key={`p2-${k.name}`} value={k.name}>
									{k.name} (Female)
								</option>
							))}
						</select>
					</div>
				</div>

				<div className={styles.calcResults}>
					<h3>Predicted Outcomes</h3>
					{onCalculate(calcP1, calcP2).map((res, idx) => (
						<div key={idx} className={styles.resultRow}>
							<div className={styles.resultKoi}>
								<img
									src={getKoiInfo(res.name).imageUrl}
									alt={res.name}
								/>
								<span>{res.name}</span>
							</div>
							<div className={styles.resultBarContainer}>
								<div
									className={styles.resultBar}
									style={{
										width: `${res.prob * 100}%`,
									}}
								></div>
							</div>
							<div className={styles.resultProb}>
								{(res.prob * 100).toFixed(1)}%
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default BreedingCalculator;
