import { getGameServer } from "../../../../gameserver.ts";
import PlayIsland from "../../../../islands/PlayIsland.tsx";
import { define } from "../../../../utils.ts";

export default define.page(async (ctx) => {
  const { gameId, sessionId } = ctx.params;
  const initialPlayerProps = await getGameServer().getInitialPlayerProps(
    gameId,
    sessionId,
  );

  return (
    <PlayIsland
      gameId={gameId}
      sessionId={sessionId}
      initialPlayerProps={initialPlayerProps}
    />
  );
});
