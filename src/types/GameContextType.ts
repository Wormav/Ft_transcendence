export type MatchData = {
	uuid: string;
	player: string;
	guest: string | null;
	guest2: string | null;
	tournament: string | null;
	score1: number;
	score2: number;
	finished: number;
	starttime: string | null;
	endtime: string | null;
};

export type CreateMatchParams = {
	player?: string;
	guest?: string;
	guest2?: string;
};

export type UpdateMatchParams = {
	score1?: number;
	score2?: number;
	finished?: number;
	starttime?: string | null;
	endtime?: string | null;
};

export type GameContextType = {
	matches: MatchData[];
	activeMatches: MatchData[];
	loading: boolean;
	error: string | null;
	fetchUserMatches: (uuid: string) => Promise<void>;
	createMatch: (params: CreateMatchParams) => Promise<MatchData | null>;
	updateMatch: (
		matchUuid: string,
		params: UpdateMatchParams,
	) => Promise<MatchData | null>;
};
