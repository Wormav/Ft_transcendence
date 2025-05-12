import React, { useState, useEffect } from 'react';
import PongStyle from '../PongStyle';
import type { GameMenuProps } from '../../../types/Pong';
import { useTranslation } from '../../../context/TranslationContext';

export const GameMenu: React.FC<GameMenuProps> = ({
  showMenu,
  score,
  maxScore,
  startGame,
  quitGame
}) => {
  const { t } = useTranslation();
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkMobileView = () => {
      setIsMobileView(window.innerWidth <= 1023);
    };

    checkMobileView();
    window.addEventListener('resize', checkMobileView);

    return () => {
      window.removeEventListener('resize', checkMobileView);
    };
  }, []);

  if (!showMenu) return null;

  const hasScore = score.player1 > 0 || score.player2 > 0;
  const gameOver = score.player1 >= maxScore || score.player2 >= maxScore;

  return (
    <div className={PongStyle.overlay}>
      <h1 className={PongStyle.title}>Pong 3D</h1>

      {hasScore && (
        <h2 className={PongStyle.subtitle}>
          {gameOver
            ? (score.player1 >= maxScore ? t('pong.player1') + ' ' + t('pong.youWin') : t('pong.player2') + ' ' + t('pong.youWin'))
            : `${t('pong.score')}: ${score.player1} - ${score.player2}`}
        </h2>
      )}

      <button className={PongStyle.button} onClick={startGame}>
        {hasScore ? t('pong.startGame') : t('pong.startGame')}
      </button>

      {hasScore && (
        <button className={PongStyle.button} onClick={startGame}>
          {t('pong.startGame')}
        </button>
      )}

      <button className={PongStyle.buttonDanger} onClick={quitGame}>
        {t('pong.quitGame')}
      </button>

      <div className={PongStyle.smallText}>
        {isMobileView ? (
          <>
            {t('pong.mobileControls')}<br />
          </>
        ) : (
          <>
            {t('pong.keyboardControls')}
          </>
        )}
      </div>
    </div>
  );
};

export default GameMenu;
