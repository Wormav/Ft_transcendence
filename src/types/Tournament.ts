export type TournamentMatchData = {
	uuid: string;
	round: number;
};

export type Tournament = {
	uuid: string;
	host: string;
	players: string[];
	matchs: TournamentMatchData[];
	winner?: string;
	finished: 0 | 1;
};
