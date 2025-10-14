import { useLobbySocket } from "yourturn/hooks";
import { LobbyView } from "../components/lobbyviews.tsx";
import { ActiveGame } from "yourturn/types";

function navigateToGame(gameId: string, sessionId: string) {
  globalThis.location.href = `/play/${gameId}/${sessionId}`;
}

export default function LobbyIsland(
  props: { initialActiveGames: ActiveGame[] },
) {
  const lobbyProps = useLobbySocket({
    socketUrl: "/lobby/socket",
    initialActiveGames: props.initialActiveGames,
    navigate: navigateToGame,
  });

  return <LobbyView {...lobbyProps} />;
}
