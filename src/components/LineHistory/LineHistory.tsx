import { useTranslation } from '../../context/TranslationContext';
import globalStyle from '../../globalStyle';
import type { LineHistoryProps } from '../../types/LineHistoryProps';
import { Space } from '../Card/Card';

export default function LineHistory({ versus, win }: LineHistoryProps) {
	const { t } = useTranslation();

	return (
		<div className={globalStyle.row}>
			<span className={`${globalStyle.span} ${globalStyle.littleText}`}>Pseudo</span>
			<Space />
			<span className={`${globalStyle.spanAlert} ${globalStyle.littleText}`}>VS</span>
			<Space />
			<p className={globalStyle.littleText}>{versus} :</p>
			<Space />
			<span
				className={`${win ? globalStyle.span : globalStyle.spanAlert} ${globalStyle.littleText}`}
			>
				{win ? t('home.win') : t('home.lose')}
			</span>
		</div>
	);
}
