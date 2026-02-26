import { getGameServer } from "../../gameserver.ts";
import { checkAuth, define } from "../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const { socket, response } = Deno.upgradeWebSocket(ctx.req);

    const gameServer = getGameServer();
    const userId = await gameServer.resolveToken(checkAuth(ctx.req.headers));
    gameServer.configureSocket(socket, userId);

    return response;
  },
});
