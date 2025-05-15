import React, { useRef, useEffect } from 'react';
import { useTranslation } from '../../../context/TranslationContext';
import { useWindowSize } from '../../../hooks/useWindowSize';

// Type for match data
type GameData = {
    id: string;
    player_id: string;
    date: number;
    score_player1: number;
    score_player2: number;
    gameIA: boolean;
};

type LineChartProps = {
    games: GameData[];
};

const LineChart: React.FC<LineChartProps> = ({ games }) => {
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
        ctx.scale(dpr, dpr);
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        // Sort games by date
        const sortedGames = [...games].sort((a, b) => a.date - b.date);

        // Determine min/max values for scale
        const maxScore = Math.max(...sortedGames.map(g => Math.max(g.score_player1, g.score_player2)));

        // Define margins
        const margin = { top: 30, right: 30, bottom: 50, left: 50 };
        const width = rect.width - margin.left - margin.right;
        const height = rect.height - margin.top - margin.bottom;

        // Clear canvas
        ctx.clearRect(0, 0, rect.width, rect.height);

        // Function to convert coordinates
        const xScale = (i: number) => margin.left + (width * i) / (sortedGames.length - 1 || 1);
        const yScale = (value: number) => height + margin.top - (height * value) / maxScore;

        // Dessiner les axes
        ctx.beginPath();
        ctx.moveTo(margin.left, margin.top);
        ctx.lineTo(margin.left, height + margin.top);
        ctx.lineTo(width + margin.left, height + margin.top);
        ctx.strokeStyle = '#9CA3AF';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Dessiner la grille horizontale
        const yTickCount = 5;
        for (let i = 0; i <= yTickCount; i++) {
            const y = margin.top + height * (i / yTickCount);
            ctx.beginPath();
            ctx.moveTo(margin.left, y);
            ctx.lineTo(width + margin.left, y);
            ctx.strokeStyle = '#E5E7EB';
            ctx.lineWidth = 0.5;
            ctx.stroke();

            // Ajouter les étiquettes de l'axe Y
            const label = Math.round((maxScore * (yTickCount - i)) / yTickCount);
            ctx.fillStyle = '#6B7280';
            ctx.font = '12px sans-serif';
            ctx.textAlign = 'right';
            ctx.fillText(label.toString(), margin.left - 10, y + 4);
        }

        // Dessiner les étiquettes de l'axe X (dates)
        sortedGames.forEach((game, i) => {
            if (i % Math.max(1, Math.floor(sortedGames.length / 7)) === 0) {
                const x = xScale(i);
                const date = new Date(game.date);
                const label = `${date.getDate()}/${date.getMonth() + 1}`;

                ctx.fillStyle = '#6B7280';
                ctx.font = '12px sans-serif';
                ctx.textAlign = 'center';
                ctx.fillText(label, x, height + margin.top + 20);
            }
        });

        // Dessiner la ligne des scores du joueur 1
        ctx.beginPath();
        sortedGames.forEach((game, i) => {
            const x = xScale(i);
            const y = yScale(game.score_player1);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = '#00BABC';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dessiner les points pour chaque match (joueur 1)
        sortedGames.forEach((game, i) => {
            const x = xScale(i);
            const y = yScale(game.score_player1);

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#00BABC';
            ctx.fill();
        });

        // Dessiner la ligne des scores du joueur 2 (adversaire)
        ctx.beginPath();
        sortedGames.forEach((game, i) => {
            const x = xScale(i);
            const y = yScale(game.score_player2);

            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        ctx.strokeStyle = '#FF4136';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Dessiner les points pour chaque match (joueur 2)
        sortedGames.forEach((game, i) => {
            const x = xScale(i);
            const y = yScale(game.score_player2);

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, 2 * Math.PI);
            ctx.fillStyle = '#FF4136';
            ctx.fill();
        });

        // Légende
        const legendX = margin.left;
        const legendY = height + margin.top + 35;  // Positionnement de la légende sous le graphique

        // Joueur 1
        ctx.beginPath();
        ctx.arc(legendX, legendY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#00BABC';
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(t('dashboard.you'), legendX + 10, legendY + 4);

        // Joueur 2
        ctx.beginPath();
        ctx.arc(legendX + 80, legendY, 5, 0, 2 * Math.PI);
        ctx.fillStyle = '#FF4136';
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(t('dashboard.opponents'), legendX + 90, legendY + 4);

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

export default LineChart;
