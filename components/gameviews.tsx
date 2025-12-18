import { ObserveViewProps, PlayerViewProps } from "yourturn/types";
import type { Move, ObserverState, PlayerState } from "../game/types.ts";

function getEmoji(action: Move) {
  switch (action) {
    case "rock":
      return "✊";
    case "paper":
      return "✋";
    case "scissors":
      return "✌️";
  }
}

function EmojiButton(
  { action, onClick }: { action: Move; onClick: () => void },
) {
  return (
    <button
      type="button"
      onClick={onClick}
      class="btn btn-lg btn-primary flex-1"
    >
      {getEmoji(action)}
    </button>
  );
}

export function PlayerView(
  { playerState, perform }: PlayerViewProps<Move, PlayerState>,
) {
  return (
    <div class="p-4 flex flex-col gap-4 items-center mx-auto select-none max-w-md">
      <h2 class="text-2xl font-bold">Rock Paper Scissors</h2>

      {playerState.state === "waiting" && perform && (
        <div class="flex flex-col gap-3 w-full">
          <p class="text-center">Choose your move:</p>
          <div class="flex gap-3 justify-center">
            <EmojiButton
              action="rock"
              onClick={() => perform("rock")}
            />
            <EmojiButton action="paper" onClick={() => perform("paper")} />
            <EmojiButton
              action="scissors"
              onClick={() => perform("scissors")}
            />
          </div>
        </div>
      )}

      {playerState.state === "played" && (
        <div class="flex flex-col gap-3 items-center">
          <p class="text-lg">
            You chose:{" "}
            <span class="text-4xl">{getEmoji(playerState.ownAction)}</span>
          </p>
          <p class="text-muted">Waiting for opponent...</p>
        </div>
      )}

      {playerState.state === "complete" && (
        <div class="flex flex-col gap-4 items-center w-full">
          <div class="flex gap-8 items-center justify-center text-5xl">
            <div class="flex flex-col items-center gap-2">
              <span>{getEmoji(playerState.ownAction)}</span>
              <span class="text-sm">You</span>
            </div>
            <span class="text-2xl">vs</span>
            <div class="flex flex-col items-center gap-2">
              <span>{getEmoji(playerState.oppositeAction)}</span>
              <span class="text-sm">Opponent</span>
            </div>
          </div>

          <div class="text-2xl font-bold">
            {playerState.result === "win" && (
              <span class="text-success">You Win! 🎉</span>
            )}
            {playerState.result === "lose" && (
              <span class="text-error">You Lose 😔</span>
            )}
            {playerState.result === "tie" && (
              <span class="text-warning">It's a Tie! 🤝</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function ObserverView(
  { observerState }: ObserveViewProps<ObserverState>,
) {
  if (observerState.state === "waiting") {
    return (
      <div class="p-4 flex flex-col gap-4 items-center mx-auto select-none max-w-md">
        <h2 class="text-2xl font-bold">Rock Paper Scissors</h2>
        <p class="text-muted">Waiting for players to choose...</p>
      </div>
    );
  }

  // state === "complete"
  return (
    <div class="p-4 flex flex-col gap-4 items-center mx-auto select-none max-w-md">
      <h2 class="text-2xl font-bold">Rock Paper Scissors</h2>

      <div class="flex flex-col gap-4 items-center w-full">
        <div class="flex gap-8 items-center justify-center text-5xl">
          <div class="flex flex-col items-center gap-2">
            <span>{getEmoji(observerState.actions[0])}</span>
            <span class="text-sm">Player 1</span>
          </div>
          <span class="text-2xl">vs</span>
          <div class="flex flex-col items-center gap-2">
            <span>{getEmoji(observerState.actions[1])}</span>
            <span class="text-sm">Player 2</span>
          </div>
        </div>

        <div class="text-2xl font-bold">
          {observerState.winner === 0 && (
            <span class="text-success">Player 1 Wins! 🎉</span>
          )}
          {observerState.winner === 1 && (
            <span class="text-success">Player 2 Wins! 🎉</span>
          )}
          {observerState.winner === "tie" && (
            <span class="text-warning">It's a Tie! 🤝</span>
          )}
        </div>
      </div>
    </div>
  );
}
