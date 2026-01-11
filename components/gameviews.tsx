import { ObserveViewProps, PlayerViewProps } from "yourturn/types";
import type {
  Move,
  ObserverState,
  Player,
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
  {
    playerState,
    perform,
    players,
    playerId,
  }: PlayerViewProps<Move, PlayerState, Player>,
) {
  const getPlayerName = (index: number) =>
    players[index]?.name || `Player ${index + 1}`;
  const opponentId = playerId === 0 ? 1 : 0;
  const opponentName = getPlayerName(opponentId);
  const selfName = getPlayerName(playerId);

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
          <p>Waiting for {opponentName}...</p>
        </div>
      )}

      {playerState.state === "complete" && (
        <div class="mt-4">
          <div class="flex gap-4">
            <div>
              <div>{getEmoji(playerState.ownAction)}</div>
              <div>{selfName}</div>
            </div>
            <div>vs</div>
            <div>
              <div>{getEmoji(playerState.oppositeAction)}</div>
              <div>{opponentName}</div>
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
  { observerState, players }: ObserveViewProps<ObserverState, Player>,
) {
  const getPlayerName = (index: number) =>
    players[index]?.name || `Player ${index + 1}`;

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
              <div>{getPlayerName(0)}</div>
            </div>
            <div>vs</div>
            <div>
              <div>{getEmoji(observerState.actions[1])}</div>
              <div>{getPlayerName(1)}</div>
            </div>
          </div>

          <div class="mt-4">
            {observerState.winner === 0 && (
              <span class="text-success">
                {getPlayerName(0)} Wins! 🎉
              </span>
            )}
            {observerState.winner === 1 && (
              <span class="text-success">
                {getPlayerName(1)} Wins! 🎉
              </span>
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
