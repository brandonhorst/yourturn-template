export type RPSAction = "rock" | "paper" | "scissors";

export type PlayerId = 0 | 1;

export type GameState = {
  actions: {
    0: RPSAction | null;
    1: RPSAction | null;
  };
};

export type Config = undefined;

export type PlayerState =
  | { state: "active" }
  | { state: "played"; ownAction: RPSAction }
  | {
    state: "complete";
    ownAction: RPSAction;
    oppositeAction: RPSAction;
    result: "win" | "lose" | "tie";
  };

export type ObserverState =
  | { state: "waiting" }
  | {
    state: "complete";
    actions: { 0: RPSAction; 1: RPSAction };
    winner: PlayerId | "tie";
  };

export type Move = RPSAction;
