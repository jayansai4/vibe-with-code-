import { useState, useCallback, useEffect, useRef } from 'react';
import { useInterval } from '../hooks/useInterval';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 0, y: -1 };
const BASE_SPEED = 150;

type Point = { x: number; y: number };

function generateFood(currentSnake: Point[]): Point {
  let newFood: Point;
  let isOccupied = true;
  while (isOccupied) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
    isOccupied = currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Point>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Ref to hold the latest direction string to prevent rapid double-turns violating rules
  const lastProcessedDirectionRef = useRef<Point>(INITIAL_DIRECTION);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    lastProcessedDirectionRef.current = INITIAL_DIRECTION;
    setFood(generateFood(INITIAL_SNAKE));
    setIsGameOver(false);
    setIsPaused(false);
    setScore(0);
  };

  const gameLoop = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const dir = direction;
      lastProcessedDirectionRef.current = dir;
      
      const newHead = { x: head.x + dir.x, y: head.y + dir.y };

      // Wall collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(s => {
          const newScore = s + 10;
          if (newScore > highScore) setHighScore(newScore);
          return newScore;
        });
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, highScore]);

  // Adjust speed based on score (faster as you get higher score)
  const speed = Math.max(50, BASE_SPEED - Math.floor(score / 30) * 10);

  useInterval(gameLoop, isGameOver || isPaused ? null : speed);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (isGameOver && e.key === ' ') {
        resetGame();
        return;
      }

      if (e.key === 'p' || e.key === ' ') {
        setIsPaused(prev => !prev);
        return;
      }

      if (isPaused) return;

      const currentDir = lastProcessedDirectionRef.current;
      
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (currentDir.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (currentDir.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (currentDir.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (currentDir.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGameOver, isPaused]);

  // Control rendering helpers
  const handleMobileDpad = (x: number, y: number) => {
    const currentDir = lastProcessedDirectionRef.current;
    if (x === 0 && currentDir.y !== -y) setDirection({ x, y });
    else if (y === 0 && currentDir.x !== -x) setDirection({ x, y });
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4 md:p-8 bg-zinc-900/50 backdrop-blur-sm border border-cyan-800 rounded-2xl shadow-[0_0_30px_rgba(34,211,238,0.1)]">
      
      <div className="flex justify-between w-full px-4 text-cyan-400 font-bold font-mono text-xl tracking-widest">
        <div className="flex flex-col items-start gap-1">
          <span className="text-xs text-cyan-700">SCORE</span>
          <span className="text-glow-cyan">{score.toString().padStart(4, '0')}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-fuchsia-700">HIGH SCORE</span>
          <span className="text-fuchsia-400 text-glow-fuchsia">{highScore.toString().padStart(4, '0')}</span>
        </div>
      </div>

      <div 
        className="relative bg-black/80 border-2 border-slate-800 rounded-lg overflow-hidden shadow-[inset_0_0_20px_rgba(0,0,0,1)]"
        style={{ width: "300px", height: "300px" }}
      >
        <div 
          className="absolute inset-0 grid" 
          style={{ 
            gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
          }}
        >
          {/* Render Food */}
          <div 
            className="bg-rose-500 rounded-full box-glow-rose drop-shadow-[0_0_8px_rgba(244,63,94,1)] animate-pulse"
            style={{ gridColumnStart: food.x + 1, gridRowStart: food.y + 1, margin: '2px' }}
          />

          {/* Render Snake */}
          {snake.map((segment, index) => {
            const isHead = index === 0;
            return (
              <div 
                key={`${segment.x}-${segment.y}-${index}`}
                className={`rounded-sm transition-all duration-75 ${
                  isHead 
                    ? 'bg-cyan-300 box-glow-cyan z-10' 
                    : 'bg-cyan-600 opacity-80'
                }`}
                style={{
                  gridColumnStart: segment.x + 1, 
                  gridRowStart: segment.y + 1,
                  margin: '1px',
                  boxShadow: isHead ? '0 0 10px rgba(34,211,238,0.8)' : '0 0 5px rgba(34,211,238,0.4)'
                }}
              />
            )
          })}
        </div>

        {/* Overlays */}
        {isGameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-20">
            <h2 className="text-3xl text-rose-500 font-bold mb-4 animate-pulse drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]">SYSTEM FAILURE</h2>
            <p className="text-slate-300 mb-6 font-mono text-sm max-w-[200px] text-center">Your cycle has ended. The grid awaits your return.</p>
            <button 
              onClick={resetGame}
              className="px-6 py-2 bg-transparent text-cyan-400 border border-cyan-500 hover:bg-cyan-500/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all rounded font-bold tracking-widest"
            >
              RESTART
            </button>
          </div>
        )}

        {isPaused && !isGameOver && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm z-20">
            <h2 className="text-3xl text-cyan-500 font-bold text-glow-cyan tracking-widest">PAUSED</h2>
          </div>
        )}
      </div>

      {/* Mobile D-Pad (only really visible/usable on smaller screens, but neat styled) */}
      <div className="grid grid-cols-3 gap-2 mt-4 md:hidden">
        <div />
        <button onClick={() => handleMobileDpad(0, -1)} className="w-12 h-12 bg-slate-800 border border-cyan-900 rounded-lg active:bg-cyan-900 flex items-center justify-center text-cyan-500">▲</button>
        <div />
        <button onClick={() => handleMobileDpad(-1, 0)} className="w-12 h-12 bg-slate-800 border border-cyan-900 rounded-lg active:bg-cyan-900 flex items-center justify-center text-cyan-500">◀</button>
        <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-slate-800 border border-fuchsia-900/50 rounded-lg active:bg-fuchsia-900 flex items-center justify-center text-fuchsia-500 text-xs font-bold">{isPaused ? 'PLAY' : 'PAUSE'}</button>
        <button onClick={() => handleMobileDpad(1, 0)} className="w-12 h-12 bg-slate-800 border border-cyan-900 rounded-lg active:bg-cyan-900 flex items-center justify-center text-cyan-500">▶</button>
        <div />
        <button onClick={() => handleMobileDpad(0, 1)} className="w-12 h-12 bg-slate-800 border border-cyan-900 rounded-lg active:bg-cyan-900 flex items-center justify-center text-cyan-500">▼</button>
        <div />
      </div>

      <div className="hidden md:flex gap-4 text-xs text-slate-500 font-mono tracking-widest mt-2">
        <span>WASD / ARROWS TO MOVE</span>
        <span>•</span>
        <span>SPACE TO PAUSE</span>
      </div>

    </div>
  );
}
