import { useTranslation } from '../../../context/TranslationContext';
import globalStyle from '../../../globalStyle';
import Card, { Space } from '../../Card/Card';
import LineHistory from '../../LineHistory/LineHistory';

export default function ResultsCard() {
	const { t } = useTranslation();

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{t('home.your')}</p>
				<Space />
				<span className={globalStyle.span}>{t('home.history')}</span>
			</div>
			<div className={globalStyle.separator}></div>
			<LineHistory versus={t('home.ai')} win={false} />
			<LineHistory versus={t('home.ai')} win={true} />
			<LineHistory versus={'Martin'} win={true} />
			<LineHistory versus={'Macron'} win={false} />
			<LineHistory versus={t('home.ai')} win={false} />
			<LineHistory versus={t('home.ai')} win={true} />
		</Card>
	);
}
