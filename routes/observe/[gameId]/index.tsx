import { getGameServer } from "../../../gameserver.ts";
import ObserveIsland from "../../../islands/ObserveIsland.tsx";
import { define } from "../../../utils.ts";

export default define.page(async (ctx) => {
  const { gameId } = ctx.params;
  const initialObserverProps = await getGameServer()
    .getInitialObserverProps(gameId);

  return (
    <ObserveIsland
      gameId={gameId}
      initialObserverProps={initialObserverProps}
    />
  );
});
