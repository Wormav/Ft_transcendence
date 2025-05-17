import { createContext, useState, useContext, useEffect } from 'react';
import type { UserContextType, UserData } from '../types/UserContextType';
import { customFetch } from '../utils/customFetch';
import { getJwtToken } from '../utils/getJwtToken';

const UserContext = createContext<UserContextType>({
	user: null,
	loading: false,
	error: null,
	fetchUserData: async () => {}
});



export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const fetchUserData = async () => {
		if (typeof window !== 'undefined' && window.location.pathname === '/login') {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = getJwtToken();

			if (!token) {
				setLoading(false);
				setError('No authentication token found. Redirecting...');
				if (typeof window !== 'undefined' && window.location.pathname !== '/login') {
					window.location.href = '/login';
				}
				return;
			}

			const response = await customFetch(`/api/user/me`, {
				method: 'GET',
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

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
				speed_moves: userData.speed_moves
			};

			setUser(filteredUserData);
			console.log('User data retrieved:', filteredUserData);
		} catch (err: any) {
			console.error('Error in fetchUserData:', err);
			if (err.message === 'Unauthorized') {
			} else if (err.message && (err.message.includes('NetworkError') || err.message.includes('Failed to fetch'))) {
				setError('Error connecting to server. Potential CORS issue.');
			} else {
				setError(err.message || 'An error occurred while retrieving user data');
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchUserData();
	}, []);

	return (
		<UserContext.Provider value={{ user, loading, error, fetchUserData }}>
			{children}
		</UserContext.Provider>
	);
};

export const useUser = () => useContext(UserContext);
