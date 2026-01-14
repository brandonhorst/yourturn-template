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

  isValidMove(_s, {
    config: _config,
    move,
    playerId,
    timestamp: _timestamp,
    players: _players,
  }): boolean {
    const { index } = move;
    if (!Number.isInteger(index) || index < 0 || index > 8) {
      return false;
    }

    if (_s.winner !== null) {
      return false;
    }

    const pid = playerId as 0 | 1;
    if (pid !== _s.nextPlayer) {
      return false;
    }

    return _s.board[index] === null;
  },

  processMove(
    s,
    {
      move,
      playerId: _playerId,
      config: _config,
      timestamp: _timestamp,
      players: _players,
    },
  ): Readonly<GameState> {
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

  playerState(
    s,
    {
      playerId: _playerId,
      isComplete: _isComplete,
      config: _config,
      timestamp: _timestamp,
      players: _players,
    },
  ): Readonly<PlayerState> {
    return {
      board: s.board,
      nextPlayer: s.nextPlayer,
      winner: s.winner,
    };
  },

  observerState(
    s,
    {
      config: _config,
      isComplete: _isComplete,
      players: _players,
      timestamp: _timestamp,
    },
  ): Readonly<ObserverState> {
    return {
      board: s.board,
      nextPlayer: s.nextPlayer,
      winner: s.winner,
    };
  },

  isComplete(s, { config: _config, players: _players }): boolean {
    return s.winner !== null;
  },
};
