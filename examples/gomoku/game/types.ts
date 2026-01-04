export type CellValue = "black" | "white" | null;
export type Board = CellValue[][];

export type Config = {
  boardSize: number;
  winLength: number;
};

export type Position = {
  row: number;
  col: number;
};

export type GameState = {
  board: Board;
  currentPlayer: number;
  timeRemainingMs: [number, number]; // Remaining time in milliseconds for each player
  lastUpdateTimestamp: number; // Timestamp of the last move
};

export type PlayerState = {
  pendingAction: boolean;
  board: Board;
  timeRemainingMs: [number, number]; // Remaining time in milliseconds for each player
  currentPlayer: number; // Index of the current player (0 or 1)
  winner: number | null;
};

export type ObserverState = {
  board: Board;
  timeRemainingMs: [number, number]; // Remaining time in milliseconds for each player
  currentPlayer: number; // Index of the current player (0 or 1)
  winner: number | null;
};

export type Move = Position;
