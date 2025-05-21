export type TournamentMatchData = {
	uuid: string;
	round: number;
	player1?: string;
	player2?: string;
	winner?: string;
	finished?: 0 | 1;
};

export type Tournament = {
	uuid: string;
	host: string;
	players: string[];
	match: TournamentMatchData[]; // "match" au lieu de "matchs" pour correspondre à l'API
	winner?: string | null; // null possible selon les données de l'API
	finished: 0 | 1;
};
