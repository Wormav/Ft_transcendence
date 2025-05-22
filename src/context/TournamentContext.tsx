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
		async (hostUuid: string, guestPlayers: string[]): Promise<void> => {
			setLoading(true);
			setError(null);

			try {
				const players = [hostUuid, ...guestPlayers];

				if (![4, 8].includes(players.length)) {
					throw new Error(
						"Le nombre de joueurs doit être de 4 ou 8 (en comptant l'hôte)",
					);
				}

				const token = getJwtToken();
				if (!token) {
					throw new Error("Utilisateur non authentifié");
				}

				const tournamentData = {
					host: hostUuid,
					players: players,
				};

				const response = await customFetch("/api/game/tournament", {
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

				const newTournament = await response.json();

				setTournaments((prevTournaments) => [
					newTournament,
					...prevTournaments,
				]);

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

	const updateTournament = useCallback(
		async (
			tournamentId: string,
			data: { winner?: string | null; finished?: 0 | 1 },
		): Promise<Tournament> => {
			try {
				const token = getJwtToken();

				if (Object.keys(data).length === 0) {
					throw new Error("Aucune donnée fournie pour la mise à jour");
				}

				const response = await customFetch(
					`/api/game/tournament/${tournamentId}`,
					{
						method: "PUT",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(data),
					},
				);

				if (!response.ok) {
					throw new Error("Erreur lors de la mise à jour du tournoi");
				}

				const updatedTournament = await response.json();

				setTournaments((prevTournaments) =>
					prevTournaments.map((tournament) =>
						tournament.uuid === tournamentId ? updatedTournament : tournament,
					),
				);

				return updatedTournament;
			} catch (err) {
				setError(
					err instanceof Error
						? err.message
						: "Une erreur est survenue lors de la mise à jour du tournoi",
				);
				throw err;
			}
		},
		[],
	);

	const value: TournamentContextType = {
		tournaments,
		loading,
		error,
		fetchUserTournaments,
		createTournament,
		getTournamentById,
		getMatchById,
		updateTournament,
	};

	return (
		<TournamentContext.Provider value={value}>
			{children}
		</TournamentContext.Provider>
	);
};
