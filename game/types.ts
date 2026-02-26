export type Mark = "x" | "o";

export type GameState = {
  board: (Mark | null)[];
  nextPlayer: 0 | 1;
};

export type Config = undefined;

export type PlayerState = undefined;

export type PublicState = {
  board: (Mark | null)[];
  nextPlayer: 0 | 1;
};

export type Outcome = 0 | 1 | "tie";

export type Move = {
  index: number;
};

export type Rating = number;

export type Loadout = undefined;

export type TicTacToeTypes = {
  Config: Config;
  GameState: GameState;
  Move: Move;
  PlayerState: PlayerState;
  PublicState: PublicState;
  Outcome: Outcome;
  Rating: Rating;
  Loadout: Loadout;
};
