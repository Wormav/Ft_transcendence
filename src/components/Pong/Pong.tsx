import { useEffect, useRef, useState } from 'react';
import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';
import { useNavigate } from 'react-router-dom';


// Style global pour s'assurer que le jeu prend tout l'écran
const globalStyle = document.createElement('style');
globalStyle.innerHTML = `
  body, html {
    margin: 0;
    padding: 0;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
  #root {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .pong3d-fullscreen .layout {
    padding: 0 !important;
    margin: 0 !important;
    width: 100% !important;
    height: 100vh !important;
    overflow: hidden !important;
  }
  .pong3d-fullscreen [class*="outletDiv"] {
    padding: 0 !important;
    margin: 0 !important;
    width: 10          <button style={{...styles.button, backgroundColor: '#d9534f'}} onClick={quitGame}>
            Quitter
          </button>
          <div style={{marginTop: '20px', fontSize: '14px', color: '#ccc'}}>
            Commandes: W/S et Flèches pour bouger | F: Plein écran | ESC: Pause | V: Mode Édition Vue | C: Changer de Vue
          </div>portant;
    max-width: 100% !important;
    height: 100vh !important;
    margin-left: 0 !important;
  }
  .pong3d-fullscreen footer,
  .pong3d-fullscreen nav,
  .pong3d-fullscreen aside {
    display: none !important;
  }
`;
document.head.appendChild(globalStyle);

// Styles pour le conteneur du jeu avec responsive design
const styles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    zIndex: 9999,
  },
  canvas: {
    width: '100%',
    height: '100%',
    outline: 'none',
    display: 'block',
  },
  overlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: 'white',
    zIndex: 10,
    padding: '20px',
    boxSizing: 'border-box' as const,
    overflowY: 'auto' as const,
  },
  score: {
    position: 'absolute' as const,
    top: '10px',
    left: 0,
    width: '100%',
    textAlign: 'center' as const,
    color: 'white',
    fontSize: window.innerWidth < 600 ? '18px' : '24px',
    fontWeight: 'bold' as const,
    zIndex: 5,
    padding: '0 10px',
    boxSizing: 'border-box' as const,
  },
  button: {
    padding: window.innerWidth < 600 ? '8px 16px' : '12px 24px',
    margin: '10px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: window.innerWidth < 600 ? '14px' : '16px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    maxWidth: '100%',
    textAlign: 'center' as const,
  },
};

export default function Pong() {
  // Utilisation de navigate pour retourner à la page précédente
  const navigate = useNavigate();

  // Références
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<BABYLON.Engine | null>(null);
  const sceneRef = useRef<BABYLON.Scene | null>(null);
  const cameraRef = useRef<BABYLON.ArcRotateCamera | null>(null);
  const gameLoopRef = useRef<number | null>(null);

  // États du jeu
  const [gameStarted, setGameStarted] = useState(false);
  const [gamePaused, setGamePaused] = useState(false);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [showMenu, setShowMenu] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [editViewMode, setEditViewMode] = useState(false); // Mode d'édition de vue
  const [currentView, setCurrentView] = useState(0); // Vue actuelle (0, 1, 2)

  // États des objets du jeu
  const paddleLeftRef = useRef<BABYLON.Mesh | null>(null);
  const paddleRightRef = useRef<BABYLON.Mesh | null>(null);
  const ballRef = useRef<BABYLON.Mesh | null>(null);
  const ballDirectionRef = useRef({ x: 0.05, y: 0.02, z: 0 });
  const keysPressed = useRef<{ [key: string]: boolean }>({});
  const wallsRef = useRef<BABYLON.Mesh[]>([]);
  // Référence pour les dimensions du terrain
  const gameFieldRef = useRef<{ width: number; height: number; paddleXPos: number }>({ width: 0, height: 0, paddleXPos: 0 });

  // Constantes du jeu
  const BALL_SPEED_INCREASE = 1.05;
  const MAX_SCORE = 10;

  // Initialisation de Babylon.js
  useEffect(() => {
    if (!canvasRef.current) return;

    // Création du moteur et de la scène
    const engine = new BABYLON.Engine(canvasRef.current, true);
    engineRef.current = engine;
    const scene = new BABYLON.Scene(engine);
    sceneRef.current = scene;

    // Configuration de la scène
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1);

    // Calculer les dimensions du terrain en fonction de l'écran
    // Facteur d'échelle pour Babylon.js (les unités Babylon sont arbitraires)
    // Nous utilisons un facteur permettant au terrain de bien s'adapter à la vue
    const scaleFactor = 10;
    const aspectRatio = window.innerWidth / window.innerHeight;

    // Calcul des dimensions réelles du terrain avec l'aspect ratio de l'écran
    const fieldWidth = scaleFactor * 2; // Base de référence pour la largeur
    const fieldHeight = fieldWidth / aspectRatio;

    // Ajuster la hauteur de la caméra pour voir tout le terrain
    const cameraHeight = Math.max(fieldWidth, fieldHeight) * 0.75;

    // Caméra avec contrôle à la souris
    const camera = new BABYLON.ArcRotateCamera(
      "camera",
      Math.PI / 2,    // Alpha (vue de face au début)
      Math.PI / 4,    // Beta (légèrement incliné vers le bas)
      cameraHeight,   // Rayon (distance)
      new BABYLON.Vector3(0, 0, 0), // Point cible
      scene
    );

    // Limites pour éviter des angles de vue trop extrêmes
    camera.lowerBetaLimit = 0.1;                // Limite inférieure de l'angle beta (évite d'aller sous le sol)
    camera.upperBetaLimit = Math.PI / 2 - 0.1;  // Limite supérieure de l'angle beta (évite la vue trop verticale)
    camera.lowerAlphaLimit = 0;                 // Limite gauche de rotation
    camera.upperAlphaLimit = Math.PI;           // Limite droite de rotation (vue limitée à 180°)

    // Distance min et max de zoom
    camera.lowerRadiusLimit = 5;
    camera.upperRadiusLimit = cameraHeight * 1.5;

    // Activer les contrôles de la caméra avec la souris
    camera.attachControl(canvasRef.current, true);

    // Stocker la référence de la caméra
    cameraRef.current = camera;

    // Lumières
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

    // Création des éléments du jeu
    createGameElements(scene);

    // Boucle de rendu
    engine.runRenderLoop(() => {
      scene.render();
    });

    // Gestion du redimensionnement
    window.addEventListener("resize", () => {
      engine.resize();
    });

    // Nettoyage
    return () => {
      scene.dispose();
      engine.dispose();
      window.removeEventListener("resize", () => {
        engine.resize();
      });
    };
  }, []);

  // Nettoyage lors du démontage du composant
  useEffect(() => {
    // Ajouter une classe au corps du document pour permettre au jeu de prendre tout l'écran
    document.body.classList.add('pong3d-fullscreen');

    return () => {
      // Nettoyer le style global lorsque le composant est démonté
      try {
        document.head.removeChild(globalStyle);
        document.body.classList.remove('pong3d-fullscreen');
      } catch (e) {
        // Ignorer les erreurs si l'élément a déjà été supprimé
      }
    };
  }, []);

  // Passer automatiquement en mode plein écran au démarrage
  useEffect(() => {
    // Petit délai pour permettre au DOM de se charger complètement
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

  // Détecter les changements de plein écran et redimensionnement
  useEffect(() => {
    const handleFullscreenChange = () => {
      // Si l'utilisateur quitte le plein écran manuellement, revenir immédiatement en plein écran
      if (!document.fullscreenElement && gameStarted) {
        const container = document.documentElement;
        if (container.requestFullscreen) {
          container.requestFullscreen().catch(err => {
            console.error('Erreur lors du passage en plein écran:', err);
          });
        }
      }
    };

    // Gérer le redimensionnement de la fenêtre
    const handleResize = () => {
      if (engineRef.current && cameraRef.current && sceneRef.current) {
        // Recalculer les dimensions du terrain
        const aspectRatio = window.innerWidth / window.innerHeight;
        const scaleFactor = 10;
        const fieldWidth = scaleFactor * 2;
        const fieldHeight = fieldWidth / aspectRatio;

        // Ajuster la caméra à la nouvelle taille de fenêtre
        const cameraHeight = Math.max(fieldWidth, fieldHeight) * 0.75;
        cameraRef.current.radius = cameraHeight;

        // Redimensionner le moteur
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

  // Création des éléments du jeu
  const createGameElements = (scene: BABYLON.Scene) => {
    // Calculer les dimensions du terrain en fonction de l'écran
    const aspectRatio = window.innerWidth / window.innerHeight;
    const scaleFactor = 10; // Facteur d'échelle pour l'unité Babylon
    const fieldWidth = scaleFactor * 2; // Largeur de base
    const fieldHeight = fieldWidth / aspectRatio; // Hauteur ajustée à l'aspect ratio

    // Ajouter une marge de 5% autour du terrain
    const margin = 0.05; // 5% de marge
    const playableWidth = fieldWidth * (1 - 2 * margin); // Réduction totale de 10% (5% de chaque côté)
    const playableHeight = fieldHeight * (1 - 2 * margin);

    // Position des paddles par rapport au bord avec marge
    const paddleXPosition = (playableWidth / 2);

    // Matériaux
    const paddleMaterial = new BABYLON.StandardMaterial("paddleMaterial", scene);
    paddleMaterial.diffuseColor = new BABYLON.Color3(0.2, 0.4, 0.8);
    paddleMaterial.emissiveColor = new BABYLON.Color3(0.1, 0.2, 0.4);

    const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);
    ballMaterial.diffuseColor = new BABYLON.Color3(0.8, 0.2, 0.2);
    ballMaterial.emissiveColor = new BABYLON.Color3(0.4, 0.1, 0.1);

    const wallMaterial = new BABYLON.StandardMaterial("wallMaterial", scene);
    wallMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
    wallMaterial.alpha = 0.5;

    // Surface de jeu
    const ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: fieldWidth, height: fieldHeight },
      scene
    );
    const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", scene);
    groundMaterial.diffuseColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    groundMaterial.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1);
    ground.material = groundMaterial;

    // Ligne centrale
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

    // Paddles (adapter la taille en fonction de la hauteur du terrain)
    const paddleHeight = playableHeight * 0.15; // Hauteur du paddle à 15% de la hauteur du terrain
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

    // Balle
    const ballDiameter = Math.min(playableWidth, playableHeight) * 0.025; // Taille proportionnelle à la taille du terrain
    const ball = BABYLON.MeshBuilder.CreateSphere(
      "ball",
      { diameter: ballDiameter },
      scene
    );
    ball.position = new BABYLON.Vector3(0, ballDiameter/2, 0);
    ball.material = ballMaterial;
    ballRef.current = ball;

    // Murs (haut et bas)
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

    // Stocker les limites du terrain pour utilisation dans la logique du jeu
    gameFieldRef.current = {
      width: playableWidth,
      height: playableHeight,
      paddleXPos: paddleXPosition
    };
  };



  // Démarrer le compte à rebours
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

  // Réinitialiser la balle
  const resetBall = () => {
    if (!ballRef.current) return;

    // Positionner la balle au centre du terrain
    const ballRadius = ballRef.current.getBoundingInfo().boundingSphere.radius;
    ballRef.current.position = new BABYLON.Vector3(0, ballRadius, 0);

    // Direction aléatoire mais en s'assurant qu'elle va vers un joueur
    const speedFactor = gameFieldRef.current.width * 0.005; // Vitesse adaptative en fonction de la taille du terrain
    const dirX = Math.random() > 0.5 ? speedFactor : -speedFactor;
    // Utiliser une vitesse verticale moins agressive sur les petits écrans
    const dirZ = (Math.random() - 0.5) * speedFactor * (window.innerWidth < 600 ? 0.7 : 1);

    ballDirectionRef.current = { x: dirX, y: 0, z: dirZ };
  };

  // Démarrer le jeu
  const startGame = () => {
    setScore({ player1: 0, player2: 0 });
    setEditViewMode(false); // Désactiver le mode d'édition de vue au démarrage
    setCurrentView(0); // Réinitialiser à la vue par défaut
    resetBall();
    startCountdown();

    // S'assurer que la caméra est dans la vue par défaut
    if (cameraRef.current) {
      cameraRef.current.alpha = Math.PI / 2;
      cameraRef.current.beta = Math.PI / 4;
    }
  };

  // Remettre à zéro pour une nouvelle partie
  const rematch = () => {
    startGame();
  };

  // Mettre en pause ou reprendre
  const togglePause = () => {
    setGamePaused((prev) => !prev);

    if (gamePaused) {
      startGameLoop();
    } else {
      stopGameLoop();
    }
  };

  // Retour au menu
  const backToMenu = () => {
    stopGameLoop();
    setGameStarted(false);
    setGamePaused(false);
    setShowMenu(true);
  };

  // Quitter le jeu et retourner à la page d'accueil
  const quitGame = () => {
    stopGameLoop();
    // Ne plus quitter le mode plein écran quand on quitte le jeu
    // Retourner à la page d'accueil
    navigate('/');
  };

  // Basculer le mode plein écran
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      // Passer en plein écran si pas déjà en plein écran
      const container = document.documentElement;
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          console.error('Erreur lors du passage en plein écran:', err);
        });
      }
    }
    // Suppression de la possibilité de quitter le plein écran
  };

  // Basculer le mode d'édition de vue
  const toggleEditViewMode = () => {
    if (gameStarted && !gamePaused && !showMenu) {
      setEditViewMode(prev => !prev);
    }
  };  // Fonction pour changer la vue de la caméra
  const changeView = () => {
    if (!cameraRef.current) return;

    // Passer à la vue suivante (cycle entre 0, 1, 2)
    const nextView = (currentView + 1) % 3;
    setCurrentView(nextView);

    const camera = cameraRef.current;

    // Définir les paramètres de la caméra en fonction de la vue sélectionnée
    switch (nextView) {
      case 0: // Vue par défaut (légèrement inclinée)
        camera.alpha = Math.PI / 2;   // Vue de face
        camera.beta = Math.PI / 4;    // Légèrement inclinée vers le bas
        camera.radius = Math.max(gameFieldRef.current.width, gameFieldRef.current.height) * 2;
        break;
      case 1: // Vue de dessus
        camera.alpha = Math.PI / 2;   // Vue de face
        camera.beta = Math.PI / 16;   // Vue presque de dessus
        camera.radius = Math.max(gameFieldRef.current.width, gameFieldRef.current.height) * 1.0;
        break;
      case 2: // Vue latérale
        camera.alpha = 0;             // Vue de côté
        camera.beta = Math.PI / 4;    // Légèrement inclinée vers le bas
        camera.radius = Math.max(gameFieldRef.current.width, gameFieldRef.current.height) * 2;
        break;
    }
  };

  // Démarrer la boucle de jeu
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

  // Arrêter la boucle de jeu
  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
  };

  // Mise à jour de la position de la balle
  const updateBallPosition = () => {
    if (!ballRef.current || editViewMode) return;

    ballRef.current.position.x += ballDirectionRef.current.x;
    ballRef.current.position.y += ballDirectionRef.current.y;
    ballRef.current.position.z += ballDirectionRef.current.z;
  };

  // Mise à jour des positions des paddles
  const updatePaddlePositions = () => {
    if (!paddleLeftRef.current || !paddleRightRef.current || editViewMode) return;

    const paddleSpeed = gameFieldRef.current.height * 0.01; // Vitesse proportionnelle à la hauteur du terrain

    // Joueur 1 (W/S)
    if (keysPressed.current['w'] || keysPressed.current['W']) {
      paddleLeftRef.current.position.z -= paddleSpeed;
    }
    if (keysPressed.current['s'] || keysPressed.current['S']) {
      paddleLeftRef.current.position.z += paddleSpeed;
    }

    // Joueur 2 (flèches haut/bas)
    if (keysPressed.current['ArrowUp']) {
      paddleRightRef.current.position.z -= paddleSpeed;
    }
    if (keysPressed.current['ArrowDown']) {
      paddleRightRef.current.position.z += paddleSpeed;
    }

    // Limites des paddles (45% de la hauteur du terrain pour éviter de sortir)
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

  // Vérification des collisions
  const checkCollisions = () => {
    if (!ballRef.current || !paddleLeftRef.current || !paddleRightRef.current) return;

    const ball = ballRef.current;
    const paddleLeft = paddleLeftRef.current;
    const paddleRight = paddleRightRef.current;
    const field = gameFieldRef.current;

    // Taille des paddles (pour la détection des collisions)
    const paddleWidth = 0.3; // Largeur du paddle (fixe)
    const paddleHalfHeight = paddleLeft.getBoundingInfo().boundingBox.extendSize.z;

    // Détection des collisions avec les murs (haut et bas)
    const wallLimit = field.height / 2 - ball.getBoundingInfo().boundingSphere.radius;
    if (ball.position.z <= -wallLimit || ball.position.z >= wallLimit) {
      ballDirectionRef.current.z = -ballDirectionRef.current.z;
    }

    // Collision avec le paddle gauche
    if (
      ball.position.x <= -field.paddleXPos + paddleWidth &&
      ball.position.x >= -field.paddleXPos - paddleWidth &&
      ball.position.z >= paddleLeft.position.z - paddleHalfHeight &&
      ball.position.z <= paddleLeft.position.z + paddleHalfHeight
    ) {
      // Inverser la direction X et augmenter légèrement la vitesse
      ballDirectionRef.current.x = -ballDirectionRef.current.x * BALL_SPEED_INCREASE;

      // Ajuster l'angle en fonction de l'endroit où la balle frappe le paddle
      const hitPosition = ball.position.z - paddleLeft.position.z;
      ballDirectionRef.current.z += hitPosition * 0.05;
    }

    // Collision avec le paddle droit
    if (
      ball.position.x >= field.paddleXPos - paddleWidth &&
      ball.position.x <= field.paddleXPos + paddleWidth &&
      ball.position.z >= paddleRight.position.z - paddleHalfHeight &&
      ball.position.z <= paddleRight.position.z + paddleHalfHeight
    ) {
      // Inverser la direction X et augmenter légèrement la vitesse
      ballDirectionRef.current.x = -ballDirectionRef.current.x * BALL_SPEED_INCREASE;

      // Ajuster l'angle en fonction de l'endroit où la balle frappe le paddle
      const hitPosition = ball.position.z - paddleRight.position.z;
      ballDirectionRef.current.z += hitPosition * 0.05;
    }

    // Marquer des points (balle dépasse les paddles)
    const scoreLimit = field.width / 2 + 1; // Légère marge au-delà du terrain
    if (ball.position.x < -scoreLimit) {
      // Point pour le joueur 2
      setScore((prev) => ({ ...prev, player2: prev.player2 + 1 }));
      checkGameOver(0, score.player2 + 1);
      resetBall();
    } else if (ball.position.x > scoreLimit) {
      // Point pour le joueur 1
      setScore((prev) => ({ ...prev, player1: prev.player1 + 1 }));
      checkGameOver(score.player1 + 1, 0);
      resetBall();
    }
  };

  // Vérifier si la partie est terminée
  const checkGameOver = (player1Score: number, player2Score: number) => {
    if (player1Score >= MAX_SCORE || player2Score >= MAX_SCORE) {
      stopGameLoop();
      setGameStarted(false);
      setShowMenu(true);
    }
  };

  // Gestion des entrées clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current[e.key] = true;

      // Touche P pour la pause
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        if (gameStarted && !gamePaused && !showMenu) {
          // Mettre le jeu en pause et afficher le menu de pause
          togglePause();
        } else if (gameStarted && gamePaused) {
          // Reprendre le jeu depuis la pause
          togglePause();
        }
      }

      // Touche Echap pour retourner au menu ou mettre en pause
      if (e.key === 'Escape') {
        e.preventDefault();
        if (gameStarted && !gamePaused && !showMenu) {
          setGamePaused(true); // Mettre le jeu en pause
        } else if (gameStarted && gamePaused && !showMenu) {
          backToMenu(); // Retourner au menu principal depuis la pause
        }
      }


      // Touche F pour le plein écran
      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      }

      // Touche V pour basculer le mode d'édition de vue
      if (e.key === 'v' || e.key === 'V') {
        e.preventDefault();
        if (gameStarted && !gamePaused && !showMenu) {
          toggleEditViewMode();
        }
      }

      // Touche C pour changer de vue
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        if ((gameStarted && !gamePaused && !showMenu) || editViewMode) {
          changeView();
        }
      }

      // Touche Q pour quitter le jeu
      if ((e.key === 'q' || e.key === 'Q') && (gamePaused || showMenu)) {
        e.preventDefault();
        quitGame();
      }

      // Touche Espace pour naviguer vers la page de jeu
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        navigate('/game');
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

  // Commencer automatiquement la boucle de jeu lorsque le jeu démarre
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
    <div style={styles.container}>
      <canvas ref={canvasRef} style={styles.canvas} />

      {/* Affichage du score */}
      {gameStarted && !showMenu && (
        <>
          <div style={styles.score}>
            {score.player1} - {score.player2}
            {editViewMode && (
              <div style={{ fontSize: '16px', fontWeight: 'normal', opacity: 0.8 }}>
                Mode Édition Vue Activé (V pour désactiver)
              </div>
            )}
            <div style={{ fontSize: '14px', fontWeight: 'normal', opacity: 0.7, marginTop: '5px' }}>
              Vue {currentView + 1}: {currentView === 0 ? "Face" : currentView === 1 ? "Dessus" : "Côté"}
            </div>
          </div>
        </>
      )}

      {/* Menu de démarrage */}
      {showMenu && (
        <div style={styles.overlay}>
          <h1 style={{fontSize: window.innerWidth < 600 ? '28px' : '36px', textAlign: 'center'}}>Pong 3D</h1>
          {(score.player1 > 0 || score.player2 > 0) && (
            <h2 style={{fontSize: window.innerWidth < 600 ? '20px' : '24px', textAlign: 'center'}}>
              {score.player1 >= MAX_SCORE
                ? "Joueur 1 gagne!"
                : score.player2 >= MAX_SCORE
                ? "Joueur 2 gagne!"
                : `Score: ${score.player1} - ${score.player2}`}
            </h2>
          )}
          <button style={styles.button} onClick={startGame}>
            {score.player1 > 0 || score.player2 > 0 ? "Nouvelle Partie" : "Commencer"}
          </button>
          {(score.player1 > 0 || score.player2 > 0) && (
            <button style={styles.button} onClick={rematch}>
              Revanche
            </button>
          )}
          <button style={{...styles.button, backgroundColor: '#d9534f'}} onClick={quitGame}>
            Quitter
          </button>
          <div style={{
            marginTop: '20px',
            fontSize: window.innerWidth < 600 ? '12px' : '14px',
            color: '#ccc',
            textAlign: 'center',
            maxWidth: '90%'
          }}>
            Commandes: W/S et Flèches pour bouger | F: Plein écran | P: Pause | V: Mode Édition Vue | C: Changer Vue | ESC: Menu | Espace: Page Jeux
          </div>
        </div>
      )}

      {/* Écran de pause */}
      {gameStarted && gamePaused && !showMenu && (
        <div style={styles.overlay}>
          <h1 style={{fontSize: window.innerWidth < 600 ? '28px' : '36px', textAlign: 'center'}}>Pause</h1>
          <button style={styles.button} onClick={togglePause}>
            Reprendre
          </button>
          <button style={styles.button} onClick={toggleEditViewMode}>
            {editViewMode ? "Désactiver Mode Édition Vue" : "Activer Mode Édition Vue"}
          </button>
          <button style={styles.button} onClick={changeView}>
            Vue: {currentView === 0 ? "Face" : currentView === 1 ? "Dessus" : "Côté"}
          </button>
          <button style={styles.button} onClick={backToMenu}>
            Menu Principal
          </button>
          <button style={{...styles.button, backgroundColor: '#d9534f'}} onClick={quitGame}>
            Quitter
          </button>
        </div>
      )}

      {/* Compte à rebours */}
      {countdown > 0 && (
        <div style={styles.overlay}>
          <h1>{countdown}</h1>
        </div>
      )}
    </div>
  );
}
