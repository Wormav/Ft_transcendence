import React, { createContext, useState, useContext, useCallback } from "react";
import {
	type TournamentContextType,
	type TournamentProviderProps,
} from "../types/TournamentContextType";
import type { Tournament } from "../types/Tournament";
import { getJwtToken } from "../utils/getJwtToken";
import { customFetch } from "../utils/customFetch";

const TournamentContext = createContext<TournamentContextType | undefined>(
	undefined,
);

export const useTournament = (): TournamentContextType => {
	const context = useContext(TournamentContext);
	if (context === undefined) {
		throw new Error(
			"useTournament doit être utilisé à l'intérieur d'un TournamentProvider",
		);
	}
	return context;
};

export const TournamentProvider: React.FC<TournamentProviderProps> = ({
	children,
}) => {
	const [tournaments, setTournaments] = useState<Tournament[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchUserTournaments = useCallback(
		async (uuid: string): Promise<void> => {
			setLoading(true);
			setError(null);

			try {
				const token = getJwtToken();

				if (!token) {
					throw new Error("Utilisateur non authentifié");
				}

				const response = await customFetch(
					`/api/game/tournament/user/${uuid}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (!response.ok) {
					throw new Error("Erreur lors de la récupération des tournois");
				}

				const data = await response.json();
				console.log("Tournaments data:", data);
				setTournaments(data);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Une erreur est survenue",
				);
			} finally {
				setLoading(false);
			}
		},
		[],
	);

	const createTournament = useCallback(
		async (hostUuid: string, players: string[]): Promise<void> => {
			setLoading(true);
			setError(null);

			try {
				const totalPlayers = players.length + 1;
				if (![4, 6, 8].includes(totalPlayers)) {
					throw new Error(
						"Le nombre de joueurs doit être de 4, 6 ou 8 (en comptant l'hôte)",
					);
				}

				const token = getJwtToken();
				if (!token) {
					throw new Error("Utilisateur non authentifié");
				}

				const tournamentData = {
					host: hostUuid,
					players: [hostUuid, ...players],
				};

				console.log("Creating tournament with data:", tournamentData);

				const response = await customFetch("/api/game/tournament/", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify(tournamentData),
				});

				if (!response.ok) {
					throw new Error("Erreur lors de la création du tournoi");
				}

				await fetchUserTournaments(hostUuid);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Une erreur est survenue",
				);
			} finally {
				setLoading(false);
			}
		},
		[fetchUserTournaments],
	);

	const getTournamentById = useCallback(
		async (id: string): Promise<Tournament> => {
			try {
				const token = getJwtToken();

				if (!token) {
					throw new Error("Utilisateur non authentifié");
				}

				const response = await customFetch(`/api/game/tournament/${id}`, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				});

				if (!response.ok) {
					throw new Error("Erreur lors de la récupération du tournoi");
				}

				const tournamentData = await response.json();
				return tournamentData;
			} catch (err) {
				throw new Error(
					err instanceof Error
						? err.message
						: "Une erreur est survenue lors de la récupération du tournoi",
				);
			}
		},
		[],
	);

	const getMatchById = useCallback(async (id: string) => {
		try {
			const token = getJwtToken();

			if (!token) {
				throw new Error("Utilisateur non authentifié");
			}

			const response = await customFetch(`/api/game/match/${id}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Erreur lors de la récupération du match");
			}

			return await response.json();
		} catch (err) {
			throw new Error(
				err instanceof Error
					? err.message
					: "Une erreur est survenue lors de la récupération du match",
			);
		}
	}, []);

	const value: TournamentContextType = {
		tournaments,
		loading,
		error,
		fetchUserTournaments,
		createTournament,
		getTournamentById,
		getMatchById,
	};

	return (
		<TournamentContext.Provider value={value}>
			{children}
		</TournamentContext.Provider>
	);
};
