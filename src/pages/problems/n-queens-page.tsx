// TODO: Implement N-Queens visualizer
// Paradigm: backtracking
// Recurrence: Place N queens with no conflicts

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function NQueensPage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="N-Queens"
      paradigm="backtracking"
      description="Coming soon — implementation in progress."
      recurrence="Place N queens with no conflicts"
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
