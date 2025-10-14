import { getGameServer } from "../../../gameserver.ts";
import { define } from "../../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const { socket, response } = Deno.upgradeWebSocket(ctx.req);
    const { gameId } = ctx.params;

    getGameServer().configureObserveSocket(socket, gameId);

    return response;
  },
});
