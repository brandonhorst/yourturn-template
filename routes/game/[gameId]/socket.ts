import { getGameServer } from "../../../gameserver.ts";
import { checkAuth, define } from "../../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const req = ctx.req;
    const { socket, response } = Deno.upgradeWebSocket(req);

    const token = checkAuth(ctx.req.headers);
    await getGameServer().configureGameSocket(socket, ctx.params.gameId, token);

    return response;
  },
});
