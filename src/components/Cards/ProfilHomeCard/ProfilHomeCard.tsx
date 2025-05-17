import Card, { Space } from '../../Card/Card';
import globalStyle from '../../../globalStyle';
import { useTranslation } from '../../../context/TranslationContext';
import HomeStyle from '../../../pages/Home/HomeStyle';
import type { ProfilHomeCardProps } from '../../../types/ProfilHomeCardProps';
import { useUser } from '../../../context/UserContext';

export default function ProfilHomeCard({ home = false }: ProfilHomeCardProps) {
	const { t } = useTranslation();
	const { user, loading, error } = useUser();

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{t('home.your')}</p>
				<Space />
				<span className={globalStyle.span}>{t('home.profile')}</span>
			</div>
			{loading ? (
				<p>Chargement du profil...</p>
			) : error ? (
				<p>Erreur: {error}</p>
			) : user ? (
				<>
					<img
						src={user.avatar && user.avatar !== "" ? user.avatar : "/default.JPG"}
						alt="Profile"
						className={HomeStyle.img}
					/>
					<span className={globalStyle.span}>{user.username}</span>
				</>
			) : (
				<>
					<img src="/default.JPG" alt="Profile" className={HomeStyle.img} />
					<span className={globalStyle.span}>Non connecté</span>
				</>
			)}
			{home && user && (
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
