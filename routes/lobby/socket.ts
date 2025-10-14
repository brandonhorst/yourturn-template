import { getGameServer } from "../../gameserver.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  GET(ctx) {
    const req = ctx.req;
    const { socket, response } = Deno.upgradeWebSocket(req);

    getGameServer().configureLobbySocket(socket);

    return response;
  },
});
