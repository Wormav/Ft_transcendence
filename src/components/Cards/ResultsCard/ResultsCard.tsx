import globalStyle from "../../../globalStyle";
import Card, { Space } from "../../Card/Card";
import LineHistory from "../../LineHistory/LineHistory";
import { useState, useEffect } from "react";
import { useTranslation } from "../../../context/TranslationContext";
import { useGameContext } from "../../../context/GameContext";
import { useUserContext } from "../../../context/UserContext";
import { customFetch } from "../../../utils/customFetch";
import { getJwtToken } from "../../../utils/getJwtToken";
import type { MatchData } from "../../../types/GameContextType";
import type { ResultsCardProps } from "../../../types/ResultsCardProps";

const ResultsCard: React.FC<ResultsCardProps> = ({ friendUuid }) => {
	const { t } = useTranslation();
	const { matches } = useGameContext();
	const { user } = useUserContext();
	const [historyLines, setHistoryLines] = useState<
		Array<{ username: string; versus: string; win: boolean }>
	>([]);
	const [friendMatches, setFriendMatches] = useState<MatchData[]>([]);
	const [friendUsername, setFriendUsername] = useState<string>("");

	useEffect(() => {
		const fetchFriendMatches = async () => {
			if (!friendUuid) return;

			try {
				const token = getJwtToken();
				if (!token) return;

				const matchesResponse = await customFetch(
					`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/match/user/${friendUuid}`,
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
						`Error retrieving matches: ${matchesResponse.status}`,
					);
				}

				const profileResponse = await customFetch(
					`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/${friendUuid}`,
					{
						method: "GET",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json",
						},
					},
				);

				if (!profileResponse.ok) {
					throw new Error(
						`Error retrieving profile: ${profileResponse.status}`,
					);
				}

				const matchesData = await matchesResponse.json();
				const profileData = await profileResponse.json();

				const finishedMatches = matchesData.filter(
					(match: MatchData) => match.finished === 1,
				);

				setFriendMatches(finishedMatches);
				setFriendUsername(profileData.username || "");
			} catch (error) {
				console.error("Error retrieving friend's matches:", error);
			}
		};

		fetchFriendMatches();
	}, [friendUuid]);

	useEffect(() => {
		if (friendUuid && friendMatches.length > 0) {
			const sortedMatches = [...friendMatches].sort((a, b) => {
				const dateA = a.endtime ? new Date(a.endtime).getTime() : 0;
				const dateB = b.endtime ? new Date(b.endtime).getTime() : 0;
				return dateB - dateA;
			});

			const recentMatches = sortedMatches.slice(0, 7);

			const formattedMatches = recentMatches.map((match) => {
				const versus = match.guest || "Unknown";
				const win = match.score1 > match.score2;

				return { username: friendUsername, versus, win };
			});

			setHistoryLines(formattedMatches);
		} else if (matches && user && !friendUuid) {
			const userMatches = matches.filter((match) => match.player === user.uuid);

			const sortedMatches = [...userMatches].sort((a, b) => {
				const dateA = a.endtime ? new Date(a.endtime).getTime() : 0;
				const dateB = b.endtime ? new Date(b.endtime).getTime() : 0;
				return dateB - dateA;
			});

			const recentMatches = sortedMatches.slice(0, 7);

			const formattedMatches = recentMatches.map((match) => {
				const versus = match.guest || "Unknown";
				const win = match.score1 > match.score2;

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
				<p className="text-center py-4 text-gray-500">
					{t("dashboard.noGames")}
				</p>
			)}
		</Card>
	);
};

export default ResultsCard;
