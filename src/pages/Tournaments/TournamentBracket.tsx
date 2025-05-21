import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTournament } from "../../context/TournamentContext";
import { useTranslation } from "../../context/TranslationContext";
import { useSettings } from "../../context/SettingsContext";
import { useUserContext } from "../../context/UserContext";
import { getSizeTextStyle } from "../../globalStyle";
import styles from "./TournamentBracketStyle";
import { useToast } from "../../context/ToastContext";
import type { Tournament, TournamentMatchData } from "../../types/Tournament";

interface MatchDetail {
	uuid: string;
	player: string | null;
	guest: string | null;
	guest2: string | null;
	tournament: string;
	score1: number;
	score2: number;
	finished: 0 | 1;
	starttime: string | null;
	endtime: string | null;
}

const TournamentBracket: React.FC = () => {
	// 1. Tous les hooks d'abord, groupés ensemble
	const { t } = useTranslation();
	const { size_text } = useSettings();
	const { showToast } = useToast();
	const navigate = useNavigate();
	const { user } = useUserContext();
	const { id } = useParams<{ id: string }>();
	const { getTournamentById, getMatchById } = useTournament();

	// 2. Tous les états ensemble
	const [tournament, setTournament] = useState<Tournament | null>(null);
	const [matchDetails, setMatchDetails] = useState<Record<string, MatchDetail>>(
		{},
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	// Fonction pour obtenir le nom d'affichage (username si c'est l'utilisateur connecté, sinon l'UUID)
	const getPlayerDisplayName = (playerId: string | null): string => {
		if (!playerId) return "TBD";

		// Si c'est l'utilisateur connecté, afficher son nom d'utilisateur
		if (user && user.uuid === playerId) {
			return user.username || "Vous";
		}

		// Sinon, afficher l'UUID tronqué
		return playerId.substring(0, 8) || "TBD";
	};

	useEffect(() => {
		const fetchTournament = async () => {
			if (!id) {
				setError("ID de tournoi manquant");
				setLoading(false);
				return;
			}

			try {
				const tournamentData = await getTournamentById(id);
				setTournament(tournamentData);

				// Récupérer les détails de chaque match
				if (tournamentData.match && tournamentData.match.length > 0) {
					const detailsPromises = tournamentData.match.map(async (match) => {
						if (match.uuid) {
							try {
								const details = await getMatchById(match.uuid);
								return { uuid: match.uuid, details };
							} catch (error) {
								console.error(
									`Erreur lors de la récupération du match ${match.uuid}:`,
									error,
								);
								return null;
							}
						}
						return null;
					});

					const matchDetailsResults = await Promise.all(detailsPromises);
					const detailsMap: Record<string, MatchDetail> = {};

					matchDetailsResults.forEach((result) => {
						if (result && result.uuid) {
							detailsMap[result.uuid] = result.details;
						}
					});

					setMatchDetails(detailsMap);
				}
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Erreur lors du chargement du tournoi",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchTournament();
	}, [id, getTournamentById, getMatchById]);

	const copyMatchId = (matchId: string) => {
		navigator.clipboard
			.writeText(matchId)
			.then(() => {
				showToast(t("tournaments.idCopied"), "success");
			})
			.catch(() => {
				showToast(t("error.unknown"), "error");
			});
	};

	const handleBackClick = () => {
		navigate(-1);
	};

	// 3. Tous les calculs basés sur des hooks ensemble (avant les conditions)
	// Organiser les matchs par rounds et obtenir les informations nécessaires pour l'affichage
	const tournamentData = useMemo(() => {
		const emptyResult = {
			matchesByRound: {} as Record<number, TournamentMatchData[]>,
			totalRounds: 0,
		};

		if (!tournament || !tournament.match) {
			return emptyResult;
		}

		// Créer un objet où les clés sont les numéros de round et les valeurs sont les matchs de ce round
		const roundsMap: Record<number, TournamentMatchData[]> = {};

		// Pour chaque match, l'ajouter au bon round
		tournament.match.forEach((match) => {
			const roundNumber = match.round || 1; // Si round n'est pas défini, considérer comme round 1
			if (!roundsMap[roundNumber]) {
				roundsMap[roundNumber] = [];
			}
			roundsMap[roundNumber].push(match);
		});

		// Calculer le nombre total de rounds
		const rounds = Object.keys(roundsMap).map(Number);
		const maxRound = rounds.length > 0 ? Math.max(...rounds) : 0;

		return {
			matchesByRound: roundsMap,
			totalRounds: maxRound,
		};
	}, [tournament]);

	// Extraire les données du useMemo pour plus de clarté
	const { matchesByRound, totalRounds } = tournamentData;

	// 4. Fonctions auxiliaires qui ne sont pas des hooks
	// Fonction pour obtenir le nom du round
	const getRoundName = (roundNumber: number): string => {
		switch (roundNumber) {
			case totalRounds:
				return t("tournaments.final");
			case totalRounds - 1:
				return t("tournaments.semifinal");
			case totalRounds - 2:
				return t("tournaments.quarterfinal");
			default:
				return `${t("tournaments.round")} ${roundNumber}`;
		}
	};

	// 5. Conditions de rendu après tous les hooks
	if (loading) {
		return (
			<div className={styles.container}>
				<p className={getSizeTextStyle(size_text)}>{t("loading")}</p>
			</div>
		);
	}

	if (error || !tournament) {
		return (
			<div className={styles.container}>
				<p className={`${styles.error} ${getSizeTextStyle(size_text)}`}>
					{error || t("error.unknown")}
				</p>
				<button
					className={`${styles.button} ${getSizeTextStyle(size_text)}`}
					onClick={handleBackClick}
				>
					{t("pong.backToMenu")}
				</button>
			</div>
		);
	}

	return (
		<div className={styles.container}>
			<h1 className={`${styles.title} ${getSizeTextStyle(size_text)}`}>
				{t("tournaments.tournamentTree")}
			</h1>

			<div className={styles.tournamentInfo}>
				<p className={`${styles.tournamentId} ${getSizeTextStyle(size_text)}`}>
					Tournoi #{tournament.uuid?.substring(0, 8) || "N/A"}
				</p>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
					<div>
						<p className={getSizeTextStyle(size_text)}>
							<span className={styles.labelText}>
								{t("tournaments.players")}:
							</span>{" "}
							<strong>{tournament.players?.length || 0}</strong>
						</p>
						<p className={getSizeTextStyle(size_text)}>
							<span className={styles.labelText}>
								{t("tournaments.status")}:
							</span>{" "}
							<span
								className={`inline-block px-3 py-1 rounded-full ${
									tournament.finished === 1
										? "bg-green-500 text-white"
										: "bg-yellow-500 text-white"
								}`}
							>
								{tournament.finished === 1
									? t("tournaments.finished")
									: t("tournaments.inProgress")}
							</span>
						</p>
					</div>
					<div>
						<p className={getSizeTextStyle(size_text)}>
							<span className={styles.labelText}>
								{t("tournaments.matches")}:
							</span>{" "}
							<strong>{tournament.match?.length || 0}</strong>
						</p>
						{tournament.winner && (
							<p className={getSizeTextStyle(size_text)}>
								<span className={styles.labelText}>
									{t("tournaments.winner")}:
								</span>{" "}
								<strong className="text-primary">
									{getPlayerDisplayName(tournament.winner)}
								</strong>
							</p>
						)}
					</div>
				</div>
			</div>

			{/* Message d'aide pour mobile */}

			<div className={styles.bracketContainer}>
				{tournament.match && tournament.match.length > 0 ? (
					<div className={styles.bracketTree}>
						{/* Afficher les matchs organisés par rounds dans l'ordre inverse pour mobile (du premier round à la finale) */}
						{Object.entries(matchesByRound)
							.sort(([roundA], [roundB]) => parseInt(roundA) - parseInt(roundB))
							.map(([round, matches]) => (
								<div key={round} className={styles.roundContainer}>
									<h3
										className={`${styles.roundTitle} ${getSizeTextStyle(size_text)}`}
									>
										{getRoundName(parseInt(round))}
									</h3>
									<div className={styles.roundMatches}>
										{matches.map((match) => (
											<div key={match.uuid} className={styles.matchCard}>
												<p
													className={`${styles.matchId} ${getSizeTextStyle(size_text)}`}
												>
													Match #{match.uuid?.substring(0, 8) || "N/A"}
													{matchDetails[match.uuid] && (
														<span className={styles.matchStatus}>
															{matchDetails[match.uuid].finished === 1
																? t("tournaments.finished")
																: t("tournaments.inProgress")}
														</span>
													)}
												</p>
												<div className={styles.players}>
													{matchDetails[match.uuid] ? (
														<>
															<div className={styles.playerRow}>
																<span
																	className={`${styles.playerName} ${getSizeTextStyle(size_text)} ${
																		user &&
																		matchDetails[match.uuid].player ===
																			user.uuid
																			? styles.currentPlayer
																			: ""
																	}`}
																>
																	{getPlayerDisplayName(
																		matchDetails[match.uuid].player,
																	)}
																</span>
																{matchDetails[match.uuid].finished === 1 && (
																	<span
																		className={`${
																			matchDetails[match.uuid].score1 >
																			matchDetails[match.uuid].score2
																				? styles.scoreHighlight
																				: styles.score
																		}`}
																	>
																		{matchDetails[match.uuid].score1}
																	</span>
																)}
															</div>
															<div className={styles.playerRow}>
																<span
																	className={`${styles.playerName} ${getSizeTextStyle(size_text)} ${
																		user &&
																		(matchDetails[match.uuid].guest ===
																			user.uuid ||
																			matchDetails[match.uuid].guest2 ===
																				user.uuid)
																			? styles.currentPlayer
																			: ""
																	}`}
																>
																	{matchDetails[match.uuid].guest
																		? getPlayerDisplayName(
																				matchDetails[match.uuid].guest,
																			)
																		: getPlayerDisplayName(
																				matchDetails[match.uuid].guest2,
																			)}
																</span>
																{matchDetails[match.uuid].finished === 1 && (
																	<span
																		className={`${
																			matchDetails[match.uuid].score2 >
																			matchDetails[match.uuid].score1
																				? styles.scoreHighlight
																				: styles.score
																		}`}
																	>
																		{matchDetails[match.uuid].score2}
																	</span>
																)}
															</div>
														</>
													) : (
														<p className={getSizeTextStyle(size_text)}>
															{t("tournaments.loading")}
														</p>
													)}
												</div>

												{matchDetails[match.uuid] &&
													matchDetails[match.uuid].finished === 1 && (
														<p
															className={`${styles.winner} ${getSizeTextStyle(size_text)}`}
														>
															{t("tournaments.winner")}:{" "}
															<strong>
																{matchDetails[match.uuid].score1 >
																matchDetails[match.uuid].score2
																	? getPlayerDisplayName(
																			matchDetails[match.uuid].player,
																		)
																	: getPlayerDisplayName(
																			matchDetails[match.uuid].guest ||
																				matchDetails[match.uuid].guest2,
																		)}
															</strong>
														</p>
													)}

												<button
													className={`${styles.copyButton} ${getSizeTextStyle(size_text)}`}
													onClick={() => copyMatchId(match.uuid || "")}
												>
													{t("tournaments.copyId")}
													<svg
														xmlns="http://www.w3.org/2000/svg"
														className="h-4 w-4"
														viewBox="0 0 20 20"
														fill="currentColor"
													>
														<path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
														<path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
													</svg>
												</button>
											</div>
										))}
									</div>
								</div>
							))}
					</div>
				) : (
					<div className={styles.noMatches}>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-16 w-16 text-gray-400 mx-auto mb-4"
							viewBox="0 0 20 20"
							fill="currentColor"
						>
							<path
								fillRule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
								clipRule="evenodd"
							/>
						</svg>
						<p className={`${getSizeTextStyle(size_text)} text-center`}>
							{t("tournaments.noMatches")}
						</p>
					</div>
				)}
			</div>

			<button
				className={`${styles.button} ${getSizeTextStyle(size_text)} flex items-center gap-2`}
				onClick={handleBackClick}
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
						clipRule="evenodd"
					/>
				</svg>
				{t("pong.backToMenu")}
			</button>
		</div>
	);
};

export default TournamentBracket;
