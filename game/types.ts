export type Mark = "x" | "o";

export type GameState = {
  board: (Mark | null)[];
  nextPlayer: 0 | 1;
  winner: 0 | 1 | "tie" | null;
};

export type Config = undefined;

export type PlayerState = {
  board: (Mark | null)[];
  nextPlayer: 0 | 1;
  winner: 0 | 1 | "tie" | null;
};

export type PublicState = {
  board: (Mark | null)[];
  nextPlayer: 0 | 1;
  winner: 0 | 1 | "tie" | null;
};

export type Move = {
  index: number;
};
