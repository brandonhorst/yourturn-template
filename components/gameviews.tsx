import { Circle, X } from "lucide-preact";
import { useState } from "preact/hooks";
import type { ChatThreadProps, MatchProps } from "yourturn/types";
import type { Mark, TicTacToeTypes } from "@/game/types.ts";

function markIcon(mark: Mark) {
  return mark === "x" ? <X class="w-8 h-8" /> : <Circle class="w-8 h-8" />;
}

function Tile(
  { cell, onPlay }: {
    cell: Mark | null;
    onPlay?: () => void;
  },
) {
  const isDisabled = onPlay == null || cell !== null;

  return (
    <button
      type="button"
      class="btn w-20 h-20"
      onClick={() => onPlay?.()}
      disabled={isDisabled}
    >
      {cell ? markIcon(cell) : null}
    </button>
  );
}

function Board(
  { board, onPlay }: {
    board: (Mark | null)[];
    onPlay?: (index: number) => void;
  },
) {
  return (
    <div class="flex justify-center">
      <div class="grid grid-cols-3 gap-2 w-60 h-60 justify-around">
        {board.map((cell, index) => (
          <Tile
            key={index}
            cell={cell}
            onPlay={onPlay ? () => onPlay(index) : undefined}
          />
        ))}
      </div>
    </div>
  );
}

function PlayerList(
  { players, nextPlayer, outcome }: {
    players: { username: string }[];
    nextPlayer: 0 | 1;
    outcome: TicTacToeTypes["Outcome"] | undefined;
  },
) {
  return (
    <div class="list">
      {players.map((player, i) => {
        const isTurn = outcome === undefined && nextPlayer === i;
        const isWinner = outcome === i;
        return (
          <div key={player.username} class="list-row items-center">
            {markIcon(i === 0 ? "x" : "o")}
            <div>{player.username}</div>
            {isWinner && <span class="badge badge-success">Winner</span>}
            {isTurn && <span class="badge badge-primary">Turn</span>}
          </div>
        );
      })}
    </div>
  );
}

function Header({ username }: { username: string | undefined }) {
  return (
    <div class="flex flex-col gap-1">
      <h2 class="text-2xl font-bold">Tic-tac-toe</h2>
      <a href="/lobby" class="link">Back to Lobby</a>
      <div>{username}</div>
    </div>
  );
}

function ChatPanel(
  { chatThread, username }: {
    chatThread: ChatThreadProps<TicTacToeTypes>;
    username: string | undefined;
  },
) {
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    const nextMessage = message.trim();
    if (nextMessage.length === 0) {
      return;
    }
    chatThread.sendChatMessage(nextMessage);
    setMessage("");
  };

  return (
    <div class="card bg-base-200 border border-base-300">
      <div class="card-body gap-3">
        <h3 class="card-title text-lg">Match Chat</h3>
        <div class="h-52 overflow-y-auto rounded-box bg-base-100 p-2 flex flex-col gap-2">
          {chatThread.chatMessages.length === 0
            ? <div class="text-sm italic opacity-70">No messages yet</div>
            : (
              chatThread.chatMessages.map((chatMessage) => (
                <div key={chatMessage.id} class="text-sm">
                  <span class="font-semibold">
                    {chatMessage.playerSnapshot.username}:
                  </span>{" "}
                  {chatMessage.message}
                </div>
              ))
            )}
        </div>

        <div class="join w-full">
          <input
            class="input input-bordered join-item flex-1"
            value={message}
            placeholder={`Say hi${username ? `, ${username}` : ""}...`}
            onInput={(event) => setMessage(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            type="button"
            class="btn btn-primary join-item"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export function GameView(
  { match, chatThread }: {
    match: MatchProps<TicTacToeTypes>;
    chatThread: ChatThreadProps<TicTacToeTypes>;
  },
) {
  const handlePlay = match.perform == null
    ? undefined
    : (index: number) => match.perform({ index });

  let username: string | undefined;
  if (match.playerId != null) {
    username = match.players[match.playerId].username;
  }

  return (
    <div class="max-w-3xl flex flex-col gap-4 mx-auto p-4">
      <Header username={username} />

      <Board
        board={match.publicState.board}
        onPlay={handlePlay}
      />

      <PlayerList
        players={match.players}
        nextPlayer={match.publicState.nextPlayer}
        outcome={match.outcome}
      />

      <ChatPanel chatThread={chatThread} username={username} />
    </div>
  );
}
