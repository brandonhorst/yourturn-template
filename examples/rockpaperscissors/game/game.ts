import { Game } from "jsr:@brandonhorst/yourturn/types";
import type {
  Config,
  GameState,
  Gesture,
  Move,
  ObserverState,
  PlayerState,
} from "./types.ts";
import { produce } from "npm:immer";

export const game: Game<Config, GameState, Move, PlayerState, ObserverState> = {
  modes: {
    queue: { numPlayers: 2, matchmaking: "queue", config: { firstToWins: 3 } },
  },

  setup() {
    return {
      log: [],
      currentGestures: [null, null],
      wins: [0, 0],
    };
  },

  isValidMove(s, { move, playerId }) {
    if (!["rock", "paper", "scissors"].includes(move)) {
      return false;
    }
    if (s.currentGestures[playerId] != null) {
      return false;
    }
    return true;
  },

  processMove(s, { move, playerId }) {
    return produce(s, (s) => {
      s.currentGestures[playerId] = move;

      // If both players have submitted a gesture, process and reset
      const [g0, g1] = s.currentGestures;
      if (g0 != null && g1 != null) {
        s.log.push([g0, g1]);
        s.currentGestures = [null, null];
        const winningPlayerId = getWinner([g0, g1]);
        if (winningPlayerId != null) {
          s.wins[winningPlayerId] += 1;
        }
      }
    });
  },

  playerState(s, { playerId, players, config, isComplete }) {
    return {
      playerId,
      pendingAction: s.currentGestures[playerId] == null && !isComplete,
      perPlayer: players.map((player, playerId) => ({
        name: player.name,
        wins: s.wins[playerId],
        isVictor: s.wins[playerId] >= config.firstToWins,
      })),
      log: s.log,
    };
  },

  observerState(s, { players, config }) {
    return {
      perPlayer: players.map((player, playerId) => ({
        name: player.name,
        wins: s.wins[playerId],
        isVictor: s.wins[playerId] >= config.firstToWins,
      })),
      log: s.log,
    };
  },

  isComplete(s, { config }): boolean {
    return s.wins[0] >= config.firstToWins || s.wins[1] >= config.firstToWins;
  },
};

// function getVictor(wins: [number, number], config: Config): number | undefined {
//   if (wins[0] >= config.firstToWins) {
//     return 0;
//   } else if (wins[1] >= config.firstToWins) {
//     return 1;
//   }
// }

// Returns null for a tie, or the winning playerId for a win
function getWinner([g0, g1]: [Gesture, Gesture]): number | null {
  if (g0 === g1) {
    return null;
  }

  if (
    (g0 === "rock" && g1 === "scissors") || (g0 === "paper" && g1 === "rock") ||
    (g0 === "scissors" && g1 === "paper")
  ) {
    return 0;
  } else {
    return 1;
  }
}
