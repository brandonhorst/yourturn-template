import { useObserveSocket } from "jsr:@brandonhorst/yourturn/hooks";
import { ObserverState } from "../game/types.ts";
import { ObserverView } from "../components/gameviews.tsx";
import { ObserverProps } from "jsr:@brandonhorst/yourturn/types";

export default function ObserveIsland(
  props: { gameId: string; initialObserverProps: ObserverProps<ObserverState> },
) {
  const observerState = useObserveSocket(
    `/observe/${props.gameId}/socket`,
    props.initialObserverProps,
  );
  return <ObserverView observerState={observerState} />;
}
