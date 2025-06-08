import { createContext, useState, useContext, useEffect } from "react";
import { customFetch } from "../utils/customFetch";
import { getJwtToken } from "../utils/getJwtToken";
import { isDemoMode } from "../config/demo";
import { DEMO_USER } from "../utils/demoData";
import type { UserContextType, UserData } from "../types/UserContextType";

const UserContext = createContext<UserContextType>({
	user: null,
	loading: false,
	error: null,
	fetchUserData: async () => {},
	updateUsername: async () => false,
	updateEmail: async () => false,
	updateAvatar: async () => false,
	deleteAccount: async () => false,
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUserData = async () => {
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
			// En mode démo, utiliser directement l'utilisateur démo
			if (isDemoMode()) {
				setUser(DEMO_USER);
				setLoading(false);
				return;
			}

			const token = getJwtToken();

			if (!token) {
				setLoading(false);
				setError("No authentication token found. Redirecting...");
				if (
					typeof window !== "undefined" &&
					window.location.pathname !== "/login"
				) {
					window.location.href = "/login";
				}
				return;
			}

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/me`,
				{
					method: "GET",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				if (response.status !== 401) {
					throw new Error(`Error retrieving user data: ${response.status}`);
				}
				setLoading(false);
				return;
			}

			const userData = await response.json();

			const filteredUserData: UserData = {
				uuid: userData.uuid,
				email: userData.email,
				username: userData.username,
				avatar: userData.avatar,
				color_items: userData.color_items,
				color_bg: userData.color_bg,
				size_text: userData.size_text,
				speed_moves: userData.speed_moves,
				last_seen: userData.last_seen,
			};

			if (
				filteredUserData.avatar &&
				filteredUserData.avatar.startsWith("https://lh3.googleusercontent.com/")
			) {
				await updateAvatar("/default.png");
				filteredUserData.avatar = "/default.png";
			}

			setUser(filteredUserData);
		} catch (err: any) {
			console.error("Error in fetchUserData:", err);
			if (err.message === "Unauthorized") {
			} else if (
				err.message &&
				(err.message.includes("NetworkError") ||
					err.message.includes("Failed to fetch"))
			) {
				setError("Error connecting to server. Potential CORS issue.");
			} else {
				setError(err.message || "An error occurred while retrieving user data");
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	const updateUsername = async (username: string): Promise<boolean> => {
		try {
			// En mode démo, simuler la mise à jour
			if (isDemoMode()) {
				if (user) {
					setUser({ ...user, username });
				}
				return true;
			}

			const token = getJwtToken();

			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/update`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ username }),
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to update username: ${response.status}`);
			}

			await fetchUserData();
			return true;
		} catch (err: any) {
			console.error("Error updating username:", err);
			setError(err.message || "An error occurred while updating username");
			return false;
		}
	};

	const updateEmail = async (email: string): Promise<boolean> => {
		try {
			// En mode démo, simuler la mise à jour
			if (isDemoMode()) {
				if (user) {
					setUser({ ...user, email });
				}
				return true;
			}

			const token = getJwtToken();

			const response = await customFetch(
				"http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/update",
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email }),
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to update email: ${response.status}`);
			}

			await fetchUserData();
			return true;
		} catch (err: any) {
			console.error("Error updating email:", err);
			setError(err.message || "An error occurred while updating email");
			return false;
		}
	};

	const updateAvatar = async (avatar: string): Promise<boolean> => {
		try {
			// En mode démo, simuler la mise à jour
			if (isDemoMode()) {
				if (user) {
					const finalAvatar = avatar.startsWith(
						"https://lh3.googleusercontent.com/",
					)
						? "/default.png"
						: avatar;
					setUser({ ...user, avatar: finalAvatar });
				}
				return true;
			}

			const finalAvatar = avatar.startsWith(
				"https://lh3.googleusercontent.com/",
			)
				? "/default.png"
				: avatar;

			const token = getJwtToken();

			const response = await customFetch(
				"http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/update",
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ avatar: finalAvatar }),
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to update avatar: ${response.status}`);
			}

			await fetchUserData();
			return true;
		} catch (err: any) {
			console.error("Error updating avatar:", err);
			setError(err.message || "An error occurred while updating avatar");
			return false;
		}
	};

	const deleteAccount = async (): Promise<boolean> => {
		try {
			// En mode démo, simuler la suppression du compte
			if (isDemoMode()) {
				setUser(null);
				if (typeof window !== "undefined") {
					window.location.href = "/login";
				}
				return true;
			}

			const token = getJwtToken();

			const response = await customFetch(
				"http://localhost:${import.meta.env.VITE_BACKEND_PORT}/auth/account",
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
				throw new Error(`Failed to delete account: ${response.status}`);
			}

			if (typeof window !== "undefined") {
				window.location.href = "/login";
			}
			return true;
		} catch (err: any) {
			console.error("Error deleting account:", err);
			setError(err.message || "An error occurred while deleting the account");
			return false;
		}
	};

	return (
		<UserContext.Provider
			value={{
				user,
				loading,
				error,
				fetchUserData,
				updateAvatar,
				updateEmail,
				updateUsername,
				deleteAccount,
			}}
		>
			{children}
		</UserContext.Provider>
	);
};

export const useUserContext = () => useContext(UserContext);
