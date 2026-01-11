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
  const formatConfig = (config: Config) =>
    `${config.boardSize}x${config.boardSize}, win ${config.winLength}`;
  const updatePlayerName = () => {
    const nextName = prompt("Enter a player name", playerName)?.trim();
    if (nextName) {
      setPlayerName(nextName);
    }
  };

  return (
    <div class="p-4 max-w-3xl mx-auto">
      <h1 class="text-xl pt-4">Gomoku</h1>

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
            <Button onClick={() => joinQueue("micro", { name: playerName })}>
              Micro (9x9)
            </Button>
            <Button onClick={() => joinQueue("standard", { name: playerName })}>
              Standard (15x15)
            </Button>
            <Button onClick={() => joinQueue("legacy", { name: playerName })}>
              Legacy (19x19)
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
