import React from 'react';
import PongStyle from '../PongStyle';
import type { ScoreState } from '../../../types/Pong';

interface ScoreOverlayProps {
  gameStarted: boolean;
  showMenu: boolean;
  score: ScoreState;
  editViewMode: boolean;
  currentView: number;
  getViewName: (viewIdx: number) => string;
}

export const ScoreOverlay: React.FC<ScoreOverlayProps> = ({
  gameStarted,
  showMenu,
  score,
  editViewMode,
  currentView,
  getViewName
}) => {
  if (!gameStarted || showMenu) return null;

  return (
    <div className={PongStyle.score}>
      {score.player1} - {score.player2}
      {editViewMode && (
        <div className={PongStyle.viewModeText}>
          Mode Édition Vue Activé (V pour désactiver)
        </div>
      )}
      <div className={PongStyle.viewIndicator}>
        Vue {currentView + 1}: {getViewName(currentView)}
      </div>
    </div>
  );
};

export default ScoreOverlay;
