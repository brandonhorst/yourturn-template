import { Game } from "jsr:@brandonhorst/yourturn/types";
import type {
  Board,
  CellValue,
  Config,
  GameState,
  Move,
  ObserverState,
  PlayerState,
} from "./types.ts";
import { produce } from "npm:immer";

// Calculate current time remaining, accounting for elapsed time since last move
function calculateTimeRemaining(
  state: GameState,
  timestamp: Date,
  isComplete: boolean,
): [number, number] {
  const calculatedTimeRemainingMs: [number, number] = [
    ...state.timeRemainingMs,
  ];

  if (!isComplete) {
    const currentPlayerIdx = state.currentPlayer;
    const elapsedMs = timestamp.valueOf() - state.lastMoveTimestamp;
    calculatedTimeRemainingMs[currentPlayerIdx] = Math.max(
      0,
      state.timeRemainingMs[currentPlayerIdx] - elapsedMs,
    );
  }

  return calculatedTimeRemainingMs;
}

function updateTimestamp(s: GameState, playerId: number, timestamp: Date) {
  const elapsedMs = timestamp.valueOf() - s.lastMoveTimestamp;
  s.timeRemainingMs[playerId] -= elapsedMs;

  s.lastMoveTimestamp = timestamp.valueOf();
}

export const game: Game<Config, GameState, Move, PlayerState, ObserverState> = {
  modes: {
    micro: {
      numPlayers: 2,
      matchmaking: "queue",
      config: { boardSize: 9, winLength: 4 },
    },
    standard: {
      numPlayers: 2,
      matchmaking: "queue",
      config: { boardSize: 15, winLength: 5 },
    },
    legacy: {
      numPlayers: 2,
      matchmaking: "queue",
      config: { boardSize: 19, winLength: 5 },
    },
  },

  setup({ config, timestamp }): Readonly<GameState> {
    // Create an empty board of boardSize×boardSize
    const board: Board = Array(config.boardSize)
      .fill(null)
      .map(() => Array(config.boardSize).fill(null));

    // Initialize player times (10 minutes per player in milliseconds)
    const initialTimeMs = 10 * 60 * 1000; // 10 minutes in milliseconds

    // Black plays first in Gomoku
    return {
      board,
      currentPlayer: 0, // Player 0 starts (black)
      timeRemainingMs: [initialTimeMs, initialTimeMs], // 10 minutes for each player
      lastMoveTimestamp: timestamp.valueOf(), // Will be set when the first move is made
    };
  },

  isValidMove(s, { move, playerId }): boolean {
    // Make sure it's this player's turn
    if (playerId !== s.currentPlayer) {
      return false;
    }

    // Check if the position is valid (within the board)
    if (
      move.row < 0 ||
      move.row >= s.board.length ||
      move.col < 0 ||
      move.col >= s.board[0].length
    ) {
      return false;
    }

    // Check if the position is empty
    return s.board[move.row][move.col] === null;
  },

  processMove(s, { move, playerId, timestamp }): Readonly<GameState> {
    return produce(s, (s) => {
      // Update the player's remaining time
      updateTimestamp(s, playerId, timestamp);

      // Place the stone on the board
      s.board[move.row][move.col] = playerId === 0 ? "black" : "white";

      // Switch to the other player
      s.currentPlayer = (playerId + 1) % 2;
    });
  },

  refreshTimeout(s): number | undefined {
    return s.timeRemainingMs[s.currentPlayer];
  },

  playerState(
    s,
    { playerId, players, isComplete, config, timestamp },
  ): Readonly<PlayerState> {
    const winner = findWinner(s.board, config);
    const calculatedTimeRemainingMs = calculateTimeRemaining(
      s,
      timestamp,
      isComplete,
    );

    return {
      playerId,
      pendingAction: playerId === s.currentPlayer && !isComplete,
      perPlayer: players.map((player, idx) => ({
        name: player.name,
        color: idx === 0 ? "black" : "white",
        isVictor: winner === idx,
      })),
      board: s.board,
      timeRemainingMs: calculatedTimeRemainingMs,
      currentPlayer: s.currentPlayer,
    };
  },

  observerState(
    s,
    { players, isComplete, config, timestamp },
  ): Readonly<ObserverState> {
    const winner = findWinner(s.board, config);
    const calculatedTimeRemainingMs = calculateTimeRemaining(
      s,
      timestamp,
      isComplete,
    );

    return {
      perPlayer: players.map((player, idx) => ({
        name: player.name,
        color: idx === 0 ? "black" : "white",
        isVictor: winner === idx,
      })),
      board: s.board,
      timeRemainingMs: calculatedTimeRemainingMs,
      currentPlayer: s.currentPlayer,
    };
  },

  isComplete(s, { config }): boolean {
    // Game is complete if there's a winner, the board is full, or a player ran out of time
    return findWinner(s.board, config) !== null ||
      isBoardFull(s.board) ||
      s.timeRemainingMs[0] <= 0 ||
      s.timeRemainingMs[1] <= 0;
  },
};

// Check if the board is full (a draw)
function isBoardFull(board: Board): boolean {
  return board.every((row) => row.every((cell) => cell !== null));
}

// Find winner by checking if any player has the required number of stones in a row
function findWinner(board: Board, config?: Config): number | null {
  // Default to 5 if config is not provided (for backward compatibility)
  const winLength = config?.winLength || 5;

  const directions = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal down-right
    { dr: 1, dc: -1 }, // diagonal down-left
  ];

  const checkLine = (
    row: number,
    col: number,
    dr: number,
    dc: number,
    color: CellValue,
  ): boolean => {
    if (color === null) return false;

    // Check for winLength consecutive stones
    for (let i = 0; i < winLength; i++) {
      const r = row + i * dr;
      const c = col + i * dc;

      // Out of bounds or different color
      if (
        r < 0 ||
        r >= board.length ||
        c < 0 ||
        c >= board[0].length ||
        board[r][c] !== color
      ) {
        return false;
      }
    }
    return true;
  };

  // Check all possible starting positions for a winning line
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[0].length; col++) {
      const color = board[row][col];

      for (const { dr, dc } of directions) {
        if (checkLine(row, col, dr, dc, color)) {
          return color === "black" ? 0 : 1;
        }
      }
    }
  }

  return null; // No winner found
}
