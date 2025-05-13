export interface SettingsContextType {
	color_items: string;
	color_bg: string;
	size_text: number;
	speed_moves: number;
	setColorItems: (color: string) => void;
	setColorBg: (color: string) => void;
	setSizeText: (size: number) => void;
	setSpeedMoves: (speed: number) => void;
}
