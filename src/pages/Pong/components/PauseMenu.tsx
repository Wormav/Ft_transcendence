import PongStyle from "../PongStyle";
import { useTranslation } from "../../../context/TranslationContext";
import type { PauseMenuProps } from "../../../types/Pong";
import { useSettings } from "../../../context/SettingsContext";
import { getSizeTextStyle } from "../../../globalStyle";

export const PauseMenu: React.FC<PauseMenuProps> = ({
	gameStarted,
	gamePaused,
	showMenu,
	togglePause,
	changeView,
	backToMenu,
	quitGame,
	currentView,
	getViewName,
}) => {
	const { t } = useTranslation();
	const { size_text } = useSettings();

	if (!gameStarted || !gamePaused || showMenu) return null;

	return (
		<div className={PongStyle.overlay}>
			<h1 className={`${PongStyle.title} ${getSizeTextStyle(size_text)}`}>
				{t("pong.pause")}
			</h1>
			<button
				className={`${PongStyle.button} ${getSizeTextStyle(size_text)}`}
				onClick={togglePause}
			>
				{t("pong.resumeGame")}
			</button>
			<button
				className={`${PongStyle.button} ${getSizeTextStyle(size_text)}`}
				onClick={changeView}
			>
				{t("pong.changeView")}: {getViewName(currentView)}
			</button>
			<button
				className={`${PongStyle.button} ${getSizeTextStyle(size_text)}`}
				onClick={backToMenu}
			>
				{t("pong.backToMenu")}
			</button>
			<button
				className={`${PongStyle.buttonDanger} ${getSizeTextStyle(size_text)}`}
				onClick={quitGame}
			>
				{t("pong.quitGame")}
			</button>
		</div>
	);
};

export default PauseMenu;
