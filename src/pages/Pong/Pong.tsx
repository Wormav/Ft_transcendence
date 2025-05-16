import { useEffect, useRef, useState, useCallback } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { useNavigate } from 'react-router-dom';
import PongStyle from './PongStyle';
import type { BallDirection, GameField, ScoreState, GameSettings, TournamentMatchSettings } from '../../types/Pong';
import { ScoreOverlay, GameMenu, PauseMenu, Countdown, TouchControls } from './components';
import { useTranslation } from '../../context/TranslationContext';
import { useSettings } from '../../context/SettingsContext';

const SCALE_FACTOR = 10;
let BALL_SPEED_INCREASE = 1.05;
const MAX_SCORE = 10;
const PADDLE_WIDTH = 0.3;
const FIELD_MARGIN = 0.05;

export default function Pong() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { color_items, color_bg, speed_moves, setColorItems, setColorBg, setSpeedMoves } = useSettings();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null);
  const gameLoopRef = useRef<number | null>(null);
  const paddleLeftRef = useRef<BABYLON.Mesh | null>(null);
  const paddleRightRef = useRef<BABYLON.Mesh | null>(null);
  const ballRef = useRef<BABYLON.Mesh | null>(null);
  const ballDirectionRef = useRef<BallDirection>({ x: 0.05, y: 0.02, z: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const wallsRef = useRef<BABYLON.Mesh[]>([]);
  const gameFieldRef = useRef<GameField>({ width: 0, height: 0, paddleXPos: 0 });
  const particleSystemRef = useRef<BABYLON.ParticleSystem | null>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [score, setScore] = useState<ScoreState>({ player1: 0, player2: 0 });
  const [showMenu, setShowMenu] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [editViewMode, setEditViewMode] = useState(false);
  const [currentView, setCurrentView] = useState(0);
  const [isMobileView, setIsMobileView] = useState(false);
  const [tournamentMatchSettings, setTournamentMatchSettings] = useState<TournamentMatchSettings>({
    matchId: null,
    isInTournament: false
  });

  const getPaddleColorFromHex = (hex: string): 'default' | 'green' | 'purple' => {
    switch (hex.toLowerCase()) {
      case '#33cc33': return 'green';
      case '#cc33cc': return 'purple';
      default: return 'default';
    }
  };

  const getPlateauColorFromHex = (hex: string): 'default' | 'blue' | 'red' => {
    switch (hex.toLowerCase()) {
      case '#1a1a4d': return 'blue';
      case '#4d1a1a': return 'red';
      default: return 'default';
    }
  };

  const [gameSettings, setGameSettings] = useState<GameSettings>({
    plateauColor: getPlateauColorFromHex(color_bg),
    paddleColor: getPaddleColorFromHex(color_items),
    ballSpeed: speed_moves
  });

  useEffect(() => {
    setGameSettings(prevSettings => ({
      ...prevSettings,
      plateauColor: getPlateauColorFromHex(color_bg),
      paddleColor: getPaddleColorFromHex(color_items),
      ballSpeed: speed_moves
    }));
  }, [color_bg, color_items, speed_moves]);

  const calculateFieldDimensions = useCallback(() => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const fieldWidth = SCALE_FACTOR * 2;
    const fieldHeight = fieldWidth / aspectRatio;

    const isMobile = window.innerWidth <= 1023;
    const mobileScaleFactor = isMobile ? 0.9 : 1.0;

    return {
      fieldWidth: fieldWidth * mobileScaleFactor,
      fieldHeight: fieldHeight * mobileScaleFactor,
      aspectRatio
    };
  }, []);

  const getMaxFieldDimension = useCallback(() => {
    const { fieldWidth, fieldHeight } = calculateFieldDimensions();
    return Math.max(fieldWidth, fieldHeight);
  }, [calculateFieldDimensions]);

  const startGameLoop = useCallback(() => {
    if (gameLoopRef.current) return;

    const updateGame = () => {
      if (!gameStarted || gamePaused) return;

      if (!editViewMode && ballRef.current) {
        ballRef.current.position.x += ballDirectionRef.current.x;
        ballRef.current.position.y += ballDirectionRef.current.y;
        ballRef.current.position.z += ballDirectionRef.current.z;

        if (particleSystemRef.current) {
          const speed = Math.sqrt(
            Math.pow(ballDirectionRef.current.x, 2) +
            Math.pow(ballDirectionRef.current.y, 2) +
            Math.pow(ballDirectionRef.current.z, 2)
          );

          particleSystemRef.current.emitRate = Math.min(100, 40 + speed * 200);
          particleSystemRef.current.minLifeTime = Math.max(0.1, 0.3 - speed * 0.5);
          particleSystemRef.current.maxLifeTime = Math.max(0.2, 0.6 - speed * 0.5);
        }
      }

      updatePaddlePositions();
      checkCollisions();

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);
  }, [gameStarted, gamePaused, editViewMode]);

  const stopGameLoop = useCallback(() => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  }, []);

  const resetBall = useCallback(() => {
    if (!ballRef.current) return;
    const ballRadius = ballRef.current.getBoundingInfo().boundingSphere.radius;
    ballRef.current.position = new BABYLON.Vector3(0, ballRadius, 0);

    let baseFactor = 0.005;
    switch (gameSettings.ballSpeed) {
      case 'fast': baseFactor = 0.008; break;
      case 'turbo': baseFactor = 0.012; break;
      default: baseFactor = 0.005;
    }

    const speedFactor = gameFieldRef.current.width * baseFactor;
    const dirX = Math.random() > 0.5 ? speedFactor : -speedFactor;
    const dirZ = (Math.random() - 0.5) * speedFactor * (window.innerWidth < 600 ? 0.7 : 1);

    ballDirectionRef.current = { x: dirX, y: 0, z: dirZ };

    if (particleSystemRef.current) {
      particleSystemRef.current.reset();
    }
  }, [gameSettings.ballSpeed]);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    setShowMenu(false);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setGameStarted(true);
          startGameLoop();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [startGameLoop]);

  const startGame = useCallback(() => {
    setScore({ player1: 0, player2: 0 });
    setEditViewMode(false);
    setCurrentView(0);
    resetBall();
    startCountdown();
    if (cameraRef.current) {
      cameraRef.current.alpha = Math.PI / 2;
      cameraRef.current.beta = Math.PI / 4;
    }
  }, [resetBall, startCountdown]);

  const togglePause = useCallback(() => {
    setGamePaused((prev) => !prev);
  }, []);

  const backToMenu = useCallback(() => {
    stopGameLoop();
    setGameStarted(false);
    setGamePaused(false);
    setShowMenu(true);
  }, [stopGameLoop]);

  const quitGame = useCallback(() => {
    stopGameLoop();

    const navigateToGame = () => {
      navigate('/game');
    };

    const exitFullscreenAndNavigate = () => {
      setTimeout(() => {
        navigateToGame();
      }, 50);
    };

    if (document.fullscreenElement) {
      try {
        if (document.exitFullscreen) {
          document.exitFullscreen()
            .then(exitFullscreenAndNavigate)
            .catch(err => {
              console.error('Erreur lors de la sortie du mode plein écran:', err);
              exitFullscreenAndNavigate();
            });
        } else if ((document as any).mozCancelFullScreen) {
          (document as any).mozCancelFullScreen();
          exitFullscreenAndNavigate();
        } else if ((document as any).webkitExitFullscreen) {
          (document as any).webkitExitFullscreen();
          exitFullscreenAndNavigate();
        } else if ((document as any).msExitFullscreen) {
          (document as any).msExitFullscreen();
          exitFullscreenAndNavigate();
        } else {
          exitFullscreenAndNavigate();
        }
      } catch (err) {
        console.error('Exception lors de la sortie du mode plein écran:', err);
        exitFullscreenAndNavigate();
      }
    } else {
      navigateToGame();
    }
  }, [navigate, stopGameLoop]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      try {
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(err => {
            console.error('Erreur lors du passage en plein écran:', err);
          });
        } else if ((document.documentElement as any).mozRequestFullScreen) {
          (document.documentElement as any).mozRequestFullScreen();
        } else if ((document.documentElement as any).webkitRequestFullscreen) {
          (document.documentElement as any).webkitRequestFullscreen();
        } else if ((document.documentElement as any).msRequestFullscreen) {
          (document.documentElement as any).msRequestFullscreen();
        }
      } catch (err) {
        console.error('Exception lors du passage en plein écran:', err);
      }
    } else if (document.exitFullscreen) {
      try {
        document.exitFullscreen().catch(err => {
          console.error('Erreur lors de la sortie du mode plein écran:', err);
        });
      } catch (err) {
        console.error('Exception lors de la sortie du mode plein écran:', err);
      }
    }
  }, []);

  const toggleEditViewMode = useCallback(() => {
    if (gameStarted && !gamePaused && !showMenu) {
      setEditViewMode(prev => !prev);
    }
  }, [gameStarted, gamePaused, showMenu]);

  const changeView = useCallback(() => {
    if (!cameraRef.current) return;

    const nextView = (currentView + 1) % 3;
    setCurrentView(nextView);

    const camera = cameraRef.current;
    const maxDimension = getMaxFieldDimension();

    switch (nextView) {
      case 0:
        camera.alpha = Math.PI / 2;
        camera.beta = Math.PI / 4;
        camera.radius = maxDimension * 3;
        break;
      case 1:
        camera.alpha = Math.PI / 2;
        camera.beta = Math.PI / 16;
        camera.radius = maxDimension * 1.5;
        break;
      case 2:
        camera.alpha = 0;
        camera.beta = Math.PI / 4;
        camera.radius = maxDimension * 3;
        break;
    }
  }, [currentView, getMaxFieldDimension]);

  const updatePaddlePositions = useCallback(() => {
    if (!paddleLeftRef.current || !paddleRightRef.current || editViewMode) return;

    const paddleSpeed = gameFieldRef.current.height * 0.01;
    const paddleLimit = gameFieldRef.current.height * 0.45;

    if (keysPressed.current['w'] || keysPressed.current['W']) {
      paddleRightRef.current.position.z -= paddleSpeed;
    }
    if (keysPressed.current['s'] || keysPressed.current['S']) {
      paddleRightRef.current.position.z += paddleSpeed;
    }

    if (keysPressed.current['ArrowUp']) {
      paddleLeftRef.current.position.z -= paddleSpeed;
    }
    if (keysPressed.current['ArrowDown']) {
      paddleLeftRef.current.position.z += paddleSpeed;
    }

    const clampPosition = (pos: number) => Math.max(-paddleLimit, Math.min(pos, paddleLimit));
    paddleLeftRef.current.position.z = clampPosition(paddleLeftRef.current.position.z);
    paddleRightRef.current.position.z = clampPosition(paddleRightRef.current.position.z);
  }, [editViewMode]);

  const checkCollisions = useCallback(() => {
    if (!ballRef.current || !paddleLeftRef.current || !paddleRightRef.current) return;

    const ball = ballRef.current;
    const paddleLeft = paddleLeftRef.current;
    const paddleRight = paddleRightRef.current;
    const field = gameFieldRef.current;
    const paddleHalfHeight = paddleLeft.getBoundingInfo().boundingBox.extendSize.z;

    const wallLimit = field.height / 2 - ball.getBoundingInfo().boundingSphere.radius;
    if (ball.position.z <= -wallLimit || ball.position.z >= wallLimit) {
      ballDirectionRef.current.z = -ballDirectionRef.current.z;
    }

    const checkPaddleCollision = (isPaddleLeft: boolean) => {
      const paddle = isPaddleLeft ? paddleLeft : paddleRight;
      const paddleX = isPaddleLeft ? -field.paddleXPos : field.paddleXPos;

      if (
        ball.position.x <= paddleX + PADDLE_WIDTH &&
        ball.position.x >= paddleX - PADDLE_WIDTH &&
        ball.position.z >= paddle.position.z - paddleHalfHeight &&
        ball.position.z <= paddle.position.z + paddleHalfHeight
      ) {
        ballDirectionRef.current.x = -ballDirectionRef.current.x * BALL_SPEED_INCREASE;
        const hitPosition = ball.position.z - paddle.position.z;
        ballDirectionRef.current.z += hitPosition * 0.05;
        return true;
      }
      return false;
    };

    checkPaddleCollision(true) || checkPaddleCollision(false);

    const scoreLimit = field.width / 2 + 1;
    if (ball.position.x < -scoreLimit) {
      handleScore('player2');
      resetBall();
    } else if (ball.position.x > scoreLimit) {
      handleScore('player1');
      resetBall();
    }
  }, [resetBall, score]);

  const handleScore = useCallback((player: 'player1' | 'player2') => {
    setScore(prevScore => {
      const newScore = {
        ...prevScore,
        [player]: prevScore[player] + 1
      };

      if (newScore[player] >= MAX_SCORE) {
        if (tournamentMatchSettings.isInTournament) {
          // TODO: Envoyer le résultat du match au serveur
          console.log(`Match de tournoi ${tournamentMatchSettings.matchId} terminé :`, newScore);
        }
        setGameStarted(false);
        setShowMenu(true);
      }

      return newScore;
    });
  }, [tournamentMatchSettings]);

//   const checkGameOver = useCallback((player1Score: number, player2Score: number) => {
//     if (player1Score >= MAX_SCORE || player2Score >= MAX_SCORE) {
//       stopGameLoop();
//       setGameStarted(false);
//       setShowMenu(true);
//     }
//   }, [stopGameLoop]);

  const createGameElements = useCallback((scene: BABYLON.Scene) => {
    const { fieldWidth, fieldHeight } = calculateFieldDimensions();

    const playableWidth = fieldWidth * (1 - 2 * FIELD_MARGIN);
    const playableHeight = fieldHeight * (1 - 2 * FIELD_MARGIN);
    const paddleXPosition = playableWidth / 2;

    const createMaterial = (name: string, diffuse: BABYLON.Color3, emissive?: BABYLON.Color3, alpha = 1) => {
      const material = new BABYLON.StandardMaterial(name, scene);
      material.diffuseColor = diffuse;
      if (emissive) material.emissiveColor = emissive;
      material.alpha = alpha;
      return material;
    };

    const initialPaddleColor = getPaddleColor(gameSettings.paddleColor);
    const paddleMaterial = createMaterial(
      "paddleMaterial",
      initialPaddleColor,
      new BABYLON.Color3(initialPaddleColor.r * 0.5, initialPaddleColor.g * 0.5, initialPaddleColor.b * 0.5)
    );

    const ballMaterial = createMaterial(
      "ballMaterial",
      new BABYLON.Color3(0.8, 0.2, 0.2),
      new BABYLON.Color3(0.4, 0.1, 0.1)
    );

    const wallMaterial = createMaterial(
      "wallMaterial",
      new BABYLON.Color3(0.4, 0.4, 0.4),
      undefined,
      0.5
    );

    const initialGroundColor = getPlateauColor(gameSettings.plateauColor);
    const groundMaterial = createMaterial(
      "groundMaterial",
      initialGroundColor
    );
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);

    const centerLineMaterial = createMaterial(
      "centerLineMaterial",
      new BABYLON.Color3(0.8, 0.8, 0.8),
      undefined,
      0.5
    );

    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: fieldWidth, height: fieldHeight },
      scene
    );
    ground.material = groundMaterial;

    const centerLine = BABYLON.MeshBuilder.CreateBox(
      "centerLine",
      { width: 0.1, height: 0.1, depth: fieldHeight },
      scene
    );
    centerLine.position.y = 0.06;
    centerLine.material = centerLineMaterial;

    const paddleHeight = playableHeight * 0.15;
    const createPaddle = (name: string, xPos: number) => {
      const paddle = BABYLON.MeshBuilder.CreateBox(
        name,
        { width: PADDLE_WIDTH, height: 0.3, depth: paddleHeight },
        scene
      );
      paddle.position = new BABYLON.Vector3(xPos, 0.15, 0);
      paddle.material = paddleMaterial;
      return paddle;
    };

    paddleLeftRef.current = createPaddle("paddleLeft", -paddleXPosition);
    paddleRightRef.current = createPaddle("paddleRight", paddleXPosition);

    const ballDiameter = Math.min(playableWidth, playableHeight) * 0.025;
    const ball = BABYLON.MeshBuilder.CreateSphere(
      "ball",
      { diameter: ballDiameter },
      scene
    );
    ball.position = new BABYLON.Vector3(0, ballDiameter/2, 0);
    ball.material = ballMaterial;
    ballRef.current = ball;

    const createParticleSystem = () => {
      if (!scene) return;

      const particleSystem = new BABYLON.ParticleSystem("ballParticles", 100, scene);
      particleSystem.particleTexture = new BABYLON.Texture("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAFFmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDIgNzkuMTYwOTI0LCAyMDE3LzA3LzEzLTAxOjA2OjM5ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMC0wMy0yNlQyMTowNzozOSswMTowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjAtMDMtMjZUMjE6NTE6NTcrMDE6MDAiIHhtcDpNZXRhZGF0YURhdGU9IjIwMjAtMDMtMjZUMjE6NTE6NTcrMDE6MDAiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0ic1JHQiBJRUM2MTk2Ni0yLjEiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZjI0YzMxMDctMGZlZi0zZDRh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", scene);

      particleSystem.emitter = ball;
      particleSystem.minEmitBox = new BABYLON.Vector3(-0.05, -0.05, -0.05);
      particleSystem.maxEmitBox = new BABYLON.Vector3(0.05, 0.05, 0.05);

      particleSystem.color1 = new BABYLON.Color4(0.8, 0.2, 0.2, 1.0);
      particleSystem.color2 = new BABYLON.Color4(1, 0.5, 0.5, 1.0);
      particleSystem.colorDead = new BABYLON.Color4(0.7, 0.1, 0.1, 0.0);

      particleSystem.minSize = 0.05;
      particleSystem.maxSize = 0.15;
      particleSystem.minLifeTime = 0.15;
      particleSystem.maxLifeTime = 0.5;

      particleSystem.emitRate = 50;
      particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
      particleSystem.gravity = new BABYLON.Vector3(0, -0.5, 0);
      particleSystem.direction1 = new BABYLON.Vector3(-0.5, -0.5, -0.5);
      particleSystem.direction2 = new BABYLON.Vector3(0.5, 0.5, 0.5);
      particleSystem.minAngularSpeed = 0;
      particleSystem.maxAngularSpeed = Math.PI;

      particleSystem.updateSpeed = 0.01;

      particleSystemRef.current = particleSystem;

      if (gameStarted && !gamePaused) {
        particleSystem.start();
      }
    };

    createParticleSystem();

    const wallThickness = Math.min(playableWidth, playableHeight) * 0.025;
    const createWall = (name: string, zPos: number) => {
      const wall = BABYLON.MeshBuilder.CreateBox(
        name,
        { width: fieldWidth, height: wallThickness, depth: wallThickness },
        scene
      );
      wall.position = new BABYLON.Vector3(0, wallThickness/2, zPos);
      wall.material = wallMaterial;
      return wall;
    };

    const topWall = createWall("topWall", -fieldHeight/2 + wallThickness);
    const bottomWall = createWall("bottomWall", fieldHeight/2 - wallThickness);
    wallsRef.current = [topWall, bottomWall];

    gameFieldRef.current = {
      width: playableWidth,
      height: playableHeight,
      paddleXPos: paddleXPosition
    };
  }, [calculateFieldDimensions]);

  const handleSettingsChange = (newSettings: GameSettings) => {
    setGameSettings(newSettings);

    // Mettre à jour les settings globaux
    setColorItems(getPaddleColorHex(newSettings.paddleColor));
    setColorBg(getPlateauColorHex(newSettings.plateauColor));
    setSpeedMoves(newSettings.ballSpeed);

    // Appliquer les changements visuels
    if (paddleLeftRef.current && paddleRightRef.current) {
      const paddleColor = getPaddleColor(newSettings.paddleColor);
      const paddleMaterial = paddleLeftRef.current.material as BABYLON.StandardMaterial;
      const paddleMaterial2 = paddleRightRef.current.material as BABYLON.StandardMaterial;
      paddleMaterial.diffuseColor = paddleColor;
      paddleMaterial2.diffuseColor = paddleColor;
    }
    if (sceneRef.current) {
      const ground = sceneRef.current.meshes.find(mesh => mesh.name === 'ground');
      if (ground) {
        const groundMaterial = ground.material as BABYLON.StandardMaterial;
        groundMaterial.diffuseColor = getPlateauColor(newSettings.plateauColor);
      }
    }
    updateBallSpeed(newSettings.ballSpeed);
  };

  const getPaddleColorHex = (color: string): string => {
    switch (color) {
      case 'green': return '#33cc33';
      case 'purple': return '#cc33cc';
      default: return '#3498db';
    }
  };

  const getPlateauColorHex = (color: string): string => {
    switch (color) {
      case 'blue': return '#1a1a4d';
      case 'red': return '#4d1a1a';
      default: return '#1a1a1a';
    }
  };

  const getPaddleColor = (color: string): BABYLON.Color3 => {
    switch (color) {
      case 'green': return new BABYLON.Color3(0.2, 0.8, 0.2);
      case 'purple': return new BABYLON.Color3(0.8, 0.2, 0.8);
      default: return new BABYLON.Color3(0.2, 0.4, 0.8);
    }
  };

  const getPlateauColor = (color: string): BABYLON.Color3 => {
    switch (color) {
      case 'blue': return new BABYLON.Color3(0.1, 0.1, 0.3);
      case 'red': return new BABYLON.Color3(0.3, 0.1, 0.1);
      default: return new BABYLON.Color3(0.1, 0.1, 0.1);
    }
  };

  const updateBallSpeed = (speed: string) => {
    let speedFactor = 1;
    switch (speed) {
      case 'fast': speedFactor = 2.5; break;
      case 'turbo': speedFactor = 4; break;
      default: speedFactor = 1;
    }
    if (ballDirectionRef.current) {
      const currentSpeed = Math.sqrt(
        Math.pow(ballDirectionRef.current.x, 2) +
        Math.pow(ballDirectionRef.current.z, 2)
      );
      const scale = speedFactor / currentSpeed;
      ballDirectionRef.current.x *= scale;
      ballDirectionRef.current.z *= scale;

      BALL_SPEED_INCREASE = speed === 'turbo' ? 1.08 : speed === 'fast' ? 1.06 : 1.05;
    }
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    engineRef.current = engine;
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    const { fieldWidth, fieldHeight } = calculateFieldDimensions();
    const cameraHeight = Math.max(fieldWidth, fieldHeight) * 1.2;

    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,
      Math.PI / 4,
      cameraHeight,
      new BABYLON.Vector3(0, 0, 0),
      scene
    );

    camera.lowerBetaLimit = 0.1;
    camera.upperBetaLimit = Math.PI / 2 - 0.1;
    camera.lowerAlphaLimit = 0;
    camera.upperAlphaLimit = Math.PI;
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = cameraHeight * 3.0;
    camera.attachControl(canvasRef.current, true);
    camera.inputs.removeByType("ArcRotateCameraKeyboardMoveInput");
    cameraRef.current = camera;

    const light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;

    const pointLight = new BABYLON.PointLight(
      "pointLight",
      new BABYLON.Vector3(0, 5, 0),
      scene
    );
    pointLight.intensity = 0.5;

    createGameElements(scene);

    engine.runRenderLoop(() => {
      scene.render();
    });

    const handleResize = () => engine.resize();
    window.addEventListener("resize", handleResize);

    return () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
      }
      scene.dispose();
      engine.dispose();
      window.removeEventListener("resize", handleResize);
    };
  }, [calculateFieldDimensions, createGameElements]);

  useEffect(() => {
    document.body.classList.add('pong3d-fullscreen');
    return () => {
      try {
        document.body.classList.remove('pong3d-fullscreen');
      } catch (e) {
      }
    };
  }, []);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!document.fullscreenElement) {
        toggleFullscreen();
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [toggleFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && gameStarted) {
        toggleFullscreen();
      }
    };

    const handleResize = () => {
      if (engineRef.current && cameraRef.current) {
        const { fieldWidth, fieldHeight } = calculateFieldDimensions();
        const cameraHeight = Math.max(fieldWidth, fieldHeight) * 1.2;
        cameraRef.current.radius = cameraHeight;
        engineRef.current.resize();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleResize);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
    };
  }, [gameStarted, toggleFullscreen, calculateFieldDimensions]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;

      const keyActions: Record<string, () => void> = {
        'p': () => {
          if ((gameStarted && !gamePaused && !showMenu) || (gameStarted && gamePaused)) {
            togglePause();
          }
        },
        'f': toggleFullscreen,
        'q': () => {
          if (gamePaused || showMenu) {
            quitGame();
          }
        }
      };

      const key = e.key.toLowerCase();
      if (keyActions[key]) {
        e.preventDefault();
        keyActions[key]();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted, gamePaused, showMenu, editViewMode, changeView, toggleFullscreen, toggleEditViewMode, togglePause, quitGame]);

  useEffect(() => {
    if (gameStarted && !gamePaused) {
      startGameLoop();
      if (particleSystemRef.current) {
        particleSystemRef.current.start();
      }
    } else {
      stopGameLoop();
      if (particleSystemRef.current) {
        particleSystemRef.current.stop();
      }
    }
    return () => stopGameLoop();
  }, [gameStarted, gamePaused, startGameLoop, stopGameLoop]);

  const getViewName = (viewIdx: number) => {
    return viewIdx === 0 ? t('pong.viewFront') : viewIdx === 1 ? t('pong.viewTop') : t('pong.viewSide');
  };

  const handleLeftPaddleUp = useCallback(() => {
    if (paddleLeftRef.current && !editViewMode) {
      const paddleSpeed = gameFieldRef.current.height * 0.01;
      const paddleLimit = gameFieldRef.current.height * 0.45;

      paddleLeftRef.current.position.z -= paddleSpeed;

      paddleLeftRef.current.position.z = Math.max(-paddleLimit, paddleLeftRef.current.position.z);
    }
  }, [editViewMode]);

  const handleLeftPaddleDown = useCallback(() => {
    if (paddleLeftRef.current && !editViewMode) {
      const paddleSpeed = gameFieldRef.current.height * 0.01;
      const paddleLimit = gameFieldRef.current.height * 0.45;

      paddleLeftRef.current.position.z += paddleSpeed;

      paddleLeftRef.current.position.z = Math.min(paddleLimit, paddleLeftRef.current.position.z);
    }
  }, [editViewMode]);

  const handleRightPaddleUp = useCallback(() => {
    if (paddleRightRef.current && !editViewMode) {
      const paddleSpeed = gameFieldRef.current.height * 0.01;
      const paddleLimit = gameFieldRef.current.height * 0.45;

      paddleRightRef.current.position.z -= paddleSpeed;

      paddleRightRef.current.position.z = Math.max(-paddleLimit, paddleRightRef.current.position.z);
    }
  }, [editViewMode]);

  const handleRightPaddleDown = useCallback(() => {
    if (paddleRightRef.current && !editViewMode) {
      const paddleSpeed = gameFieldRef.current.height * 0.01;
      const paddleLimit = gameFieldRef.current.height * 0.45;

      paddleRightRef.current.position.z += paddleSpeed;

      paddleRightRef.current.position.z = Math.min(paddleLimit, paddleRightRef.current.position.z);
    }
  }, [editViewMode]);

  const startTournamentMatch = useCallback((matchId: string) => {
    setTournamentMatchSettings({ matchId, isInTournament: true });
    setScore({ player1: 0, player2: 0 });
    setEditViewMode(false);
    setCurrentView(0);
    resetBall();
    startCountdown();
    if (cameraRef.current) {
      cameraRef.current.alpha = Math.PI / 2;
      cameraRef.current.beta = Math.PI / 4;
    }
  }, [resetBall, startCountdown]);

  return (
    <div className={PongStyle.container}>
      <canvas ref={canvasRef} className={PongStyle.canvas} />
      <ScoreOverlay
        gameStarted={gameStarted}
        showMenu={showMenu}
        score={score}
        editViewMode={editViewMode}
        currentView={currentView}
        getViewName={getViewName}
      />
      <GameMenu
        showMenu={showMenu}
        score={score}
        maxScore={MAX_SCORE}
        startGame={startGame}
        quitGame={quitGame}
        settings={gameSettings}
        onSettingsChange={handleSettingsChange}
        onStartTournamentMatch={startTournamentMatch}
      />
      <PauseMenu
        gameStarted={gameStarted}
        gamePaused={gamePaused}
        showMenu={showMenu}
        togglePause={togglePause}
        changeView={changeView}
        backToMenu={backToMenu}
        quitGame={quitGame}
        currentView={currentView}
        getViewName={getViewName}
      />
      <Countdown countdown={countdown} />
      {isMobileView && (
        <TouchControls
          gameStarted={gameStarted}
          gamePaused={gamePaused}
          showMenu={showMenu}
          onLeftUp={handleRightPaddleUp}
          onLeftDown={handleRightPaddleDown}
          onRightUp={handleLeftPaddleUp}
          onRightDown={handleLeftPaddleDown}
          onPauseClick={togglePause}
        />
      )}
    </div>
  );
}
