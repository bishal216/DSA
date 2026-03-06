// TODO: Implement Egg Drop Problem visualizer
// Paradigm: dp
// Recurrence: dp[n][k] = 1 + min max(dp[n-1][x-1], dp[n][k-x])

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function EggDropPage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="Egg Drop Problem"
      paradigm="dp"
      description="Coming soon — implementation in progress."
      recurrence="dp[n][k] = 1 + min max(dp[n-1][x-1], dp[n][k-x])"
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
