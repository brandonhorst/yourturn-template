import {
  ObserveViewProps,
  PlayerViewProps,
} from "jsr:@brandonhorst/yourturn/types";
import type {
  Card,
  CardColor,
  Move,
  ObserverState,
  PlayerState,
} from "../game/types.ts";
import { useState } from "preact/hooks";

function UnoCard(
  props: {
    card: Card;
    onClick?: () => void;
    selectable?: boolean;
  },
) {
  const { card, onClick, selectable = true } = props;
  const colorClasses = {
    red: "bg-red-500 text-white",
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    yellow: "bg-yellow-400 text-black",
    wild: "bg-gradient-to-br from-red-500 via-blue-500 to-green-500 text-white",
  };

  const displayValue = card.value === "draw2"
    ? "+2"
    : card.value === "draw4"
    ? "+4"
    : card.value;

  return (
    <button
      type="button"
      class={`w-16 h-24 rounded-lg flex items-center justify-center ${
        colorClasses[card.color]
      } font-bold m-1 border-2 border-white shadow-md transform ${
        selectable ? "hover:scale-110 transition-transform" : ""
      }`}
      onClick={selectable ? onClick : undefined}
      disabled={!selectable}
    >
      {displayValue}
    </button>
  );
}

function ColorPicker(
  props: {
    onSelectColor: (color: CardColor) => void;
  },
) {
  const colors: CardColor[] = ["red", "blue", "green", "yellow"];

  return (
    <div class="flex justify-center items-center my-4">
      <div class="bg-white p-4 rounded-lg shadow-md">
        <h3 class="text-center font-bold mb-2">Choose a color:</h3>
        <div class="flex space-x-2">
          {colors.map((color) => (
            <button
              type="button"
              key={color}
              class={`w-12 h-12 rounded-full bg-${color}-500 hover:opacity-80`}
              onClick={() => props.onSelectColor(color)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlayersList({ 
  players, 
  currentPlayer, 
  playerWithOneCard = null, 
  unoHasBeenCalled = false 
}: { 
  players: { name: string; cardCount: number; isVictor: boolean }[];
  currentPlayer: number;
  playerWithOneCard?: number | null;
  unoHasBeenCalled?: boolean;
}) {
  return (
    <div class="mb-4">
      <div class="flex justify-center items-center space-x-8">
        {players.map((player, index) => (
          <div
            key={index}
            class={`p-2 rounded-lg ${
              player.isVictor
                ? "bg-green-100"
                : index === currentPlayer
                ? "bg-yellow-100"
                : ""
            }`}
          >
            <div class="font-bold">{player.name}</div>
            <div>{player.cardCount} cards</div>
            {player.isVictor && (
              <div class="font-bold text-green-600">Winner!</div>
            )}
            {playerWithOneCard !== null && index === playerWithOneCard && (
              <>
                {!unoHasBeenCalled && (
                  <div class="font-bold text-red-600">Needs to call UNO!</div>
                )}
                {unoHasBeenCalled && (
                  <div class="font-bold text-red-600">UNO!</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function GameBoard({ topCard, drawPileSize }: { topCard: Card; drawPileSize: number }) {
  return (
    <div class="flex justify-center items-center mb-6">
      <div class="text-center mr-4">
        <div class="bg-gray-200 rounded-lg p-2 mb-1 w-16 h-24 flex items-center justify-center font-bold">
          {drawPileSize}
        </div>
        <div class="text-sm">Draw Pile</div>
      </div>

      <div class="text-center">
        <UnoCard card={topCard} selectable={false} />
        <div class="text-sm">Discard Pile</div>
      </div>
    </div>
  );
}

export function PlayerView(
  { playerState, perform }: PlayerViewProps<Move, PlayerState>,
) {
  const [selectingColor, setSelectingColor] = useState(false);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const playCard = (card: Card) => {
    if (card.color === "wild") {
      setSelectedCard(card);
      setSelectingColor(true);
    } else {
      perform?.({ type: "play", card });
    }
  };

  const selectColor = (color: CardColor) => {
    if (selectedCard) {
      perform?.({
        type: "play",
        card: selectedCard,
        chosenColor: color,
      });
      setSelectedCard(null);
      setSelectingColor(false);
    }
  };

  const handleDrawCard = () => {
    perform?.({ type: "draw" });
  };

  const handlePlayDrawn = () => {
    if (playerState.drawnCard) {
      if (playerState.drawnCard.color === "wild") {
        setSelectedCard(playerState.drawnCard);
        setSelectingColor(true);
      } else {
        perform?.({ type: "play", card: playerState.drawnCard });
      }
    }
  };

  const handlePass = () => {
    perform?.({ type: "pass" });
  };

  const handleCallUno = () => {
    perform?.({ type: "callUno" });
  };

  return (
    <div class="p-4">
      <h2 class="text-xl font-bold text-center mb-4">UNO</h2>

      <PlayersList
        players={playerState.perPlayer}
        currentPlayer={playerState.currentPlayer}
      />

      <GameBoard
        topCard={playerState.topCard}
        drawPileSize={playerState.drawPileSize}
      />

      {/* Call Uno Button - Only show when any player has exactly one card and uno hasn't been called yet */}
      {playerState.playerWithOneCard !== null &&
        !playerState.unoHasBeenCalled && (
        <div class="text-center mb-4">
          <button
            type="button"
            class="bg-red-600 text-white px-6 py-3 rounded-lg font-bold text-xl transform hover:scale-105 transition-transform mb-2"
            onClick={handleCallUno}
          >
            UNO!
          </button>
          <div class="text-sm text-gray-600">
            {playerState.playerWithOneCard === playerState.playerId
              ? "Click to declare Uno for yourself!"
              : `${
                playerState.perPlayer[playerState.playerWithOneCard]?.name
              } has one card! Call Uno to make them draw 2 cards!`}
          </div>
        </div>
      )}

      {playerState.pendingAction && (
        <div class="text-center mb-4">
          {playerState.mustPlayDrawnCard
            ? (
              <div>
                <div class="mb-2">
                  <span class="font-bold">Card drawn:</span>
                  {playerState.drawnCard && (
                    <div class="flex justify-center">
                      <UnoCard
                        card={playerState.drawnCard}
                        onClick={handlePlayDrawn}
                      />
                    </div>
                  )}
                </div>
                <div class="flex justify-center space-x-4">
                  <button
                    type="button"
                    class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={handlePlayDrawn}
                  >
                    Play Card
                  </button>
                  <button
                    type="button"
                    class="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                    onClick={handlePass}
                  >
                    Pass
                  </button>
                </div>
              </div>
            )
            : (
              <div>
                <div class="font-bold text-green-600 mb-2">Your turn!</div>
                <button
                  type="button"
                  class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={handleDrawCard}
                >
                  Draw Card
                </button>
              </div>
            )}
        </div>
      )}

      {selectingColor && <ColorPicker onSelectColor={selectColor} />}

      <div class="mt-4">
        <h3 class="text-lg font-bold mb-2">Your Hand:</h3>
        <div class="flex flex-wrap justify-center">
          {playerState.hand.map((card, index) => (
            <UnoCard
              key={index}
              card={card}
              onClick={() => playCard(card)}
              selectable={playerState.pendingAction &&
                !playerState.mustPlayDrawnCard}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ObserverView(
  { observerState }: ObserveViewProps<ObserverState>,
) {
  return (
    <div class="p-4">
      <h2 class="text-xl font-bold text-center mb-4">UNO (Observer View)</h2>

      <PlayersList
        players={observerState.perPlayer}
        currentPlayer={observerState.currentPlayer}
        playerWithOneCard={observerState.playerWithOneCard}
        unoHasBeenCalled={observerState.unoHasBeenCalled}
      />

      <GameBoard
        topCard={observerState.topCard}
        drawPileSize={observerState.drawPileSize}
      />
    </div>
  );
}
