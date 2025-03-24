import { ComponentChildren } from "preact";
import { LobbyViewProps } from "jsr:@brandonhorst/yourturn/types";

export default function Button(
  props: {
    onClick?: () => void;
    children: ComponentChildren;
  },
) {
  return (
    <button
      type="button"
      class="flex-grow bg-blue-200 hover:bg-blue-300 active:bg-blue-400 focus:ring-4 focus:ring-blue-300  rounded px-5 py-2.5 focus:outline-none"
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function LobbyView(
  { activeGames, joinQueue, isQueued, leaveQueue }: LobbyViewProps,
) {
  return (
    <div class="p-4">
      <h1 class="text-xl pt-4">New Empty Game</h1>

      <h2 class="text-lg pt-4">New Game</h2>
      {isQueued
        ? <Button onClick={leaveQueue}>Leave Queue</Button>
        : <Button onClick={() => joinQueue("queue")}>Join Queue</Button>}

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
