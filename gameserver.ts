import { initializeServer } from "yourturn/server";
import { game } from "@/game/game.ts";
import type { Server } from "yourturn/types";
import type { TicTacToeTypes } from "./game/types.ts";

let gameServer: Server<TicTacToeTypes> | undefined;

export function getGameServer(): Server<TicTacToeTypes> {
  if (gameServer == null) {
    throw new Error("GameServer is not initialized");
  }
  return gameServer;
}

export async function initializeGameServer() {
  console.log("Initializing yourturn game server");
  gameServer = await initializeServer(game);
}
