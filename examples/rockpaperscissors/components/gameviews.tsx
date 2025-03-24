import {
  ObserveViewProps,
  PlayerViewProps,
} from "jsr:@brandonhorst/yourturn/types";
import { Move, ObserverState, PlayerState } from "../game/types.ts";

function Button(
  props: {
    pendingAction: boolean;
    text: string;
    move: Move;
    perform?: (move: Move) => void;
  },
) {
  return (
    <button
      class="p-2 m-2 rounded enabled:bg-blue-100 bg-gray-100"
      type="button"
      disabled={!props.pendingAction}
      onClick={() => props.perform?.(props.move)}
    >
      {props.text}
    </button>
  );
}

export function PlayerView(
  { playerState, perform }: PlayerViewProps<Move, PlayerState>,
) {
  return (
    <>
      <div>
        <Button {...playerState} perform={perform} move="rock" text="Rock" />
        <Button {...playerState} perform={perform} move="paper" text="Paper" />
        <Button
          {...playerState}
          perform={perform}
          move="scissors"
          text="Scissors"
        />
      </div>
      <br />
      <ul>
        <li>
          {playerState.perPlayer[0].name}: {playerState.perPlayer[0].wins}
          {playerState.perPlayer[0].isVictor ? "!" : ""}
        </li>
        <li>
          {playerState.perPlayer[1].name}: {playerState.perPlayer[1].wins}
          {playerState.perPlayer[1].isVictor ? "!" : ""}
        </li>
      </ul>
      <br />
      <ul>
        {playerState.log.map((logEntry) => (
          <li>{logEntry[0]} / {logEntry[1]}</li>
        ))}
      </ul>
    </>
  );
}
export function ObserverView(
  { observerState }: ObserveViewProps<ObserverState>,
) {
  return (
    <>
      <ul>
        <li>
          {observerState.perPlayer[0].name}: {observerState.perPlayer[0].wins}
          {observerState.perPlayer[0].isVictor ? "!" : ""}
        </li>
        <li>
          {observerState.perPlayer[1].name}: {observerState.perPlayer[1].wins}
          {observerState.perPlayer[1].isVictor ? "!" : ""}
        </li>
      </ul>
      <br />
      <ul>
        {observerState.log.map((logEntry) => (
          <li>{logEntry[0]} / {logEntry[1]}</li>
        ))}
      </ul>
    </>
  );
}
