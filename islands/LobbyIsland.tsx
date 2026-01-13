import { useLobbySocket } from "yourturn/hooks";
import { LobbyView } from "@/components/lobbyviews.tsx";
import { LobbyProps } from "yourturn/types";

function navigateToGame(gameId: string, sessionId: string) {
  globalThis.location.href = `/play/${gameId}/${sessionId}`;
}

export default function LobbyIsland(
  props: { initialLobbyProps: LobbyProps },
) {
  const lobbyProps = useLobbySocket({
    socketUrl: "/lobby/socket",
    initialLobbyProps: props.initialLobbyProps,
    navigate: navigateToGame,
  });

  return <LobbyView {...lobbyProps} />;
}
