import React, { useState, useEffect, useCallback, useRef } from "react";

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };

export default function SnakeGame({
  onScoreUpdate,
}: {
  onScoreUpdate: (score: number) => void;
}) {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const directionRef = useRef(direction);

  const generateFood = useCallback(
    (currentSnake: { x: number; y: number }[]) => {
      let newFood;
      while (true) {
        newFood = {
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE),
        };
        // eslint-disable-next-line no-loop-func
        if (
          !currentSnake.some(
            (segment) => segment.x === newFood.x && segment.y === newFood.y,
          )
        ) {
          break;
        }
      }
      return newFood;
    },
    [],
  );

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    directionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setGameOver(false);
    setScore(0);
    onScoreUpdate(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys
      if (
        ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", " "].includes(e.key)
      ) {
        e.preventDefault();
      }

      if (e.key === " " && !gameOver) {
        setIsPaused((p) => !p);
        return;
      }

      if (isPaused || gameOver) return;

      const currentDir = directionRef.current;
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (currentDir.y !== 1) directionRef.current = { x: 0, y: -1 };
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (currentDir.y !== -1) directionRef.current = { x: 0, y: 1 };
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (currentDir.x !== 1) directionRef.current = { x: -1, y: 0 };
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (currentDir.x !== -1) directionRef.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, gameOver]);

  useEffect(() => {
    if (gameOver || isPaused) return;

    const moveSnake = () => {
      setSnake((prevSnake) => {
        const head = prevSnake[0];
        const newHead = {
          x: head.x + directionRef.current.x,
          y: head.y + directionRef.current.y,
        };

        // Check collision with walls
        if (
          newHead.x < 0 ||
          newHead.x >= GRID_SIZE ||
          newHead.y < 0 ||
          newHead.y >= GRID_SIZE
        ) {
          setGameOver(true);
          return prevSnake;
        }

        // Check collision with self
        if (
          prevSnake.some(
            (segment) => segment.x === newHead.x && segment.y === newHead.y,
          )
        ) {
          setGameOver(true);
          return prevSnake;
        }

        const newSnake = [newHead, ...prevSnake];

        // Check food collision
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore((s) => {
            const newScore = s + 10;
            onScoreUpdate(newScore);
            return newScore;
          });
          setFood(generateFood(newSnake));
        } else {
          newSnake.pop();
        }

        setDirection(directionRef.current);
        return newSnake;
      });
    };

    const gameInterval = setInterval(moveSnake, 150);
    return () => clearInterval(gameInterval);
  }, [food, gameOver, isPaused, generateFood, onScoreUpdate]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto relative">
      <div className="mb-4 flex justify-between w-full text-neon-green font-mono text-xl uppercase tracking-widest drop-shadow-[0_0_8px_rgba(0,255,0,0.8)]">
        <span>Score: {score}</span>
        <span>{isPaused ? "PAUSED" : "PLAYING"}</span>
      </div>

      <div
        className="relative bg-black/80 border-2 border-neon-green rounded-lg overflow-hidden shadow-[0_0_20px_rgba(0,255,0,0.3)]"
        style={{
          width: "100%",
          aspectRatio: "1/1",
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Render Food */}
        <div
          className="bg-neon-pink rounded-full shadow-[0_0_10px_rgba(255,0,255,0.8)]"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
            transform: "scale(0.8)",
          }}
        />

        {/* Render Snake */}
        {snake.map((segment, index) => {
          const isHead = index === 0;
          return (
            <div
              key={`${segment.x}-${segment.y}-${index}`}
              className={`${isHead ? "bg-neon-blue shadow-[0_0_15px_rgba(0,255,255,0.9)] z-10" : "bg-neon-blue/80 shadow-[0_0_8px_rgba(0,255,255,0.5)]"} rounded-sm`}
              style={{
                gridColumnStart: segment.x + 1,
                gridRowStart: segment.y + 1,
                transform: isHead ? "scale(1.05)" : "scale(0.9)",
              }}
            />
          );
        })}

        {/* Game Over Overlay */}
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20 backdrop-blur-sm">
            <h2 className="text-4xl font-black text-neon-pink mb-2 drop-shadow-[0_0_15px_rgba(255,0,255,0.8)] tracking-widest uppercase">
              Game Over
            </h2>
            <p className="text-neon-blue font-mono mb-6 drop-shadow-[0_0_8px_rgba(0,255,255,0.8)]">
              Final Score: {score}
            </p>
            <button
              onClick={resetGame}
              className="px-6 py-3 bg-transparent border-2 border-neon-green text-neon-green font-bold uppercase tracking-widest rounded hover:bg-neon-green hover:text-black transition-all duration-300 shadow-[0_0_15px_rgba(0,255,0,0.4)] hover:shadow-[0_0_25px_rgba(0,255,0,0.8)]"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 text-gray-400 font-mono text-xs text-center">
        Use <span className="text-neon-blue">Arrow Keys</span> or{" "}
        <span className="text-neon-blue">WASD</span> to move.
        <br />
        Press <span className="text-neon-pink">Space</span> to pause.
      </div>
    </div>
  );
}
