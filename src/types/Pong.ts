export type GameField = {
  width: number;
  height: number;
  paddleXPos: number;
}

export type ScoreState = {
  player1: number;
  player2: number;
}

export type BallDirection = {
  x: number;
  y: number;
  z: number;
}

export type TouchControlsProps = {
  gameStarted: boolean;
  gamePaused: boolean;
  showMenu: boolean;
  onLeftUp: () => void;
  onLeftDown: () => void;
  onRightUp: () => void;
  onRightDown: () => void;
  onPauseClick: () => void;
}

export type ScoreOverlayProps = {
  gameStarted: boolean;
  showMenu: boolean;
  score: ScoreState;
  editViewMode: boolean;
  currentView: number;
  getViewName: (viewIdx: number) => string;
}

export type PauseMenuProps = {
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

export type GameMenuProps = {
  showMenu: boolean;
  score: ScoreState;
  maxScore: number;
  startGame: () => void;
  quitGame: () => void;
}

export type CountdownProps = {
  countdown: number;
}
