import globalStyle from '../../globalStyle';
import ProfilHomeCard from '../../components/Cards/ProfilHomeCard/ProfilHomeCard';
import AccountCard from '../../components/Cards/AccountCard/AccountCard';
import SettingsCard from '../../components/Cards/SettingsCard/SettingsCard';
import AccessibilityCard from '../../components/Cards/AccessibilityCard/AccessibilityCard';


const Profile: React.FC = () => {

	return (
		<>
			<div className={globalStyle.cardContainer}>
				<ProfilHomeCard />
				<AccountCard />
				<SettingsCard />
				<AccessibilityCard />
			</div>
		</>
	);
};

export default Profile;
