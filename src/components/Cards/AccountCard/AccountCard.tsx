import Card from "../../Card/Card";
import BugerMenuStyles from "../../BugerMenu/BugerMenuStyles";
import globalStyle from "../../../globalStyle";
import { useTranslation } from "../../../context/TranslationContext";
import { useLogout } from "../../../hooks/useLogout";
import { useUserContext } from "../../../context/UserContext";

const AccountCard: React.FC = () => {
	const { t } = useTranslation();
	const handleLogout = useLogout();
	const { deleteAccount } = useUserContext();

	const handleDeleteAccount = async () => {
		if (window.confirm(t("profile.confirmDelete"))) {
			const success = await deleteAccount();
			if (!success) {
				alert(t("profile.deleteError"));
			}
		}
	};

	return (
		<Card>
			<p className={globalStyle.span}>{t("profile.account")}</p>
			<div className={globalStyle.separator}></div>
			<button
				onClick={handleLogout}
				className={`${BugerMenuStyles.logoutButton} pl-4`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className={BugerMenuStyles.navIcon}
					fill="none"
					viewBox="0 0 24 24"
					stroke="#FF0000"
				>
					<defs>
						<filter
							id="logoutShadow"
							x="-20%"
							y="-20%"
							width="140%"
							height="140%"
						>
							<feDropShadow
								dx="1"
								dy="1"
								stdDeviation="2"
								floodOpacity="0.3"
								floodColor="#000"
							/>
						</filter>
					</defs>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
						filter="url(#logoutShadow)"
					/>
				</svg>
				<span className={globalStyle.spanAlert}>{t("profile.logout")}</span>
			</button>
			<button
				onClick={handleDeleteAccount}
				className={`${BugerMenuStyles.logoutButton} pl-4 mt-2`}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className={BugerMenuStyles.navIcon}
					fill="none"
					viewBox="0 0 24 24"
					stroke="#FF0000"
				>
					<defs>
						<filter
							id="deleteShadow"
							x="-20%"
							y="-20%"
							width="140%"
							height="140%"
						>
							<feDropShadow
								dx="1"
								dy="1"
								stdDeviation="2"
								floodOpacity="0.3"
								floodColor="#000"
							/>
						</filter>
					</defs>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
						filter="url(#deleteShadow)"
					/>
				</svg>
				<span className={globalStyle.spanAlert}>{t("profile.delete")}</span>
			</button>
		</Card>
	);
};

export default AccountCard;
