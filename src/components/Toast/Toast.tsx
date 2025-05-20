import React, { useEffect, useState } from "react";
import { ToastStyles } from "./ToastStyles.ts";
import { getSizeTextStyle } from "../../globalStyle.ts";
import { useSettings } from "../../context/SettingsContext.tsx";
import type { ToastProps } from "../../types/ToastProps.ts";

const Toast: React.FC<ToastProps> = ({
	message,
	type,
	duration = 3000,
	onClose,
}) => {
	const [isVisible, setIsVisible] = useState(true);
	const { size_text } = useSettings();

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsVisible(false);
			setTimeout(onClose, 300);
		}, duration);

		return () => clearTimeout(timer);
	}, [duration, onClose]);

	const styles = ToastStyles;

	const typeStyles = {
		success: styles.success,
		error: styles.error,
		info: styles.info,
	};

	const iconByType = {
		success: (
			<svg
				className="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
					clipRule="evenodd"
				></path>
			</svg>
		),
		error: (
			<svg
				className="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
					clipRule="evenodd"
				></path>
			</svg>
		),
		info: (
			<svg
				className="w-5 h-5"
				fill="currentColor"
				viewBox="0 0 20 20"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path
					fillRule="evenodd"
					d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1-5a1 1 0 100 2 1 1 0 000-2z"
					clipRule="evenodd"
				></path>
			</svg>
		),
	};

	return (
		<div
			className={`${styles.toast} ${typeStyles[type]} ${isVisible ? styles.visible : styles.hidden}`}
			role="alert"
		>
			<div className={styles.iconContainer}>{iconByType[type]}</div>
			<div
				className={`${styles.messageContainer} ${getSizeTextStyle(size_text)}`}
			>
				{message}
			</div>
			<button
				type="button"
				className={styles.closeButton}
				onClick={() => {
					setIsVisible(false);
					setTimeout(onClose, 300);
				}}
				aria-label="Fermer"
			>
				<svg
					className="w-3 h-3"
					fill="currentColor"
					viewBox="0 0 20 20"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						fillRule="evenodd"
						d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
						clipRule="evenodd"
					></path>
				</svg>
			</button>
		</div>
	);
};

export default Toast;
