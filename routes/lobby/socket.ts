import { getGameServer } from "../../gameserver.ts";
import { define, YOURTURN_TOKEN_COOKIE } from "../../utils.ts";
import { getCookies } from "@std/http/cookie";

export const handler = define.handlers({
  async GET(ctx) {
    const req = ctx.req;
    const { socket, response } = Deno.upgradeWebSocket(req);

    const cookies = getCookies(ctx.req.headers);
    const token = cookies[YOURTURN_TOKEN_COOKIE];
    await getGameServer().configureLobbySocket(socket, token);

    return response;
  },
});
