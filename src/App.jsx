import React, { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';

const BOARD_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 5, y: 5 };
const INITIAL_DIRECTION = { x: 0, y: 0 };
const GAME_SPEED = 150;

function App() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    return parseInt(localStorage.getItem('highScore')) || 0;
  });
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef();

  const getRandomFood = useCallback((currentSnake) => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE),
      };
    } while (
      currentSnake.some((segment) => segment.x === newFood.x && segment.y === newFood.y)
    );
    return newFood;
  }, []);

  const checkCollision = useCallback((head, currentSnake) => {
    return (
      head.x < 0 ||
      head.x >= BOARD_SIZE ||
      head.y < 0 ||
      head.y >= BOARD_SIZE ||
      currentSnake.slice(1).some((segment) => segment.x === head.x && segment.y === head.y)
    );
  }, []);

  const moveSnake = useCallback(() => {
    if (!gameStarted || isPaused || gameOver) return;

    setSnake((currentSnake) => {
      const head = {
        x: currentSnake[0].x + direction.x,
        y: currentSnake[0].y + direction.y
      };

      if (checkCollision(head, currentSnake)) {
        setGameOver(true);
        setGameStarted(false);
        return currentSnake;
      }

      const newSnake = [head, ...currentSnake];

      // Check if food is eaten
      if (head.x === food.x && head.y === food.y) {
        setScore((prevScore) => {
          const newScore = prevScore + 1;
          if (newScore > highScore) {
            setHighScore(newScore);
            localStorage.setItem('highScore', newScore.toString());
          }
          return newScore;
        });
        setFood(getRandomFood(newSnake));
        return newSnake;
      } else {
        return newSnake.slice(0, -1);
      }
    });
  }, [direction, food, gameStarted, isPaused, gameOver, checkCollision, getRandomFood, highScore]);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
    setIsPaused(false);
  }, []);

  const startGame = useCallback(() => {
    if (!gameStarted && !gameOver) {
      setGameStarted(true);
      setDirection({ x: 1, y: 0 }); // Start moving right
    }
  }, [gameStarted, gameOver]);

  const togglePause = useCallback(() => {
    if (gameStarted && !gameOver) {
      setIsPaused(!isPaused);
    }
  }, [gameStarted, gameOver, isPaused]);

  const handleDirectionChange = useCallback((newDirection) => {
    if (!gameStarted) {
      startGame();
    }
    
    setDirection((currentDirection) => {
      // Prevent reverse direction
      if (
        (newDirection.x === 1 && currentDirection.x === -1) ||
        (newDirection.x === -1 && currentDirection.x === 1) ||
        (newDirection.y === 1 && currentDirection.y === -1) ||
        (newDirection.y === -1 && currentDirection.y === 1)
      ) {
        return currentDirection;
      }
      return newDirection;
    });
  }, [gameStarted, startGame]);

  // Game loop
  useEffect(() => {
    if (gameStarted && !isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      clearInterval(gameLoopRef.current);
    }

    return () => clearInterval(gameLoopRef.current);
  }, [moveSnake, gameStarted, isPaused, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          handleDirectionChange({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          handleDirectionChange({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          handleDirectionChange({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          handleDirectionChange({ x: 1, y: 0 });
          break;
        case ' ':
          e.preventDefault();
          togglePause();
          break;
        case 'Enter':
          e.preventDefault();
          if (gameOver) {
            resetGame();
          } else if (!gameStarted) {
            startGame();
          }
          break;
        case 'Escape':
          e.preventDefault();
          resetGame();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleDirectionChange, togglePause, resetGame, startGame, gameOver, gameStarted]);

  const renderBoard = () => {
    const cells = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const isSnake = snake.some(segment => segment.x === x && segment.y === y);
        const isFood = food.x === x && food.y === y;
        const isHead = snake[0] && snake[0].x === x && snake[0].y === y;
        
        cells.push(
          <div
            key={`${x}-${y}`}
            className={`cell ${isSnake ? (isHead ? 'snake-head' : 'snake-body') : ''} ${isFood ? 'food' : ''}`}
          />
        );
      }
    }
    return cells;
  };

  const getGameStatus = () => {
    if (gameOver) return 'Game Over!';
    if (isPaused) return 'Paused';
    if (!gameStarted) return 'Press any arrow key or WASD to start!';
    return 'Playing...';
  };

  return (
    <div className="game-container">
      <div className="game-header">
        <h1 className="game-title">🐍 React Snake Game</h1>
        <div className="score-container">
          <div className="score">Score: {score}</div>
          <div className="high-score">High Score: {highScore}</div>
        </div>
      </div>

      <div className="game-status">
        {getGameStatus()}
      </div>

      <div className="game-board">
        {renderBoard()}
      </div>

      <div className="controls">
        <div className="control-buttons">
          <button 
            className="control-btn start-btn"
            onClick={startGame}
            disabled={gameStarted && !gameOver}
          >
            {gameStarted && !gameOver ? 'Started' : 'Start Game'}
          </button>
          
          <button 
            className="control-btn pause-btn"
            onClick={togglePause}
            disabled={!gameStarted || gameOver}
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          
          <button 
            className="control-btn reset-btn"
            onClick={resetGame}
          >
            Reset
          </button>
        </div>

        <div className="mobile-controls">
          <div className="arrow-pad">
            <button 
              className="arrow-btn up"
              onClick={() => handleDirectionChange({ x: 0, y: -1 })}
            >
              ↑
            </button>
            <div className="arrow-row">
              <button 
                className="arrow-btn left"
                onClick={() => handleDirectionChange({ x: -1, y: 0 })}
              >
                ←
              </button>
              <button 
                className="arrow-btn right"
                onClick={() => handleDirectionChange({ x: 1, y: 0 })}
              >
                →
              </button>
            </div>
            <button 
              className="arrow-btn down"
              onClick={() => handleDirectionChange({ x: 0, y: 1 })}
            >
              ↓
            </button>
          </div>
        </div>
      </div>

      <div className="instructions">
        <h3>Controls:</h3>
        <p>🎮 Arrow Keys or WASD - Move snake</p>
        <p>⏸️ Spacebar - Pause/Resume</p>
        <p>🔄 Enter - Start new game (when game over)</p>
        <p>🛑 Escape - Reset game</p>
      </div>

      {gameOver && (
        <div className="game-over-modal">
          <div className="modal-content">
            <h2>Game Over!</h2>
            <p>Final Score: {score}</p>
            {score === highScore && score > 0 && (
              <p className="new-record">🎉 New High Score!</p>
            )}
            <button className="play-again-btn" onClick={resetGame}>
              Play Again
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;