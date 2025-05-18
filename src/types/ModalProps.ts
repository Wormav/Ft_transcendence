import type { ReactNode } from "react";

export type ModalProps = {
	isOpen: boolean;
	onClose: () => void;
	title?: string;
	children: ReactNode;
};
