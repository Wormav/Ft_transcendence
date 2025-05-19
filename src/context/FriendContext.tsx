import { createContext, useState, useContext, useEffect } from "react";
import type { FriendContextType, FriendData } from "../types/FriendContextType";
import { customFetch } from "../utils/customFetch";
import { getJwtToken } from "../utils/getJwtToken";

const FriendContext = createContext<FriendContextType>({
	friendData: null,
	loading: false,
	error: null,
	fetchFriendData: async () => {},
	addFriend: async () => false,
});

export const FriendProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [friendData, setFriendData] = useState<FriendData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchFriendData = async () => {
		if (
			typeof window !== "undefined" &&
			window.location.pathname === "/login"
		) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = getJwtToken();

			if (!token) {
				setLoading(false);
				setError("Aucun jeton d'authentification trouvé.");
				return;
			}

			const response = await customFetch(`/api/user/friends`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(
					`Erreur lors de la récupération des amis: ${response.status}`,
				);
			}

			const data: FriendData = await response.json();
			setFriendData(data);
			console.log("Données d'amis récupérées:", data);
		} catch (err: any) {
			console.error("Erreur dans fetchFriendData:", err);
			setError(
				err.message ||
					"Une erreur s'est produite lors de la récupération des données d'amis",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchFriendData();
	}, []);

	const addFriend = async (uuid: string): Promise<boolean> => {
		setError(null);
		try {
			const token = getJwtToken();

			if (!token) {
				setError("Aucun jeton d'authentification trouvé.");
				return false;
			}

			const response = await customFetch(`/api/user/friends/${uuid}`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({}),
			});

			if (!response.ok) {
				throw new Error(`Erreur lors de l'ajout d'ami: ${response.status}`);
			}

			await fetchFriendData();
			return true;
		} catch (err: any) {
			console.error("Erreur dans addFriend:", err);
			setError(
				err.message || "Une erreur s'est produite lors de l'ajout d'ami",
			);
			return false;
		}
	};

	return (
		<FriendContext.Provider
			value={{
				friendData,
				loading,
				error,
				fetchFriendData,
				addFriend,
			}}
		>
			{children}
		</FriendContext.Provider>
	);
};

export const useFriendContext = () => useContext(FriendContext);
