import { Circle, X } from "lucide-preact";
import { GameViewProps } from "yourturn/types";
import type { Mark, Move, ObserverState, PlayerState } from "@/game/types.ts";

function markIcon(mark: Mark) {
  return mark === "x" ? <X class="w-8 h-8" /> : <Circle class="w-8 h-8" />;
}

function Board(
  { board, canPlay, onPlay }: {
    board: (Mark | null)[];
    canPlay: boolean;
    onPlay: (index: number) => void;
  },
) {
  return (
    <div class="grid grid-cols-3 gap-2">
      {board.map((cell, index) => (
        <button
          type="button"
          class="btn btn-outline btn-square w-20 h-20"
          onClick={() => onPlay(index)}
          disabled={!canPlay || cell !== null}
        >
          {cell ? markIcon(cell) : null}
        </button>
      ))}
    </div>
  );
}

function PlayerList(
  { players, nextPlayer, winner }: {
    players: { username: string }[];
    nextPlayer: 0 | 1;
    winner: 0 | 1 | "tie" | null;
  },
) {
  return (
    <div class="mt-8">
      <h3 class="text-lg font-semibold">Player List</h3>
      <div class="list bg-base-100 rounded-box border mt-3">
        {players.map((player, index) => {
          const playerId = index as 0 | 1;
          const isTurn = winner === null && nextPlayer === playerId;
          const isWinner = winner === playerId;
          return (
            <div class="list-row">
              <div class="list-col-grow flex items-center gap-3">
                {markIcon(playerId === 0 ? "x" : "o")}
                <span class="font-medium">{player.username}</span>
              </div>
              <div class="flex items-center gap-2">
                {isWinner && <span class="badge badge-success">Winner</span>}
                {isTurn && <span class="badge badge-primary">Turn</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function GameView(
  props: GameViewProps<Move, PlayerState, ObserverState>,
) {
  const canPlay = props.mode === "player" && props.perform !== undefined &&
    props.playerId === state.nextPlayer;

  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold">Tic-tac-toe</h2>
      <a href="/lobby" class="link">Back to Lobby</a>

      <div class="mt-6 flex justify-center">
        <Board
          board={props.state.board}
          canPlay={canPlay}
          onPlay={(index) => props.perform?.({ index })}
        />
      </div>

      <PlayerList
        players={props.players}
        nextPlayer={props.state.nextPlayer}
        winner={props.state.winner}
      />
    </div>
  );
}
