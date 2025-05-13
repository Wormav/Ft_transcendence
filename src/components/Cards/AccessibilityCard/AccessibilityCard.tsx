import { useTranslation } from '../../../context/TranslationContext';
import { useSettings } from '../../../context/SettingsContext';
import globalStyle from '../../../globalStyle';
import Card, { Space } from '../../Card/Card';
import AccessibilityCardStyle from './AccessibilityCardStyle';
import { useEffect, useState } from 'react';

export default function AccessibilityCard() {
	const { t } = useTranslation();
	const { size_text, setSizeText } = useSettings();

	const [localSizeText, setLocalSizeText] = useState(size_text);

	useEffect(() => {
		setLocalSizeText(size_text);
	}, [size_text]);

	useEffect(() => {
		const validSizes = [20, 26, 30];
		if (!validSizes.includes(size_text)) {
			setSizeText(26);
		}
	}, [size_text, setSizeText]);

	const handleSizeChange = (size: number) => {
		setSizeText(size);
	};

	return (
		<Card>
			<div className={globalStyle.row}>
				<span className={globalStyle.span}>{t('accessibility.title')}</span>
			</div>
			<div className={globalStyle.separator}></div>

			<div className={globalStyle.row}>
				<p>{t('accessibility.text_size')}</p>
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
						<option value="20">{t('accessibility.small')}</option>
						<option value="26">{t('accessibility.normal')}</option>
						<option value="30">{t('accessibility.large')}</option>
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
				<p className={AccessibilityCardStyle.previewText}>{t('accessibility.previewText')}:</p>
				<div
					className={AccessibilityCardStyle.sampleTextContainer}
					style={{ fontSize: `${localSizeText}px` }}
				>
					{t('accessibility.sampleText')}
				</div>
			</div>
		</Card>
	);
}
