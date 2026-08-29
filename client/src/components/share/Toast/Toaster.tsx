import { useEffect, useState } from "react";
import { toastStore } from "./toast";
import Toast from "./Toast";
import styles from "./Toaster.module.css";

function Toaster() {
	const [toasts, setToasts] = useState(toastStore.getSnapshot());

	useEffect(() => {
		const unsubscribe = toastStore.subscribe((newToasts) => {
			setToasts(newToasts);
		});

		return () => unsubscribe();
	}, []);

	if (toasts.length === 0) return null;

	const currentToast = toasts[0];

	return (
		<div
			className={styles.toastContainer}
			role="region"
			aria-label="Notifications"
		>
			<div key={currentToast.id} className={styles.toastItem}>
				<Toast
					message={currentToast.message}
					type={currentToast.type}
					onClose={() => toastStore.removeToast(currentToast.id)}
				/>
			</div>
		</div>
	);
}

export default Toaster;
