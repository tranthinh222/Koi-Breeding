import { ArrowLeft, Waves } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { IPond } from "../../../types/backend";
import styles from "./BackToPondButton.module.css";

interface PondNavigationState {
	returnToPond?: IPond;
}

function BackToPondButton() {
	const location = useLocation();
	const navigate = useNavigate();
	const { returnToPond } = (location.state ?? {}) as PondNavigationState;

	if (!returnToPond) return null;

	return (
		<button
			type="button"
			className={styles.button}
			onClick={() =>
				navigate("/pond", {
					state: { openPond: returnToPond },
				})
			}
			title={`Back to ${returnToPond.name}`}
		>
			<ArrowLeft className={styles.arrow} />
			<Waves />
			<span>Back to Pond</span>
		</button>
	);
}

export default BackToPondButton;
