import { ComponentChildren } from "preact";
import type {
  AccountUserProfileProps,
  ActivePublicMatchesViewData,
  ActiveUsersViewData,
  AvailablePublicRoomsViewData,
  UserMatchmakingProps,
} from "yourturn/types";
import type { TicTacToeTypes } from "@/game/types.ts";

export default function Button(
  props: {
    onClick?: () => void;
    children: ComponentChildren;
    class?: string;
  },
) {
  return (
    <button
      type="button"
      class={`btn ${props.class ?? ""}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export function LobbyView(
  {
    accountUserProfile,
    userMatchmaking,
    activePublicMatches,
    activePublicUsers,
    availablePublicRooms,
  }: {
    accountUserProfile: AccountUserProfileProps<TicTacToeTypes>;
    userMatchmaking: UserMatchmakingProps<TicTacToeTypes>;
    activePublicMatches: ActivePublicMatchesViewData<TicTacToeTypes>;
    activePublicUsers: ActiveUsersViewData<TicTacToeTypes>;
    availablePublicRooms: AvailablePublicRoomsViewData<TicTacToeTypes>;
  },
) {
  const queueId = "queue";
  const isQueued = userMatchmaking.queueEntries.some((entry) =>
    entry.queueId === queueId
  );

  const handleChangeDescription = () => {
    const nextDescription = prompt(
      "Enter a new description",
      accountUserProfile.description,
    );
    if (nextDescription == null) {
      return;
    }
    if (nextDescription === accountUserProfile.description) {
      return;
    }
    accountUserProfile.update({ description: nextDescription });
  };

  return (
    <div class="p-4 space-y-4">
      <h1 class="text-xl">Tic-tac-toe</h1>

      <div class="flex items-center gap-2">
        <span class="font-semibold">Username:</span>
        <span>{accountUserProfile.username}</span>
      </div>

      <div class="flex items-center gap-2 flex-wrap">
        <span class="font-semibold">Description:</span>
        <span>{accountUserProfile.description || <i>(empty)</i>}</span>
        <Button onClick={handleChangeDescription}>Edit</Button>
      </div>

      <div>
        <h2 class="text-lg">New Game</h2>
        {isQueued
          ? (
            <Button onClick={() => userMatchmaking.leaveQueue(queueId)}>
              Leave Queue
            </Button>
          )
          : (
            <Button
              onClick={() =>
                userMatchmaking.joinQueue(queueId, { loadout: undefined })}
            >
              Join Queue
            </Button>
          )}
      </div>

      <div>
        <h2 class="text-lg">Public Rooms</h2>
        <Button
          onClick={() =>
            userMatchmaking.createAndJoinRoom(
              {
                config: undefined,
                numPlayers: 2,
                private: false,
              },
              { loadout: undefined },
            )}
        >
          Create Public Room
        </Button>

        {availablePublicRooms.allAvailableRooms.length === 0
          ? <div class="italic pt-2">No Public Rooms</div>
          : (
            <ul class="list-disc list-inside pt-2">
              {availablePublicRooms.allAvailableRooms.map((room) => (
                <li key={room.roomId}>
                  {room.roomId} ({room.players.length}/{room.numPlayers})
                  <Button
                    class="btn-sm ml-2"
                    onClick={() =>
                      userMatchmaking.joinRoom(room.roomId, {
                        loadout: undefined,
                      })}
                  >
                    Join
                  </Button>
                </li>
              ))}
            </ul>
          )}
      </div>

      <div>
        <h2 class="text-lg">Your Active Matches</h2>
        {userMatchmaking.userActiveMatches.length === 0
          ? <div class="italic">No Active Matches</div>
          : (
            <ul class="list-disc list-inside">
              {userMatchmaking.userActiveMatches.map((match) => (
                <li key={match.matchId}>
                  <a
                    class="cursor-pointer underline"
                    href={`/game/${match.matchId}`}
                  >
                    {match.matchId}
                  </a>
                </li>
              ))}
            </ul>
          )}
      </div>

      <div>
        <h2 class="text-lg">All Active Matches</h2>
        {activePublicMatches.allActiveMatches.length === 0
          ? <div class="italic">No Active Matches</div>
          : (
            <ul class="list-disc list-inside">
              {activePublicMatches.allActiveMatches.map((match) => (
                <li key={match.matchId}>
                  <a
                    class="cursor-pointer underline"
                    href={`/game/${match.matchId}`}
                  >
                    {match.matchId}
                  </a>
                </li>
              ))}
            </ul>
          )}
      </div>

      <div>
        <h2 class="text-lg">Active Users</h2>
        {activePublicUsers.allActiveUsers.length === 0
          ? <div class="italic">No Active Users</div>
          : (
            <ul class="space-y-1 pt-2">
              {activePublicUsers.allActiveUsers.map((activeUser) => {
                const isSelf = activeUser.userId === accountUserProfile.userId;
                const isStarred = accountUserProfile.starredUserIds.includes(
                  activeUser.userId,
                );

                return (
                  <li
                    key={activeUser.userId}
                    class="flex items-center gap-2"
                  >
                    <span>{activeUser.username}</span>
                    {isStarred && (
                      <span class="badge badge-warning">★ Starred</span>
                    )}
                    {!isSelf && (
                      isStarred
                        ? (
                          <Button
                            class="btn-xs"
                            onClick={() =>
                              accountUserProfile.unstarUser(activeUser.userId)}
                          >
                            Unstar
                          </Button>
                        )
                        : (
                          <Button
                            class="btn-xs"
                            onClick={() =>
                              accountUserProfile.starUser(activeUser.userId)}
                          >
                            Star
                          </Button>
                        )
                    )}
                  </li>
                );
              })}
            </ul>
          )}
      </div>
    </div>
  );
}
