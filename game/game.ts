import { Game } from "yourturn/types";
import type {
  Config,
  GameState,
  Move,
  ObserverState,
  PlayerId,
  PlayerState,
} from "./types.ts";
import { produce } from "immer";

function otherPlayerId(playerId: 0 | 1): 0 | 1 {
  return (1 + playerId) % 2 as 0 | 1;
}

export const game: Game<
  Config,
  GameState,
  Move,
  PlayerState,
  ObserverState,
  PlayerId
> = {
  modes: {
    queue: {
      playerIds: [0, 1],
      matchmaking: "queue",
      config: undefined,
    },
  },

  setup(): Readonly<GameState> {
    return { actions: { 0: null, 1: null } };
  },

  isValidMove(_s, {
    config: _config,
    move: _move,
    playerId: _playerId,
    timestamp: _timestamp,
    players: _players,
  }): boolean {
    return true;
  },

  processMove(
    s,
    {
      move,
      playerId,
      config: _config,
      timestamp: _timestamp,
      players: _players,
    },
  ): Readonly<GameState> {
    return produce(s, (s) => {
      s.actions[playerId] = move;
    });
  },

  playerState(
    s,
    {
      playerId,
      isComplete,
      config: _config,
      timestamp: _timestamp,
      players: _players,
    },
  ): Readonly<PlayerState> {
    const ownAction = s.actions[playerId];
    const oppositeAction = s.actions[otherPlayerId(playerId)];

    if (isComplete && ownAction && oppositeAction) {
      // Calculate result
      let result: "win" | "lose" | "tie";
      if (ownAction === oppositeAction) {
        result = "tie";
      } else if (
        (ownAction === "rock" && oppositeAction === "scissors") ||
        (ownAction === "paper" && oppositeAction === "rock") ||
        (ownAction === "scissors" && oppositeAction === "paper")
      ) {
        result = "win";
      } else {
        result = "lose";
      }

      return {
        state: "complete",
        ownAction,
        oppositeAction,
        result,
      };
    } else if (ownAction) {
      return {
        state: "played",
        ownAction,
      };
    } else {
      return { state: "waiting" };
    }
  },

  observerState(
    s,
    { config: _config, isComplete, players: _players, timestamp: _timestamp },
  ): Readonly<ObserverState> {
    if (isComplete && s.actions[0] && s.actions[1]) {
      const action0 = s.actions[0];
      const action1 = s.actions[1];

      // Calculate winner
      let winner: PlayerId | "tie";
      if (action0 === action1) {
        winner = "tie";
      } else if (
        (action0 === "rock" && action1 === "scissors") ||
        (action0 === "paper" && action1 === "rock") ||
        (action0 === "scissors" && action1 === "paper")
      ) {
        winner = 0;
      } else {
        winner = 1;
      }

      return {
        state: "complete",
        actions: { 0: action0, 1: action1 },
        winner,
      };
    } else {
      return { state: "waiting" };
    }
  },

  isComplete(s, { config: _config, players: _players }): boolean {
    return s.actions[0] !== null && s.actions[1] !== null;
  },
};
