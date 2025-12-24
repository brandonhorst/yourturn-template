export type RPSAction = "rock" | "paper" | "scissors";

export type GameState = {
  actions: [RPSAction | null, RPSAction | null];
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
    winner: 0 | 1 | "tie";
  };

export type Move = RPSAction;
