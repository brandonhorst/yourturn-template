import { getGameServer } from "../../../../gameserver.ts";
import { define } from "../../../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const { socket, response } = Deno.upgradeWebSocket(ctx.req);
    const { gameId, sessionId } = ctx.params;

    await getGameServer().configurePlaySocket(socket, gameId, sessionId);

    return response;
  },
});
