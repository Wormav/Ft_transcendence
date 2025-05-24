import CardStyle from "./CardStyle";
import { useSettings } from "../../context/SettingsContext";
import { getSizeTextStyle } from "../../globalStyle";
import type { CardProps } from "../../types/CardProps";

export const Space = () => <span className="whitespace-pre">&nbsp;</span>;

const Card: React.FC<CardProps> = ({ children }) => {
	const { size_text } = useSettings();
	return (
		<div className={`${CardStyle.container} ${getSizeTextStyle(size_text)}`}>
			{children}
		</div>
	);
};

export default Card;
