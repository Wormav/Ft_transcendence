import React from 'react';
import PongStyle from '../PongStyle';

interface PauseMenuProps {
  gameStarted: boolean;
  gamePaused: boolean;
  showMenu: boolean;
  togglePause: () => void;
  changeView: () => void;
  backToMenu: () => void;
  quitGame: () => void;
  currentView: number;
  getViewName: (viewIdx: number) => string;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  gameStarted,
  gamePaused,
  showMenu,
  togglePause,
  changeView,
  backToMenu,
  quitGame,
  currentView,
  getViewName
}) => {
  if (!gameStarted || !gamePaused || showMenu) return null;

  return (
    <div className={PongStyle.overlay}>
      <h1 className={PongStyle.title}>Pause</h1>
      <button className={PongStyle.button} onClick={togglePause}>
        Reprendre
      </button>
      <button className={PongStyle.button} onClick={changeView}>
        Vue: {getViewName(currentView)}
      </button>
      <button className={PongStyle.button} onClick={backToMenu}>
        Menu Principal
      </button>
      <button className={PongStyle.buttonDanger} onClick={quitGame}>
        Quitter
      </button>
    </div>
  );
};

export default PauseMenu;
