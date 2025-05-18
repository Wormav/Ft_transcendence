import Card, { Space } from "../../Card/Card";
import globalStyle from "../../../globalStyle";
import { useTranslation } from "../../../context/TranslationContext";
import HomeStyle from "../../../pages/Home/HomeStyle";
import type { ProfilHomeCardProps } from "../../../types/ProfilHomeCardProps";
import { useUserContext } from "../../../context/UserContext";

export default function ProfilHomeCard({
	home = false,
	friendProfile,
}: ProfilHomeCardProps) {
	const { t } = useTranslation();
	const { user, loading, error } = useUserContext();

	const profileToDisplay = friendProfile || user;
	const isLoadingProfile = !friendProfile && loading;
	const profileError = !friendProfile && error;
	const isFriendProfile = !!friendProfile;

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{isFriendProfile ? t("profile.friendProfile") : t("home.your")}</p>
				<Space />
				<span className={globalStyle.span}>{t("home.profile")}</span>
			</div>
			{isLoadingProfile ? (
				<p>Chargement du profil...</p>
			) : profileError ? (
				<p>Erreur: {profileError}</p>
			) : profileToDisplay ? (
				<>
					<img
						src={
							profileToDisplay.avatar && profileToDisplay.avatar !== ""
								? profileToDisplay.avatar
								: "/default.JPG"
						}
						alt="Profile"
						className={HomeStyle.img}
					/>
					<span className={globalStyle.span}>{profileToDisplay.username}</span>
				</>
			) : (
				<>
					<img src="/default.JPG" alt="Profile" className={HomeStyle.img} />
					<span className={globalStyle.span}>Non connecté</span>
				</>
			)}
			{home && user && !isFriendProfile && (
				<>
					<div className={globalStyle.separator}></div>
					<div className={globalStyle.row}>
						<p>{t("home.lastGame")}</p>
						<Space />
						<span className={globalStyle.spanAlert}>{t("home.lose")}</span>
					</div>
				</>
			)}
		</Card>
	);
}
