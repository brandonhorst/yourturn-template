import {
  ObserveViewProps,
  PlayerViewProps,
} from "jsr:@brandonhorst/yourturn/types";
import type { Move, ObserverState, PlayerState } from "../game/types.ts";
import { useEffect, useState } from "preact/hooks";

function GomokuBoard(
  props: {
    board: (string | null)[][];
    pendingAction: boolean;
    perform?: (move: Move) => void;
  },
) {
  const boardSize = props.board.length;

  // Create a grid template style instead of using Tailwind class
  const gridStyle = {
    gridTemplateColumns: `repeat(${boardSize}, minmax(0, 1fr))`,
  };

  return (
    <div class="grid gap-1 w-full max-w-lg mx-auto" style={gridStyle}>
      {props.board.map((row, rowIndex) => (
        row.map((cell, colIndex) => (
          <button
            type="button"
            key={`${rowIndex}-${colIndex}`}
            class={`aspect-square rounded-full flex items-center justify-center border ${
              cell === "black"
                ? "bg-black"
                : cell === "white"
                ? "bg-white"
                : props.pendingAction
                ? "bg-gray-200 hover:bg-gray-300"
                : "bg-gray-200"
            }`}
            disabled={cell !== null || !props.pendingAction}
            onClick={() => props.perform?.({ row: rowIndex, col: colIndex })}
            aria-label={`Position ${rowIndex}, ${colIndex}`}
          >
            {cell !== null && (
              <div
                class={`w-3/4 h-3/4 rounded-full ${
                  cell === "black" ? "bg-black" : "bg-white"
                } border ${cell === "white" ? "border-black" : "border-white"}`}
              />
            )}
          </button>
        ))
      ))}
    </div>
  );
}

// Helper function to format time in mm:ss
function formatTimeRemaining(ms: number): string {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

// Shared countdown timer component
function CountdownTimer(
  { initialTimeMs, isActive = false }: {
    initialTimeMs: number;
    isActive?: boolean;
  },
) {
  const [timeRemainingMs, setTimeRemainingMs] = useState(initialTimeMs);

  useEffect(() => {
    // Reset timer whenever the server value changes
    setTimeRemainingMs(initialTimeMs);
  }, [initialTimeMs]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeRemainingMs((prev) => Math.max(0, prev - 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <span class="ml-2 font-mono">
      {formatTimeRemaining(timeRemainingMs)}
    </span>
  );
}

// Player info component with timer
function PlayerInfo({ player, timeRemainingMs, isActive, color }: {
  player: { name: string; isVictor: boolean };
  timeRemainingMs: number;
  isActive: boolean;
  color: "black" | "white";
}) {
  return (
    <div
      class={`p-2 rounded ${
        player.isVictor ? "bg-green-100" : isActive ? "bg-yellow-50" : ""
      }`}
    >
      <div class="flex items-center gap-2">
        <div
          class={`w-4 h-4 rounded-full ${
            color === "black" ? "bg-black" : "bg-white border border-black"
          }`}
        >
        </div>
        <span>{player.name}</span>
        {player.isVictor && <span>(Winner!)</span>}
        <CountdownTimer
          initialTimeMs={timeRemainingMs}
          isActive={isActive && !player.isVictor}
        />
      </div>
    </div>
  );
}

export function PlayerView(
  { playerState, perform }: PlayerViewProps<Move, PlayerState>,
) {
  return (
    <div class="p-4">
      <div class="mb-4 text-center">
        <h2 class="text-xl font-bold">Gomoku</h2>
        <div class="flex justify-center gap-8 mb-4">
          <PlayerInfo
            player={playerState.perPlayer[0]}
            timeRemainingMs={playerState.timeRemainingMs[0]}
            isActive={playerState.currentPlayer === 0}
            color="black"
          />
          <PlayerInfo
            player={playerState.perPlayer[1]}
            timeRemainingMs={playerState.timeRemainingMs[1]}
            isActive={playerState.currentPlayer === 1}
            color="white"
          />
        </div>

        {playerState.pendingAction && (
          <div class="mb-4 font-bold text-green-600">Your turn</div>
        )}
        {!playerState.pendingAction &&
          !playerState.perPlayer.some((p) => p.isVictor) && (
          <div class="mb-4">Waiting for opponent...</div>
        )}
      </div>

      <GomokuBoard
        board={playerState.board}
        pendingAction={playerState.pendingAction}
        perform={perform}
      />
    </div>
  );
}

export function ObserverView(
  { observerState }: ObserveViewProps<ObserverState>,
) {
  return (
    <div class="p-4">
      <div class="mb-4 text-center">
        <h2 class="text-xl font-bold">Gomoku (Observer View)</h2>
        <div class="flex justify-center gap-8 mb-4">
          <PlayerInfo
            player={observerState.perPlayer[0]}
            timeRemainingMs={observerState.timeRemainingMs[0]}
            isActive={observerState.currentPlayer === 0}
            color="black"
          />
          <PlayerInfo
            player={observerState.perPlayer[1]}
            timeRemainingMs={observerState.timeRemainingMs[1]}
            isActive={observerState.currentPlayer === 1}
            color="white"
          />
        </div>
      </div>

      <GomokuBoard
        board={observerState.board}
        pendingAction={false}
      />
    </div>
  );
}
