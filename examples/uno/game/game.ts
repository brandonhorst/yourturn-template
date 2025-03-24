import { Game } from "jsr:@brandonhorst/yourturn/types";
import type {
  Card,
  CardColor,
  CardValue,
  Config,
  GameState,
  Move,
  ObserverState,
  PlayerState,
} from "./types.ts";
import { produce } from "npm:immer";
import { shuffle } from "jsr:@std/random@0.1";

// Create a standard UNO deck
function createDeck(): Card[] {
  const deck: Card[] = [];
  const colors: CardColor[] = ["red", "green", "blue", "yellow"];
  const numbers: CardValue[] = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
  ];
  const specials: CardValue[] = ["skip", "reverse", "draw2"];

  // Add numbered cards (0-9)
  for (const color of colors) {
    // One 0 card per color
    deck.push({ color, value: "0" });

    // Two of each 1-9 card per color
    for (const num of numbers.slice(1)) {
      deck.push({ color, value: num });
      deck.push({ color, value: num });
    }

    // Two of each special card per color
    for (const special of specials) {
      deck.push({ color, value: special });
      deck.push({ color, value: special });
    }
  }

  // Add wild cards
  for (let i = 0; i < 4; i++) {
    deck.push({ color: "wild", value: "wild" });
    deck.push({ color: "wild", value: "draw4" });
  }

  return deck;
}

// Determine if a card can be played on top of another
function canPlayCard(card: Card, topCard: Card): boolean {
  // Wild cards can always be played
  if (card.color === "wild") {
    return true;
  }

  // Match color or value
  return card.color === topCard.color || card.value === topCard.value;
}

// Get the next player, considering direction and skip
function getNextPlayer(
  currentPlayer: number,
  direction: 1 | -1,
  numPlayers: number,
  skip: boolean = false,
): number {
  let next = (currentPlayer + direction + numPlayers) % numPlayers;

  // If skip is true, skip one more player
  if (skip) {
    next = (next + direction + numPlayers) % numPlayers;
  }

  return next;
}

export const game: Game<Config, GameState, Move, PlayerState, ObserverState> = {
  modes: {
    twoPlayer: {
      numPlayers: 2,
      matchmaking: "queue",
      config: { initialHandSize: 7 },
    },
    threePlayer: {
      numPlayers: 3,
      matchmaking: "queue",
      config: { initialHandSize: 7 },
    },
    fourPlayer: {
      numPlayers: 4,
      matchmaking: "queue",
      config: { initialHandSize: 7 },
    },
  },

  setup({ config, players }): Readonly<GameState> {
    // Create and shuffle the deck
    const deck = shuffle(createDeck());

    // Deal cards to each player
    const hands: Card[][] = [];
    for (let i = 0; i < players.length; i++) {
      const hand: Card[] = [];
      for (let j = 0; j < config.initialHandSize; j++) {
        const card = deck.pop();
        if (card) {
          hand.push(card);
        }
      }
      hands.push(hand);
    }

    // Start discard pile with one card from the deck
    // Make sure it's not a wild card
    let firstCard;
    do {
      firstCard = deck.pop();
    } while (firstCard && firstCard.color === "wild");

    const discardPile = firstCard ? [firstCard] : [];

    return {
      deck,
      discardPile,
      hands,
      currentPlayer: 0,
      direction: 1,
      drawPileSize: deck.length,
      mustPlayDrawnCard: false,
      drawnCard: null,
      playerWithOneCard: null,
      unoHasBeenCalled: false,
    };
  },

  isValidMove(state, { move, playerId }): boolean {
    const topCard = state.discardPile[state.discardPile.length - 1];

    // callUno move is allowed by any player when someone has 1 card
    if (move.type === "callUno") {
      return state.playerWithOneCard !== null && !state.unoHasBeenCalled;
    }

    // Other moves can only be made by the current player
    if (playerId !== state.currentPlayer) {
      return false;
    }

    if (move.type === "draw") {
      // Can draw if not already drawn
      return !state.mustPlayDrawnCard;
    } else if (move.type === "play") {
      // If must play drawn card, verify it matches
      if (state.mustPlayDrawnCard && state.drawnCard) {
        if (
          move.card.color !== state.drawnCard.color &&
          move.card.value !== state.drawnCard.value
        ) {
          return false;
        }
      }

      // Verify player has the card
      const playerHand = state.hands[playerId];
      const hasCard = playerHand.some(
        (card) =>
          card.color === move.card.color && card.value === move.card.value,
      );

      if (!state.mustPlayDrawnCard && !hasCard) {
        return false;
      }

      // Verify card can be played
      if (!canPlayCard(move.card, topCard)) {
        return false;
      }

      // Verify chosen color for wild cards
      if (move.card.color === "wild" && !move.chosenColor) {
        return false;
      }

      return true;
    } else if (move.type === "pass") {
      // Can only pass if already drawn and must play
      return state.mustPlayDrawnCard;
    }

    return false;
  },

  processMove(state, { move, playerId }): Readonly<GameState> {
    console.log(move);
    return produce(state, (s) => {
      if (move.type === "callUno") {
        // Handle callUno move
        if (s.playerWithOneCard !== null && !s.unoHasBeenCalled) {
          if (playerId === s.playerWithOneCard) {
            // Player correctly called Uno for themselves
            s.unoHasBeenCalled = true;
          } else {
            // Another player caught someone not saying Uno
            // Make the player with one card draw 2 cards
            for (let i = 0; i < 2; i++) {
              if (s.deck.length === 0) {
                const topCard = s.discardPile.pop();
                s.deck = shuffle([...s.discardPile]);
                s.discardPile = topCard ? [topCard] : [];
              }
              const card = s.deck.pop();
              if (card) {
                s.hands[s.playerWithOneCard].push(card);
              }
            }
            s.playerWithOneCard = null;
            s.unoHasBeenCalled = false;
            s.drawPileSize = s.deck.length;
          }
        }
      } else if (move.type === "draw") {
        // Reset uno state if anyone draws
        s.unoHasBeenCalled = false;

        // Draw a card
        if (s.deck.length === 0) {
          // If deck is empty, shuffle the discard pile (except top card)
          const topCard = s.discardPile.pop();
          s.deck = shuffle([...s.discardPile]);
          s.discardPile = topCard ? [topCard] : [];
        }

        const drawnCard = s.deck.pop();
        if (drawnCard) {
          s.drawnCard = drawnCard;
          s.drawPileSize = s.deck.length;
          s.mustPlayDrawnCard = true;

          // Check if drawn card can be played
          const topCard = s.discardPile[s.discardPile.length - 1];
          if (!canPlayCard(drawnCard, topCard)) {
            // Auto-add the card to hand and end turn
            s.hands[playerId].push(drawnCard);
            s.mustPlayDrawnCard = false;
            s.drawnCard = null;
            s.currentPlayer = getNextPlayer(
              playerId,
              s.direction,
              s.hands.length,
            );
          }
        }

        // Update playerWithOneCard state
        if (s.playerWithOneCard === playerId) {
          s.playerWithOneCard = null;
        }
      } else if (move.type === "play") {
        // Reset uno state if anyone plays a card
        if (s.playerWithOneCard !== null && !s.unoHasBeenCalled) {
          // If a card is played and Uno wasn't called, the player with one card must draw 2
          if (s.playerWithOneCard !== playerId) {
            // Another player played a card before Uno was called
            for (let i = 0; i < 2; i++) {
              if (s.deck.length === 0) {
                const topCard = s.discardPile.pop();
                s.deck = shuffle([...s.discardPile]);
                s.discardPile = topCard ? [topCard] : [];
              }
              const card = s.deck.pop();
              if (card) {
                s.hands[s.playerWithOneCard].push(card);
              }
            }
          }
        }

        s.unoHasBeenCalled = false;
        s.playerWithOneCard = null;

        // Remove card from player's hand
        const hand = s.hands[playerId];
        const cardIndex = hand.findIndex(
          (card) =>
            card.color === move.card.color && card.value === move.card.value,
        );

        if (cardIndex !== -1) {
          hand.splice(cardIndex, 1);

          // Check if player now has exactly one card
          if (hand.length === 1) {
            s.playerWithOneCard = playerId;
          }
        }

        // Add card to discard pile
        let playedCard = { ...move.card };

        // Apply chosen color for wild cards
        if (playedCard.color === "wild" && move.chosenColor) {
          playedCard = {
            ...playedCard,
            color: move.chosenColor,
          };
        }

        s.discardPile.push(playedCard);
        s.mustPlayDrawnCard = false;
        s.drawnCard = null;

        // Apply card effects
        let skip = false;

        switch (playedCard.value) {
          case "skip": {
            skip = true;
            break;
          }
          case "reverse": {
            s.direction = s.direction === 1 ? -1 : 1;
            // For 2 players, reverse acts like skip
            if (s.hands.length === 2) {
              skip = true;
            }
            break;
          }
          case "draw2": {
            // Next player draws 2 cards and loses turn
            const nextPlayer = getNextPlayer(
              playerId,
              s.direction,
              s.hands.length,
            );
            for (let i = 0; i < 2; i++) {
              if (s.deck.length === 0) {
                const topCard = s.discardPile.pop();
                s.deck = shuffle([...s.discardPile]);
                s.discardPile = topCard ? [topCard] : [];
              }
              const card = s.deck.pop();
              if (card) {
                s.hands[nextPlayer].push(card);
              }
            }
            skip = true;
            break;
          }
          case "draw4": {
            // Next player draws 4 cards and loses turn
            const next = getNextPlayer(playerId, s.direction, s.hands.length);
            for (let i = 0; i < 4; i++) {
              if (s.deck.length === 0) {
                const topCard = s.discardPile.pop();
                s.deck = shuffle([...s.discardPile]);
                s.discardPile = topCard ? [topCard] : [];
              }
              const card = s.deck.pop();
              if (card) {
                s.hands[next].push(card);
              }
            }
            skip = true;
            break;
          }
        }

        s.drawPileSize = s.deck.length;
        s.currentPlayer = getNextPlayer(
          playerId,
          s.direction,
          s.hands.length,
          skip,
        );
      } else if (move.type === "pass") {
        // Reset uno state if anyone passes
        s.unoHasBeenCalled = false;

        // Add drawn card to hand
        if (s.drawnCard) {
          s.hands[playerId].push(s.drawnCard);
        }
        s.mustPlayDrawnCard = false;
        s.drawnCard = null;
        s.currentPlayer = getNextPlayer(playerId, s.direction, s.hands.length);

        // Update playerWithOneCard state
        if (s.playerWithOneCard === playerId) {
          // Check if hand size is still 1 after passing
          if (s.hands[playerId].length !== 1) {
            s.playerWithOneCard = null;
          }
        }
      }
    });
  },

  playerState(state, { playerId, players, isComplete }): Readonly<PlayerState> {
    const topCard = state.discardPile[state.discardPile.length - 1];

    return {
      playerId,
      pendingAction: playerId === state.currentPlayer && !isComplete,
      perPlayer: players.map((player, idx) => ({
        name: player.name,
        cardCount: state.hands[idx].length,
        isVictor: state.hands[idx].length === 0,
      })),
      hand: state.hands[playerId],
      topCard,
      drawPileSize: state.drawPileSize,
      currentPlayer: state.currentPlayer,
      drawnCard: playerId === state.currentPlayer ? state.drawnCard : null,
      mustPlayDrawnCard: playerId === state.currentPlayer
        ? state.mustPlayDrawnCard
        : false,
      playerWithOneCard: state.playerWithOneCard,
      unoHasBeenCalled: state.unoHasBeenCalled,
    };
  },

  observerState(state, { players }): Readonly<ObserverState> {
    const topCard = state.discardPile[state.discardPile.length - 1];

    return {
      perPlayer: players.map((player, idx) => ({
        name: player.name,
        cardCount: state.hands[idx].length,
        isVictor: state.hands[idx].length === 0,
      })),
      topCard,
      drawPileSize: state.drawPileSize,
      currentPlayer: state.currentPlayer,
      playerWithOneCard: state.playerWithOneCard,
      unoHasBeenCalled: state.unoHasBeenCalled,
    };
  },

  isComplete(state): boolean {
    // Game is complete when any player has no cards left
    return state.hands.some((hand) => hand.length === 0);
  },
};
