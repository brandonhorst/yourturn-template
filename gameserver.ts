import { initializeServer, type Server } from "yourturn/server";
import { game } from "@/game/game.ts";
import type {
  Config,
  GameState,
  Move,
  ObserverState,
  Player,
  PlayerState,
} from "./game/types.ts";

let gameServer:
  | Server<Config, GameState, Move, Player, PlayerState, ObserverState>
  | undefined;

export function getGameServer(): Server<
  Config,
  GameState,
  Move,
  Player,
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
