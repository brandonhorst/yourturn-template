import { getGameServer } from "../../../gameserver.ts";
import GameIsland from "../../../islands/GameIsland.tsx";
import { checkAuth, define, setAuth } from "../../../utils.ts";
import type { MatchViewData } from "yourturn/types";
import type { TicTacToeTypes } from "@/game/types.ts";

type GamePageData = {
  gameId: string;
  initialMatchProps: MatchViewData<TicTacToeTypes>;
};

export const handler = define.handlers({
  async GET(ctx) {
    const gameServer = getGameServer();
    const { gameId } = ctx.params;
    const userId = await gameServer.resolveToken(checkAuth(ctx.req.headers));

    const [{ token }, initialMatchProps] = await Promise.all([
      gameServer.getUserMatchmakingViewData(userId),
      gameServer.getMatchViewData(gameId, userId),
    ]);

    const headers = new Headers();
    setAuth(headers, token);

    return {
      data: {
        gameId,
        initialMatchProps,
      } satisfies GamePageData,
      headers,
    };
  },
});

export default define.page<typeof handler>((props) => {
  return (
    <GameIsland
      gameId={props.data.gameId}
      initialMatchProps={props.data.initialMatchProps}
    />
  );
});
