import { Handlers } from "$fresh/server.ts";
import { getGameServer } from "../../../gameserver.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const { gameId } = ctx.params;

    getGameServer().configureObserveSocket(socket, gameId);

    return response;
  },
};
