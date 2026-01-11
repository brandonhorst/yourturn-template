import { ComponentChildren } from "preact";
import { useState } from "preact/hooks";
import { LobbyViewProps } from "yourturn/types";
import type { Config, Player } from "../game/types.ts";

export function Button(
  props: {
    onClick?: () => void;
    children: ComponentChildren;
  },
) {
  return (
    <button
      type="button"
      class="flex-grow bg-blue-200 hover:bg-blue-300 active:bg-blue-400 focus:ring-4 focus:ring-blue-300 rounded px-5 py-2.5 focus:outline-none"
      onClick={props.onClick}
    >
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
  const formatConfig = (config: Config) => `hand ${config.initialHandSize}`;
  const updatePlayerName = () => {
    const nextName = prompt("Enter a player name", playerName)?.trim();
    if (nextName) {
      setPlayerName(nextName);
    }
  };

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h1 class="text-xl pt-4">UNO</h1>

      <div class="pt-4 flex items-center gap-2">
        <span class="font-semibold">Player:</span>
        <span>{playerName}</span>
        <Button onClick={updatePlayerName}>Change Name</Button>
      </div>

      <h2 class="text-lg pt-4">New Game</h2>
      {isQueued
        ? <Button onClick={leaveQueue}>Leave Queue</Button>
        : (
          <div class="flex gap-2">
            <Button
              onClick={() => joinQueue("twoPlayer", { name: playerName })}
            >
              2 Players
            </Button>
            <Button
              onClick={() => joinQueue("threePlayer", { name: playerName })}
            >
              3 Players
            </Button>
            <Button
              onClick={() => joinQueue("fourPlayer", { name: playerName })}
            >
              4 Players
            </Button>
          </div>
        )}

      <h2 class="text-lg pt-4">Active Games</h2>
      {activeGames.length === 0
        ? <div class="italic">No Active Games</div>
        : (
          <ul class="list-disc list-inside">
            {activeGames.map(({ gameId, config, players }) => (
              <li>
                <a
                  class="cursor-pointer underline"
                  href={`/observe/${gameId}`}
                >
                  {`${formatPlayers(players)} - ${formatConfig(config)}`}
                </a>
              </li>
            ))}
          </ul>
        )}
    </div>
  );
}
