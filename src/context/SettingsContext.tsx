import { createContext, useState, useContext } from 'react';
import type { SettingsContextType, GameSpeedType } from '../types/SettingsTypes';

const SettingsContext = createContext<SettingsContextType>({
	color_items: '#3498db',
	color_bg: '#1a1a1a',
	size_text: 18,
	speed_moves: 'normal',
	setColorItems: () => {},
	setColorBg: () => {},
	setSizeText: () => {},
	setSpeedMoves: () => {},
});

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [color_items, setColorItems] = useState<string>('#3498db');
	const [color_bg, setColorBg] = useState<string>('#1a1a1a');
	const [size_text, setSizeText] = useState<number>(18);
	const [speed_moves, setSpeedMoves] = useState<GameSpeedType>('normal');

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
