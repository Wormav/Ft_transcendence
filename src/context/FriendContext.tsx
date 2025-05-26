import { createContext, useState, useContext, useEffect } from "react";
import { customFetch } from "../utils/customFetch";
import { getJwtToken } from "../utils/getJwtToken";
import type { FriendContextType, FriendData } from "../types/FriendContextType";

const FriendContext = createContext<FriendContextType>({
	friendData: null,
	loading: false,
	error: null,
	fetchFriendData: async () => {},
	addFriend: async () => false,
	acceptFriendRequest: async () => false,
	declineFriendRequest: async () => false,
	removeFriend: async () => false,
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

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/friends`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error(`Error while retrieving friends: ${response.status}`);
			}

			const data: FriendData = await response.json();
			setFriendData(data);
		} catch (err: any) {
			console.error("Erreur in fetchFriendData:", err);
			setError(err.message || "An error occurred while fetching friend data");
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

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/friends/${uuid}`,
				{
					method: "POST",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
				},
			);

			if (!response.ok) {
				throw new Error(`Error while adding friend: ${response.status}`);
			}

			await fetchFriendData();
			return true;
		} catch (err: any) {
			console.error("Erreur in addFriend:", err);
			setError(err.message || "An error occurred while adding friend");
			return false;
		}
	};

	const acceptFriendRequest = async (uuid: string): Promise<boolean> => {
		setError(null);
		try {
			const token = getJwtToken();

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/friends/${uuid}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ action: "accept" }),
				},
			);

			if (!response.ok) {
				throw new Error(
					`Erreur lors de l'acceptation de la demande d'ami: ${response.status}`,
				);
			}

			await fetchFriendData();
			return true;
		} catch (err: any) {
			console.error("Erreur in acceptFriendRequest:", err);
			setError(
				err.message || "An error occurred while accepting the friend request",
			);
			return false;
		}
	};

	const declineFriendRequest = async (uuid: string): Promise<boolean> => {
		setError(null);
		try {
			const token = getJwtToken();

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/friends/${uuid}`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ action: "decline" }),
				},
			);

			if (!response.ok) {
				throw new Error(
					`Error while declining friend request: ${response.status}`,
				);
			}

			await fetchFriendData();
			return true;
		} catch (err: any) {
			console.error("Erreur in declineFriendRequest:", err);
			setError(
				err.message || "An error occurred while declining the friend request",
			);
			return false;
		}
	};

	const removeFriend = async (uuid: string): Promise<boolean> => {
		setError(null);
		try {
			const token = getJwtToken();

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/friends/${uuid}`,
				{
					method: "DELETE",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({}),
				},
			);

			if (!response.ok) {
				throw new Error(`Error while removing friend: ${response.status}`);
			}

			await fetchFriendData();
			return true;
		} catch (err: any) {
			console.error("Erreur in removeFriend:", err);
			setError(
				err.message || "Une erreur s'est produite lors de la suppression d'ami",
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
				acceptFriendRequest,
				declineFriendRequest,
				removeFriend,
			}}
		>
			{children}
		</FriendContext.Provider>
	);
};

export const useFriendContext = () => useContext(FriendContext);
