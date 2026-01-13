import { LobbyViewProps } from "yourturn/types";
import { ComponentChildren } from "preact";

export function Button(
  props: {
    onClick?: () => void;
    children: ComponentChildren;
  },
) {
  return (
    <button type="button" class="btn" onClick={props.onClick}>
      {props.children}
    </button>
  );
}

export function LobbyView(
  {
    activeGames,
    joinQueue,
    isQueued,
    leaveQueue,
    updateUsername,
    user,
  }: LobbyViewProps,
) {
  const handleChangeUsername = () => {
    const nextUsername = prompt("Enter a new username", user.username);
    if (nextUsername == null) {
      return;
    }
    const trimmed = nextUsername.trim();
    if (trimmed.length === 0 || trimmed === user.username) {
      return;
    }
    updateUsername(trimmed);
  };

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h1 class="text-xl pt-4">Gomoku</h1>

      <div class="pt-4 flex items-center gap-2">
        <span class="font-semibold">Username:</span>
        <span>{user.username}</span>
        <Button onClick={handleChangeUsername}>Change</Button>
      </div>

      <h2 class="text-lg pt-4">New Game</h2>
      {isQueued
        ? <Button onClick={leaveQueue}>Leave Queue</Button>
        : (
          <div class="flex gap-2">
            <Button onClick={() => joinQueue("micro")}>Micro (9x9)</Button>
            <Button onClick={() => joinQueue("standard")}>
              Standard (15x15)
            </Button>
            <Button onClick={() => joinQueue("legacy")}>
              Legacy (19x19)
            </Button>
          </div>
        )}

      <h2 class="text-lg pt-4">Active Games</h2>
      {activeGames.length === 0
        ? <div class="italic">No Active Games</div>
        : (
          <ul class="list-disc list-inside">
            {activeGames.map(({ gameId }) => (
              <li>
                <a
                  class="cursor-pointer underline"
                  href={`/observe/${gameId}`}
                >
                  {gameId}
                </a>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
