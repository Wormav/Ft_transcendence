import CustomBtn from "../../CustomBtn/CustomBtn";
import globalStyle from "../../../globalStyle";
import Card from "../../Card/Card";
import { useTranslation } from "../../../context/TranslationContext";
import { IoIosSettings } from "react-icons/io";

const CustomGameCard: React.FC = () => {
	const { t } = useTranslation();

	return (
		<Card>
			<IoIosSettings size={100} color="#00babc" />
			<p>{t("home.gameSettings")}</p>
			<span className={globalStyle.span}>{t("game.gameCustom")}</span>
			<CustomBtn text={t("home.custom")} onClick={() => {}} />
		</Card>
	);
};

export default CustomGameCard;
