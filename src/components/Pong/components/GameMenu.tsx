import React from 'react';
import PongStyle from '../PongStyle';
import type { ScoreState } from '../../../types/Pong';

interface GameMenuProps {
  showMenu: boolean;
  score: ScoreState;
  maxScore: number;
  startGame: () => void;
  quitGame: () => void;
}

export const GameMenu: React.FC<GameMenuProps> = ({
  showMenu,
  score,
  maxScore,
  startGame,
  quitGame
}) => {
  if (!showMenu) return null;

  const hasScore = score.player1 > 0 || score.player2 > 0;
  const gameOver = score.player1 >= maxScore || score.player2 >= maxScore;

  return (
    <div className={PongStyle.overlay}>
      <h1 className={PongStyle.title}>Pong 3D</h1>

      {hasScore && (
        <h2 className={PongStyle.subtitle}>
          {gameOver
            ? (score.player1 >= maxScore ? "Joueur 1 gagne!" : "Joueur 2 gagne!")
            : `Score: ${score.player1} - ${score.player2}`}
        </h2>
      )}

      <button className={PongStyle.button} onClick={startGame}>
        {hasScore ? "Nouvelle Partie" : "Commencer"}
      </button>

      {hasScore && (
        <button className={PongStyle.button} onClick={startGame}>
          Revanche
        </button>
      )}

      <button className={PongStyle.buttonDanger} onClick={quitGame}>
        Quitter
      </button>

      <div className={PongStyle.smallText}>
        Commandes: W/S et Flèches pour bouger | F: Plein écran | P: Pause
      </div>
    </div>
  );
};

export default GameMenu;
