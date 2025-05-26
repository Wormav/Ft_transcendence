import { createContext, useState, useContext, useEffect } from "react";
import { customFetch } from "../utils/customFetch";
import { getJwtToken } from "../utils/getJwtToken";
import { useUserContext } from "./UserContext";
import type {
	GameContextType,
	MatchData,
	CreateMatchParams,
	UpdateMatchParams,
} from "../types/GameContextType";

const GameContext = createContext<GameContextType>({
	matches: [],
	activeMatches: [],
	loading: false,
	error: null,
	fetchUserMatches: async () => {},
	createMatch: async () => null,
	updateMatch: async () => null,
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [matches, setMatches] = useState<MatchData[]>([]);
	const [activeMatches, setActiveMatches] = useState<MatchData[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { user } = useUserContext();

	const fetchUserMatches = async (uuid: string) => {
		setLoading(true);
		setError(null);

		try {
			const token = getJwtToken();

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/match/user/${uuid}`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			// Si la réponse est 404, on considère que c'est un cas normal (pas de matchs)
			if (response.status === 404) {
				setMatches([]);
				setActiveMatches([]);
				return;
			}

			if (!response.ok) {
				throw new Error(`Error retrieving matches data: ${response.status}`);
			}

			const allMatchesData = await response.json();
			const finishedMatches = allMatchesData.filter(
				(match: MatchData) => match.finished === 1,
			);
			const currentActiveMatches = allMatchesData.filter(
				(match: MatchData) => match.finished === 0,
			);

			setMatches(finishedMatches);
			setActiveMatches(currentActiveMatches);
		} catch (err: any) {
			// Ne pas afficher l'erreur dans la console si c'est un 404
			if (err.status !== 404) {
				console.error("Error in fetchUserMatches:", err);
				setError(
					err.message || "An error occurred while retrieving match data",
				);
			}
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

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/match`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(params),
				},
			);

			if (!response.ok) {
				throw new Error(`Error creating match: ${response.status}`);
			}

			const newMatch = await response.json();

			if (user?.uuid) {
				await fetchUserMatches(user.uuid);
			}

			return newMatch;
		} catch (err: any) {
			console.error("Error creating match:", err);
			setError(err.message || "An error occurred while creating the match");
			return null;
		} finally {
			setLoading(false);
		}
	};

	const updateMatch = async (
		matchUuid: string,
		params: UpdateMatchParams,
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

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/game/match/${matchUuid}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(params),
				},
			);

			if (!response.ok) {
				throw new Error(`Error updating match: ${response.status}`);
			}

			const updatedMatch = await response.json();

			if (user?.uuid) {
				await fetchUserMatches(user.uuid);
			}

			return updatedMatch;
		} catch (err: any) {
			console.error("Error updating match:", err);
			setError(err.message || "An error occurred while updating the match");
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
				activeMatches,
				loading,
				error,
				fetchUserMatches,
				createMatch,
				updateMatch,
			}}
		>
			{children}
		</GameContext.Provider>
	);
};

export const useGameContext = () => useContext(GameContext);
