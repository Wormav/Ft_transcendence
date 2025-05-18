export type GameSpeedType = "normal" | "fast" | "turbo";

export type SettingsContextType = {
	color_items: string;
	color_bg: string;
	size_text: number;
	speed_moves: GameSpeedType;
	setColorItems: (color: string) => void;
	setColorBg: (color: string) => void;
	setSizeText: (size: number) => void;
	setSpeedMoves: (speed: GameSpeedType) => void;
};
