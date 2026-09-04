import type { IBreedingRecipe } from "../../../../types/backend";
import styles from "./BreedingRecipeCard.module.css";

interface BreedingRecipeCardProps {
	recipe: IBreedingRecipe;
}

function BreedingRecipeCard({ recipe }: BreedingRecipeCardProps) {
	const toCapitalString = (text: string) => {
		const firstCharacter = text.at(0)?.toUpperCase();
		return firstCharacter + text.toLowerCase().slice(1);
	};

	const tagClass =
		recipe.type === "CROSS"
			? styles.tagCross
			: recipe.type === "PURE"
				? styles.tagPure
				: styles.tagOverlay;

	return (
		<div className={styles.recipeCard}>
			<div className={`${styles.typeTag} ${tagClass}`}>
				{recipe.type} BREEDING
			</div>

			<div className={styles.recipeParents}>
				<div className={styles.parentInfo}>
					<img
						src={recipe.father.imageUrl}
						alt={recipe.father.name}
						style={{
							transform: "scaleX(-1)",
						}}
					/>
					<span>{recipe.father.name}</span>
				</div>
				<span className={styles.plusSign}>+</span>
				<div className={styles.parentInfo}>
					<img
						src={recipe.mother.imageUrl}
						alt={recipe.mother.name}
					/>
					<span>{recipe.mother.name}</span>
				</div>
			</div>
			<div className={styles.recipeTarget}>
				<img src={recipe.child.imageUrl} alt={recipe.child.name} />
				<div className={styles.targetDetails}>
					<span className={styles.targetName}>
						{recipe.child.name}
					</span>
					<div className={styles.targetTags}>
						<span className={styles.tag}>
							{toCapitalString(recipe.child.shape)}
						</span>
						<span className={styles.tag}>
							{toCapitalString(recipe.child.scaleType)}
						</span>
					</div>
				</div>
				<div className={styles.probBadge}>
					{((recipe.childRate || 0) * 100).toFixed(0)}%
				</div>
			</div>
		</div>
	);
}

export default BreedingRecipeCard;
