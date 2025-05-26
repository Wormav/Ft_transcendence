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
import type { MatchDetail } from "../../types/TournamentMatch";
import { customFetch } from "../../utils/customFetch";
import { getJwtToken } from "../../utils/getJwtToken";

const TournamentBracket: React.FC = () => {
	const { t } = useTranslation();
	const { size_text } = useSettings();
	const { showToast } = useToast();
	const navigate = useNavigate();
	const { user } = useUserContext();
	const { id } = useParams<{ id: string }>();
	const {
		getTournamentById,
		getMatchById,
		updateTournament,
		fetchUserTournaments,
	} = useTournament();

	const [tournament, setTournament] = useState<Tournament | null>(null);
	const [matchDetails, setMatchDetails] = useState<Record<string, MatchDetail>>(
		{},
	);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const determineWinners = (
		match1: MatchDetail | undefined,
		match2: MatchDetail | undefined,
	) => {
		if (!match1 || !match2) return null;

		const winner1 =
			match1.score1 > match1.score2
				? match1.player || match1.guest
				: match1.guest2 || match1.guest;

		const winner2 =
			match2.score1 > match2.score2
				? match2.player || match2.guest
				: match2.guest2 || match2.guest;

		if (winner1 !== match1.player && winner2 !== match2.player) {
			const result = {
				player: null,
				guest: winner1,
				guest2: winner2,
			};
			return result;
		}

		const result = {
			player: winner1 === match1.player ? winner1 : winner2,
			guest: winner1 === match1.player ? winner2 : winner1,
			guest2: null,
		};
		return result;
	};

	const getPlayerDisplayName = (
		playerId: string | null,
		isPlayer: boolean = true,
	): string => {
		if (!playerId) {
			return isPlayer ? "Guest1" : "Guest2";
		}

		if (user && user.uuid === playerId) {
			return user.username || "Vous";
		}

		return playerId.substring(0, 8);
	};

	const handleBackClick = () => {
		navigate(-1);
	};

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

	const handleCancelTournament = async () => {
		if (!tournament || !tournament.uuid || !user) return;

		try {
			if (!window.confirm(t("tournaments.cancelConfirmation"))) {
				return;
			}

			await updateTournament(tournament.uuid, { finished: 1 });

			const updatedTournament = await getTournamentById(tournament.uuid);
			setTournament(updatedTournament);

			await fetchUserTournaments(user.uuid);

			showToast(t("tournaments.cancelSuccess"), "success");
		} catch (err) {
			console.error("Error while canceling tournament:", err);
			showToast(t("tournaments.cancelError"), "error");
		}
	};

	useEffect(() => {
		const fetchTournament = async () => {
			if (!id) {
				setError("Missing tournament ID");
				setLoading(false);
				return;
			}

			try {
				const tournamentData = await getTournamentById(id);
				setTournament(tournamentData);

				if (tournamentData.match && tournamentData.match.length > 0) {
					const detailsPromises = tournamentData.match.map(async (match) => {
						if (match.uuid) {
							try {
								const details = await getMatchById(match.uuid);
								return { uuid: match.uuid, details };
							} catch (error) {
								console.error(
									`Error while fetching match ${match.uuid}:`,
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
					err instanceof Error ? err.message : "Error while loading tournament",
				);
			} finally {
				setLoading(false);
			}
		};

		fetchTournament();
	}, [id, getTournamentById, getMatchById]);

	useEffect(() => {
		const updateNextMatch = async () => {
			if (!tournament?.match || !tournament.uuid) {
				return;
			}

			const matchesByRound: Record<number, any[]> = {};
			tournament.match.forEach((match) => {
				const round = match.round || 1;
				if (!matchesByRound[round]) {
					matchesByRound[round] = [];
				}
				matchesByRound[round].push(match);
			});

			const maxRound = Math.max(...Object.keys(matchesByRound).map(Number));
			const finalMatch = matchesByRound[maxRound]?.[0];
			if (
				finalMatch?.uuid &&
				matchDetails[finalMatch.uuid]?.finished === 1 &&
				tournament.finished !== 1
			) {
				const finalMatchDetails = matchDetails[finalMatch.uuid];
				const winner =
					finalMatchDetails.score1 > finalMatchDetails.score2
						? finalMatchDetails.player || finalMatchDetails.guest
						: finalMatchDetails.guest2 || finalMatchDetails.guest;

				try {
					await updateTournament(tournament.uuid, {
						finished: 1,
						winner: winner,
					});
					const updatedTournament = await getTournamentById(tournament.uuid);
					setTournament(updatedTournament);

					const winnerName = getPlayerDisplayName(
						winner,
						winner === finalMatchDetails.player,
					);
					showToast(
						t("tournaments.winnerMessage").replace("{winner}", winnerName),
						"success",
					);
				} catch (error) {
					console.error("Error updating tournament status:", error);
				}
			}

			for (let round = 1; round < Object.keys(matchesByRound).length; round++) {
				const currentRoundMatches = matchesByRound[round] || [];
				const nextRoundMatches = matchesByRound[round + 1] || [];

				for (let i = 0; i < currentRoundMatches.length; i += 2) {
					const match1 = currentRoundMatches[i];
					const match2 = currentRoundMatches[i + 1];
					if (!match1?.uuid || !match2?.uuid) continue;

					const match1Details = matchDetails[match1.uuid];
					const match2Details = matchDetails[match2.uuid];

					if (match1Details?.finished === 1 && match2Details?.finished === 1) {
						const nextRoundMatch = nextRoundMatches[i / 2];
						if (!nextRoundMatch?.uuid) continue;

						const nextMatchDetails = matchDetails[nextRoundMatch.uuid];
						if (!nextMatchDetails?.finished) {
							const winners = determineWinners(match1Details, match2Details);
							if (!winners) {
								continue;
							}

							const updateData = {
								player: winners.player || null,
								guest: winners.guest || null,
								guest2: winners.guest2 || null,
							};

							try {
								const token = getJwtToken();
								await customFetch(
									`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/match/${nextRoundMatch.uuid}`,
									{
										method: "PUT",
										headers: {
											"Content-Type": "application/json",
											Authorization: `Bearer ${token}`,
										},
										body: JSON.stringify(updateData),
									},
								);

								const updatedMatch = await getMatchById(nextRoundMatch.uuid);
								setMatchDetails((prev) => ({
									...prev,
									[nextRoundMatch.uuid]: updatedMatch,
								}));
							} catch (err) {
								console.error(
									`Error while updating match ${nextRoundMatch.uuid}:`,
									err,
								);
							}
						}
					}
				}
			}
		};

		const timeoutId = setTimeout(updateNextMatch, 1000);
		return () => clearTimeout(timeoutId);
	}, [
		tournament,
		matchDetails,
		getMatchById,
		updateTournament,
		getTournamentById,
		getPlayerDisplayName,
		showToast,
	]);

	useEffect(() => {
		let timeoutId: NodeJS.Timeout;

		const checkAndUpdateMatches = async () => {
			if (!tournament?.match) return;

			const matchesByRound: Record<number, any[]> = {};
			tournament.match.forEach((match) => {
				const round = match.round || 1;
				if (!matchesByRound[round]) matchesByRound[round] = [];
				matchesByRound[round].push(match);
			});

			for (let round = 1; round < Object.keys(matchesByRound).length; round++) {
				const currentMatches = matchesByRound[round] || [];
				const nextMatches = matchesByRound[round + 1] || [];

				for (let i = 0; i < currentMatches.length; i += 2) {
					const match1 = currentMatches[i];
					const match2 = currentMatches[i + 1];
					if (!match1?.uuid || !match2?.uuid) continue;

					const match1Details = matchDetails[match1.uuid];
					const match2Details = matchDetails[match2.uuid];

					if (match1Details?.finished === 1 && match2Details?.finished === 1) {
						const nextMatch = nextMatches[i / 2];
						if (!nextMatch?.uuid) continue;

						if (!matchDetails[nextMatch.uuid]?.finished) {
							const winners = determineWinners(match1Details, match2Details);
							if (!winners) continue;

							const updateData = {
								player: winners.player || null,
								guest: winners.guest || null,
								guest2: winners.guest2 || null,
							};

							try {
								const token = getJwtToken();
								await customFetch(
									`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/match/${nextMatch.uuid}`,
									{
										method: "PUT",
										headers: {
											"Content-Type": "application/json",
											Authorization: `Bearer ${token}`,
										},
										body: JSON.stringify(updateData),
									},
								);

								const updatedMatch = await getMatchById(nextMatch.uuid);
								setMatchDetails((prev) => ({
									...prev,
									[nextMatch.uuid]: updatedMatch,
								}));
							} catch (err) {
								console.error(`Error updating match ${nextMatch.uuid}:`, err);
							}
						}
					}
				}
			}
		};

		const startPolling = () => {
			timeoutId = setTimeout(async () => {
				await checkAndUpdateMatches();
				startPolling();
			}, 2000);
		};

		startPolling();

		return () => {
			if (timeoutId) clearTimeout(timeoutId);
		};
	}, [tournament, matchDetails, determineWinners, getMatchById]);

	const tournamentData = useMemo(() => {
		const emptyResult = {
			matchesByRound: {} as Record<number, TournamentMatchData[]>,
			totalRounds: 0,
		};

		if (!tournament || !tournament.match) {
			return emptyResult;
		}

		const roundsMap: Record<number, TournamentMatchData[]> = {};

		tournament.match.forEach((match) => {
			const roundNumber = match.round || 1;
			if (!roundsMap[roundNumber]) {
				roundsMap[roundNumber] = [];
			}
			roundsMap[roundNumber].push(match);
		});

		const rounds = Object.keys(roundsMap).map(Number);
		const maxRound = rounds.length > 0 ? Math.max(...rounds) : 0;

		return {
			matchesByRound: roundsMap,
			totalRounds: maxRound,
		};
	}, [tournament]);

	const { matchesByRound, totalRounds } = tournamentData;

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
									{getPlayerDisplayName(tournament.winner, true)}
								</strong>
							</p>
						)}
						{user &&
							tournament.host === user.uuid &&
							tournament.finished !== 1 && (
								<button
									className="mt-3 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md transition-colors flex items-center gap-1 text-sm"
									onClick={handleCancelTournament}
									type="button"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="h-4 w-4"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M6 18L18 6M6 6l12 12"
										/>
									</svg>
									{t("tournaments.cancelTournament")}
								</button>
							)}
					</div>
				</div>
			</div>

			<div className="md:hidden bg-slate-50 p-4 rounded-lg mb-6 text-center">
				<p className={getSizeTextStyle(size_text)}>
					{t("tournaments.mobileView")}
				</p>
			</div>

			<div className={styles.bracketContainer}>
				{tournament.match && tournament.match.length > 0 ? (
					<div className={styles.bracketTree}>
						{Object.entries(matchesByRound)
							.sort(([roundA], [roundB]) => parseInt(roundA) - parseInt(roundB))
							.map(([round, matches]) => {
								const currentRoundNum = parseInt(round);
								if (currentRoundNum > 1) {
									const previousRoundMatches =
										matchesByRound[currentRoundNum - 1] || [];
									const allPreviousMatchesFinished = previousRoundMatches.every(
										(match) => matchDetails[match.uuid]?.finished === 1,
									);
									if (!allPreviousMatchesFinished) return null;
								}
								return (
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
														{tournament.finished !== 1 &&
															`Match #${match.uuid?.substring(0, 8) || "N/A"}`}
														{matchDetails[match.uuid] && (
															<span
																className={`${styles.matchStatus} ${tournament.finished === 1 ? "ml-0" : ""}`}
															>
																{tournament.finished === 1 ||
																matchDetails[match.uuid].finished === 1
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
																		{!matchDetails[match.uuid].player &&
																		matchDetails[match.uuid].guest
																			? getPlayerDisplayName(
																					matchDetails[match.uuid].guest,
																					false,
																				)
																			: getPlayerDisplayName(
																					matchDetails[match.uuid].player,
																					true,
																				)}
																	</span>
																	{(tournament.finished === 1 ||
																		matchDetails[match.uuid].finished ===
																			1) && (
																		<span
																			className={`${
																				matchDetails[match.uuid].score1 >
																				matchDetails[match.uuid].score2
																					? styles.scoreHighlight
																					: styles.score
																			}`}
																		>
																			{matchDetails[match.uuid].score1 || 0}
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
																		{matchDetails[match.uuid].guest2
																			? getPlayerDisplayName(
																					matchDetails[match.uuid].guest2,
																					false,
																				)
																			: !matchDetails[match.uuid].player &&
																				  matchDetails[match.uuid].guest
																				? "Guest2"
																				: getPlayerDisplayName(
																						matchDetails[match.uuid].guest,
																						false,
																					)}
																	</span>
																	{(tournament.finished === 1 ||
																		matchDetails[match.uuid].finished ===
																			1) && (
																		<span
																			className={`${
																				matchDetails[match.uuid].score2 >
																				matchDetails[match.uuid].score1
																					? styles.scoreHighlight
																					: styles.score
																			}`}
																		>
																			{matchDetails[match.uuid].score2 || 0}
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
														(tournament.finished === 1 ||
															matchDetails[match.uuid].finished === 1) && (
															<p
																className={`${styles.winner} ${getSizeTextStyle(size_text)}`}
															>
																{t("tournaments.winner")}:{" "}
																<strong>
																	{matchDetails[match.uuid].score1 >
																	matchDetails[match.uuid].score2
																		? !matchDetails[match.uuid].player &&
																			matchDetails[match.uuid].guest
																			? getPlayerDisplayName(
																					matchDetails[match.uuid].guest,
																					false,
																				)
																			: getPlayerDisplayName(
																					matchDetails[match.uuid].player,
																					true,
																				)
																		: matchDetails[match.uuid].guest2
																			? getPlayerDisplayName(
																					matchDetails[match.uuid].guest2,
																					false,
																				)
																			: !matchDetails[match.uuid].player &&
																				  matchDetails[match.uuid].guest
																				? "Guest2"
																				: getPlayerDisplayName(
																						matchDetails[match.uuid].guest,
																						false,
																					)}
																</strong>
															</p>
														)}

													{tournament.finished !== 1 && (
														<button
															className={`${styles.copyButton} ${getSizeTextStyle(size_text)}`}
															onClick={() => copyMatchId(match.uuid || "")}
															type="button"
															role="button"
															aria-label={t("tournaments.copyId")}
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
													)}
												</div>
											))}
										</div>
									</div>
								);
							})}
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
