import { useObserveSocket } from "yourturn/hooks";
import { ObserverState, Player } from "@/game/types.ts";
import { ObserverView } from "@/components/gameviews.tsx";
import { ObserverProps } from "yourturn/types";

export default function ObserveIsland(
  props: {
    gameId: string;
    initialObserverProps: ObserverProps<ObserverState, Player>;
  },
) {
  const observerProps = useObserveSocket(
    `/observe/${props.gameId}/socket`,
    props.initialObserverProps,
  );
  return <ObserverView {...observerProps} />;
}
