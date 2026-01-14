import { getGameServer } from "../../../gameserver.ts";
import ObserveIsland from "../../../islands/ObserveIsland.tsx";
import PlayIsland from "../../../islands/PlayIsland.tsx";
import { checkAuth, define } from "../../../utils.ts";

export default define.page(async (ctx) => {
  const { gameId } = ctx.params;
  const token = checkAuth(ctx.req.headers);
  const initialGameProps = await getGameServer().getInitialGameProps(
    gameId,
    token ?? null,
  );
  switch (initialGameProps.mode) {
    case "player":
      return (
        <PlayIsland
          gameId={gameId}
          initialPlayerProps={initialGameProps}
        />
      );
    case "observer":
      return (
        <ObserveIsland
          gameId={gameId}
          initialObserverProps={initialGameProps}
        />
      );
  }
});
