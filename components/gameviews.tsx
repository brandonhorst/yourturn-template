import { ObserveViewProps, PlayerViewProps } from "yourturn/types";
import type {
  Move,
  ObserverState,
  PlayerState,
  RPSAction,
} from "@/game/types.ts";

function getEmoji(action: RPSAction) {
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
  { action, onClick }: { action: RPSAction; onClick: () => void },
) {
  return (
    <button
      type="button"
      onClick={onClick}
      class="btn btn-primary"
    >
      {getEmoji(action)}
    </button>
  );
}

export function PlayerView(
  { playerState, perform, playerId, players }: PlayerViewProps<
    Move,
    PlayerState
  >,
) {
  const ownUsername = players[playerId]!.username;
  const opponentId = playerId === 0 ? 1 : 0;
  const opponentUsername = players[opponentId]!.username;
  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold">Rock Paper Scissors</h2>
      <a href="/lobby" class="link">Back to Lobby</a>

      {playerState.state === "active" && perform && (
        <div class="mt-4">
          <p>Choose your move:</p>
          <div class="flex gap-2 mt-2">
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
        <div class="mt-4">
          <p>
            You chose: {getEmoji(playerState.ownAction)}
          </p>
          <p>Waiting for opponent...</p>
        </div>
      )}

      {playerState.state === "complete" && (
        <div class="mt-4">
          <div class="flex gap-4">
            <div>
              <div>{getEmoji(playerState.ownAction)}</div>
              <div>{ownUsername}</div>
            </div>
            <div>vs</div>
            <div>
              <div>{getEmoji(playerState.oppositeAction)}</div>
              <div>{opponentUsername}</div>
            </div>
          </div>

          <div class="mt-4">
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
  { observerState, players }: ObserveViewProps<ObserverState>,
) {
  const playerOneName = players[0]!.username;
  const playerTwoName = players[1]!.username;
  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold">Rock Paper Scissors</h2>
      <a href="/lobby" class="link">Back to Lobby</a>

      {observerState.state === "waiting" && (
        <p class="mt-4">Waiting for players to choose...</p>
      )}

      {observerState.state === "complete" && (
        <div class="mt-4">
          <div class="flex gap-4">
            <div>
              <div>{getEmoji(observerState.actions[0])}</div>
              <div>{playerOneName}</div>
            </div>
            <div>vs</div>
            <div>
              <div>{getEmoji(observerState.actions[1])}</div>
              <div>{playerTwoName}</div>
            </div>
          </div>

          <div class="mt-4">
            {observerState.winner === 0 && (
              <span class="text-success">{playerOneName} Wins! 🎉</span>
            )}
            {observerState.winner === 1 && (
              <span class="text-success">{playerTwoName} Wins! 🎉</span>
            )}
            {observerState.winner === "tie" && (
              <span class="text-warning">It's a Tie! 🤝</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
