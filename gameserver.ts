import {
  initializeServer,
  type Server,
} from "jsr:@brandonhorst/yourturn/server";
import { game } from "./game/game.ts";
import type {
  Config,
  GameState,
  Move,
  ObserverState,
  PlayerState,
} from "./game/types.ts";

let gameServer:
  | Server<Config, GameState, Move, PlayerState, ObserverState>
  | undefined;

export function getGameServer(): Server<
  Config,
  GameState,
  Move,
  PlayerState,
  ObserverState
> {
  if (gameServer == null) {
    throw new Error("GameServer is not initialized");
  }
  return gameServer;
}

export async function initializeGameServer() {
  console.log("Initializing yourturn game server");
  gameServer = await initializeServer(game);
}
