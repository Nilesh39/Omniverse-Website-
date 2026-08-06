import React, { useState, useEffect, useRef } from 'react';
import { RefreshCw, Play, Volume2, Shield, User, Cpu, Gamepad2, Star, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

// ---------------------------------------------------------------------
// 1. 2048 MERGE TILES GAME
// ---------------------------------------------------------------------
export const Game2048Tool: React.FC = () => {
  const [grid, setGrid] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);

  // Swipe gesture tracking coordinates
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize Game Board
  const initGame = () => {
    let newGrid = Array(4).fill(null).map(() => Array(4).fill(0));
    newGrid = addRandomTile(addRandomTile(newGrid));
    setGrid(newGrid);
    setScore(0);
    setGameOver(false);
    setHasWon(false);
  };

  // Add random 2 or 4 to blank cells
  const addRandomTile = (currentGrid: number[][]): number[][] => {
    const nextGrid = currentGrid.map(row => [...row]);
    const emptyCells: { r: number; c: number }[] = [];
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (nextGrid[r][c] === 0) emptyCells.push({ r, c });
      }
    }
    if (emptyCells.length > 0) {
      const { r, c } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      nextGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    }
    return nextGrid;
  };

  // Load High Score
  useEffect(() => {
    try {
      const saved = localStorage.getItem('omni_2048_highscore');
      if (saved) setHighScore(Number(saved));
    } catch (e) {}
    initGame();
  }, []);

  // Check Game Over Condition
  const checkGameOver = (currentGrid: number[][]): boolean => {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (currentGrid[r][c] === 0) return false;
        if (r < 3 && currentGrid[r][c] === currentGrid[r + 1][c]) return false;
        if (c < 3 && currentGrid[r][c] === currentGrid[r][c + 1]) return false;
      }
    }
    return true;
  };

  // Matrix manipulation helpers
  const rotateLeft = (matrix: number[][]): number[][] => {
    const size = matrix.length;
    let res = Array(size).fill(null).map(() => Array(size).fill(0));
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        res[size - 1 - c][r] = matrix[r][c];
      }
    }
    return res;
  };

  const slideRowLeft = (row: number[], scoreAcc: { val: number }): number[] => {
    let clean = row.filter(val => val !== 0);
    let result: number[] = [];
    for (let i = 0; i < clean.length; i++) {
      if (i < clean.length - 1 && clean[i] === clean[i + 1]) {
        const combined = clean[i] * 2;
        result.push(combined);
        scoreAcc.val += combined;
        if (combined === 2048) setHasWon(true);
        i++;
      } else {
        result.push(clean[i]);
      }
    }
    while (result.length < 4) result.push(0);
    return result;
  };

  const slideLeft = (currentGrid: number[][], scoreAcc: { val: number }): number[][] => {
    return currentGrid.map(row => slideRowLeft(row, scoreAcc));
  };

  // Core move engine
  const handleMove = (direction: 'up' | 'down' | 'left' | 'right') => {
    if (gameOver) return;

    let current = grid.map(row => [...row]);
    let scoreAcc = { val: 0 };
    let moved = false;

    // Rotate matrix to transform all movements into a Slide Left operation
    if (direction === 'left') {
      const next = slideLeft(current, scoreAcc);
      if (JSON.stringify(current) !== JSON.stringify(next)) {
        current = next;
        moved = true;
      }
    } else if (direction === 'right') {
      // Reverse rows, slide left, reverse back
      let reversed = current.map(row => [...row].reverse());
      let next = slideLeft(reversed, scoreAcc);
      let nextReversed = next.map(row => [...row].reverse());
      if (JSON.stringify(current) !== JSON.stringify(nextReversed)) {
        current = nextReversed;
        moved = true;
      }
    } else if (direction === 'up') {
      // Rotate 270 deg (or rotate left, slide left, rotate right)
      let rotated = rotateLeft(current);
      let next = slideLeft(rotated, scoreAcc);
      // Rotate right (rotateLeft 3 times)
      let nextRotated = rotateLeft(rotateLeft(rotateLeft(next)));
      if (JSON.stringify(current) !== JSON.stringify(nextRotated)) {
        current = nextRotated;
        moved = true;
      }
    } else if (direction === 'down') {
      // Rotate right (rotateLeft 3 times), slide left, rotate left
      let rotated = rotateLeft(rotateLeft(rotateLeft(current)));
      let next = slideLeft(rotated, scoreAcc);
      let nextRotated = rotateLeft(next);
      if (JSON.stringify(current) !== JSON.stringify(nextRotated)) {
        current = nextRotated;
        moved = true;
      }
    }

    if (moved) {
      const nextGrid = addRandomTile(current);
      const nextScore = score + scoreAcc.val;
      setGrid(nextGrid);
      setScore(nextScore);

      if (nextScore > highScore) {
        setHighScore(nextScore);
        localStorage.setItem('omni_2048_highscore', nextScore.toString());
      }

      if (checkGameOver(nextGrid)) {
        setGameOver(true);
      }
    }
  };

  // Keyboard Event Handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        handleMove('up');
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        handleMove('down');
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        handleMove('left');
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        handleMove('right');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [grid, score, gameOver]);

  // Touch handlers for mobile swipe guestures
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (Math.max(absX, absY) > 30) { // Threshold for swipe
      if (absX > absY) {
        handleMove(dx > 0 ? 'right' : 'left');
      } else {
        handleMove(dy > 0 ? 'down' : 'up');
      }
    }
    touchStartRef.current = null;
  };

  // Tile Visual Style Mapping helper
  const getTileStyles = (val: number): string => {
    switch (val) {
      case 0: return 'bg-white/5 border-white/5 text-transparent';
      case 2: return 'bg-slate-500/15 border-white/5 text-slate-300';
      case 4: return 'bg-slate-500/25 border-white/10 text-slate-200';
      case 8: return 'bg-orange-500/20 border-orange-500/40 text-orange-200';
      case 16: return 'bg-orange-600/30 border-orange-500/60 text-orange-100';
      case 32: return 'bg-rose-500/25 border-rose-500/50 text-rose-200';
      case 64: return 'bg-rose-600/35 border-rose-500/70 text-rose-100';
      case 128: return 'bg-yellow-500/20 border-yellow-500/45 text-yellow-200';
      case 256: return 'bg-yellow-500/30 border-yellow-500/60 text-yellow-100 shadow-[0_0_10px_rgba(234,179,8,0.2)]';
      case 512: return 'bg-emerald-500/20 border-emerald-500/45 text-emerald-200';
      case 1024: return 'bg-cyan-500/25 border-cyan-500/60 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]';
      case 2048: return 'bg-purple-600/30 border-purple-500/80 text-accent font-black shadow-[0_0_20px_rgba(168,85,247,0.5)] animate-pulse';
      default: return 'bg-purple-500/40 border-purple-500 text-white shadow-[0_0_25px_rgba(168,85,247,0.6)]';
    }
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      {/* Stats Header Panel */}
      <div className="grid grid-cols-2 gap-3 text-center font-mono">
        <div className="p-3.5 glass-panel rounded-2xl border border-white/10">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Score</span>
          <h3 className="text-2xl font-black text-accent mt-0.5">{score}</h3>
        </div>
        <div className="p-3.5 glass-panel rounded-2xl border border-white/10">
          <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Best Score</span>
          <h3 className="text-2xl font-black text-emerald-400 mt-0.5">{highScore}</h3>
        </div>
      </div>

      {/* Main Game Swipe Board Area */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative bg-slate-950/80 p-3.5 rounded-3xl border border-white/15 aspect-square grid grid-cols-4 grid-rows-4 gap-3 select-none"
      >
        {grid.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-full h-full rounded-2xl border flex items-center justify-center font-mono text-lg font-black transition-all duration-150 relative overflow-hidden ${getTileStyles(cell)}`}
            >
              {cell > 0 && cell}
              {cell > 0 && (
                <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/20 pointer-events-none" />
              )}
            </div>
          ))
        )}

        {/* Floating Modals for Win/Game Over */}
        {gameOver && (
          <div className="absolute inset-0 bg-[#090d16]/95 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4">
            <h2 className="text-2xl font-black text-rose-500">💀 Game Over!</h2>
            <p className="text-xs text-slate-300">You ran out of empty spaces or valid moves. Final score: <strong className="text-accent">{score}</strong></p>
            <button onClick={initGame} className="px-5 py-2 rounded-xl bg-accent text-slate-950 font-bold text-xs shadow-lg">Try Again</button>
          </div>
        )}

        {hasWon && (
          <div className="absolute inset-0 bg-accent/20 backdrop-blur-md rounded-3xl flex flex-col items-center justify-center text-center p-6 space-y-4">
            <h2 className="text-2xl font-black text-accent">🎉 You Won!</h2>
            <p className="text-xs text-slate-100">You successfully merged tiles to reach the legendary <strong className="text-emerald-400">2048</strong> tile!</p>
            <div className="flex gap-2">
              <button onClick={() => setHasWon(false)} className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs border border-white/10">Keep Playing</button>
              <button onClick={initGame} className="px-4 py-2 rounded-xl bg-accent text-slate-950 font-black text-xs">New Game</button>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center gap-2">
        <span className="text-[9px] text-slate-500 text-center leading-relaxed">
          🖥️ Desktop: Use Keyboard **Arrow Keys** or **WASD** to slide.<br/>
          📱 Mobile: **Swipe** directly on the grid.
        </span>
        <button onClick={initGame} className="mt-2 w-full py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-200 text-xs font-bold flex items-center justify-center gap-1">
          <RefreshCw className="w-3.5 h-3.5" /> Restart Game
        </button>
      </div>
    </div>
  );
};


// ---------------------------------------------------------------------
// 2. TIC-TAC-TOE WITH MINIMAX UNBEATABLE AI
// ---------------------------------------------------------------------
export const TicTacToeTool: React.FC = () => {
  const [board, setBoard] = useState<string[]>(Array(9).fill(''));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameMode, setGameMode] = useState<'pvp' | 'ai'>('ai');
  const [aiDifficulty, setAiDifficulty] = useState<'easy' | 'medium' | 'unbeatable'>('unbeatable');
  const [winner, setWinner] = useState<string | 'Draw' | null>(null);
  const [winningLine, setWinningLine] = useState<number[] | null>(null);

  // Persistent session score board
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  // Check lines combinations
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  // Client-side Web Audio API Sound Synthesizer
  const playSound = (type: 'click' | 'win' | 'lose' | 'tie') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      const now = ctx.currentTime;
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(550, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.08);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'win') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(261.63, now); // C4
        osc.frequency.setValueAtTime(329.63, now + 0.08); // E4
        osc.frequency.setValueAtTime(392.00, now + 0.16); // G4
        osc.frequency.setValueAtTime(523.25, now + 0.24); // C5
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);
        osc.start(now);
        osc.stop(now + 0.55);
      } else if (type === 'lose') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(170, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.45);
        gain.gain.setValueAtTime(0.14, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
        osc.start(now);
        osc.stop(now + 0.45);
      } else if (type === 'tie') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(330, now);
        osc.frequency.setValueAtTime(270, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);
        osc.start(now);
        osc.stop(now + 0.26);
      }
    } catch (e) {}
  };

  // Evaluate board status
  const checkWinner = (currentBoard: string[]): { winner: string | null; line: number[] | null } => {
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (currentBoard[a] && currentBoard[a] === currentBoard[b] && currentBoard[a] === currentBoard[c]) {
        return { winner: currentBoard[a], line: lines[i] };
      }
    }
    if (currentBoard.every(cell => cell !== '')) {
      return { winner: 'Draw', line: null };
    }
    return { winner: null, line: null };
  };

  // Minimax algorithm core for unbeatable AI
  const minimax = (tempBoard: string[], depth: number, isMaximizing: boolean): number => {
    const { winner: result } = checkWinner(tempBoard);
    if (result === 'O') return 10 - depth; // AI wins
    if (result === 'X') return depth - 10; // Human wins
    if (result === 'Draw') return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === '') {
          tempBoard[i] = 'O';
          let score = minimax(tempBoard, depth + 1, false);
          tempBoard[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (tempBoard[i] === '') {
          tempBoard[i] = 'X';
          let score = minimax(tempBoard, depth + 1, true);
          tempBoard[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  // Get AI choice move
  const getAiMove = (currentBoard: string[]): number => {
    const rand = Math.random();
    const isEasyPlay = aiDifficulty === 'easy' && rand > 0.2;
    const isMediumPlay = aiDifficulty === 'medium' && rand > 0.5;

    if (isEasyPlay || isMediumPlay) {
      const empties: number[] = [];
      currentBoard.forEach((c, idx) => { if (c === '') empties.push(idx); });
      return empties[Math.floor(Math.random() * empties.length)];
    }

    // Minimax Search
    let bestScore = -Infinity;
    let move = -1;
    for (let i = 0; i < 9; i++) {
      if (currentBoard[i] === '') {
        currentBoard[i] = 'O';
        let score = minimax(currentBoard, 0, false);
        currentBoard[i] = '';
        if (score > bestScore) {
          bestScore = score;
          move = i;
        }
      }
    }
    return move;
  };

  // Play handler
  const handleCellClick = (idx: number) => {
    if (board[idx] !== '' || winner) return;
    playSound('click');

    const nextBoard = [...board];
    nextBoard[idx] = 'X';
    setBoard(nextBoard);

    const checkRes = checkWinner(nextBoard);
    if (checkRes.winner) {
      setWinner(checkRes.winner);
      setWinningLine(checkRes.line);
      if (checkRes.winner === 'X') {
        playSound('win');
        triggerConfetti();
        setScores(prev => ({ ...prev, X: prev.X + 1 }));
      } else {
        playSound('tie');
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      }
      return;
    }

    // Trigger AI turn
    setXIsNext(false);
    setTimeout(() => {
      const aiIndex = getAiMove(nextBoard);
      if (aiIndex !== -1) {
        nextBoard[aiIndex] = 'O';
        setBoard(nextBoard);
        
        const aiCheck = checkWinner(nextBoard);
        if (aiCheck.winner) {
          setWinner(aiCheck.winner);
          setWinningLine(aiCheck.line);
          if (aiCheck.winner === 'O') {
            playSound('lose');
            setScores(prev => ({ ...prev, O: prev.O + 1 }));
          } else {
            playSound('tie');
            setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
          }
        } else {
          setXIsNext(true);
        }
      }
    }, 350);
  };

  // PvP player two move
  const handlePvPClick = (idx: number) => {
    if (board[idx] !== '' || winner) return;
    playSound('click');

    const nextBoard = [...board];
    nextBoard[idx] = xIsNext ? 'X' : 'O';
    setBoard(nextBoard);

    const checkRes = checkWinner(nextBoard);
    if (checkRes.winner) {
      setWinner(checkRes.winner);
      setWinningLine(checkRes.line);
      if (checkRes.winner === 'Draw') {
        playSound('tie');
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      } else {
        playSound('win');
        triggerConfetti();
        if (checkRes.winner === 'X') setScores(prev => ({ ...prev, X: prev.X + 1 }));
        else setScores(prev => ({ ...prev, O: prev.O + 1 }));
      }
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 75,
      origin: { y: 0.75 }
    });
  };

  const handleReset = () => {
    setBoard(Array(9).fill(''));
    setXIsNext(true);
    setWinner(null);
    setWinningLine(null);
  };

  const handleResetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    handleReset();
  };

  return (
    <div className="space-y-6 max-w-sm mx-auto">
      {/* Session Scores Header Panel */}
      <div className="grid grid-cols-3 gap-2.5 text-center font-mono select-none">
        <div className="p-3.5 glass-panel rounded-2xl border border-cyan-500/10">
          <span className="text-[9px] text-cyan-400 font-bold block uppercase tracking-wider">Player X</span>
          <h3 className="text-2xl font-black text-cyan-400 mt-0.5">{scores.X}</h3>
        </div>
        <div className="p-3.5 glass-panel rounded-2xl border border-white/10">
          <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Draws</span>
          <h3 className="text-2xl font-black text-slate-200 mt-0.5">{scores.draws}</h3>
        </div>
        <div className="p-3.5 glass-panel rounded-2xl border border-rose-500/10">
          <span className="text-[9px] text-rose-400 font-bold block uppercase tracking-wider">{gameMode === 'ai' ? 'CPU O' : 'Player O'}</span>
          <h3 className="text-2xl font-black text-rose-400 mt-0.5">{scores.O}</h3>
        </div>
      </div>

      {/* Game Settings Mode Select */}
      <div className="flex flex-col gap-3 p-4 glass-panel rounded-3xl border border-white/10">
        <div className="flex items-center justify-between text-xs font-bold text-slate-300">
          <span>Game Match Mode:</span>
          <div className="flex gap-1.5">
            <button
              onClick={() => { setGameMode('ai'); handleReset(); }}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
                gameMode === 'ai' ? 'bg-accent text-slate-950 font-bold shadow-md' : 'glass-panel text-slate-300 hover:bg-white/10'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> Vs Computer
            </button>
            <button
              onClick={() => { setGameMode('pvp'); handleReset(); }}
              className={`px-3 py-1.5 rounded-xl flex items-center gap-1 transition-all ${
                gameMode === 'pvp' ? 'bg-accent text-slate-950 font-bold shadow-md' : 'glass-panel text-slate-300 hover:bg-white/10'
              }`}
            >
              <User className="w-3.5 h-3.5" /> Vs Friend
            </button>
          </div>
        </div>

        {gameMode === 'ai' && (
          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-t border-white/10 pt-3">
            <span>AI Level:</span>
            <div className="flex gap-1">
              {(['easy', 'medium', 'unbeatable'] as const).map(diff => (
                <button
                  key={diff}
                  onClick={() => setAiDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-xl capitalize text-[10px] transition-all ${
                    aiDifficulty === diff ? 'bg-accent/25 border border-accent/40 text-accent font-black' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dashboard player status */}
      <div className="p-3 text-center glass-panel rounded-2xl border border-white/5 text-xs font-bold transition-all">
        {winner ? (
          winner === 'Draw' ? (
            <span className="text-amber-400 animate-pulse">🤝 Match Tied! Draw Game.</span>
          ) : (
            <span className={winner === 'X' ? 'text-cyan-400 animate-bounce block' : 'text-rose-400 animate-bounce block'}>
              🎉 Winner: Player {winner}!
            </span>
          )
        ) : gameMode === 'ai' ? (
          xIsNext ? (
            <span className="text-cyan-400 animate-pulse">Your Turn (X)</span>
          ) : (
            <span className="text-rose-400 animate-pulse">Computer is thinking...</span>
          )
        ) : (
          <span className={xIsNext ? 'text-cyan-400' : 'text-rose-400'}>
            Player Turn: {xIsNext ? 'X' : 'O'}
          </span>
        )}
      </div>

      {/* 3x3 Tic Tac Toe Grid Board */}
      <div className="grid grid-cols-3 grid-rows-3 gap-3 aspect-square bg-slate-950/80 p-3.5 rounded-3xl border border-white/15 relative overflow-hidden select-none">
        {board.map((cell, idx) => {
          const isWinningCell = winningLine?.includes(idx);
          return (
            <button
              key={idx}
              disabled={!!winner || (!xIsNext && gameMode === 'ai')}
              onClick={() => gameMode === 'pvp' ? handlePvPClick(idx) : handleCellClick(idx)}
              className={`w-full h-full rounded-2xl border flex items-center justify-center text-4xl font-bold font-mono transition-all duration-300 relative group overflow-hidden ${
                isWinningCell
                  ? 'bg-accent/25 border-accent text-accent scale-105 shadow-[0_0_20px_rgba(6,182,212,0.5)] z-10'
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5'
              }`}
            >
              {cell === 'X' && (
                <span className="text-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-scale">
                  X
                </span>
              )}
              {cell === 'O' && (
                <span className="text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)] animate-scale">
                  O
                </span>
              )}
              
              {/* Glossy overlay on empty cell hover */}
              {cell === '' && !winner && (
                <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              )}
            </button>
          );
        })}
      </div>

      {/* Control Buttons */}
      <div className="flex gap-2">
        <button onClick={handleReset} className="flex-1 py-2.5 rounded-xl bg-accent text-slate-950 font-black text-xs shadow-md flex items-center justify-center gap-1.5 hover:opacity-90">
          <RefreshCw className="w-4 h-4" /> Next Round
        </button>
        <button onClick={handleResetScores} className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 font-bold text-xs hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20">
          Reset Scores
        </button>
      </div>
    </div>
  );
};
