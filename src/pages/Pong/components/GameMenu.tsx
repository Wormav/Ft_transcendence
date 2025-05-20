import { useState, useEffect } from "react";
import PongStyle from "../PongStyle";
import type { GameMenuProps } from "../../../types/Pong";
import { useTranslation } from "../../../context/TranslationContext";
import { TournamentMatchDialog } from "./TournamentMatchDialog";
import { useSettings } from "../../../context/SettingsContext";
import { getSizeTextStyle } from "../../../globalStyle";

export const GameMenu: React.FC<GameMenuProps> = ({
	showMenu,
	score,
	maxScore,
	startGame,
	quitGame,
	settings,
	onSettingsChange,
	onStartTournamentMatch,
}) => {
	const { t } = useTranslation();
	const [isMobileView, setIsMobileView] = useState(false);
	const [showTournamentDialog, setShowTournamentDialog] = useState(false);
	const { size_text } = useSettings();

	useEffect(() => {
		const checkMobileView = () => {
			setIsMobileView(window.innerWidth <= 1023);
		};

		checkMobileView();
		window.addEventListener("resize", checkMobileView);

		return () => {
			window.removeEventListener("resize", checkMobileView);
		};
	}, []);

	if (!showMenu) return null;

	const hasScore = score.player1 > 0 || score.player2 > 0;
	const gameOver = score.player1 >= maxScore || score.player2 >= maxScore;

	return (
		<div className={PongStyle.overlay}>
			<h1 className={`${PongStyle.title} ${getSizeTextStyle(size_text)}`}>
				Pong 3D
			</h1>

			{hasScore && (
				<h2 className={`${PongStyle.subtitle} ${getSizeTextStyle(size_text)}`}>
					{gameOver
						? score.player1 >= maxScore
							? t("pong.player1") + " " + t("pong.youWin")
							: t("pong.player2") + " " + t("pong.youWin")
						: `${t("pong.score")}: ${score.player1} - ${score.player2}`}
				</h2>
			)}

			<button
				className={`${PongStyle.button}  ${getSizeTextStyle(size_text)}`}
				onClick={startGame}
			>
				{hasScore ? t("pong.playAgain") : t("pong.startGame")}
			</button>

			<button
				className={`${PongStyle.button} ${getSizeTextStyle(size_text)}`}
				onClick={() => setShowTournamentDialog(true)}
			>
				{t("pong.tournamentMatch")}
			</button>

			<div className={PongStyle.settingsSection}>
				<h3
					className={`${PongStyle.settingsTitle} ${getSizeTextStyle(size_text)}`}
				>
					{t("pong.gameSettings")}
				</h3>

				<div className={PongStyle.settingGroup}>
					<label className={getSizeTextStyle(size_text)}>
						{t("pong.plateauColor")}
					</label>
					<select
						value={settings.plateauColor}
						onChange={(e) =>
							onSettingsChange({
								...settings,
								plateauColor: e.target.value as any,
							})
						}
						className={`${PongStyle.select}  ${getSizeTextStyle(size_text)}`}
					>
						<option value="default">{t("pong.colorDefault")}</option>
						<option value="blue">{t("pong.colorBlue")}</option>
						<option value="red">{t("pong.colorRed")}</option>
					</select>
				</div>

				<div className={PongStyle.settingGroup}>
					<label>{t("pong.paddleColor")}</label>
					<select
						value={settings.paddleColor}
						onChange={(e) =>
							onSettingsChange({
								...settings,
								paddleColor: e.target.value as any,
							})
						}
						className={`${PongStyle.select} ${getSizeTextStyle(size_text)}`}
					>
						<option value="default">{t("pong.colorDefault")}</option>
						<option value="green">{t("pong.colorGreen")}</option>
						<option value="purple">{t("pong.colorPurple")}</option>
					</select>
				</div>

				<div className={PongStyle.settingGroup}>
					<label className={getSizeTextStyle(size_text)}>
						{t("pong.ballSpeed")}
					</label>
					<select
						value={settings.ballSpeed}
						onChange={(e) =>
							onSettingsChange({
								...settings,
								ballSpeed: e.target.value as any,
							})
						}
						className={`${PongStyle.select} ${getSizeTextStyle(size_text)}`}
					>
						<option value="normal">{t("pong.speedNormal")}</option>
						<option value="fast">{t("pong.speedFast")}</option>
						<option value="turbo">{t("pong.speedTurbo")}</option>
					</select>
				</div>
			</div>

			<button
				className={`${PongStyle.buttonDanger} ${getSizeTextStyle(size_text)}`}
				onClick={quitGame}
			>
				{t("pong.quitGame")}
			</button>

			<div className={`${PongStyle.smallText} ${getSizeTextStyle(size_text)}`}>
				{isMobileView ? (
					<>
						{t("pong.mobileControls")}
						<br />
					</>
				) : (
					<>{t("pong.keyboardControls")}</>
				)}
			</div>

			<TournamentMatchDialog
				isOpen={showTournamentDialog}
				onClose={() => setShowTournamentDialog(false)}
				onStartMatch={(matchId) => {
					setShowTournamentDialog(false);
					if (onStartTournamentMatch) onStartTournamentMatch(matchId);
				}}
			/>
		</div>
	);
};

export default GameMenu;
