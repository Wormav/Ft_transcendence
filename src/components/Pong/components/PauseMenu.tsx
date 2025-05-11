import React from 'react';
import PongStyle from '../PongStyle';
import { useTranslation } from '../../../context/TranslationContext';
import type { PauseMenuProps } from '../../../types/Pong';

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
  const { t } = useTranslation();

  if (!gameStarted || !gamePaused || showMenu) return null;

  return (
    <div className={PongStyle.overlay}>
      <h1 className={PongStyle.title}>{t('pong.pause')}</h1>
      <button className={PongStyle.button} onClick={togglePause}>
        {t('pong.resumeGame')}
      </button>
      <button className={PongStyle.button} onClick={changeView}>
        {t('pong.changeView')}: {getViewName(currentView)}
      </button>
      <button className={PongStyle.button} onClick={backToMenu}>
        {t('pong.backToMenu')}
      </button>
      <button className={PongStyle.buttonDanger} onClick={quitGame}>
        {t('pong.quitGame')}
      </button>
    </div>
  );
};

export default PauseMenu;
