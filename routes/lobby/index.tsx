import LobbyIsland from "../../islands/LobbyIsland.tsx";
import { getGameServer } from "../../gameserver.ts";
import { define, YOURTURN_TOKEN_COOKIE } from "../../utils.ts";
import type { LobbyProps } from "yourturn/types";
import { getCookies, setCookie } from "@std/http/cookie";

export const handler = define.handlers({
  async GET(ctx) {
    const headers = new Headers();
    const cookies = getCookies(ctx.req.headers);
    const providedToken = cookies[YOURTURN_TOKEN_COOKIE];
    const { props, token } = await getGameServer()
      .getInitialLobbyProps(providedToken);
    setCookie(headers, {
      name: YOURTURN_TOKEN_COOKIE,
      value: token,
      httpOnly: true,
      sameSite: "Lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });

    return { data: props, headers };
  },
});

export default define.page<typeof handler>(
  (props: { data: LobbyProps }) => {
    return <LobbyIsland initialLobbyProps={props.data} />;
  },
);
