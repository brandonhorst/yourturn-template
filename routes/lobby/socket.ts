import { Handlers } from "$fresh/server.ts";
import { getGameServer } from "../../gameserver.ts";

export const handler: Handlers = {
  GET(req) {
    const { socket, response } = Deno.upgradeWebSocket(req);

    getGameServer().configureLobbySocket(socket);

    return response;
  },
};
