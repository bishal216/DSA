// TODO: Implement Longest Common Subsequence visualizer
// Paradigm: dp
// Recurrence: dp[i][j] = match ? dp[i-1][j-1]+1 : max(...)

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function LcsPage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="Longest Common Subsequence"
      paradigm="dp"
      description="Coming soon — implementation in progress."
      recurrence="dp[i][j] = match ? dp[i-1][j-1]+1 : max(...)"
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
