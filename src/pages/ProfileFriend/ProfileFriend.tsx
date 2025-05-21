import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProfilHomeCard from "../../components/Cards/ProfilHomeCard/ProfilHomeCard";
import ResultsCard from "../../components/Cards/ResultsCard/ResultsCard";
import Card from "../../components/Card/Card";
import LineChart from "../Dashboard/components/LineChart";
import WinLossChart from "../Dashboard/components/WinLossChart";
import globalStyle from "../../globalStyle";
import { customFetch } from "../../utils/customFetch";
import { getJwtToken } from "../../utils/getJwtToken";
import { useTranslation } from "../../context/TranslationContext";
import type { FriendProfile } from "../../types/FriendProfile";
import type { MatchData } from "../../types/GameContextType";
import type { GameData } from "../../types/Pong";

export default function ProfileFriend() {
	const { uuid } = useParams<{ uuid: string }>();
	const [friendProfile, setFriendProfile] = useState<FriendProfile | null>(
		null,
	);
	const [matches, setMatches] = useState<MatchData[]>([]);
	const [games, setGames] = useState<GameData[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const { t } = useTranslation();
	const navigate = useNavigate();

	useEffect(() => {
		const fetchFriendProfile = async () => {
			try {
				setLoading(true);
				setError(null);

				const token = getJwtToken();
				if (!token) {
					navigate("/login");
					return;
				}

				if (!uuid) {
					setError("UUID manquant");
					setLoading(false);
					return;
				}

				const profileResponse = await customFetch(`/api/user/${uuid}`, {
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

				const matchesResponse = await customFetch(
					`/api/game/match/user/${uuid}`,
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

				const profileData = await profileResponse.json();
				const matchesData = await matchesResponse.json();

				const finishedMatches = matchesData.filter(
					(match: MatchData) => match.finished === 1,
				);

				setFriendProfile(profileData);
				setMatches(finishedMatches);
			} catch (err: any) {
				console.error("Error loading friend profile:", err);
				setError(err.message || "Une erreur est survenue");
			} finally {
				setLoading(false);
			}
		};

		fetchFriendProfile();
	}, [uuid, navigate]);

	useEffect(() => {
		const convertMatchesToGameData = () => {
			if (!matches || matches.length === 0) return [];

			return matches.map((match) => ({
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
	}, [matches]);

	if (loading) {
		return (
			<div className={globalStyle.cardContainer}>
				<div className="flex justify-center items-center min-h-screen">
					<p>{t("loading")}</p>
				</div>
			</div>
		);
	}

	if (error || !friendProfile) {
		return (
			<div className={globalStyle.cardContainer}>
				<div className="flex justify-center items-center min-h-screen">
					<p className="text-red-500">{error || "Profil non trouvé"}</p>
				</div>
			</div>
		);
	}

	return (
		<div className={globalStyle.cardContainer}>
			<ProfilHomeCard home={false} friendProfile={friendProfile} />

			{games.length > 0 ? (
				<>
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

					<ResultsCard friendUuid={uuid} />
				</>
			) : (
				<Card>
					<div className="flex justify-center items-center p-6">
						<p>{t("dashboard.noGames")}</p>
					</div>
				</Card>
			)}
		</div>
	);
}
