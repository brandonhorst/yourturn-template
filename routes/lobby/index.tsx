import { Handlers, PageProps } from "$fresh/server.ts";
import LobbyIsland from "../../islands/Lobby.tsx";
import { getGameServer } from "../../gameserver.ts";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const initialActiveGames = await getGameServer()
      .getInitialActiveGames();
    return ctx.render(initialActiveGames);
  },
};

export default function Home(props: PageProps) {
  return <LobbyIsland initialActiveGames={props.data} />;
}
