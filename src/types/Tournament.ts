export type Player = {
    id: string;
    name: string;
    isGuest: boolean;
};

export type Match = {
    id: string;
    player1: Player;
    player2: Player;
    winner?: Player | null;
    round: number;
};

export type Tournament = {
    id: string;
    players: Player[];
    matches: Match[];
    maxPlayers: 4 | 6 | 8;
    status: 'pending' | 'in_progress' | 'completed';
};
