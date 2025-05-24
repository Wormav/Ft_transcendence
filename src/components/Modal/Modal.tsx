import { useEffect } from "react";
import { createPortal } from "react-dom";
import { ModalStyles } from "./ModalStyles";
import { getSizeTextStyle } from "../../globalStyle";
import { useSettings } from "../../context/SettingsContext";
import type { ModalProps } from "../../types/ModalProps";

export const Modal: React.FC<ModalProps> = ({
	isOpen,
	onClose,
	title,
	children,
}) => {
	const { size_text } = useSettings();
	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		if (isOpen) {
			window.addEventListener("keydown", handleEscape);
			document.body.style.overflow = "hidden";
		}

		return () => {
			window.removeEventListener("keydown", handleEscape);
			document.body.style.overflow = "unset";
		};
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const handleOverlayClick = (event: React.MouseEvent) => {
		if (event.target === event.currentTarget) {
			onClose();
		}
	};

	return createPortal(
		<div className="fixed inset-0 isolate" style={{ zIndex: 99999 }}>
			<div
				className="fixed inset-0 bg-black/25 backdrop-blur flex items-center justify-center min-h-screen min-w-screen overflow-hidden"
				onClick={handleOverlayClick}
			>
				<div className={ModalStyles.modal}>
					<button className={ModalStyles.closeButton} onClick={onClose}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<defs>
								<filter
									id="closeShadow"
									x="-20%"
									y="-20%"
									width="140%"
									height="140%"
								>
									<feDropShadow
										dx="1"
										dy="1"
										stdDeviation="2"
										floodOpacity="0.3"
										floodColor="#000"
									/>
								</filter>
							</defs>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={3}
								d="M6 18L18 6M6 6l12 12"
								filter="url(#closeShadow)"
							/>
						</svg>
					</button>

					{title && (
						<h2
							className={`${ModalStyles.title}  ${getSizeTextStyle(size_text)}`}
						>
							{title}
						</h2>
					)}

					<div
						className={`${ModalStyles.content}  ${getSizeTextStyle(size_text)}`}
					>
						{children}
					</div>
				</div>
			</div>
		</div>,
		document.body,
	);
};
