import {
  ObserveViewProps,
  PlayerViewProps,
} from "jsr:@brandonhorst/yourturn/types";
import type { Move, ObserverState, PlayerState } from "../game/types.ts";

export function PlayerView(
  { playerState, perform }: PlayerViewProps<Move, PlayerState>,
) {
  return (
    <div class="p-1 text-sm flex flex-col lg:flex-row gap-1 justify-center mx-auto select-none">
      PlayerView
    </div>
  );
}

export function ObserverView(
  { observerState }: ObserveViewProps<ObserverState>,
) {
  return (
    <div class="p-1 text-sm flex flex-col lg:flex-row gap-1 justify-center mx-auto select-none">
      ObserverView
    </div>
  );
}
