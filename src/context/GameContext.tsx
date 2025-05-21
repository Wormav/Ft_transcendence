import { createContext, useState, useContext, useEffect } from "react";
import type { GameContextType, MatchData } from "../types/GameContextType";
import { customFetch } from "../utils/customFetch";
import { getJwtToken } from "../utils/getJwtToken";
import { useUserContext } from "./UserContext";

const GameContext = createContext<GameContextType>({
	matches: [],
	loading: false,
	error: null,
	fetchUserMatches: async () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [matches, setMatches] = useState<MatchData[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useUserContext();

	const fetchUserMatches = async (uuid: string) => {
		setLoading(true);
		setError(null);

		try {
			const token = getJwtToken();

			if (!token) {
				setLoading(false);
				setError("No authentication token found");
				return;
			}

			const response = await customFetch(`/api/game/match/user/${uuid}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`Error retrieving matches data: ${response.status}`);
			}

			const matchesData = await response.json();
			setMatches(matchesData);

			// Console log des données comme demandé
			console.log("Matches data:", matchesData);
		} catch (err: any) {
			console.error("Error in fetchUserMatches:", err);
			setError(
				err.message ||
					"Une erreur est survenue lors de la récupération des données de match",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user?.uuid) {
			fetchUserMatches(user.uuid);
		}
	}, [user]);

	return (
		<GameContext.Provider
			value={{
				matches,
				loading,
				error,
				fetchUserMatches,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
