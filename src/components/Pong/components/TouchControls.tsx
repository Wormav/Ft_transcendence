import React, { useEffect, useRef } from 'react';
import PongStyle from '../PongStyle';

interface TouchControlsProps {
  gameStarted: boolean;
  gamePaused: boolean;
  showMenu: boolean;
  onLeftUp: () => void;
  onLeftDown: () => void;
  onRightUp: () => void;
  onRightDown: () => void;
  onPauseClick: () => void;
}

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
  // Références pour suivre si les boutons sont enfoncés
  const leftUpPressed = useRef(false);
  const leftDownPressed = useRef(false);
  const rightUpPressed = useRef(false);
  const rightDownPressed = useRef(false);
  const intervalRef = useRef<number | null>(null);

  // Fonction pour gérer le mouvement continu des raquettes
  useEffect(() => {
    const updatePaddles = () => {
      if (leftUpPressed.current) onLeftUp();
      if (leftDownPressed.current) onLeftDown();
      if (rightUpPressed.current) onRightUp();
      if (rightDownPressed.current) onRightDown();
    };

    if (gameStarted && !gamePaused && !showMenu) {
      // Exécuter à 60 FPS pour une animation fluide
      intervalRef.current = window.setInterval(updatePaddles, 16);
    }

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [gameStarted, gamePaused, showMenu, onLeftUp, onLeftDown, onRightUp, onRightDown]);

  // Nettoyage au démontage
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
      {/* Contrôles du joueur gauche */}
      <div className={PongStyle.touchControlLeft}>
        <button
          className={PongStyle.touchButton}
          onTouchStart={() => { leftUpPressed.current = true; }}
          onTouchEnd={() => { leftUpPressed.current = false; }}
          onTouchCancel={() => { leftUpPressed.current = false; }}
          aria-label="Gauche haut"
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
          aria-label="Gauche bas"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="10" height="10">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </button>
      </div>

      {/* Bouton pause au milieu */}
      <div className="flex justify-center items-center">
        <button
          className={PongStyle.touchButtonPause}
          onClick={onPauseClick}
          aria-label="Pause"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" width="8" height="8">
            <path d="M10 4H6v16h4V4zM18 4h-4v16h4V4z"/>
          </svg>
        </button>
      </div>

      {/* Contrôles du joueur droit */}
      <div className={PongStyle.touchControlRight}>
        <button
          className={PongStyle.touchButton}
          onTouchStart={() => { rightUpPressed.current = true; }}
          onTouchEnd={() => { rightUpPressed.current = false; }}
          onTouchCancel={() => { rightUpPressed.current = false; }}
          aria-label="Droite haut"
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
          aria-label="Droite bas"
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
