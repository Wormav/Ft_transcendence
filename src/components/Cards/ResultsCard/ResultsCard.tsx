import { useState, useEffect } from "react";
import { useTranslation } from "../../../context/TranslationContext";
import { useGameContext } from "../../../context/GameContext";
import { useUserContext } from "../../../context/UserContext";
import { customFetch } from "../../../utils/customFetch";
import { getJwtToken } from "../../../utils/getJwtToken";
import globalStyle from "../../../globalStyle";
import Card, { Space } from "../../Card/Card";
import LineHistory from "../../LineHistory/LineHistory";
import type { MatchData } from "../../../types/GameContextType";

type ResultsCardProps = {
	friendUuid?: string;
};

export default function ResultsCard({ friendUuid }: ResultsCardProps) {
	const { t } = useTranslation();
	const { matches } = useGameContext();
	const { user } = useUserContext();
	const [historyLines, setHistoryLines] = useState<
		Array<{ username: string; versus: string; win: boolean }>
	>([]);
	const [friendMatches, setFriendMatches] = useState<MatchData[]>([]);
	const [friendUsername, setFriendUsername] = useState<string>("");

	// Récupérer les matchs de l'ami si friendUuid est fourni
	useEffect(() => {
		const fetchFriendMatches = async () => {
			if (!friendUuid) return;

			try {
				const token = getJwtToken();
				if (!token) return;

				// Récupérer les matchs de l'ami
				const matchesResponse = await customFetch(
					`/api/game/match/user/${friendUuid}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				);

				if (!matchesResponse.ok) {
					throw new Error(
						`Erreur lors de la récupération des matchs: ${matchesResponse.status}`,
					);
				}

				// Récupérer le profil de l'ami pour obtenir son username
				const profileResponse = await customFetch(`/api/user/${friendUuid}`, {
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				});

				if (!profileResponse.ok) {
					throw new Error(
						`Erreur lors de la récupération du profil: ${profileResponse.status}`,
					);
				}

				const matchesData = await matchesResponse.json();
				const profileData = await profileResponse.json();

				// Filtrer uniquement les matchs terminés
				const finishedMatches = matchesData.filter(
					(match: MatchData) => match.finished === 1,
				);

				setFriendMatches(finishedMatches);
				setFriendUsername(profileData.username || "");
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des matchs de l'ami:",
					error,
				);
			}
		};

		fetchFriendMatches();
	}, [friendUuid]);

	useEffect(() => {
		if (friendUuid && friendMatches.length > 0) {
			// Traiter les matchs de l'ami
			// Trier les matchs par date (les plus récents d'abord)
			const sortedMatches = [...friendMatches].sort((a, b) => {
				const dateA = a.endtime ? new Date(a.endtime).getTime() : 0;
				const dateB = b.endtime ? new Date(b.endtime).getTime() : 0;
				return dateB - dateA;
			});

			// Limiter à 7 matchs maximum pour l'affichage
			const recentMatches = sortedMatches.slice(0, 7);

			// Convertir les matchs en format adapté pour LineHistory
			const formattedMatches = recentMatches.map((match) => {
				// Afficher le nom de l'invité directement
				const versus = match.guest || "Unknown";
				const win = match.score1 > match.score2; // Considérer que score1 est le score du joueur

				return { username: friendUsername, versus, win };
			});

			setHistoryLines(formattedMatches);
		} else if (matches && user && !friendUuid) {
			// Utiliser le contexte global pour l'utilisateur connecté
			const userMatches = matches.filter((match) => match.player === user.uuid);

			// Trier les matchs par date (les plus récents d'abord)
			const sortedMatches = [...userMatches].sort((a, b) => {
				const dateA = a.endtime ? new Date(a.endtime).getTime() : 0;
				const dateB = b.endtime ? new Date(b.endtime).getTime() : 0;
				return dateB - dateA;
			});

			// Limiter à 7 matchs maximum pour l'affichage
			const recentMatches = sortedMatches.slice(0, 7);

			// Convertir les matchs en format adapté pour LineHistory
			const formattedMatches = recentMatches.map((match) => {
				// Afficher le nom de l'invité directement
				const versus = match.guest || "Unknown";
				const win = match.score1 > match.score2; // Considérer que score1 est le score du joueur

				return { username: user.username, versus, win };
			});

			setHistoryLines(formattedMatches);
		}
	}, [matches, user, friendUuid, friendMatches, friendUsername, t]);

	return (
		<Card>
			<div className={globalStyle.row}>
				<p>{friendUuid ? t("profile.history") : t("home.your")}</p>
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
				<p className="text-center py-4 text-gray-500">
					{t("dashboard.noGames")}
				</p>
			)}
		</Card>
	);
}
