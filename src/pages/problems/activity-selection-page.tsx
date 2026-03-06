// TODO: Implement Activity Selection visualizer
// Paradigm: greedy
// Recurrence: Sort by finish time, select greedily

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function ActivitySelectionPage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="Activity Selection"
      paradigm="greedy"
      description="Coming soon — implementation in progress."
      recurrence="Sort by finish time, select greedily"
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
