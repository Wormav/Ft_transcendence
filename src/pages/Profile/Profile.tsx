import globalStyle from '../../globalStyle';
import ProfilHomeCard from '../../components/Cards/ProfilHomeCard/ProfilHomeCard';
import AccountCard from '../../components/Cards/AccountCard/AccountCard';
import SettingsCard from '../../components/Cards/SettingsCard/SettingsCard';

const Profile: React.FC = () => {

	return (
		<>
			<div className={globalStyle.cardContainer}>
				<ProfilHomeCard />
				<AccountCard />
				<SettingsCard />
			</div>
		</>
	);
};

export default Profile;
