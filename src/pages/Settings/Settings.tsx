import globalStyle from "../../globalStyle";
import AccountCard from "../../components/Cards/AccountCard/AccountCard";
import SettingsCard from "../../components/Cards/SettingsCard/SettingsCard";
import AccessibilityCard from "../../components/Cards/AccessibilityCard/AccessibilityCard";
import YourPictureCard from "../../components/Cards/YourPictureCard/YourPictureCard";

const Settings: React.FC = () => {
	return (
		<>
			<div className={globalStyle.cardContainer}>
				<YourPictureCard />
				<AccountCard />
				<SettingsCard />
				<AccessibilityCard />
			</div>
		</>
	);
};

export default Settings;
