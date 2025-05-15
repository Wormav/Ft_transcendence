import React, { useState, useEffect } from 'react';
import Card from '../../components/Card/Card';
import globalStyle from '../../globalStyle';
import { useTranslation } from '../../context/TranslationContext';
import { useWindowSize } from '../../hooks/useWindowSize';
import LineChart from './components/LineChart';
import WinLossChart from './components/WinLossChart';

type GameData = {
    id: string;
    player_id: string;
    date: number;
    score_player1: number;
    score_player2: number;
    gameIA: boolean;
};

const mockGames: GameData[] = [
    { id: '1', player_id: 'user1', date: Date.now() - 6 * 24 * 60 * 60 * 1000, score_player1: 5, score_player2: 3, gameIA: false },
    { id: '2', player_id: 'user1', date: Date.now() - 5 * 24 * 60 * 60 * 1000, score_player1: 2, score_player2: 5, gameIA: true },
    { id: '3', player_id: 'user1', date: Date.now() - 4 * 24 * 60 * 60 * 1000, score_player1: 5, score_player2: 0, gameIA: false },
    { id: '4', player_id: 'user1', date: Date.now() - 3 * 24 * 60 * 60 * 1000, score_player1: 5, score_player2: 4, gameIA: true },
    { id: '5', player_id: 'user1', date: Date.now() - 2 * 24 * 60 * 60 * 1000, score_player1: 3, score_player2: 5, gameIA: false },
    { id: '6', player_id: 'user1', date: Date.now() - 1 * 24 * 60 * 60 * 1000, score_player1: 5, score_player2: 2, gameIA: true },
    { id: '7', player_id: 'user1', date: Date.now(), score_player1: 4, score_player2: 5, gameIA: false },
];

const Dashboard: React.FC = () => {
    const { t } = useTranslation();
    const windowSize = useWindowSize();
    const [games, setGames] = useState<GameData[]>(mockGames);
    const [, setRender] = useState(0);

    // In the future, this effect would load data from an API
    useEffect(() => {
        // Simulating data loading
        // In a real application, you would make an API call here
        const loadData = async () => {
            try {
                // Example of a mock API call
                // const response = await fetch('/api/games');
                // const data = await response.json();
                // setGames(data);

                // For now, using mock data
                setGames(mockGames);
            } catch (error) {
                console.error('Error loading data:', error);
            }
        };

        loadData();
    }, []);

    // Force re-render when window size changes
    useEffect(() => {
        setRender(prev => prev + 1);
    }, [windowSize]);

    return (
            <div className={globalStyle.cardContainer}>
                <Card>
                    <div className={globalStyle.row}>
                        <span className={globalStyle.span}>{t('dashboard.scoreEvolution')}</span>
                    </div>
                    <div className={globalStyle.separator}></div>
                    <div className="w-full h-[300px]">
                        <LineChart games={games} />
                    </div>
                </Card>
                <Card>
                    <div className={globalStyle.row}>
                        <span className={globalStyle.span}>{t('dashboard.winLossRatio')}</span>
                    </div>
                    <div className={globalStyle.separator}></div>
                    <div className="w-full h-[300px]">
                        <WinLossChart games={games} />
                    </div>
                </Card>
            </div>
    );
};

export default Dashboard;
