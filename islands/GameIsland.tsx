import {
  useChatThreadChannel,
  useMatchChannel,
  useSocket,
} from "yourturn/client";
import type { ChatThreadViewData, MatchViewData } from "yourturn/types";
import { GameView } from "@/components/gameviews.tsx";
import type { TicTacToeTypes } from "@/game/types.ts";

export default function GameIsland(
  props: {
    gameId: string;
    initialMatchProps: MatchViewData<TicTacToeTypes>;
    initialChatThreadProps: ChatThreadViewData<TicTacToeTypes>;
  },
) {
  const socket = useSocket("/api/socket");
  const matchProps = useMatchChannel(
    socket,
    props.gameId,
    props.initialMatchProps,
  );
  const chatThreadProps = useChatThreadChannel(
    socket,
    matchProps.chatThreadId,
    props.initialChatThreadProps,
  );

  return (
    <GameView
      match={matchProps}
      chatThread={chatThreadProps}
    />
  );
}
