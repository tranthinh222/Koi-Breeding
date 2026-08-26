import { CircleCheckBig, CircleX, Info, TriangleAlert } from "lucide-react";
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
			{typeof message === "string" ? (
				<div className="toast-content">
					{TOAST_ICONS.get(type)}
					<span>{message}</span>
				</div>
			) : (
				message
			)}
			<button className="toast-close-btn" onClick={onClose}>
				&times;
			</button>
		</div>
	);
}

export default Toast;

const TOAST_ICONS = new Map<string, React.ReactNode>([
	["info", <Info />],
	["success", <CircleCheckBig />],
	["warning", <TriangleAlert />],
	["error", <CircleX />],
]);
