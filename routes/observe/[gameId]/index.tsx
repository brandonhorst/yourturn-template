import { PageProps } from "$fresh/server.ts";
import { Handlers } from "$fresh/server.ts";
import { getGameServer } from "../../../gameserver.ts";
import ObserveIsland from "../../../islands/ObserveIsland.tsx";

export const handler: Handlers = {
  async GET(_req, ctx) {
    const { gameId } = ctx.params;
    const initialObserverProps = await getGameServer()
      .getInitialObserverProps(gameId);
    return ctx.render(initialObserverProps);
  },
};

export default function GameId(props: PageProps) {
  const { gameId } = props.params;

  return (
    <ObserveIsland
      gameId={gameId}
      initialObserverProps={props.data}
    />
  );
}
