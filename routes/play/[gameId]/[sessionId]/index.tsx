import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { getGameServer } from "../../../../gameserver.ts";
import PlayIsland from "../../../../islands/PlayIsland.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { gameId, sessionId } = ctx.params;
    const initialPlayerProps = await getGameServer().getInitialPlayerProps(
      gameId,
      sessionId,
    );
    return ctx.render(initialPlayerProps);
  },
};

export default function GameId(props: PageProps) {
  const { gameId, sessionId } = props.params;

  return (
    <PlayIsland
      gameId={gameId}
      sessionId={sessionId}
      initialPlayerProps={props.data}
    />
  );
}
