import LobbyIsland from "../../islands/LobbyIsland.tsx";
import { getGameServer } from "../../gameserver.ts";
import { checkAuth, define, setAuth } from "../../utils.ts";
import type { LobbyProps } from "yourturn/types";

export const handler = define.handlers({
  async GET(ctx) {
    const headers = new Headers();
    const providedToken = checkAuth(ctx.req.headers);
    const { props, token } = await getGameServer()
      .getInitialLobbyProps(providedToken);
    setAuth(headers, token);

    return { data: props, headers };
  },
});

export default define.page<typeof handler>(
  (props: { data: LobbyProps }) => {
    return <LobbyIsland initialLobbyProps={props.data} />;
  },
);
