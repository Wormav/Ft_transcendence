import Card, { Space } from '../../Card/Card';
import globalStyle from '../../../globalStyle';
import { useTranslation } from '../../../context/TranslationContext';
import HomeStyle from '../../../pages/Home/HomeStyle';
import { FaPen } from 'react-icons/fa6';
import { useUser } from '../../../context/UserContext';

export default function YourPictureCard() {
	const { t } = useTranslation();
	const { user } = useUser();

	const avatarSrc = user?.avatar && user.avatar !== "" ? user.avatar : "/default.JPG";

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{t('settings.yourPicture')}</p>
				<Space />
				<span className={globalStyle.span}>{t('home.profile')}</span>
			</div>
			<img src={avatarSrc} alt="Profile" className={HomeStyle.img} />
			<button className="flex items-center justify-center hover:opacity-80 transition-opacity cursor-pointer"
				aria-label={t('profile.edit_pseudo')}>
					<FaPen size={20} color="#00babc" />
			</button>
			<p>{t('settings.uploadNewProfilPicture')}</p>
		</Card>
	);
}
