import type { ReactNode } from "react";
import type { Tournament } from "./Tournament";

export interface TournamentContextType {
	tournaments: Tournament[];
	loading: boolean;
	error: string | null;
	fetchUserTournaments: (uuid: string) => Promise<void>;
	createTournament: (hostUuid: string, players: string[]) => Promise<void>;
	getTournamentById: (id: string) => Promise<Tournament>;
	getMatchById: (id: string) => Promise<any>;
}

export type TournamentProviderProps = {
	children: ReactNode;
};
