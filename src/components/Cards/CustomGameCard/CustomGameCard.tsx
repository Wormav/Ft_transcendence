import Card from '../../Card/Card';
import { useTranslation } from '../../../context/TranslationContext';
import globalStyle from '../../../globalStyle';
import CustomBtn from '../../CustomBtn/CustomBtn';
import { IoIosSettings } from 'react-icons/io';

export default function CustomGameCard() {
	const { t } = useTranslation();

	return (
		<Card>
			<IoIosSettings size={100} color="#00babc" />
			<p>{t('home.gameSettings')}</p>
			<span className={globalStyle.span}>{t('game.gameCustom')}</span>
			<CustomBtn text={t('home.custom')} onClick={() => console.log('cc')} />
		</Card>
	);
}
