import { createContext, useState, useContext, useEffect } from "react";
import { useUserContext } from "./UserContext";
import { customFetch } from "../utils/customFetch";
import { getJwtToken } from "../utils/getJwtToken";
import type {
	SettingsContextType,
	GameSpeedType,
} from "../types/SettingsTypes";

const SettingsContext = createContext<SettingsContextType>({
	color_items: "#3498db",
	color_bg: "#1a1a1a",
	size_text: 18,
	speed_moves: "normal",
	setColorItems: () => {},
	setColorBg: () => {},
	setSizeText: () => {},
	setSpeedMoves: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const { user } = useUserContext();

	const [color_items, setColorItemsState] = useState<string>("#3498db");
	const [color_bg, setColorBgState] = useState<string>("#1a1a1a");
	const [size_text, setSizeTextState] = useState<number>(18);
	const [speed_moves, setSpeedMovesState] = useState<GameSpeedType>("normal");

	useEffect(() => {
		if (user) {
			if (user.color_items) setColorItems(user.color_items);
			if (user.color_bg) setColorBg(user.color_bg);
			if (user.size_text) setSizeText(user.size_text);
			if (user.speed_moves) setSpeedMoves(user.speed_moves as GameSpeedType);
		}
	}, [user]);

	const updateSettings = async (
		options: Partial<{
			color_items: string;
			color_bg: string;
			size_text: number;
			speed_moves: GameSpeedType;
		}>,
	) => {
		try {
			const token = getJwtToken();
			const response = await customFetch(
				`http://localhost:${import.meta.env.VITE_BACKEND_PORT}/user/options`,
				{
					method: "PUT",
					headers: {
						Authorization: `Bearer ${token}`,
						"Content-Type": "application/json",
					},
					body: JSON.stringify(options),
					credentials: "include",
				},
			);
			if (!response.ok) {
				throw new Error("Fail update settings user");
			}
		} catch (error) {
			console.error("Fail update settings user:", error);
		}
	};

	const setColorItems = (value: string) => {
		setColorItemsState(value);
		updateSettings({ color_items: value });
	};

	const setColorBg = (value: string) => {
		setColorBgState(value);
		updateSettings({ color_bg: value });
	};

	const setSizeText = (value: number) => {
		setSizeTextState(value);
		updateSettings({ size_text: value });
	};

	const setSpeedMoves = (value: GameSpeedType) => {
		setSpeedMovesState(value);
		updateSettings({ speed_moves: value });
	};

	return (
		<SettingsContext.Provider
			value={{
				color_items,
				color_bg,
				size_text,
				speed_moves,
				setColorItems,
				setColorBg,
				setSizeText,
				setSpeedMoves,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
};

export const useSettings = () => useContext(SettingsContext);
