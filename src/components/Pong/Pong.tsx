import { useState, useEffect, useRef, useCallback } from 'react';
import PongStyle from './PongStyle';

export default function Pong() {
	// Game states
	const [gameStarted, setGameStarted] = useState(false);
	const [gamePaused, setGamePaused] = useState(false);
	const [score, setScore] = useState({ player1: 0, player2: 0 });
	const [showMenu, setShowMenu] = useState(true);
	const [countdown, setCountdown] = useState(0);
	const [isMobileMode, setIsMobileMode] = useState(false);
	const [isFullscreen, setIsFullscreen] = useState(false);

	// Game element references
	const containerRef = useRef<HTMLDivElement>(null);
	const player1Ref = useRef<HTMLDivElement>(null);
	const player2Ref = useRef<HTMLDivElement>(null);
	const ballRef = useRef<HTMLDivElement>(null);

	// Movement states
	const [player1Position, setPlayer1Position] = useState(250);
	const [player2Position, setPlayer2Position] = useState(250);
	const [ballPosition, setBallPosition] = useState({ x: 0, y: 0 });
	const [ballDirection, setBallDirection] = useState({ x: 5, y: 5 });

	// Key states
	const keysPressed = useRef<{ [key: string]: boolean }>({});

	// Animation frame
	const requestRef = useRef<number | undefined>(undefined);

	// Screen size detection for mobile mode
	useEffect(() => {
		const handleResize = () => {
			const isMobile = window.innerWidth < 768; // Typical width to consider a device as mobile (768px)
			setIsMobileMode(isMobile);
		};

		// Initialization
		handleResize();

		// Listener for screen size changes
		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	// Fullscreen mode handling
	const toggleFullscreen = useCallback(() => {
		if (!document.fullscreenElement) {
			// Switch to fullscreen mode
			if (containerRef.current?.requestFullscreen) {
				containerRef.current.requestFullscreen()
					.then(() => {
						setIsFullscreen(true);
					})
					.catch(err => {
						console.error('Error entering fullscreen mode:', err);
					});
			}
		} else {
			// Exit fullscreen mode
			if (document.exitFullscreen) {
				document.exitFullscreen()
					.then(() => {
						setIsFullscreen(false);
					})
					.catch(err => {
						console.error('Error exiting fullscreen mode:', err);
					});
			}
		}
	}, []);

	// Monitor external fullscreen changes
	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener('fullscreenchange', handleFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', handleFullscreenChange);
		};
	}, []);

	// Initialize ball position
	const resetBall = useCallback(() => {
		setBallPosition({ x: 0, y: 0 });
		// Random direction but make sure it's not too vertical
		if (isMobileMode) {
			const randomY = Math.random() > 0.5 ? 5 : -5;
			const randomX = (Math.random() - 0.5) * 6;
			setBallDirection({ x: randomX, y: randomY });
		} else {
			const randomX = Math.random() > 0.5 ? 5 : -5;
			const randomY = (Math.random() - 0.5) * 6;
			setBallDirection({ x: randomX, y: randomY });
		}
	}, [isMobileMode]);

	// Start countdown before game
	const startCountdown = useCallback(() => {
		setCountdown(3);
		setShowMenu(false);

		const intervalId = setInterval(() => {
			setCountdown(prev => {
				if (prev <= 1) {
					clearInterval(intervalId);
					setGameStarted(true);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => clearInterval(intervalId);
	}, []);

	// Start game
	const startGame = useCallback(() => {
		setScore({ player1: 0, player2: 0 });
		resetBall();
		startCountdown();
	}, [resetBall, startCountdown]);

	// Rematch
	const rematch = useCallback(() => {
		startGame();
	}, [startGame]);

	// Pause or resume
	const togglePause = useCallback(() => {
		setGamePaused(prev => !prev);
	}, []);

	// Back to menu
	const backToMenu = useCallback(() => {
		setGameStarted(false);
		setGamePaused(false);
		setShowMenu(true);
	}, []);

	// Keyboard controls handling
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			keysPressed.current[e.key] = true;

			// Escape key handling without exiting fullscreen
			if (e.key === 'Escape') {
				// Prevent default behavior (exit fullscreen)
				e.preventDefault();

				if (gameStarted && !gamePaused) {
					// If game is running, pause it
					togglePause();
				} else if (gameStarted && gamePaused) {
					// If game is paused, resume it
					togglePause();
				} else if (!gameStarted && !showMenu) {
					// If countdown is running, go back to menu
					backToMenu();
				}
			}

			// Fullscreen key handling (F or M)
			if (e.key === 'f' || e.key === 'F' || e.key === 'm' || e.key === 'M') {
				toggleFullscreen();
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
	}, [gameStarted, gamePaused, showMenu, togglePause, backToMenu, toggleFullscreen]);

	// Main game logic
	const updateGame = useCallback(() => {
		if (!gameStarted || gamePaused || !containerRef.current || !player1Ref.current || !player2Ref.current || !ballRef.current) return;

		const containerHeight = containerRef.current.clientHeight;
		const containerWidth = containerRef.current.clientWidth;

		// Different variables based on mode
		let paddleSize: number = 0, ballSize: number = 0, player1Pos: number = 0, player2Pos: number = 0;

		if (isMobileMode) {
			paddleSize = player1Ref.current.clientWidth;
			ballSize = ballRef.current.clientHeight;

			// Paddle movement in mobile mode
			const paddleSpeed = 10;

			// Player 1 (A/D)
			if (keysPressed.current['a'] || keysPressed.current['A']) {
				setPlayer1Position(prev => Math.max(prev - paddleSpeed, 0));
			}
			if (keysPressed.current['d'] || keysPressed.current['D']) {
				setPlayer1Position(prev => Math.min(prev + paddleSpeed, containerWidth - paddleSize));
			}

			// Player 2 (left/right arrows)
			if (keysPressed.current['ArrowLeft']) {
				setPlayer2Position(prev => Math.max(prev - paddleSpeed, 0));
			}
			if (keysPressed.current['ArrowRight']) {
				setPlayer2Position(prev => Math.min(prev + paddleSpeed, containerWidth - paddleSize));
			}

			player1Pos = player1Position - containerWidth / 2;
			player2Pos = player2Position - containerWidth / 2;
		} else {
			paddleSize = player1Ref.current.clientHeight;
			ballSize = ballRef.current.clientHeight;

			// Paddle movement in normal mode
			const paddleSpeed = 10;

			// Player 1 (W/S)
			if (keysPressed.current['w'] || keysPressed.current['W']) {
				setPlayer1Position(prev => Math.max(prev - paddleSpeed, 0));
			}
			if (keysPressed.current['s'] || keysPressed.current['S']) {
				setPlayer1Position(prev => Math.min(prev + paddleSpeed, containerHeight - paddleSize));
			}

			// Player 2 (up/down arrows)
			if (keysPressed.current['ArrowUp']) {
				setPlayer2Position(prev => Math.max(prev - paddleSpeed, 0));
			}
			if (keysPressed.current['ArrowDown']) {
				setPlayer2Position(prev => Math.min(prev + paddleSpeed, containerHeight - paddleSize));
			}

			player1Pos = player1Position - containerHeight / 2;
			player2Pos = player2Position - containerHeight / 2;
		}

		// Ball movement
		let newX = ballPosition.x + ballDirection.x;
		let newY = ballPosition.y + ballDirection.y;
		let newDirectionX = ballDirection.x;
		let newDirectionY = ballDirection.y;

		if (isMobileMode) {
			// Bounce off walls (left/right) in mobile mode
			if (newX <= -containerWidth / 2 + ballSize / 2 || newX >= containerWidth / 2 - ballSize / 2) {
				newDirectionX = -newDirectionX;
			}

			// Paddle collision in mobile mode
			const paddleHeight = player1Ref.current.clientHeight;
			const player1Top = -containerHeight / 2 + 16; // Adjusted according to top-4 style
			const player1Bottom = player1Top + paddleHeight;
			const player1Left = player1Position - containerWidth / 2;
			const player1Right = player1Left + paddleSize;

			const player2Top = containerHeight / 2 - 16 - paddleHeight; // Adjusted according to bottom-4 style
			const player2Bottom = player2Top + paddleHeight;
			const player2Left = player2Position - containerWidth / 2;
			const player2Right = player2Left + paddleSize;

			// Collision with top paddle
			if (
				newY <= player1Bottom &&
				newY >= player1Top &&
				newX >= player1Left &&
				newX <= player1Right
			) {
				newDirectionY = -newDirectionY * 1.05; // Slight acceleration
				// Add angle based on where the ball hits the paddle
				const hitPosition = (newX - player1Left) / paddleSize - 0.5;
				newDirectionX += hitPosition * 3;
			}

			// Collision with bottom paddle
			if (
				newY >= player2Top &&
				newY <= player2Bottom &&
				newX >= player2Left &&
				newX <= player2Right
			) {
				newDirectionY = -newDirectionY * 1.05; // Slight acceleration
				// Add angle based on where the ball hits the paddle
				const hitPosition = (newX - player2Left) / paddleSize - 0.5;
				newDirectionX += hitPosition * 3;
			}

			// Scoring in mobile mode
			if (newY < -containerHeight / 2) {
				// Point for player 2
				setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
				resetBall();
				return;
			}

			if (newY > containerHeight / 2) {
				// Point for player 1
				setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
				resetBall();
				return;
			}
		} else {
			// Bounce off walls (top/bottom) in normal mode
			if (newY <= -containerHeight / 2 + ballSize / 2 || newY >= containerHeight / 2 - ballSize / 2) {
				newDirectionY = -newDirectionY;
			}

			// Paddle collision in normal mode
			const paddleWidth = player1Ref.current.clientWidth;
			const player1Left = -containerWidth / 2 + 16; // Adjusted according to left-4 style
			const player1Right = player1Left + paddleWidth;
			const player1Top = player1Position - containerHeight / 2;
			const player1Bottom = player1Top + paddleSize;

			const player2Right = containerWidth / 2 - 16; // Adjusted according to right-4 style
			const player2Left = player2Right - paddleWidth;
			const player2Top = player2Position - containerHeight / 2;
			const player2Bottom = player2Top + paddleSize;

			// Collision with left paddle
			if (
				newX <= player1Right &&
				newX >= player1Left &&
				newY >= player1Top &&
				newY <= player1Bottom
			) {
				newDirectionX = -newDirectionX * 1.05; // Slight acceleration
				// Add angle based on where the ball hits the paddle
				const hitPosition = (newY - player1Top) / paddleSize - 0.5;
				newDirectionY += hitPosition * 3;
			}

			// Collision with right paddle
			if (
				newX >= player2Left &&
				newX <= player2Right &&
				newY >= player2Top &&
				newY <= player2Bottom
			) {
				newDirectionX = -newDirectionX * 1.05; // Slight acceleration
				// Add angle based on where the ball hits the paddle
				const hitPosition = (newY - player2Top) / paddleSize - 0.5;
				newDirectionY += hitPosition * 3;
			}

			// Scoring in normal mode
			if (newX < -containerWidth / 2) {
				// Point for player 2
				setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
				resetBall();
				return;
			}

			if (newX > containerWidth / 2) {
				// Point for player 1
				setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
				resetBall();
				return;
			}
		}

		// Update ball position and direction
		setBallPosition({ x: newX, y: newY });
		setBallDirection({ x: newDirectionX, y: newDirectionY });

		// Animation loop
		requestRef.current = requestAnimationFrame(updateGame);
	}, [ballDirection, ballPosition, gameStarted, gamePaused, player1Position, player2Position, resetBall, isMobileMode]);

	// Start game loop
	useEffect(() => {
		if (gameStarted && !gamePaused) {
			requestRef.current = requestAnimationFrame(updateGame);
		}
		return () => {
			if (requestRef.current) {
				cancelAnimationFrame(requestRef.current);
			}
		};
	}, [gameStarted, gamePaused, updateGame]);

	return (
		<div
			className={isFullscreen ? PongStyle.containerFullscreen : PongStyle.container}
			ref={containerRef}
		>
			{/* Center line */}
			<div className={isMobileMode ? PongStyle.centerLineMobile : PongStyle.centerLine}></div>

			{/* Score board */}
			{isMobileMode ? (
				<div className={PongStyle.scoreBoardMobile}>
					<span className={PongStyle.scoreTop}>{score.player1}</span>
					<span className={PongStyle.scoreBottom}>{score.player2}</span>
				</div>
			) : (
				<div className={PongStyle.scoreBoard}>
					<span className={PongStyle.scoreLeft}>{score.player1}</span>
					<span className={PongStyle.scoreRight}>{score.player2}</span>
				</div>
			)}

			{/* Game area */}
			<div className={PongStyle.gameArea}>
				{/* Paddles based on mode */}
				{isMobileMode ? (
					<>
						{/* Player 1 paddle (top) */}
						<div
							ref={player1Ref}
							className={`${PongStyle.paddle.mobile.base} ${PongStyle.paddle.mobile.top}`}
							style={{ left: player1Position }}
						></div>

						{/* Player 2 paddle (bottom) */}
						<div
							ref={player2Ref}
							className={`${PongStyle.paddle.mobile.base} ${PongStyle.paddle.mobile.bottom}`}
							style={{ left: player2Position }}
						></div>
					</>
				) : (
					<>
						{/* Player 1 paddle (left) */}
						<div
							ref={player1Ref}
							className={`${PongStyle.paddle.base} ${PongStyle.paddle.left}`}
							style={{ top: player1Position }}
						></div>

						{/* Player 2 paddle (right) */}
						<div
							ref={player2Ref}
							className={`${PongStyle.paddle.base} ${PongStyle.paddle.right}`}
							style={{ top: player2Position }}
						></div>
					</>
				)}

				{/* Ball */}
				<div
					ref={ballRef}
					className={PongStyle.ball}
					style={{
						transform: `translate(${ballPosition.x}px, ${ballPosition.y}px)`
					}}
				></div>
			</div>

			{/* Start menu */}
			{showMenu && (
				<div className={PongStyle.menu.overlay}>
					<h1 className={PongStyle.menu.title}>PONG</h1>
					<button
						className={PongStyle.menu.button}
						onClick={startGame}
					>
						JOUER
					</button>
					<div className="text-white text-lg mt-6 text-center">
						<p>Contrôles:</p>
						{isMobileMode ? (
							<>
								<p>Joueur 1: A (gauche) et D (droite)</p>
								<p>Joueur 2: ← (gauche) et → (droite)</p>
							</>
						) : (
							<>
								<p>Joueur 1: W (haut) et S (bas)</p>
								<p>Joueur 2: ↑ (haut) et ↓ (bas)</p>
							</>
						)}
						<p className="mt-2">Appuyez sur Échap pour mettre en pause</p>
						<p>Appuyez sur F ou M pour passer en plein écran</p>
					</div>
				</div>
			)}

			{/* Pause screen */}
			{gameStarted && gamePaused && !showMenu && (
				<div className={PongStyle.menu.overlay}>
					<h1 className={PongStyle.menu.title}>PAUSE</h1>
					<button
						className={PongStyle.menu.button}
						onClick={togglePause}
					>
						Reprendre
					</button>
					<button
						className={PongStyle.menu.button}
						onClick={rematch}
					>
						Recommencer
					</button>
					<button
						className={PongStyle.menu.button}
						onClick={backToMenu}
					>
						Menu
					</button>
				</div>
			)}

			{/* Start countdown */}
			{countdown > 0 && (
				<div className={PongStyle.menu.overlay}>
					<span className={PongStyle.countdown}>{countdown}</span>
				</div>
			)}
		</div>
	);
}
