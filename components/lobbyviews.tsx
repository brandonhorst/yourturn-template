import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { LobbyViewProps } from "yourturn/types";
import type { Config, Player } from "@/game/types.ts";

export default function Button(
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
    initialPlayerName,
  }: LobbyViewProps<Config, Player> & { initialPlayerName: string },
) {
  const [playerName, setPlayerName] = useState(() => initialPlayerName);
  const formatPlayers = (players: Player[]) =>
    players.map((player, index) => player.name || `Player ${index + 1}`).join(
      " vs ",
    );
  const updatePlayerName = () => {
    const nextName = prompt("Enter a player name", playerName)?.trim();
    if (nextName) {
      setPlayerName(nextName);
    }
  };

  return (
    <div class="p-4">
      <h1 class="text-xl pt-4">Rock Paper Scissors</h1>

      <div class="pt-4 flex items-center gap-2">
        <span class="font-semibold">Player:</span>
        <span>{playerName}</span>
        <Button onClick={updatePlayerName}>Change Name</Button>
      </div>

      <h2 class="text-lg pt-4">New Game</h2>
      {isQueued
        ? <Button onClick={leaveQueue}>Leave Queue</Button>
        : (
          <Button onClick={() => joinQueue("queue", { name: playerName })}>
            Join Queue
          </Button>
        )}

      <h2 class="text-lg pt-4">Active Games</h2>
      {activeGames.length === 0
        ? <div class="italic">No Active Games</div>
        : (
          <ul class="list-disc list-inside">
            {activeGames.map(({ gameId, players }) => (
              <li>
                <a
                  class="cursor-pointer underline"
                  href={`/observe/${gameId}`}
                >
                  {formatPlayers(players)}
                </a>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
