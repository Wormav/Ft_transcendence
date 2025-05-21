export type TournamentMatchData = {
	uuid: string;
	round: number;
};

export type Tournament = {
	uuid: string;
	host: string;
	players: string[];
	match: TournamentMatchData[]; // "match" au lieu de "matchs" pour correspondre à l'API
	winner?: string | null; // null possible selon les données de l'API
	finished: 0 | 1;
};
