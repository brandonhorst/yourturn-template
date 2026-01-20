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
    <div class="flex justify-center">
      <div class="grid grid-cols-3 gap-2 w-60 h-60 justify-around">
        {board.map((cell, index) => (
          <Tile
            cell={cell}
            onPlay={onPlay ? () => onPlay(index) : undefined}
          />
        ))}
      </div>
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
    <div class="list">
      {players.map((player, i) => {
        const isTurn = outcome === undefined && nextPlayer === i;
        const isWinner = outcome === i;
        return (
          <div class="list-row items-center">
            {markIcon(i === 0 ? "x" : "o")}
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
    <div class="w-xl flex flex-col gap-4 mx-auto">
      <Header username={username} />

      <Board
        board={props.publicState.board}
        onPlay={handlePlay}
      />

      <PlayerList
        players={props.players}
        nextPlayer={props.publicState.nextPlayer}
        outcome={props.outcome}
      />
    </div>
  );
}
