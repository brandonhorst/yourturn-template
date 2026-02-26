import { type GameDefinition } from "yourturn/types";
import type {
  Config,
  GameState,
  Loadout,
  Mark,
  Outcome,
  PlayerState,
  PublicState,
  Rating,
  TicTacToeTypes,
} from "./types.ts";
import { produce } from "immer";

function otherPlayerId(playerId: 0 | 1): 0 | 1 {
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

export const game: GameDefinition<TicTacToeTypes> = {
  queues: {
    queue: {
      numPlayers: 2,
      queueType: "unranked",
      config: undefined,
    },
  },

  setup(_o): Readonly<GameState> {
    return { board: Array(9).fill(null), nextPlayer: 0 };
  },

  isValidMove(s, { move, playerId }): boolean {
    const { index } = move;
    if (!Number.isInteger(index) || index < 0 || index > 8) {
      return false;
    }

    if (playerId !== s.nextPlayer) {
      return false;
    }

    return s.board[index] === null;
  },

  isValidLoadout(loadout: Loadout, _config: Config): boolean {
    return loadout === undefined;
  },

  isValidRoom(config: Config): boolean {
    return config === undefined;
  },

  processMove(s, { move, playerId }): Readonly<GameState> {
    const pid = playerId as 0 | 1;
    return produce(s, (s) => {
      s.board[move.index] = markForPlayer(pid);
      s.nextPlayer = otherPlayerId(pid);
    });
  },

  playerState(): Readonly<PlayerState> {
    return undefined;
  },

  publicState(s, _o): Readonly<PublicState> {
    return {
      board: s.board,
      nextPlayer: s.nextPlayer,
    };
  },

  outcome(s, _o): Outcome | undefined {
    for (const [a, b, c] of winningLines) {
      const mark = s.board[a];
      if (mark && mark === s.board[b] && mark === s.board[c]) {
        return mark === "x" ? 0 : 1;
      }
    }

    if (s.board.every((cell) => cell !== null)) {
      return "tie";
    }

    return undefined;
  },

  initialRating(): Rating {
    return 0;
  },

  processOutcome(_outcome: Outcome, currentRatings: Rating[]): Rating[] {
    return currentRatings;
  },
};
