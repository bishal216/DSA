// TODO: Implement Closest Pair of Points visualizer
// Paradigm: divide-conquer
// Recurrence: T(n) = 2T(n/2) + O(n log n)

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function ClosestPairPage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="Closest Pair of Points"
      paradigm="divide-conquer"
      description="Coming soon — implementation in progress."
      recurrence="T(n) = 2T(n/2) + O(n log n)"
      player={player}
      visualizer={
        <div className="flex items-center justify-center h-64 text-muted-foreground text-sm font-mono">
          visualizer coming soon
        </div>
      }
      controls={
        <div className="text-sm text-muted-foreground">
          Controls will appear here once the visualizer is implemented.
        </div>
      }
      complexity={[
        { label: "Time", value: "TBD" },
        { label: "Space", value: "TBD" },
      ]}
    />
  );
}
