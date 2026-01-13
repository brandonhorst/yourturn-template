import LobbyIsland from "../../islands/LobbyIsland.tsx";
import { getGameServer } from "../../gameserver.ts";
import { define } from "../../utils.ts";

export default define.page(async function Home() {
  const initialLobbyProps = await getGameServer()
    .getInitialLobbyProps();

  return <LobbyIsland initialLobbyProps={initialLobbyProps} />;
});
