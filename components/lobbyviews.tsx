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
  },
) {
  return (
    <button type="button" class="btn" onClick={props.onClick}>
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
    <div class="p-4">
      <h1 class="text-xl pt-4">Tic-tac-toe</h1>

      <div class="pt-4 flex items-center gap-2">
        <span class="font-semibold">Username:</span>
        <span>{accountUserProfile.username}</span>
      </div>

      <div class="pt-2 flex items-center gap-2">
        <span class="font-semibold">Description:</span>
        <span>{accountUserProfile.description || <i>(empty)</i>}</span>
        <Button onClick={handleChangeDescription}>Edit</Button>
      </div>

      <h2 class="text-lg pt-4">New Game</h2>
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

      <h2 class="text-lg pt-4">Public Rooms</h2>
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

      <h2 class="text-lg pt-4">Your Active Matches</h2>
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

      <h2 class="text-lg pt-4">All Active Matches</h2>
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

      <h2 class="text-lg pt-4">Active Users</h2>
      <div>{activePublicUsers.allActiveUsers.length}</div>
    </div>
  );
}
