import { Handlers } from "$fresh/server.ts";
import { getGameServer } from "../../../../gameserver.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    const { socket, response } = Deno.upgradeWebSocket(req);
    const { gameId, sessionId } = ctx.params;

    await getGameServer().configurePlaySocket(socket, gameId, sessionId);

    return response;
  },
};
