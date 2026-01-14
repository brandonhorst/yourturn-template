import { GameViewProps } from "yourturn/types";
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

export function GameView(
  props: GameViewProps<Move, PlayerState, ObserverState>,
) {
  const isPlayer = props.mode === "player";
  const ownUsername = isPlayer
    ? props.players[props.playerId]!.username
    : undefined;
  const opponentId = isPlayer ? (props.playerId === 0 ? 1 : 0) : undefined;
  const opponentUsername = isPlayer && opponentId !== undefined
    ? props.players[opponentId]!.username
    : undefined;
  const playerOneName = props.players[0]!.username;
  const playerTwoName = props.players[1]!.username;

  return (
    <div class="p-4">
      <h2 class="text-2xl font-bold">Rock Paper Scissors</h2>
      <a href="/lobby" class="link">Back to Lobby</a>

      {isPlayer && props.playerState.state === "active" && (
        <div class="mt-4">
          <p>Choose your move:</p>
          <div class="flex gap-2 mt-2">
            <EmojiButton
              action="rock"
              onClick={() => props.perform?.("rock")}
            />
            <EmojiButton
              action="paper"
              onClick={() => props.perform?.("paper")}
            />
            <EmojiButton
              action="scissors"
              onClick={() => props.perform?.("scissors")}
            />
          </div>
        </div>
      )}

      {!isPlayer && (
        <div class="mt-4">
          <p class="opacity-70">Observers can view results after each round.</p>
          <div class="flex gap-2 mt-2">
            <button type="button" class="btn btn-primary" disabled>
              {getEmoji("rock")}
            </button>
            <button type="button" class="btn btn-primary" disabled>
              {getEmoji("paper")}
            </button>
            <button type="button" class="btn btn-primary" disabled>
              {getEmoji("scissors")}
            </button>
          </div>
        </div>
      )}

      {isPlayer && props.playerState.state === "played" && (
        <div class="mt-4">
          <p>
            You chose: {getEmoji(props.playerState.ownAction)}
          </p>
          <p>Waiting for opponent...</p>
        </div>
      )}

      {isPlayer && props.playerState.state === "complete" && (
        <div class="mt-4">
          <div class="flex gap-4">
            <div>
              <div>{getEmoji(props.playerState.ownAction)}</div>
              <div>{ownUsername}</div>
            </div>
            <div>vs</div>
            <div>
              <div>{getEmoji(props.playerState.oppositeAction)}</div>
              <div>{opponentUsername}</div>
            </div>
          </div>

          <div class="mt-4">
            {props.playerState.result === "win" && (
              <span class="text-success">You Win! 🎉</span>
            )}
            {props.playerState.result === "lose" && (
              <span class="text-error">You Lose 😔</span>
            )}
            {props.playerState.result === "tie" && (
              <span class="text-warning">It's a Tie! 🤝</span>
            )}
          </div>
        </div>
      )}

      {!isPlayer && props.observerState.state === "waiting" && (
        <p class="mt-4">Waiting for players to choose...</p>
      )}

      {!isPlayer && props.observerState.state === "complete" && (
        <div class="mt-4">
          <div class="flex gap-4">
            <div>
              <div>{getEmoji(props.observerState.actions[0])}</div>
              <div>{playerOneName}</div>
            </div>
            <div>vs</div>
            <div>
              <div>{getEmoji(props.observerState.actions[1])}</div>
              <div>{playerTwoName}</div>
            </div>
          </div>

          <div class="mt-4">
            {props.observerState.winner === 0 && (
              <span class="text-success">{playerOneName} Wins! 🎉</span>
            )}
            {props.observerState.winner === 1 && (
              <span class="text-success">{playerTwoName} Wins! 🎉</span>
            )}
            {props.observerState.winner === "tie" && (
              <span class="text-warning">It's a Tie! 🤝</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
