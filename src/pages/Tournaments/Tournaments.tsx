import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TournamentsStyle";
import type { Tournament } from "../../types/Tournament";
import { useTranslation } from "../../context/TranslationContext";
import { useSettings } from "../../context/SettingsContext";
import { getSizeTextStyle } from "../../globalStyle";
import { useTournament } from "../../context/TournamentContext";
import { useUserContext } from "../../context/UserContext";

type TabType = "active" | "finished";

const Tournaments: React.FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const { user } = useUserContext();
	const {
		tournaments,
		loading,
		error: tournamentError,
		createTournament,
		fetchUserTournaments,
	} = useTournament();
	const [guestPlayers, setGuestPlayers] = useState<string[]>([]);
	const [activeTournament, setActiveTournament] = useState<Tournament | null>(
		null,
	);
	const [error, setError] = useState<string>("");
	const [activeTab, setActiveTab] = useState<TabType>("active");
	const { size_text } = useSettings();

	useEffect(() => {
		const findActiveTournament = () => {
			if (!tournaments) {
				setActiveTournament(null);
				return;
			}
			const active = tournaments.find(
				(tournament) => tournament.finished === 0,
			);
			setActiveTournament(active || null);
		};

		findActiveTournament();
	}, [tournaments]);

	useEffect(() => {
		if (user?.uuid) {
			fetchUserTournaments(user.uuid);
		}
	}, [user, fetchUserTournaments]);

	const filteredTournaments = useMemo(() => {
		if (!tournaments) return [];

		return tournaments.filter((tournament) => {
			if (activeTab === "active") {
				return tournament.finished === 0;
			} else {
				return tournament.finished === 1;
			}
		});
	}, [tournaments, activeTab]);

	const handleAddPlayer = (index: number, name: string) => {
		const newPlayers = [...guestPlayers];
		newPlayers[index] = name;
		setGuestPlayers(newPlayers);

		const trimmedName = name.trim();
		if (trimmedName !== "") {
			const playerNames = newPlayers
				.filter((p) => p && p.trim() !== "")
				.map((p) => p.toLowerCase());
			const uniqueNames = new Set(playerNames);

			if (uniqueNames.size !== playerNames.length) {
				setError(t("tournaments.duplicateNameError"));
			} else {
				setError("");
			}
		} else {
			setError("");
		}
	};

	const getRequiredGuestPlayers = (maxPlayerCount: number) =>
		maxPlayerCount - 1;

	const handleCreateTournament = async () => {
		if (!user?.uuid) {
			setError("You must be logged in to create a tournament");
			return;
		}

		const validPlayers = guestPlayers
			.filter((p) => p && p.trim() !== "")
			.map((p) => p.trim());

		if (validPlayers.length < 4 - 1) {
			setError(
				t("tournaments.minPlayersError")
					.replace("{0}", (4 - 1).toString())
					.replace("{1}", "4"),
			);
			return;
		}

		const playerNames = validPlayers.map((p) => p.toLowerCase());
		const uniqueNames = new Set(playerNames);
		if (uniqueNames.size !== playerNames.length) {
			setError(t("tournaments.createError"));
			return;
		}

		try {
			await createTournament(user.uuid, validPlayers);

			setError("");
			setGuestPlayers([]);

			await fetchUserTournaments(user.uuid);
		} catch (err) {
			console.error("Error creating tournament:", err);
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while creating the tournament",
			);
		}
	};

	return (
		<div className={styles.container}>
			{activeTournament && (
				<div className={styles.activeTournament}>
					<h2 className={`${styles.subtitle} ${getSizeTextStyle(size_text)}`}>
						{t("tournaments.activeTournament")}
					</h2>
					<div
						className={styles.tournamentActiveItem}
						onClick={() =>
							activeTournament.uuid &&
							navigate(`/tournaments/${activeTournament.uuid}`)
						}
					>
						<p
							className={`${styles.tournamentId} ${getSizeTextStyle(size_text)}`}
						>
							Tournoi #{activeTournament.uuid?.substring(0, 8) || "N/A"}
						</p>
						<p className={getSizeTextStyle(size_text)}>
							<span className={styles.labelText}>{t("tournaments.host")}:</span>{" "}
							{activeTournament.host === user?.uuid
								? t("tournaments.you")
								: activeTournament.host?.substring(0, 8) || "N/A"}
						</p>
						<p className={getSizeTextStyle(size_text)}>
							<span className={styles.labelText}>
								{t("tournaments.players")}:
							</span>{" "}
							{activeTournament.players?.length || 0}
						</p>
						<p className={getSizeTextStyle(size_text)}>
							<span className={styles.labelText}>
								{t("tournaments.matches")}:
							</span>{" "}
							{activeTournament.match?.length || 0}
						</p>
						<p
							className={`${styles.statusActive} ${getSizeTextStyle(size_text)}`}
						>
							{t("tournaments.active")}
						</p>
						<p
							className={`${styles.viewBracket} ${getSizeTextStyle(size_text)}`}
						>
							{t("tournaments.viewBracket")} →
						</p>
					</div>
				</div>
			)}

			<h1 className={`${styles.title} ${getSizeTextStyle(size_text)}`}>
				{t("tournaments.createTournament")}
			</h1>

			<div className={styles.form}>
				{Array.from({ length: 4 - 1 }).map((_, index) => (
					<input
						key={index}
						type="text"
						className={`${styles.playerInput} ${getSizeTextStyle(size_text)}`}
						placeholder={`${t("tournaments.playerName")} ${index + 2}`}
						onChange={(e) => handleAddPlayer(index, e.target.value)}
						value={guestPlayers[index] || ""}
					/>
				))}

				{error && <p className={styles.error}>{error}</p>}
				{tournamentError && <p className={styles.error}>{tournamentError}</p>}

				<button
					className={`
						${
							guestPlayers.filter((p) => p && p.trim() !== "").length <
							getRequiredGuestPlayers(4)
								? styles.buttonDisabled
								: styles.button
						} ${getSizeTextStyle(size_text)}
					`}
					onClick={handleCreateTournament}
					disabled={
						loading ||
						guestPlayers.filter((p) => p && p.trim() !== "").length <
							getRequiredGuestPlayers(4)
					}
				>
					{loading ? t("tournaments.creating") : t("tournaments.createButton")}
				</button>
			</div>

			{tournaments && tournaments.length > 0 && (
				<div className={styles.tournamentList}>
					<h2 className={`${styles.subtitle} ${getSizeTextStyle(size_text)}`}>
						{t("tournaments.yourTournaments")}
					</h2>
					<div className={styles.tabContainer}>
						<div
							className={activeTab === "active" ? styles.activeTab : styles.tab}
							onClick={() => setActiveTab("active")}
						>
							{t("tournaments.activeTournaments")}
						</div>
						<div
							className={
								activeTab === "finished" ? styles.activeTab : styles.tab
							}
							onClick={() => setActiveTab("finished")}
						>
							{t("tournaments.finishedTournaments")}
						</div>
					</div>

					{filteredTournaments.length > 0 ? (
						filteredTournaments.map((tournament) => (
							<div
								key={tournament.uuid}
								className={styles.tournamentItem}
								onClick={() =>
									tournament.uuid && navigate(`/tournaments/${tournament.uuid}`)
								}
								style={{ cursor: "pointer" }}
							>
								<p className={getSizeTextStyle(size_text)}>
									Tournoi #{tournament.uuid?.substring(0, 8) || "N/A"}
								</p>
								<p className={getSizeTextStyle(size_text)}>
									{t("tournaments.players")}: {tournament.players?.length || 0}
								</p>
								<p className={getSizeTextStyle(size_text)}>
									{t("tournaments.status")}:{" "}
									{tournament.finished === 1
										? t("tournaments.finished")
										: t("tournaments.inProgress")}
								</p>
								{tournament.winner && (
									<p className={getSizeTextStyle(size_text)}>
										{t("tournaments.winner")}: {tournament.winner}
									</p>
								)}
								<p
									className={`${styles.viewBracket} ${getSizeTextStyle(size_text)}`}
								>
									{t("tournaments.viewBracket")} →
								</p>
							</div>
						))
					) : (
						<p className={styles.noTournaments}>
							{t("tournaments.noTournaments")}
						</p>
					)}
				</div>
			)}
		</div>
	);
};

export default Tournaments;
