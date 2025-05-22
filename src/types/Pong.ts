export type GameField = {
	width: number;
	height: number;
	paddleXPos: number;
};

export type ScoreState = {
	player1: number;
	player2: number;
};

export type BallDirection = {
	x: number;
	y: number;
	z: number;
};

export type TouchControlsProps = {
	gameStarted: boolean;
	gamePaused: boolean;
	showMenu: boolean;
	onLeftUp: () => void;
	onLeftDown: () => void;
	onRightUp: () => void;
	onRightDown: () => void;
	onPauseClick: () => void;
};

export type ScoreOverlayProps = {
	gameStarted: boolean;
	showMenu: boolean;
	score: ScoreState;
	editViewMode: boolean;
	currentView: number;
	getViewName: (viewIdx: number) => string;
	playerNames?: { player1: string; player2: string };
};

export type PauseMenuProps = {
	gameStarted: boolean;
	gamePaused: boolean;
	showMenu: boolean;
	togglePause: () => void;
	changeView: () => void;
	backToMenu: () => void;
	quitGame: () => void;
	currentView: number;
	getViewName: (viewIdx: number) => string;
};

export type GameSettings = {
	plateauColor: "default" | "blue" | "red";
	paddleColor: "default" | "green" | "purple";
	ballSpeed: "normal" | "fast" | "turbo";
};

export type GameMenuProps = {
	showMenu: boolean;
	score: ScoreState;
	maxScore: number;
	startGame: () => void;
	quitGame: () => void;
	settings: GameSettings;
	onSettingsChange: (settings: GameSettings) => void;
	onStartTournamentMatch?: (matchId: string) => void;
};

export type CountdownProps = {
	countdown: number;
};

export type TournamentMatchSettings = {
	matchId: string | null;
	isInTournament: boolean;
};

export type GameData = {
	id: string;
	player_id: string;
	date: number;
	score_player1: number;
	score_player2: number;
	gameIA: boolean;
};

export type LineChartProps = {
	games: GameData[];
};

export type WinLossChartProps = {
	games: GameData[];
};
