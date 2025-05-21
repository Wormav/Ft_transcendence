import React, { createContext, useState, useContext } from "react";
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

	const fetchUserTournaments = async (uuid: string): Promise<void> => {
		setLoading(true);
		setError(null);

		try {
			const token = getJwtToken();

			if (!token) {
				throw new Error("Utilisateur non authentifié");
			}

			const response = await customFetch(`/api/game/tournament/user/${uuid}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
			});

			if (!response.ok) {
				throw new Error("Erreur lors de la récupération des tournois");
			}

			const data = await response.json();
			setTournaments(data);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Une erreur est survenue");
		} finally {
			setLoading(false);
		}
	};

	const value: TournamentContextType = {
		tournaments,
		loading,
		error,
		fetchUserTournaments,
	};

	return (
		<TournamentContext.Provider value={value}>
			{children}
		</TournamentContext.Provider>
	);
};
