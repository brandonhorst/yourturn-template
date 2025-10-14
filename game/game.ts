import { Game } from "yourturn/types";
import type {
  Config,
  GameState,
  Move,
  ObserverState,
  PlayerState,
} from "./types.ts";
import { produce } from "immer";

export const game: Game<Config, GameState, Move, PlayerState, ObserverState> = {
  modes: {
    queue: {
      numPlayers: 2,
      matchmaking: "queue",
      config: undefined,
    },
  },

  setup({ config, players, timestamp }): Readonly<GameState> {},

  isValidMove(s, { move, playerId, timestamp, players }): boolean {
    return true;
  },

  processMove(s, { move, playerId, timestamp, players }): Readonly<GameState> {
    return s;
  },

  playerState(s, { playerId, isComplete, players }): Readonly<PlayerState> {},

  observerState(s, { isComplete, players }): Readonly<ObserverState> {},

  isComplete(s, { players }): boolean {
    return false;
  },
};
