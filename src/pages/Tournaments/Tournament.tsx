import { useSettings } from "../../context/SettingsContext";
import { getSizeTextStyle } from "../../globalStyle";
import TournamentsStyle from "./TournamentsStyle";

export default function Tournament() {
	const { size_text } = useSettings();

	return (
		<div
			className={`${TournamentsStyle.container} ${getSizeTextStyle(size_text)}`}
		>
			<h1
				className={`${TournamentsStyle.title} ${getSizeTextStyle(size_text)}`}
			>
				Tournament Title
			</h1>
			<div className={TournamentsStyle.tournament.container}>
				<div
					className={`${TournamentsStyle.tournament.roundTitle} ${getSizeTextStyle(size_text)}`}
				>
					Round 1
				</div>
				<div
					className={`${TournamentsStyle.tournament.player} ${getSizeTextStyle(size_text)}`}
				>
					Player 1
				</div>
				<div
					className={`${TournamentsStyle.tournament.vs} ${getSizeTextStyle(size_text)}`}
				>
					VS
				</div>
				<div
					className={`${TournamentsStyle.tournament.matchId} ${getSizeTextStyle(size_text)}`}
				>
					Match ID: 12345
				</div>
			</div>
		</div>
	);
}
