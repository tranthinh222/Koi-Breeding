import { useEffect, useState } from "react";
import { toastStore } from "./toast";
import Toast from "./Toast";
import styles from "./ToastProvider.module.css";

function Toaster() {
	const [toasts, setToasts] = useState(toastStore.getSnapshot());

	useEffect(() => {
		const unsubscribe = toastStore.subscribe((newToasts) => {
			setToasts(newToasts);
		});

		return () => unsubscribe();
	}, []);

	const visibleToasts = toasts.slice(-3);

	if (toasts.length === 0) return null;

	return (
		<div
			className={styles.toastContainer}
			role="region"
			aria-label="Notifications"
		>
			{visibleToasts.map((toast, index) => {
				const stackIndex = visibleToasts.length - 1 - index;
				return (
					<div
						key={toast.id}
						className={styles.toastItem}
						style={
							{
								"--index": stackIndex,
							} as React.CSSProperties
						}
					>
						<Toast
							message={toast.message}
							type={toast.type}
							onClose={() => toastStore.removeToast(toast.id)}
						/>
					</div>
				);
			})}
		</div>
	);
}

export default Toaster;
