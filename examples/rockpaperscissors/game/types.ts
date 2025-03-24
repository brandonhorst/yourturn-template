export type Gesture = "rock" | "paper" | "scissors";

export type Config = { firstToWins: number };

export type LogEntry = [Gesture, Gesture];

export type GameState = {
  log: LogEntry[];
  currentGestures: [Gesture | null, Gesture | null];
  wins: [number, number];
};

type PerPlayerClientState = {
  name: string;
  wins: number;
  isVictor: boolean;
};

export type PlayerState = {
  playerId: number;
  pendingAction: boolean;
  perPlayer: PerPlayerClientState[];
  log: LogEntry[];
};

export type ObserverState = {
  perPlayer: PerPlayerClientState[];
  log: LogEntry[];
};

export type Move = Gesture;
