import React, { createContext, useState, useContext, useCallback } from "react";
import { getJwtToken } from "../utils/getJwtToken";
import { customFetch } from "../utils/customFetch";
import type { Tournament } from "../types/Tournament";
import {
	type TournamentContextType,
	type TournamentProviderProps,
} from "../types/TournamentContextType";

const TournamentContext = createContext<TournamentContextType | undefined>(
	undefined,
);

export const useTournament = (): TournamentContextType => {
	const context = useContext(TournamentContext);
	if (context === undefined) {
		throw new Error("useTournament must be used within a TournamentProvider");
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

				const response = await customFetch(
					`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/tournament/user/${uuid}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (response.ok) {
					const data = await response.json();
					setTournaments(data);
				} else if (response.status === 404) {
					setTournaments([]);
				} else {
					throw new Error("Error retrieving tournaments");
				}
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
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

				if (![4].includes(players.length)) {
					throw new Error("Number of players must be 4");
				}

				const token = getJwtToken();

				const tournamentData = {
					host: hostUuid,
					players: players,
				};

				const response = await customFetch(
					`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/tournament`,
					{
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
						body: JSON.stringify(tournamentData),
					},
				);

				if (!response.ok) {
					throw new Error("Error while creating tournament");
				}

				const newTournament = await response.json();

				setTournaments((prevTournaments) => [
					newTournament,
					...prevTournaments,
				]);

				await fetchUserTournaments(hostUuid);
			} catch (err) {
				setError(err instanceof Error ? err.message : "An error occurred");
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

				const response = await customFetch(
					`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/tournament/${id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${token}`,
						},
					},
				);

				if (!response.ok) {
					throw new Error("Error retrieving tournament");
				}

				const tournamentData = await response.json();
				return tournamentData;
			} catch (err) {
				throw new Error(
					err instanceof Error
						? err.message
						: "An error occurred while retrieving the tournament",
				);
			}
		},
		[],
	);

	const getMatchById = useCallback(async (id: string) => {
		try {
			const token = getJwtToken();

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/match/${id}`,
				{
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
				},
			);

			if (!response.ok) {
				throw new Error("Error retrieving match");
			}

			return await response.json();
		} catch (err) {
			throw new Error(
				err instanceof Error
					? err.message
					: "An error occurred while retrieving the match",
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
					throw new Error("No data provided for update");
				}

				const response = await customFetch(
					`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/tournament/${tournamentId}`,
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
					throw new Error("Error while updating tournament");
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
						: "An error occurred while updating the tournament",
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
