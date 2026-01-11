import LobbyIsland from "../../islands/LobbyIsland.tsx";
import { getGameServer } from "../../gameserver.ts";
import { define } from "../../utils.ts";

function createPlayerName() {
  const value = crypto.getRandomValues(new Uint16Array(1))[0] % 10000;
  return `player-${value.toString().padStart(4, "0")}`;
}

export default define.page(async function Home() {
  const initialActiveGames = await getGameServer()
    .getInitialActiveGames();

  return (
    <LobbyIsland
      initialActiveGames={initialActiveGames}
      initialPlayerName={createPlayerName()}
    />
  );
});
