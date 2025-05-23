import { useSettings } from "../../context/SettingsContext";
import { getSizeTextStyle } from "../../globalStyle";
import TournamentsStyle from "./TournamentsStyle";
import { useTournament } from "../../context/TournamentContext";
import { useTranslation } from "../../context/TranslationContext";
import Card from "../../components/Card/Card";

export default function Tournament() {
	const { size_text } = useSettings();
	const { tournaments, loading } = useTournament();
	const { t } = useTranslation();

	if (loading) {
		return (
			<div className={TournamentsStyle.container}>
				<Card>
					<div className="flex justify-center items-center p-6">
						<p>{t("loading")}</p>
					</div>
				</Card>
			</div>
		);
	}

	if (!tournaments || tournaments.length === 0) {
		return (
			<div className={TournamentsStyle.container}>
				<Card>
					<div className="flex justify-center items-center p-6">
						<p>{t("tournament.noTournaments")}</p>
					</div>
				</Card>
			</div>
		);
	}

	return (
		<div
			className={`${TournamentsStyle.container} ${getSizeTextStyle(size_text)}`}
		>
			<div className={TournamentsStyle.tournament.container}>
				{tournaments.map((tournament) => (
					<Card key={tournament.uuid}>
						<h1
							className={`${TournamentsStyle.title} ${getSizeTextStyle(size_text)}`}
						>
							{t("tournament.title")} #{tournament.uuid.slice(0, 8)}
						</h1>
						<div
							className={`${TournamentsStyle.tournament.roundTitle} ${getSizeTextStyle(size_text)}`}
						>
							{t("tournament.round")} 1
						</div>
						<div
							className={`${TournamentsStyle.tournament.player} ${getSizeTextStyle(size_text)}`}
						>
							{tournament.players[0]}
						</div>
						<div
							className={`${TournamentsStyle.tournament.vs} ${getSizeTextStyle(size_text)}`}
						>
							VS
						</div>
						<div
							className={`${TournamentsStyle.tournament.matchId} ${getSizeTextStyle(size_text)}`}
						>
							{t("tournament.matchId")}: {tournament.uuid}
						</div>
					</Card>
				))}
			</div>
		</div>
	);
}
