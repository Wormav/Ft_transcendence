import React, { useEffect, useRef } from 'react';
import PongStyle from '../PongStyle';
import { useTranslation } from '../../../context/TranslationContext';
import type { TouchControlsProps } from '../../../types/Pong';

const TouchControls: React.FC<TouchControlsProps> = ({
  gameStarted,
  gamePaused,
  showMenu,
  onLeftUp,
  onLeftDown,
  onRightUp,
  onRightDown,
  onPauseClick,
}) => {
  const { t } = useTranslation();
  const leftUpPressed = useRef(false);
  const leftDownPressed = useRef(false);
  const rightUpPressed = useRef(false);
  const rightDownPressed = useRef(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const updatePaddles = () => {
      if (leftUpPressed.current) onLeftUp();
      if (leftDownPressed.current) onLeftDown();
      if (rightUpPressed.current) onRightUp();
      if (rightDownPressed.current) onRightDown();
    };

    if (gameStarted && !gamePaused && !showMenu) {
      intervalRef.current = window.setInterval(updatePaddles, 16);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameStarted, gamePaused, showMenu, onLeftUp, onLeftDown, onRightUp, onRightDown]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  if (!gameStarted || gamePaused || showMenu) return null;

  return (
    <div className={PongStyle.touchControls}>
      <div className={PongStyle.touchControlLeft}>
        <button
          className={PongStyle.touchButton}
          onTouchStart={() => { leftUpPressed.current = true; }}
          onTouchEnd={() => { leftUpPressed.current = false; }}
          onTouchCancel={() => { leftUpPressed.current = false; }}
          aria-label={`${t('pong.player1')} ${t('pong.up')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </button>
        <button
          className={PongStyle.touchButton}
          onTouchStart={() => { leftDownPressed.current = true; }}
          onTouchEnd={() => { leftDownPressed.current = false; }}
          onTouchCancel={() => { leftDownPressed.current = false; }}
          aria-label={`${t('pong.player1')} ${t('pong.down')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </button>
      </div>

      <div className="flex justify-center items-center">
        <button
          className={PongStyle.touchButtonPause}
          onClick={onPauseClick}
          aria-label={t('pong.pause')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8">
            <path d="M10 4H6v16h4V4zM18 4h-4v16h4V4z"/>
          </svg>
        </button>
      </div>

      <div className={PongStyle.touchControlRight}>
        <button
          className={PongStyle.touchButton}
          onTouchStart={() => { rightUpPressed.current = true; }}
          onTouchEnd={() => { rightUpPressed.current = false; }}
          onTouchCancel={() => { rightUpPressed.current = false; }}
          aria-label={`${t('pong.player2')} ${t('pong.up')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
            <path d="M12 19V5M5 12l7-7 7 7"/>
          </svg>
        </button>
        <button
          className={PongStyle.touchButton}
          onTouchStart={() => { rightDownPressed.current = true; }}
          onTouchEnd={() => { rightDownPressed.current = false; }}
          onTouchCancel={() => { rightDownPressed.current = false; }}
          aria-label={`${t('pong.player2')} ${t('pong.down')}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default TouchControls;
