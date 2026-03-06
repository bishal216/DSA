// TODO: Implement Coin Change visualizer
// Paradigm: dp
// Recurrence: dp[i] = min(dp[i], dp[i - coin] + 1)

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function CoinChangePage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="Coin Change"
      paradigm="dp"
      description="Coming soon — implementation in progress."
      recurrence="dp[i] = min(dp[i], dp[i - coin] + 1)"
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
