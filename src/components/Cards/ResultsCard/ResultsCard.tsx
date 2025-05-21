import { useState, useEffect } from "react";
import { useTranslation } from "../../../context/TranslationContext";
import { useGameContext } from "../../../context/GameContext";
import { useUserContext } from "../../../context/UserContext";
import globalStyle from "../../../globalStyle";
import Card, { Space } from "../../Card/Card";
import LineHistory from "../../LineHistory/LineHistory";

export default function ResultsCard() {
	const { t } = useTranslation();
	const { matches } = useGameContext();
	const { user } = useUserContext();
	const [historyLines, setHistoryLines] = useState<
		Array<{ username: string; versus: string; win: boolean }>
	>([]);

	useEffect(() => {
		// Filtrer les matchs terminés pour l'utilisateur connecté
		if (matches && user) {
			const userMatches = matches.filter((match) => match.player === user.uuid);

			// Trier les matchs par date (les plus récents d'abord)
			const sortedMatches = [...userMatches].sort((a, b) => {
				const dateA = a.endtime ? new Date(a.endtime).getTime() : 0;
				const dateB = b.endtime ? new Date(b.endtime).getTime() : 0;
				return dateB - dateA;
			});

			// Limiter à 6 matchs maximum pour l'affichage
			const recentMatches = sortedMatches.slice(0, 6);

			// Convertir les matchs en format adapté pour LineHistory
			const formattedMatches = recentMatches.map((match) => {
				// Afficher le nom de l'invité directement, "Guest" est un joueur normal
				const versus = match.guest || "Unknown";
				const win = match.score1 > match.score2; // Considérer que score1 est le score du joueur

				return { username: user.username, versus, win };
			});

			setHistoryLines(formattedMatches);
		}
	}, [matches, user, t]);

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{t("home.your")}</p>
				<Space />
				<span className={globalStyle.span}>{t("home.history")}</span>
			</div>
			<div className={globalStyle.separator}></div>

			{historyLines.length > 0 ? (
				historyLines.map((line, index) => (
					<LineHistory
						key={index}
						username={line.username}
						versus={line.versus}
						win={line.win}
					/>
				))
			) : (
				// Afficher un message si aucun historique
				<p className="text-center py-4 text-gray-500">{t("loading")}</p>
			)}
		</Card>
	);
}
