import { Game } from "yourturn/types";
import type {
  Config,
  GameState,
  Mark,
  Move,
  ObserverState,
  PlayerState,
} from "./types.ts";
import { produce } from "immer";

function otherPlayerId(playerId: number): 0 | 1 {
  return (1 + playerId) % 2 as 0 | 1;
}

function markForPlayer(playerId: 0 | 1): Mark {
  return playerId === 0 ? "x" : "o";
}

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function getOutcome(board: (Mark | null)[]): 0 | 1 | "tie" | null {
  for (const [a, b, c] of winningLines) {
    const mark = board[a];
    if (mark && mark === board[b] && mark === board[c]) {
      return mark === "x" ? 0 : 1;
    }
  }

  if (board.every((cell) => cell !== null)) {
    return "tie";
  }

  return null;
}

export const game: Game<
  Config,
  GameState,
  Move,
  PlayerState,
  ObserverState
> = {
  modes: {
    queue: {
      numPlayers: 2,
      matchmaking: "queue",
      config: undefined,
    },
  },

  setup(): Readonly<GameState> {
    return { board: Array(9).fill(null), nextPlayer: 0, winner: null };
  },

  isValidMove(s, { move, playerId }): boolean {
    const { index } = move;
    if (!Number.isInteger(index) || index < 0 || index > 8) {
      return false;
    }

    if (s.winner !== null) {
      return false;
    }

    const pid = playerId as 0 | 1;
    if (pid !== s.nextPlayer) {
      return false;
    }

    return s.board[index] === null;
  },

  processMove(s, { move, playerId }): Readonly<GameState> {
    const pid = playerId as 0 | 1;
    return produce(s, (s) => {
      s.board[move.index] = markForPlayer(pid);
      const outcome = getOutcome(s.board);
      s.winner = outcome;
      if (outcome === null) {
        s.nextPlayer = otherPlayerId(pid);
      }
    });
  },

  playerState(s): Readonly<PlayerState> {
    return {
      board: s.board,
      nextPlayer: s.nextPlayer,
      winner: s.winner,
    };
  },

  observerState(s): Readonly<ObserverState> {
    return {
      board: s.board,
      nextPlayer: s.nextPlayer,
      winner: s.winner,
    };
  },

  isComplete(s): boolean {
    return s.winner !== null;
  },
};
