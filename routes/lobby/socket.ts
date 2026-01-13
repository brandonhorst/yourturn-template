import { getGameServer } from "../../gameserver.ts";
import { define } from "../../utils.ts";

export const handler = define.handlers({
  async GET(ctx) {
    const req = ctx.req;
    const { socket, response } = Deno.upgradeWebSocket(req);

    await getGameServer().configureLobbySocket(socket, req);

    return response;
  },
});
