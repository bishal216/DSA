// TODO: Implement Maze Solver visualizer
// Paradigm: backtracking
// Recurrence: Find path from start to end

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function MazePage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="Maze Solver"
      paradigm="backtracking"
      description="Coming soon — implementation in progress."
      recurrence="Find path from start to end"
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
