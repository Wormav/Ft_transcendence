export interface TournamentMatchSettings {
	matchId: string | null;
	isInTournament: boolean;
}

export interface TournamentMatchProps {
	isOpen: boolean;
	onClose: () => void;
	onStartMatch: (matchId: string) => void;
}

export type MatchDetail = {
	uuid: string;
	player: string | null;
	guest: string | null;
	guest2: string | null;
	tournament: string;
	score1: number;
	score2: number;
	finished: 0 | 1;
	starttime: string | null;
	endtime: string | null;
};
