import LobbyIsland from "../../islands/LobbyIsland.tsx";
import { getGameServer } from "../../gameserver.ts";
import { define } from "../../utils.ts";
import type { LobbyProps } from "yourturn/types";

export const handler = define.handlers({
  async GET(ctx) {
    const headers = new Headers();
    const initialLobbyProps = await getGameServer()
      .getInitialLobbyProps(ctx.req, headers);

    return { data: initialLobbyProps, headers };
  },
});

export default define.page<typeof handler>(
  (props: { data: LobbyProps }) => {
    return <LobbyIsland initialLobbyProps={props.data} />;
  },
);
