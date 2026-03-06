// TODO: Implement Huffman Encoding visualizer
// Paradigm: greedy
// Recurrence: Merge two lowest-frequency nodes

import { useProblemPlayer } from "@/hooks/use-problem-player";
import { ProblemPage } from "@/pages/problems/problem-page";

export default function HuffmanPage() {
  const player = useProblemPlayer();

  return (
    <ProblemPage
      title="Huffman Encoding"
      paradigm="greedy"
      description="Coming soon — implementation in progress."
      recurrence="Merge two lowest-frequency nodes"
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
