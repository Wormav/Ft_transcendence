import AccessibilityCardStyle from "./AccessibilityCardStyle";
import Card, { Space } from "../../Card/Card";
import { useTranslation } from "../../../context/TranslationContext";
import { useSettings } from "../../../context/SettingsContext";
import globalStyle from "../../../globalStyle";
import { useCallback, useEffect, useRef, useState } from "react";

const AccessibilityCard: React.FC = () => {
	const { t } = useTranslation();
	const { size_text, setSizeText } = useSettings();
	const [localSizeText, setLocalSizeText] = useState(size_text);
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		setLocalSizeText(size_text);
	}, [size_text]);

	useEffect(() => {
		const validSizes = [18, 22, 26];
		if (!validSizes.includes(size_text)) {
			setSizeText(22);
		}
	}, [size_text, setSizeText]);

	const debouncedSetSizeText = useCallback(
		(size: number) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				setSizeText(size);
				timeoutRef.current = null;
			}, 300);
		},
		[setSizeText],
	);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	const handleSizeChange = (size: number) => {
		setLocalSizeText(size);
		debouncedSetSizeText(size);
	};

	return (
		<Card>
			<div className={globalStyle.row}>
				<span className={globalStyle.span}>{t("accessibility.title")}</span>
			</div>
			<div className={globalStyle.separator}></div>

			<div className={globalStyle.row}>
				<p>{t("accessibility.text_size")}</p>
				<Space />
				<div className={AccessibilityCardStyle.selectContainer}>
					<select
						className={AccessibilityCardStyle.select}
						value={String(localSizeText)}
						onChange={(e) => {
							const newSize = parseInt(e.target.value);
							setLocalSizeText(newSize);
							handleSizeChange(newSize);
						}}
					>
						<option value="18">{t("accessibility.small")}</option>
						<option value="22">{t("accessibility.normal")}</option>
						<option value="26">{t("accessibility.large")}</option>
					</select>
					<div className={AccessibilityCardStyle.chevronContainer}>
						<svg
							className="h-5 w-5"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
							fill="currentColor"
							aria-hidden="true"
						>
							<path
								fillRule="evenodd"
								d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
								clipRule="evenodd"
							/>
						</svg>
					</div>
				</div>
			</div>

			<div className={AccessibilityCardStyle.previewContainer}>
				<p className={AccessibilityCardStyle.previewText}>
					{t("accessibility.previewText")}:
				</p>
				<div
					className={AccessibilityCardStyle.sampleTextContainer}
					style={{ fontSize: `${localSizeText}px` }}
				>
					{t("accessibility.sampleText")}
				</div>
			</div>
		</Card>
	);
};

export default AccessibilityCard;
