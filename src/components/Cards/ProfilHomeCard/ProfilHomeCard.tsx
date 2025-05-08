import Card, { Space } from '../../Card/Card';
import globalStyle from '../../../globalStyle';
import { useTranslation } from '../../../context/TranslationContext';
import HomeStyle from '../../../pages/Home/HomeStyle';
import type { ProfilHomeCardProps } from '../../../types/ProfilHomeCardProps';

export default function ProfilHomeCard({ home = false }: ProfilHomeCardProps) {
	const { t } = useTranslation();

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{t('home.your')}</p>
				<Space />
				<span className={globalStyle.span}>{t('home.profile')}</span>
			</div>
			<img src="/jlorette.jpg" alt="Profile" className={HomeStyle.img} />
			<span className={globalStyle.span}>Pseudo</span>
			{home && (
				<>
					<div className={globalStyle.separator}></div>
					<div className={globalStyle.row}>
						<p>{t('home.lastGame')}</p>
						<Space />
						<span className={globalStyle.spanAlert}>{t('home.lose')}</span>
					</div>
				</>
			)}
		</Card>
	);
}
