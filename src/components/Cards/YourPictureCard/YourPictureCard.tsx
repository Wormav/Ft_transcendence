import Card, { Space } from '../../Card/Card';
import globalStyle from '../../../globalStyle';
import { useTranslation } from '../../../context/TranslationContext';
import HomeStyle from '../../../pages/Home/HomeStyle';
import { FaPen } from 'react-icons/fa6';

export default function YourPictureCard() {
	const { t } = useTranslation();

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{t('settings.yourPicture')}</p>
				<Space />
				<span className={globalStyle.span}>{t('home.profile')}</span>
			</div>
			<img src="/jlorette.jpg" alt="Profile" className={HomeStyle.img} />
			<button className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
				aria-label={t('profile.edit_pseudo')}>
					<FaPen size={20} color="#00babc" />
			</button>
			<p>{t('settings.uploadNewProfilPicture')}</p>
		</Card>
	);
}
