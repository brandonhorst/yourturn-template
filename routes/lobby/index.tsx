import LobbyIsland from "../../islands/LobbyIsland.tsx";
import { getGameServer } from "../../gameserver.ts";
import { checkAuth, define, setAuth } from "../../utils.ts";
import type {
  ActivePublicMatchesViewData,
  ActiveUsersViewData,
  AvailablePublicRoomsViewData,
  UserMatchmakingViewData,
  UserProfileViewData,
} from "yourturn/types";
import type { TicTacToeTypes } from "@/game/types.ts";

type LobbyPageData = {
  initialAccountUserProfileProps: UserProfileViewData<TicTacToeTypes>;
  initialUserMatchmakingProps: UserMatchmakingViewData<TicTacToeTypes>;
  initialActivePublicMatchesProps: ActivePublicMatchesViewData<TicTacToeTypes>;
  initialActivePublicUsersProps: ActiveUsersViewData<TicTacToeTypes>;
  initialAvailablePublicRoomsProps: AvailablePublicRoomsViewData<
    TicTacToeTypes
  >;
};

export const handler = define.handlers({
  async GET(ctx) {
    const gameServer = getGameServer();
    const userId = await gameServer.resolveToken(checkAuth(ctx.req.headers));
    const [
      { props: initialUserMatchmakingProps, token },
      initialAccountUserProfileProps,
      initialActivePublicMatchesProps,
      initialActivePublicUsersProps,
      initialAvailablePublicRoomsProps,
    ] = await Promise.all([
      gameServer.getUserMatchmakingViewData(userId),
      gameServer.getUserProfileViewData(userId),
      gameServer.getActivePublicMatchesViewData(),
      gameServer.getActivePublicUsersViewData(),
      gameServer.getAvailablePublicRoomsViewData(),
    ]);

    const headers = new Headers();
    setAuth(headers, token);

    return {
      data: {
        initialAccountUserProfileProps,
        initialUserMatchmakingProps,
        initialActivePublicMatchesProps,
        initialActivePublicUsersProps,
        initialAvailablePublicRoomsProps,
      } satisfies LobbyPageData,
      headers,
    };
  },
});

export default define.page<typeof handler>(
  (props) => {
    return <LobbyIsland {...props.data} />;
  },
);
