import PongStyle from "../PongStyle";
import type { CountdownProps } from "../../../types/Pong";
import { getSizeTextStyle } from "../../../globalStyle";
import { useSettings } from "../../../context/SettingsContext";

export const Countdown: React.FC<CountdownProps> = ({ countdown }) => {
	if (countdown <= 0) return null;
	const { size_text } = useSettings();

	return (
		<div className={PongStyle.overlay}>
			<h1 className={getSizeTextStyle(size_text)}>{countdown}</h1>
		</div>
	);
};

export default Countdown;
