// TODO: Implement 0/1 Knapsack visualizer
// Paradigm: dp
// Recurrence: dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function KnapsackPage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="0/1 Knapsack"
      paradigm="dp"
      description="Coming soon — implementation in progress."
      recurrence="dp[i][w] = max(dp[i-1][w], dp[i-1][w-wi] + vi)"
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
