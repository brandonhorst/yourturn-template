import { getGameServer } from "../../gameserver.ts";
import { checkAuth, define } from "../../utils.ts";
import { assert } from "@std/assert";

export const handler = define.handlers({
  async GET(ctx) {
    const req = ctx.req;
    const { socket, response } = Deno.upgradeWebSocket(req);

    const token = checkAuth(ctx.req.headers);
    assert(token != null);
    await getGameServer().configureLobbySocket(socket, token);

    return response;
  },
});
