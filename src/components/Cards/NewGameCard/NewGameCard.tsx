import Card from '../../Card/Card';
import { useTranslation } from '../../../context/TranslationContext';
import { FaGamepad } from 'react-icons/fa6';
import globalStyle from '../../../globalStyle';
import CustomBtn from '../../CustomBtn/CustomBtn';
import { MdSupervisorAccount } from 'react-icons/md';
import type { NewGameCardProps } from '../../../types/NewGameCardProps';

export default function NewGameCard({ ai = false }: NewGameCardProps) {
	const { t } = useTranslation();

	return (
		<Card>
			{ai ? (
				<FaGamepad size={100} color="#00babc" />
			) : (
				<MdSupervisorAccount size={100} color="#00babc" />
			)}
			<p>{t('home.newGame')}</p>
			<span className={globalStyle.span}>{t(ai ? 'home.ai' : 'home.player')}</span>
			<CustomBtn text={t('home.start')} onClick={() => console.log('cc')} />
		</Card>
	);
}
