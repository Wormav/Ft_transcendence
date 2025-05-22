import PongStyle from "../PongStyle";
import type { ScoreOverlayProps } from "../../../types/Pong";
import { useTranslation } from "../../../context/TranslationContext";
import { getSizeTextStyle } from "../../../globalStyle";
import { useSettings } from "../../../context/SettingsContext";

export const ScoreOverlay: React.FC<ScoreOverlayProps> = ({
	gameStarted,
	showMenu,
	score,
	editViewMode,
	currentView,
	getViewName,
	playerNames,
}) => {
	const { t } = useTranslation();
	const { size_text } = useSettings();
	if (!gameStarted || showMenu) return null;

	const player1 = playerNames?.player1 || t("pong.player1");
	const player2 = playerNames?.player2 || t("pong.player2");

	return (
		<div className={`${PongStyle.score} ${getSizeTextStyle(size_text)}`}>
			<div className={PongStyle.scoreWithNames}>
				<span className={PongStyle.playerName}>{player1}</span>
				<span className={PongStyle.scoreNumbers}>
					{score.player1} - {score.player2}
				</span>
				<span className={PongStyle.playerName}>{player2}</span>
			</div>
			{editViewMode && (
				<div className={PongStyle.viewModeText}>{t("pong.editViewMode")}</div>
			)}
			<div className={PongStyle.viewIndicator}>
				{t("pong.view")} {currentView + 1}: {getViewName(currentView)}
			</div>
		</div>
	);
};

export default ScoreOverlay;
