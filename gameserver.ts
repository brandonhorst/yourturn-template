import { initializeServer, type Server } from "yourturn/server";
import { game } from "@/game/game.ts";
import type {
  Config,
  GameState,
  Move,
  Outcome,
  PlayerState,
  PublicState,
} from "./game/types.ts";

let gameServer:
  | Server<Config, GameState, Move, PlayerState, PublicState, Outcome>
  | undefined;

export function getGameServer(): Server<
  Config,
  GameState,
  Move,
  PlayerState,
  PublicState,
  Outcome
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
