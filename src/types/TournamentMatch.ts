export interface TournamentMatchSettings {
  matchId: string | null;
  isInTournament: boolean;
}

export interface TournamentMatchProps {
  isOpen: boolean;
  onClose: () => void;
  onStartMatch: (matchId: string) => void;
}
