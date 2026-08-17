import type { ReactNode } from "react";

interface ToastData {
	id: number;
	message: ReactNode;
	type: ToastType;
}

type ToastType = "info" | "success" | "error";

type Listener = (toasts: ToastData[]) => void;

let toasts: ToastData[] = [];
let listeners: Listener[] = [];

export const toastStore = {
	addToast: (message: ReactNode, type: ToastType) => {
		const id = Date.now();
		toasts = [...toasts, { id, message, type }];
		emitChange();
	},

	removeToast: (id: number) => {
		toasts = toasts.filter((toast) => toast.id !== id);
		emitChange();
	},

	subscribe: (listener: Listener) => {
		listeners.push(listener);
		return () => {
			listeners = listeners.filter((l) => l !== listener);
		};
	},

	getSnapshot: () => toasts,
};

function emitChange() {
	for (const listener of listeners) {
		listener(toasts);
	}
}

export const toast = (message: ReactNode, type: ToastType = "info") => {
	toastStore.addToast(message, type);
};

toast.success = (message: ReactNode) => toastStore.addToast(message, "success");
toast.error = (message: ReactNode) => toastStore.addToast(message, "error");
