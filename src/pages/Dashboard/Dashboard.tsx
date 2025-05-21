import { useState, useEffect } from "react";
import Card from "../../components/Card/Card";
import globalStyle from "../../globalStyle";
import { useTranslation } from "../../context/TranslationContext";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useGameContext } from "../../context/GameContext";
import { useUserContext } from "../../context/UserContext";
import LineChart from "./components/LineChart";
import WinLossChart from "./components/WinLossChart";
import type { GameData } from "../../types/Pong";

const Dashboard: React.FC = () => {
	const { t } = useTranslation();
	const windowSize = useWindowSize();
	const { matches } = useGameContext();
	const { user } = useUserContext();
	const [games, setGames] = useState<GameData[]>([]);
	const [, setRender] = useState(0);

	useEffect(() => {
		const convertMatchesToGameData = () => {
			if (!matches || matches.length === 0) return [];

			const userMatches = user?.uuid
				? matches.filter((match) => match.player === user.uuid)
				: matches;

			return userMatches.map((match) => ({
				id: match.uuid,
				player_id: match.player,
				date: match.endtime ? new Date(match.endtime).getTime() : Date.now(),
				score_player1: match.score1,
				score_player2: match.score2,
				gameIA: match.guest === "Guest",
			}));
		};

		const gameData = convertMatchesToGameData();
		setGames(gameData);
	}, [matches, user]);

	useEffect(() => {
		setRender((prev) => prev + 1);
	}, [windowSize]);

	return (
		<div className={globalStyle.cardContainer}>
			<Card>
				<div className={globalStyle.row}>
					<span className={globalStyle.span}>
						{t("dashboard.scoreEvolution")}
					</span>
				</div>
				<div className={globalStyle.separator}></div>
				<div className="w-full h-[300px]">
					<LineChart games={games} />
				</div>
			</Card>
			<Card>
				<div className={globalStyle.row}>
					<span className={globalStyle.span}>
						{t("dashboard.winLossRatio")}
					</span>
				</div>
				<div className={globalStyle.separator}></div>
				<div className="w-full h-[300px]">
					<WinLossChart games={games} />
				</div>
			</Card>
		</div>
	);
};

export default Dashboard;
