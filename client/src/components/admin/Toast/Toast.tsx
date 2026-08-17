import { useEffect, type ReactNode } from "react";
import "./Toast.css";

interface ToastProps {
	message: ReactNode;
	type: string;
	onClose: () => void;
	duration?: number;
}

function Toast({ message, type, onClose, duration = 5000 }: ToastProps) {
	useEffect(() => {
		const timer = setTimeout(() => {
			onClose();
		}, duration);

		return () => clearTimeout(timer);
	}, [onClose, duration]);

	return (
		<div className={`toast-message toast-${type}`} role="alert">
			{message}
			<button className="toast-close-btn" onClick={onClose}>
				&times;
			</button>
		</div>
	);
}

export default Toast;
