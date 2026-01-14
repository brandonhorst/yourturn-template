import { getGameServer } from "../../../gameserver.ts";
import GameIsland from "../../../islands/GameIsland.tsx";
import { checkAuth, define } from "../../../utils.ts";

export default define.page(async (ctx) => {
  const { gameId } = ctx.params;
  const token = checkAuth(ctx.req.headers);
  const initialGameProps = await getGameServer().getInitialGameProps(
    gameId,
    token,
  );
  return (
    <GameIsland
      gameId={gameId}
      initialGameProps={initialGameProps}
    />
  );
});
