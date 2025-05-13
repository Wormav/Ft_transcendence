import { useSettings } from '../../context/SettingsContext';
import { useTranslation } from '../../context/TranslationContext';
import globalStyle, { getSizeTextStyle } from '../../globalStyle';
import type { LineHistoryProps } from '../../types/LineHistoryProps';
import { Space } from '../Card/Card';

export default function LineHistory({ versus, win }: LineHistoryProps) {
	const { t } = useTranslation();

	const { size_text } = useSettings();

	return (
		<div className={globalStyle.row}>
			<span className={`${globalStyle.span} ${getSizeTextStyle(size_text)}`}>Pseudo</span>
			<Space />
			<span className={`${globalStyle.spanAlert} ${getSizeTextStyle(size_text)}`}>VS</span>
			<Space />
			<p className={getSizeTextStyle(size_text)}>{versus} :</p>
			<Space />
			<span
				className={`${win ? globalStyle.span : globalStyle.spanAlert} ${getSizeTextStyle(size_text)}`}
			>
				{win ? t('home.win') : t('home.lose')}
			</span>
		</div>
	);
}
