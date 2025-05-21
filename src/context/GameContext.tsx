import { createContext, useState, useContext, useEffect } from "react";
import type {
	GameContextType,
	MatchData,
	CreateMatchParams,
} from "../types/GameContextType";
import { customFetch } from "../utils/customFetch";
import { getJwtToken } from "../utils/getJwtToken";
import { useUserContext } from "./UserContext";

const GameContext = createContext<GameContextType>({
	matches: [],
	loading: false,
	error: null,
	fetchUserMatches: async () => {},
	createMatch: async () => null,
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
		} catch (err: any) {
			if (err.status !== 404) {
				console.error("Error in fetchUserMatches:", err);
			}
			setError(
				err.message ||
					"Une erreur est survenue lors de la récupération des données de match",
			);
		} finally {
			setLoading(false);
		}
	};

	const createMatch = async (
		params: CreateMatchParams,
	): Promise<MatchData | null> => {
		setLoading(true);
		setError(null);

		try {
			const token = getJwtToken();

			if (!token) {
				setLoading(false);
				setError("No authentication token found");
				return null;
			}

			const response = await customFetch(`/api/game/match`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify(params),
			});

			if (!response.ok) {
				throw new Error(`Error creating match: ${response.status}`);
			}

			const newMatch = await response.json();
			console.log("Match created:", newMatch);

			// Refresh matches list if user exists
			if (user?.uuid) {
				await fetchUserMatches(user.uuid);
			}

			return newMatch;
		} catch (err: any) {
			console.error("Error creating match:", err);
			setError(
				err.message || "Une erreur est survenue lors de la création du match",
			);
			return null;
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
				createMatch,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
