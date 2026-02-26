import {
  useAccountUserProfileChannel,
  useActivePublicMatchesChannel,
  useActivePublicUsersChannel,
  useAvailablePublicRoomsChannel,
  useSocket,
  useUserMatchmakingChannel,
} from "yourturn/client";
import type {
  ActivePublicMatchesViewData,
  ActiveUsersViewData,
  AvailablePublicRoomsViewData,
  UserMatchmakingViewData,
  UserProfileViewData,
} from "yourturn/types";
import { LobbyView } from "@/components/lobbyviews.tsx";
import type { TicTacToeTypes } from "@/game/types.ts";

type LobbyIslandProps = {
  initialAccountUserProfileProps: UserProfileViewData<TicTacToeTypes>;
  initialUserMatchmakingProps: UserMatchmakingViewData<TicTacToeTypes>;
  initialActivePublicMatchesProps: ActivePublicMatchesViewData<TicTacToeTypes>;
  initialActivePublicUsersProps: ActiveUsersViewData<TicTacToeTypes>;
  initialAvailablePublicRoomsProps: AvailablePublicRoomsViewData<
    TicTacToeTypes
  >;
};

function navigateToGame(matchId: string) {
  globalThis.location.href = `/game/${matchId}`;
}

function displayError(message: string) {
  globalThis.alert(message);
}

export default function LobbyIsland(
  props: LobbyIslandProps,
) {
  const socket = useSocket("/api/socket");

  const accountUserProfile = useAccountUserProfileChannel({
    socket,
    initialAccountUserProfileProps: props.initialAccountUserProfileProps,
  });
  const userMatchmaking = useUserMatchmakingChannel({
    socket,
    initialUserMatchmakingProps: props.initialUserMatchmakingProps,
    navigate: navigateToGame,
    displayError,
  });
  const activePublicMatches = useActivePublicMatchesChannel({
    socket,
    initialActivePublicMatchesProps: props.initialActivePublicMatchesProps,
  });
  const activePublicUsers = useActivePublicUsersChannel({
    socket,
    initialActivePublicUsersProps: props.initialActivePublicUsersProps,
  });
  const availablePublicRooms = useAvailablePublicRoomsChannel({
    socket,
    initialAvailablePublicRoomsProps: props.initialAvailablePublicRoomsProps,
  });

  return (
    <LobbyView
      accountUserProfile={accountUserProfile}
      userMatchmaking={userMatchmaking}
      activePublicMatches={activePublicMatches}
      activePublicUsers={activePublicUsers}
      availablePublicRooms={availablePublicRooms}
    />
  );
}
