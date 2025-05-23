import { useRef, useEffect } from "react";
import { useTranslation } from "../../../context/TranslationContext";
import { useWindowSize } from "../../../hooks/useWindowSize";
import type { WinLossChartProps } from "../../../types/Pong";

const WinLossChart: React.FC<WinLossChartProps> = ({ games }) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { t } = useTranslation();
	const windowSize = useWindowSize();

	useEffect(() => {
		if (!canvasRef.current) return;

		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const updateCanvasSize = () => {
			const dpr = window.devicePixelRatio || 1;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			return { dpr, rect };
		};

		const { dpr, rect } = updateCanvasSize();
		canvas.height = rect.height * dpr;
		ctx.scale(dpr, dpr);
		canvas.style.width = `${rect.width}px`;
		canvas.style.height = `${rect.height}px`;

		ctx.clearRect(0, 0, rect.width, rect.height);

		if (games.length === 0) {
			ctx.fillStyle = "#6B7280";
			ctx.font = "16px sans-serif";
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";
			ctx.fillText(t("dashboard.noData"), rect.width / 2, rect.height / 2);
			return;
		}

		const wins = games.filter(
			(game) => game.score_player1 > game.score_player2,
		).length;
		const losses = games.filter(
			(game) => game.score_player1 < game.score_player2,
		).length;
		const total = games.length;

		ctx.clearRect(0, 0, rect.width, rect.height);

		const centerX = rect.width / 2;
		const centerY = rect.height / 2 - 30;
		const radius = Math.min(centerX, centerY) * 0.65;

		const colors = {
			wins: "#00BABC",
			losses: "#FF4136",
		};

		const drawPieSlice = (
			ctx: CanvasRenderingContext2D,
			centerX: number,
			centerY: number,
			radius: number,
			startAngle: number,
			endAngle: number,
			color: string,
		) => {
			ctx.beginPath();
			ctx.moveTo(centerX, centerY);
			ctx.arc(centerX, centerY, radius, startAngle, endAngle);
			ctx.closePath();
			ctx.fillStyle = color;
			ctx.fill();
		};

		const winRatio = wins / total;
		const startAngle = 0;
		const winEndAngle = startAngle + winRatio * 2 * Math.PI;
		const lossEndAngle = 2 * Math.PI;

		drawPieSlice(
			ctx,
			centerX,
			centerY,
			radius,
			startAngle,
			winEndAngle,
			colors.wins,
		);
		drawPieSlice(
			ctx,
			centerX,
			centerY,
			radius,
			winEndAngle,
			lossEndAngle,
			colors.losses,
		);

		const innerRadius = radius * 0.6;
		ctx.beginPath();
		ctx.arc(centerX, centerY, innerRadius, 0, 2 * Math.PI);
		ctx.fillStyle = "#FFFFFF";
		ctx.fill();

		ctx.fillStyle = "#000000";
		ctx.font = "bold 20px sans-serif";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(`${Math.round(winRatio * 100)}%`, centerX, centerY - 10);
		ctx.font = "14px sans-serif";
		ctx.fillText(t("dashboard.wins"), centerX, centerY + 15);

		const statsY = centerY + radius + 30;
		ctx.font = "14px sans-serif";
		ctx.textAlign = "center";

		ctx.fillStyle = "#000000";
		ctx.fillText(
			`${t("dashboard.total")}: ${total} ${t("dashboard.matches")}`,
			centerX,
			statsY,
		);

		ctx.fillStyle = colors.wins;
		ctx.fillText(`${wins} ${t("dashboard.wins")}`, centerX - 80, statsY + 25);

		ctx.fillStyle = colors.losses;
		ctx.fillText(
			`${losses} ${t("dashboard.losses")}`,
			centerX + 80,
			statsY + 25,
		);

		ctx.fillStyle = "#000000";
		ctx.font = "12px sans-serif";
		ctx.fillText(
			`${t("dashboard.vsPlayers")}: ${wins}V/${losses}D`,
			centerX,
			statsY + 45,
		);

		const legendX1 = centerX - 100;
		const legendX2 = centerX + 10;
		const legendY = centerY - radius - 20;

		ctx.beginPath();
		ctx.rect(legendX1, legendY, 12, 12);
		ctx.fillStyle = colors.wins;
		ctx.fill();
		ctx.fillStyle = "#000000";
		ctx.textAlign = "left";
		ctx.font = "12px sans-serif";
		ctx.fillText(t("dashboard.wins"), legendX1 + 18, legendY + 10);

		ctx.beginPath();
		ctx.rect(legendX2, legendY, 12, 12);
		ctx.fillStyle = colors.losses;
		ctx.fill();
		ctx.fillStyle = "#000000";
		ctx.fillText(t("dashboard.losses"), legendX2 + 18, legendY + 10);
	}, [games, t, windowSize]);

	return (
		<div className="w-full h-full relative">
			<canvas ref={canvasRef} className="w-full h-full block" />
		</div>
	);
};

export default WinLossChart;
