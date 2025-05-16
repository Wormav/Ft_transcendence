import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from './TournamentsStyle';
import type { Match, Player, Tournament } from '../../types/Tournament';


const Tournaments: React.FC = () => {
    const [maxPlayers, setMaxPlayers] = useState<4 | 6 | 8>(4);
    const [players, setPlayers] = useState<Player[]>([
        { id: uuidv4(), name: 'pseudo', isGuest: false }
    ]);
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [error, setError] = useState<string>('');

    const handleAddPlayer = (index: number, name: string) => {
        // Toujours mettre à jour le joueur avec le nouveau nom
        const newPlayers = [...players];
        if (index < newPlayers.length) {
            newPlayers[index] = { id: players[index]?.id || uuidv4(), name, isGuest: true };
        } else {
            newPlayers.push({ id: uuidv4(), name, isGuest: true });
        }
        setPlayers(newPlayers);

        // Vérifier les doublons uniquement si le champ n'est pas vide
        const trimmedName = name.trim();
        if (trimmedName !== '') {
            const playerNames = newPlayers
                .filter(p => p.name.trim() !== '')
                .map(p => p.name.toLowerCase());
            const uniqueNames = new Set(playerNames);

            if (uniqueNames.size !== playerNames.length) {
                setError('Ce nom est déjà utilisé par un autre joueur');
            } else {
                setError('');
            }
        } else {
            setError('');
        }
    };

    const shuffleArray = <T,>(array: T[]): T[] => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    const generateMatches = (tournamentPlayers: Player[]): Match[] => {
        const shuffledPlayers = shuffleArray(tournamentPlayers);
        const matches: Match[] = [];
        const totalRounds = Math.ceil(Math.log2(maxPlayers));

        // Premier tour : création des matchs initiaux
        let remainingPlayers = [...shuffledPlayers];
        const firstRoundMatches = Math.ceil(shuffledPlayers.length / 2);

        for (let i = 0; i < firstRoundMatches; i++) {
            const player1 = remainingPlayers[i * 2];
            const player2 = remainingPlayers[i * 2 + 1];

            const match: Match = {
                id: uuidv4(),
                player1,
                player2: player2 || { id: uuidv4(), name: 'No player', isGuest: true },
                round: 1,
                winner: player2 ? null : player1  // Si pas de player2, player1 gagne automatiquement
            };
            matches.push(match);

            if (!player2) {
                remainingPlayers.push(player1); // Le joueur qui gagne par forfait avance au prochain tour
            }
        }

        // Tours suivants : nombres de matchs divisés par 2 à chaque tour
        for (let round = 2; round <= totalRounds; round++) {
            const matchesInRound = firstRoundMatches / Math.pow(2, round - 1);

            for (let i = 0; i < matchesInRound; i++) {
                matches.push({
                    id: uuidv4(),
                    player1: { id: uuidv4(), name: '?', isGuest: true },
                    player2: { id: uuidv4(), name: '?', isGuest: true },
                    round,
                    winner: null
                });
            }
        }

        return matches;
    };

    const getMinPlayers = (max: number) => max - 1;    const createTournament = () => {
        const filledPlayers = players.filter(p => p.name.trim() !== '');
        const minPlayers = getMinPlayers(maxPlayers);

        if (filledPlayers.length < minPlayers) {
            setError(`Il faut au moins ${minPlayers} joueurs pour un tournoi de ${maxPlayers} joueurs`);
            return;
        }

        // Vérifier les doublons une dernière fois
        const playerNames = filledPlayers.map(p => p.name.toLowerCase());
        const uniqueNames = new Set(playerNames);
        if (uniqueNames.size !== playerNames.length) {
            setError('Impossible de créer le tournoi : certains joueurs ont le même nom');
            return;
        }

        const newTournament: Tournament = {
            id: uuidv4(),
            players: filledPlayers,
            matches: generateMatches(filledPlayers),
            maxPlayers,
            status: 'pending'
        };

        setTournament(newTournament);
        setError('');
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Créer un tournoi</h1>

            <div className={styles.form}>
                <select
                    className={styles.select}
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value) as 4 | 6 | 8)}
                >
                    <option value={4}>4 joueurs</option>
                    <option value={6}>6 joueurs</option>
                    <option value={8}>8 joueurs</option>
                </select>

                {Array.from({ length: maxPlayers - 1 }).map((_, index) => (
                    <input
                        key={index}
                        type="text"
                        className={styles.playerInput}
                        placeholder={`Nom du joueur ${index + 2}`}
                        onChange={(e) => handleAddPlayer(index + 1, e.target.value)}
                        value={players[index + 1]?.name || ''}
                    />
                ))}

                {error && <p className={styles.error}>{error}</p>}

                <button
                    className={players.filter(p => p.name.trim() !== '').length < getMinPlayers(maxPlayers) ? styles.buttonDisabled : styles.button}
                    onClick={createTournament}
                    disabled={players.filter(p => p.name.trim() !== '').length < getMinPlayers(maxPlayers)}
                >
                    Créer le tournoi
                </button>
            </div>

            {tournament && (
                <div className={styles.tournament.container}>
                    <h2 className={styles.tournament.roundTitle}>
                        Arbre du tournoi
                    </h2>
                    <div className={styles.tournament.bracket}>
                        {Array.from({ length: Math.ceil(Math.log2(maxPlayers)) }).map((_, roundIndex) => {
                            const roundNumber = roundIndex + 1;
                            const roundMatches = tournament.matches.filter(match => match.round === roundNumber);

                            return (
                                <div key={roundNumber} className={styles.tournament.round}>
                                    {roundMatches.map((match) => (
                                        <div key={match.id} className={styles.tournament.match}>
                                            <div className={`${styles.tournament.player} ${match.winner?.id === match.player1.id ? styles.tournament.winner : ''}`}>
                                                {match.player1.name}
                                            </div>
                                            <div className={`${styles.tournament.player} ${match.winner?.id === match.player2.id ? styles.tournament.winner : ''}`}>
                                                {match.player2.name}
                                            </div>
                                            <div className={styles.tournament.matchId}>
                                                <span>ID: {match.id.slice(0, 8)}...</span>
                                                <button
                                                    className={styles.tournament.copyButton}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(match.id);
                                                    }}
                                                    title="Copier l'ID"
                                                >
                                                    📋
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Tournaments;
