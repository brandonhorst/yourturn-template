import { Circle, X } from "lucide-preact";
import { GameViewProps } from "yourturn/types";
import type {
  Mark,
  Move,
  Outcome,
  PlayerState,
  PublicState,
} from "@/game/types.ts";

function markIcon(mark: Mark) {
  return mark === "x" ? <X class="w-8 h-8" /> : <Circle class="w-8 h-8" />;
}

function Tile(
  { cell, onPlay }: {
    cell: Mark | null;
    onPlay?: () => void;
  },
) {
  const isDisabled = onPlay == null || cell !== null;

  return (
    <button
      type="button"
      class="btn w-20 h-20"
      onClick={() => onPlay?.()}
      disabled={isDisabled}
    >
      {cell ? markIcon(cell) : null}
    </button>
  );
}

function Board(
  { board, onPlay }: {
    board: (Mark | null)[];
    onPlay?: (index: number) => void;
  },
) {
  return (
    <div class="grid grid-cols-3 gap-2">
      {board.map((cell, index) => (
        <Tile
          cell={cell}
          onPlay={onPlay ? () => onPlay(index) : undefined}
        />
      ))}
    </div>
  );
}

function PlayerList(
  { players, nextPlayer, outcome }: {
    players: { username: string }[];
    nextPlayer: 0 | 1;
    outcome: Outcome | undefined;
  },
) {
  return (
    <div class="list bg-base-100 border border-base-100 rounded-box mt-3">
      {players.map((player, index) => {
        const playerId = index as 0 | 1;
        const isTurn = outcome === undefined && nextPlayer === playerId;
        const isWinner = outcome === playerId;
        return (
          <div class="list-row items-center">
            {markIcon(playerId === 0 ? "x" : "o")}
            <div>{player.username}</div>
            {isWinner && <span class="badge badge-success">Winner</span>}
            {isTurn && <span class="badge badge-primary">Turn</span>}
          </div>
        );
      })}
    </div>
  );
}

function Header({ username }: { username: string | undefined }) {
  return (
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-bold">Tic-tac-toe</h2>
      <a href="/lobby" class="link">Back to Lobby</a>
      <div>{username}</div>
    </div>
  );
}

export function GameView(
  props: GameViewProps<Move, PlayerState, PublicState, Outcome>,
) {
  const handlePlay = props.perform == null
    ? undefined
    : (index: number) => props.perform({ index });

  let username: string | undefined;
  if (props.playerId != null) {
    username = props.players[props.playerId].username;
  }

  return (
    <div class="w-xl flex flex-col justify-center mx-auto">
      <Header username={username} />

      <div class="mt-6 flex justify-center">
        <Board
          board={props.publicState.board}
          onPlay={handlePlay}
        />
      </div>

      <PlayerList
        players={props.players}
        nextPlayer={props.publicState.nextPlayer}
        outcome={props.outcome}
      />
    </div>
  );
}
