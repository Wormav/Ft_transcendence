import { createContext, useState, useContext } from 'react';
import type { SettingsContextType } from '../types/SettingsTypes';

const SettingsContext = createContext<SettingsContextType>({
	color_items: '#3498db',
	color_bg: '#f5f5f5',
	size_text: 25,
	speed_moves: 5,
	setColorItems: () => {},
	setColorBg: () => {},
	setSizeText: () => {},
	setSpeedMoves: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [color_items, setColorItems] = useState<string>('#3498db');
	const [color_bg, setColorBg] = useState<string>('#f5f5f5');
	const [size_text, setSizeText] = useState<number>(25);
	const [speed_moves, setSpeedMoves] = useState<number>(5);

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
