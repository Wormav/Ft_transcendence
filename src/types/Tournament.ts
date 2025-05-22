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
	match: TournamentMatchData[];
	winner?: string | null;
	finished: 0 | 1;
};
