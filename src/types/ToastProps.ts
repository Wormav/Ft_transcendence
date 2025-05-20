export type ToastProps = {
	message: string;
	type: "success" | "error" | "info";
	duration?: number;
	onClose: () => void;
};
