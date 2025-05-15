import React, { useRef, useEffect } from 'react';
import { useTranslation } from '../../../context/TranslationContext';
import { useWindowSize } from '../../../hooks/useWindowSize';

// Type pour les données d'un match
type GameData = {
    id: string;
    player_id: string;
    date: number;
    score_player1: number;
    score_player2: number;
    gameIA: boolean;
};

type WinLossChartProps = {
    games: GameData[];
};

const WinLossChart: React.FC<WinLossChartProps> = ({ games }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { t } = useTranslation();
    const windowSize = useWindowSize();

    useEffect(() => {
        if (!canvasRef.current || games.length === 0) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fonction pour mettre à jour les dimensions du canvas
        const updateCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            return { dpr, rect };
        };

        // Mettre à jour les dimensions initiales
        const { dpr, rect } = updateCanvasSize();
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // Calculate wins and losses
        const wins = games.filter(game => game.score_player1 > game.score_player2).length;
        const losses = games.filter(game => game.score_player1 < game.score_player2).length;
        const total = games.length;

        // Split matches between AI and human players
        const iaGames = games.filter(game => game.gameIA);
        const iaWins = iaGames.filter(game => game.score_player1 > game.score_player2).length;
        const iaLosses = iaGames.filter(game => game.score_player1 < game.score_player2).length;

        const humanGames = games.filter(game => !game.gameIA);
        const humanWins = humanGames.filter(game => game.score_player1 > game.score_player2).length;
        const humanLosses = humanGames.filter(game => game.score_player1 < game.score_player2).length;

        // Clear the canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Define center and radius for pie chart
        const centerX = rect.width / 2;
        const centerY = rect.height / 2 - 30; // Move up to make space for statistics
        const radius = Math.min(centerX, centerY) * 0.65; // Slightly reduce chart size

        // Colors for the chart
        const colors = {
            wins: '#00BABC', // Turquoise for wins
            losses: '#FF4136', // Red for losses
            iaWins: '#00796B', // Dark green for AI wins
            iaLosses: '#C62828', // Dark red for AI losses
            humanWins: '#4CAF50', // Green for human wins
            humanLosses: '#F44336' // Red for human losses
        };

        // Dessiner le graphique principal (victoires/défaites)
        const drawPieSlice = (ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, startAngle: number, endAngle: number, color: string) => {
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            ctx.fillStyle = color;
            ctx.fill();
        };

        const winRatio = wins / total;
        const startAngle = 0;
        const winEndAngle = startAngle + (winRatio * 2 * Math.PI);
        const lossEndAngle = 2 * Math.PI;

        // Dessiner les tranches du graphique
        drawPieSlice(ctx, centerX, centerY, radius, startAngle, winEndAngle, colors.wins);
        drawPieSlice(ctx, centerX, centerY, radius, winEndAngle, lossEndAngle, colors.losses);

        // Ajouter un cercle blanc au centre pour créer un effet donut
        const innerRadius = radius * 0.6;
        ctx.beginPath();
        ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        // Ajouter le texte au centre pour le ratio de victoires/défaites
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`${Math.round(winRatio * 100)}%`, centerX, centerY - 10);
        ctx.font = '14px sans-serif';
        ctx.fillText(t('dashboard.wins'), centerX, centerY + 15);

        // Dessiner les statistiques détaillées en bas du graphique
        const statsY = centerY + radius + 30;
        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';

        // Stats globales
        ctx.fillStyle = '#000000';
        ctx.fillText(`${t('dashboard.total')}: ${total} ${t('dashboard.matches')}`, centerX, statsY);

        // Stats de victoires
        ctx.fillStyle = colors.wins;
        ctx.fillText(`${wins} ${t('dashboard.wins')}`, centerX - 80, statsY + 25);

        // Stats de défaites
        ctx.fillStyle = colors.losses;
        ctx.fillText(`${losses} ${t('dashboard.losses')}`, centerX + 80, statsY + 25);

        // Stats condensées sur une seule ligne avec moins d'espace
        ctx.fillStyle = '#000000';
        ctx.font = '12px sans-serif';
        ctx.fillText(`${t('dashboard.vsAI')}: ${iaWins}V/${iaLosses}D | ${t('dashboard.vsPlayers')}: ${humanWins}V/${humanLosses}D`, centerX, statsY + 45);

        // Légende
        const legendX1 = centerX - 100;
        const legendX2 = centerX + 10;
        const legendY = centerY - radius - 20;

        // Victoires
        ctx.beginPath();
        ctx.rect(legendX1, legendY, 12, 12);
        ctx.fillStyle = colors.wins;
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.textAlign = 'left';
        ctx.font = '12px sans-serif';
        ctx.fillText(t('dashboard.wins'), legendX1 + 18, legendY + 10);

        // Défaites
        ctx.beginPath();
        ctx.rect(legendX2, legendY, 12, 12);
        ctx.fillStyle = colors.losses;
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.fillText(t('dashboard.losses'), legendX2 + 18, legendY + 10);

    }, [games, t, windowSize]);

    return (
        <div className="w-full h-full relative">
            <canvas
                ref={canvasRef}
                className="w-full h-full block"
            />
        </div>
    );
};

export default WinLossChart;
