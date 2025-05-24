import Card from "../../Card/Card";
import CustomBtn from "../../CustomBtn/CustomBtn";
import globalStyle from "../../../globalStyle";
import { useTranslation } from "../../../context/TranslationContext";
import { FaGamepad } from "react-icons/fa6";
import { MdSupervisorAccount } from "react-icons/md";
import type { NewGameCardProps } from "../../../types/NewGameCardProps";
import { useNavigate } from "react-router-dom";

const NewGameCard: React.FC<NewGameCardProps> = ({ ai = false }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleGameStart = () => {
		navigate("/pong");
	};

	return (
		<Card>
			{ai ? (
				<FaGamepad size={100} color="#00babc" />
			) : (
				<MdSupervisorAccount size={100} color="#00babc" />
			)}
			<p>{t("home.newGame")}</p>
			<span className={globalStyle.span}>
				{t(ai ? "home.aivs" : "home.player")}
			</span>
			{ai ? (
				<CustomBtn
					text={t("home.comingSoon")}
					onClick={() => {}}
					disabled={true}
				/>
			) : (
				<CustomBtn text={t("home.start")} onClick={handleGameStart} />
			)}
		</Card>
	);
};

export default NewGameCard;
