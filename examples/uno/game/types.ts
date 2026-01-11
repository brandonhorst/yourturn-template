export type CardColor = "red" | "green" | "blue" | "yellow" | "wild";
export type CardValue =
  | "0"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "skip"
  | "reverse"
  | "draw2"
  | "wild"
  | "draw4";

export type Card = {
  color: CardColor;
  value: CardValue;
};

export type Config = {
  initialHandSize: number;
};

export type GameState = {
  deck: Card[];
  discardPile: Card[];
  hands: Card[][];
  currentPlayer: number;
  direction: 1 | -1; // 1 for clockwise, -1 for counter-clockwise
  drawPileSize: number;
  mustPlayDrawnCard: boolean;
  drawnCard: Card | null;
  playerWithOneCard: number | null;
  unoHasBeenCalled: boolean;
};

export type Player = {
  name: string;
};

export type PlayerState = {
  pendingAction: boolean;
  cardCounts: number[];
  hand: Card[];
  topCard: Card;
  drawPileSize: number;
  currentPlayer: number;
  drawnCard: Card | null;
  mustPlayDrawnCard: boolean;
  playerWithOneCard: number | null;
  unoHasBeenCalled: boolean;
};

export type ObserverState = {
  cardCounts: number[];
  topCard: Card;
  drawPileSize: number;
  currentPlayer: number;
  playerWithOneCard: number | null;
  unoHasBeenCalled: boolean;
};

export type Move =
  | { type: "play"; card: Card; chosenColor?: CardColor }
  | { type: "draw" }
  | { type: "pass" }
  | { type: "callUno" };
