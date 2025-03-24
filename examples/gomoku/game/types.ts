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
  lastMoveTimestamp: number; // Timestamp of the last move
};

type PerPlayerClientState = {
  name: string;
  color: "black" | "white";
  isVictor: boolean;
};

export type PlayerState = {
  playerId: number;
  pendingAction: boolean;
  perPlayer: PerPlayerClientState[];
  board: Board;
  timeRemainingMs: [number, number]; // Remaining time in milliseconds for each player
  currentPlayer: number; // Index of the current player (0 or 1)
};

export type ObserverState = {
  perPlayer: PerPlayerClientState[];
  board: Board;
  timeRemainingMs: [number, number]; // Remaining time in milliseconds for each player
  currentPlayer: number; // Index of the current player (0 or 1)
};

export type Move = Position;
