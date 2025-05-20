import { useState } from "react";
import PongStyle from "../PongStyle";
import { useTranslation } from "../../../context/TranslationContext";
import type { TournamentMatchProps } from "../../../types/TournamentMatch";
import { getSizeTextStyle } from "../../../globalStyle";
import { useSettings } from "../../../context/SettingsContext";

export const TournamentMatchDialog: React.FC<TournamentMatchProps> = ({
	isOpen,
	onClose,
	onStartMatch,
}) => {
	const { t } = useTranslation();
	const [matchId, setMatchId] = useState("");
	const { size_text } = useSettings();

	if (!isOpen) return null;

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (matchId.trim()) {
			onStartMatch(matchId.trim());
		}
	};

	return (
		<div className={PongStyle.overlay}>
			<div className={PongStyle.settingsSection}>
				<h2
					className={`${PongStyle.settingsTitle} ${getSizeTextStyle(size_text)}`}
				>
					{t("pong.tournamentMatch")}
				</h2>
				<form onSubmit={handleSubmit}>
					<div className={PongStyle.settingGroup}>
						<label className={getSizeTextStyle(size_text)}>
							{t("pong.matchId")}
						</label>
						<input
							type="text"
							value={matchId}
							onChange={(e) => setMatchId(e.target.value)}
							className={`${PongStyle.input}  ${getSizeTextStyle(size_text)}`}
							placeholder={t("pong.enterMatchId")}
							required
						/>
					</div>
					<button
						type="submit"
						className={`${PongStyle.button} ${getSizeTextStyle(size_text)}`}
					>
						{t("pong.startTournamentMatch")}
					</button>
					<button
						type="button"
						className={`${PongStyle.buttonDanger} ${getSizeTextStyle(size_text)}`}
						onClick={onClose}
					>
						{t("pong.cancel")}
					</button>
				</form>
			</div>
		</div>
	);
};
