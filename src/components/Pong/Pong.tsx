import { useEffect, useRef, useState } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { useNavigate } from 'react-router-dom';
import PongStyle from './PongStyle';

export default function Pong() {
  const navigate = useNavigate();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [showMenu, setShowMenu] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [editViewMode, setEditViewMode] = useState(false);
  const [currentView, setCurrentView] = useState(0);

  const paddleLeftRef = useRef<BABYLON.Mesh | null>(null);
  const paddleRightRef = useRef<BABYLON.Mesh | null>(null);
  const ballRef = useRef<BABYLON.Mesh | null>(null);
  const ballDirectionRef = useRef({ x: 0.05, y: 0.02, z: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const wallsRef = useRef<BABYLON.Mesh[]>([]);

  const gameFieldRef = useRef<{ width: number; height: number; paddleXPos: number }>({ width: 0, height: 0, paddleXPos: 0 });

  const BALL_SPEED_INCREASE = 1.05;
  const MAX_SCORE = 10;

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new BABYLON.Engine(canvasRef.current, true);
    engineRef.current = engine;
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    const scaleFactor = 10;
    const aspectRatio = window.innerWidth / window.innerHeight;

    const fieldWidth = scaleFactor * 2;
    const fieldHeight = fieldWidth / aspectRatio;

    const cameraHeight = Math.max(fieldWidth, fieldHeight) * 0.75;

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
    camera.upperRadiusLimit = cameraHeight * 1.5;

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

    window.addEventListener("resize", () => {
      engine.resize();
    });

    return () => {
      scene.dispose();
      engine.dispose();
      window.removeEventListener("resize", () => {
        engine.resize();
      });
    };
  }, []);

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
    const timer = setTimeout(() => {
      if (!document.fullscreenElement) {
        const container = document.documentElement;
        if (container.requestFullscreen) {
          container.requestFullscreen().catch(err => {
            console.error('Erreur lors du passage en plein écran:', err);
          });
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && gameStarted) {
        const container = document.documentElement;
        if (container.requestFullscreen) {
          container.requestFullscreen().catch(err => {
            console.error('Erreur lors du passage en plein écran:', err);
          });
        }
      }
    };

    const handleResize = () => {
      if (engineRef.current && cameraRef.current && sceneRef.current) {
        const aspectRatio = window.innerWidth / window.innerHeight;
        const scaleFactor = 10;
        const fieldWidth = scaleFactor * 2;
        const fieldHeight = fieldWidth / aspectRatio;

        const cameraHeight = Math.max(fieldWidth, fieldHeight) * 0.75;
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
  }, [gameStarted]);

  const createGameElements = (scene: BABYLON.Scene) => {
    const aspectRatio = window.innerWidth / window.innerHeight;
    const scaleFactor = 10;
    const fieldWidth = scaleFactor * 2;
    const fieldHeight = fieldWidth / aspectRatio;

    const margin = 0.05;
    const playableWidth = fieldWidth * (1 - 2 * margin);
    const playableHeight = fieldHeight * (1 - 2 * margin);

    const paddleXPosition = (playableWidth / 2);

    const paddleMaterial = new BABYLON.StandardMaterial("paddleMaterial", scene);
    paddleMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
    paddleMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.4);

    const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
    ballMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
    ballMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.1, 0.1);

    const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    wallMaterial.alpha = 0.5;

    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: fieldWidth, height: fieldHeight },
      scene
    );
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;

    const centerLine = BABYLON.MeshBuilder.CreateBox(
      "centerLine",
      { width: 0.1, height: 0.1, depth: fieldHeight },
      scene
    );
    centerLine.position.y = 0.06;
    const centerLineMaterial = new BABYLON.StandardMaterial("centerLineMaterial", scene);
    centerLineMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.8, 0.8);
    centerLineMaterial.alpha = 0.5;
    centerLine.material = centerLineMaterial;

    const paddleHeight = playableHeight * 0.15;
    const paddleLeft = BABYLON.MeshBuilder.CreateBox(
      "paddleLeft",
      { width: 0.3, height: 0.3, depth: paddleHeight },
      scene
    );
    paddleLeft.position = new BABYLON.Vector3(-paddleXPosition, 0.15, 0);
    paddleLeft.material = paddleMaterial;
    paddleLeftRef.current = paddleLeft;

    const paddleRight = BABYLON.MeshBuilder.CreateBox(
      "paddleRight",
      { width: 0.3, height: 0.3, depth: paddleHeight },
      scene
    );
    paddleRight.position = new BABYLON.Vector3(paddleXPosition, 0.15, 0);
    paddleRight.material = paddleMaterial;
    paddleRightRef.current = paddleRight;

    const ballDiameter = Math.min(playableWidth, playableHeight) * 0.025;
    const ball = BABYLON.MeshBuilder.CreateSphere(
      "ball",
      { diameter: ballDiameter },
      scene
    );
    ball.position = new BABYLON.Vector3(0, ballDiameter/2, 0);
    ball.material = ballMaterial;
    ballRef.current = ball;

    const wallThickness = Math.min(playableWidth, playableHeight) * 0.025;
    const topWall = BABYLON.MeshBuilder.CreateBox(
      "topWall",
      { width: fieldWidth, height: wallThickness, depth: wallThickness },
      scene
    );
    topWall.position = new BABYLON.Vector3(0, wallThickness/2, -fieldHeight/2 + wallThickness);
    topWall.material = wallMaterial;

    const bottomWall = BABYLON.MeshBuilder.CreateBox(
      "bottomWall",
      { width: fieldWidth, height: wallThickness, depth: wallThickness },
      scene
    );
    bottomWall.position = new BABYLON.Vector3(0, wallThickness/2, fieldHeight/2 - wallThickness);
    bottomWall.material = wallMaterial;

    wallsRef.current = [topWall, bottomWall];

    gameFieldRef.current = {
      width: playableWidth,
      height: playableHeight,
      paddleXPos: paddleXPosition
    };
  };

  const startCountdown = () => {
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
  };

  const resetBall = () => {
    if (!ballRef.current) return;
    const ballRadius = ballRef.current.getBoundingInfo().boundingSphere.radius;
    ballRef.current.position = new BABYLON.Vector3(0, ballRadius, 0);
    const speedFactor = gameFieldRef.current.width * 0.005;
    const dirX = Math.random() > 0.5 ? speedFactor : -speedFactor;
    const dirZ = (Math.random() - 0.5) * speedFactor * (window.innerWidth < 600 ? 0.7 : 1);

    ballDirectionRef.current = { x: dirX, y: 0, z: dirZ };
  };

  const startGame = () => {
    setScore({ player1: 0, player2: 0 });
    setEditViewMode(false);
    setCurrentView(0);
    resetBall();
    startCountdown();
    if (cameraRef.current) {
      cameraRef.current.alpha = Math.PI / 2;
      cameraRef.current.beta = Math.PI / 4;
    }
  };

  const rematch = () => {
    startGame();
  };

  const togglePause = () => {
    setGamePaused((prev) => !prev);

    if (gamePaused) {
      startGameLoop();
    } else {
      stopGameLoop();
    }
  };

  const backToMenu = () => {
    stopGameLoop();
    setGameStarted(false);
    setGamePaused(false);
    setShowMenu(true);
  };

  const quitGame = () => {
    stopGameLoop();

    // Quitter le mode plein écran avant de naviguer
    if (document.fullscreenElement) {
      document.exitFullscreen().then(() => {
        navigate('/game');
      }).catch(err => {
        console.error('Erreur lors de la sortie du mode plein écran:', err);
        navigate('/game'); // Naviguer même en cas d'erreur
      });
    } else {
      navigate('/game');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      const container = document.documentElement;
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          console.error('Erreur lors du passage en plein écran:', err);
        });
      }
    }
  };

  const toggleEditViewMode = () => {
    if (gameStarted && !gamePaused && !showMenu) {
      setEditViewMode(prev => !prev);
    }
  };

  const changeView = () => {
    if (!cameraRef.current) return;

    const nextView = (currentView + 1) % 3;
    setCurrentView(nextView);

    const camera = cameraRef.current;

    switch (nextView) {
      case 0:
        camera.alpha = Math.PI / 2;
        camera.beta = Math.PI / 4;
        camera.radius = Math.max(gameFieldRef.current.width, gameFieldRef.current.height) * 2;
        break;
      case 1:
        camera.alpha = Math.PI / 2;
        camera.beta = Math.PI / 16;
        camera.radius = Math.max(gameFieldRef.current.width, gameFieldRef.current.height) * 1.0;
        break;
      case 2:
        camera.alpha = 0;
        camera.beta = Math.PI / 4;
        camera.radius = Math.max(gameFieldRef.current.width, gameFieldRef.current.height) * 2;
        break;
    }
  };

  const startGameLoop = () => {
    if (gameLoopRef.current) return;

    const updateGame = () => {
      if (!gameStarted || gamePaused) return;

      updateBallPosition();
      updatePaddlePositions();
      checkCollisions();

      gameLoopRef.current = requestAnimationFrame(updateGame);
    };

    gameLoopRef.current = requestAnimationFrame(updateGame);
  };

  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  const updateBallPosition = () => {
    if (!ballRef.current || editViewMode) return;

    ballRef.current.position.x += ballDirectionRef.current.x;
    ballRef.current.position.y += ballDirectionRef.current.y;
    ballRef.current.position.z += ballDirectionRef.current.z;
  };

  const updatePaddlePositions = () => {
    if (!paddleLeftRef.current || !paddleRightRef.current || editViewMode) return;

    const paddleSpeed = gameFieldRef.current.height * 0.01;

    if (keysPressed.current['w'] || keysPressed.current['W']) {
      paddleRightRef.current.position.z -= paddleSpeed; // W: raquette gauche vers le haut
    }
    if (keysPressed.current['s'] || keysPressed.current['S']) {
      paddleRightRef.current.position.z += paddleSpeed; // S: raquette gauche vers le bas
    }

    if (keysPressed.current['ArrowUp']) {
      paddleLeftRef.current.position.z -= paddleSpeed; // Flèche haut: raquette droite vers le haut
    }
    if (keysPressed.current['ArrowDown']) {
      paddleLeftRef.current.position.z += paddleSpeed; // Flèche bas: raquette droite vers le bas
    }

    const paddleLimit = gameFieldRef.current.height * 0.45;
    paddleLeftRef.current.position.z = Math.max(
      -paddleLimit,
      Math.min(paddleLeftRef.current.position.z, paddleLimit)
    );
    paddleRightRef.current.position.z = Math.max(
      -paddleLimit,
      Math.min(paddleRightRef.current.position.z, paddleLimit)
    );
  };

  const checkCollisions = () => {
    if (!ballRef.current || !paddleLeftRef.current || !paddleRightRef.current) return;

    const ball = ballRef.current;
    const paddleLeft = paddleLeftRef.current;
    const paddleRight = paddleRightRef.current;
    const field = gameFieldRef.current;

    const paddleWidth = 0.3;
    const paddleHalfHeight = paddleLeft.getBoundingInfo().boundingBox.extendSize.z;

    const wallLimit = field.height / 2 - ball.getBoundingInfo().boundingSphere.radius;
    if (ball.position.z <= -wallLimit || ball.position.z >= wallLimit) {
      ballDirectionRef.current.z = -ballDirectionRef.current.z;
    }

    if (
      ball.position.x <= -field.paddleXPos + paddleWidth &&
      ball.position.x >= -field.paddleXPos - paddleWidth &&
      ball.position.z >= paddleLeft.position.z - paddleHalfHeight &&
      ball.position.z <= paddleLeft.position.z + paddleHalfHeight
    ) {
      ballDirectionRef.current.x = -ballDirectionRef.current.x * BALL_SPEED_INCREASE;

      const hitPosition = ball.position.z - paddleLeft.position.z;
      ballDirectionRef.current.z += hitPosition * 0.05;
    }

    if (
      ball.position.x >= field.paddleXPos - paddleWidth &&
      ball.position.x <= field.paddleXPos + paddleWidth &&
      ball.position.z >= paddleRight.position.z - paddleHalfHeight &&
      ball.position.z <= paddleRight.position.z + paddleHalfHeight
    ) {
      ballDirectionRef.current.x = -ballDirectionRef.current.x * BALL_SPEED_INCREASE;

      const hitPosition = ball.position.z - paddleRight.position.z;
      ballDirectionRef.current.z += hitPosition * 0.05;
    }

    const scoreLimit = field.width / 2 + 1;
    if (ball.position.x < -scoreLimit) {
      setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
      checkGameOver(0, score.player2 + 1);
      resetBall();
    } else if (ball.position.x > scoreLimit) {
      setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
      checkGameOver(score.player1 + 1, 0);
      resetBall();
    }
  };

  const checkGameOver = (player1Score: number, player2Score: number) => {
    if (player1Score >= MAX_SCORE || player2Score >= MAX_SCORE) {
      stopGameLoop();
      setGameStarted(false);
      setShowMenu(true);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;

      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (gameStarted && !gamePaused && !showMenu) {
          togglePause();
        } else if (gameStarted && gamePaused) {
          togglePause();
        }
      }
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        if (gameStarted && !gamePaused && !showMenu) {
          toggleEditViewMode();
        }
      }
      if ((e.key === 'q' || e.key === 'Q') && (gamePaused || showMenu)) {
        e.preventDefault();
        quitGame();
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
  }, [gameStarted, gamePaused, showMenu, editViewMode, currentView]);

  useEffect(() => {
    if (gameStarted && !gamePaused) {
      startGameLoop();
    } else {
      stopGameLoop();
    }

    return () => {
      stopGameLoop();
    };
  }, [gameStarted, gamePaused]);

  return (
    <div className={PongStyle.container}>
      <canvas ref={canvasRef} className={PongStyle.canvas} />

      {gameStarted && !showMenu && (
        <>
          <div className={PongStyle.score}>
            {score.player1} - {score.player2}
            {editViewMode && (
              <div className={PongStyle.viewModeText}>
                Mode Édition Vue Activé (V pour désactiver)
              </div>
            )}
            <div className={PongStyle.viewIndicator}>
              Vue {currentView + 1}: {currentView === 0 ? "Face" : currentView === 1 ? "Dessus" : "Côté"}
            </div>
          </div>
        </>
      )}

      {showMenu && (
        <div className={PongStyle.overlay}>
          <h1 className={PongStyle.title}>Pong 3D</h1>
          {(score.player1 > 0 || score.player2 > 0) && (
            <h2 className={PongStyle.subtitle}>
              {score.player1 >= MAX_SCORE
                ? "Joueur 1 gagne!"
                : score.player2 >= MAX_SCORE
                ? "Joueur 2 gagne!"
                : `Score: ${score.player1} - ${score.player2}`}
            </h2>
          )}
          <button className={PongStyle.button} onClick={startGame}>
            {score.player1 > 0 || score.player2 > 0 ? "Nouvelle Partie" : "Commencer"}
          </button>
          {(score.player1 > 0 || score.player2 > 0) && (
            <button className={PongStyle.button} onClick={rematch}>
              Revanche
            </button>
          )}
          <button className={PongStyle.buttonDanger} onClick={quitGame}>
            Quitter
          </button>
          <div className={PongStyle.smallText}>
            Commandes: W/S et Flèches pour bouger | F: Plein écran | P: Pause | V: Mode Édition Vue | C: Changer Vue | ESC: Menu | Espace: Page Jeux
          </div>
        </div>
      )}

      {gameStarted && gamePaused && !showMenu && (
        <div className={PongStyle.overlay}>
          <h1 className={PongStyle.title}>Pause</h1>
          <button className={PongStyle.button} onClick={togglePause}>
            Reprendre
          </button>
          <button className={PongStyle.button} onClick={changeView}>
            Vue: {currentView === 0 ? "Face" : currentView === 1 ? "Dessus" : "Côté"}
          </button>
          <button className={PongStyle.button} onClick={backToMenu}>
            Menu Principal
          </button>
          <button className={PongStyle.buttonDanger} onClick={quitGame}>
            Quitter
          </button>
        </div>
      )}

      {countdown > 0 && (
        <div className={PongStyle.overlay}>
          <h1>{countdown}</h1>
        </div>
      )}
    </div>
  );
}
