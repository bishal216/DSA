// src/components/graph/PathfindingStepDisplay.tsx

import type {
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from "@/algorithms/types/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/helpers";

interface PathfindingStepDisplayProps {
  step: GraphStep;
  metadata: PathfindingStepMetadata | undefined;
  algorithm: string;
  graphData: GraphData;
}

const INF = Infinity;

function getStepTitle(step: GraphStep): string {
  switch (step.stepType) {
    case "initial":
      return "Initialising";
    case "explore":
      return "Exploring Edge";
    case "visit":
      return "Visiting Node";
    case "path":
      return "Path Found";
    case "complete":
      return "Complete";
    case "process":
      return "Processing Iteration";
    case "summary":
      return "Progress";
    default:
      return "Step";
  }
}

function getStepStyle(step: GraphStep): {
  bg: string;
  border: string;
  text: string;
} {
  const neutral = { bg: "#F9FAFB", border: "#E5E7EB", text: "#374151" };
  const blue = { bg: "#EFF6FF", border: "#93C5FD", text: "#1E3A5F" };
  const amber = { bg: "#FFFBEB", border: "#FCD34D", text: "#78350F" };
  const green = { bg: "#F0FDF4", border: "#6EE7B7", text: "#065F46" };

  switch (step.stepType) {
    case "initial":
      return neutral;
    case "explore":
      return blue;
    case "visit":
      return amber;
    case "path":
    case "complete":
      return green;
    default:
      return neutral;
  }
}

export default function PathfindingStepDisplay({
  step,
  metadata,
  algorithm,
  graphData,
}: PathfindingStepDisplayProps) {
  if (!metadata) return null;

  const showDistances =
    algorithm === "dijkstra" ||
    algorithm === "astar" ||
    algorithm === "bellmanFord";
  const showStack = algorithm === "dfs";
  const showQueue = algorithm === "bfs";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{getStepTitle(step)}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Step description */}
        {(() => {
          const s = getStepStyle(step);
          return (
            <div
              className="p-3 rounded-lg border-l-[3px]"
              style={{
                backgroundColor: s.bg,
                borderLeftColor: s.border,
                color: s.text,
              }}
            >
              <p className="font-medium">{step.message}</p>
              {step.subMessage && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: s.text, opacity: 0.75 }}
                >
                  {step.subMessage}
                </p>
              )}
            </div>
          );
        })()}

        {/* Path display */}
        {metadata.path.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Path
            </h3>
            <div className="flex flex-wrap items-center gap-1 text-sm font-mono">
              {metadata.path.map((id, i) => (
                <span key={id} className="flex items-center gap-1">
                  <span
                    className="px-2 py-0.5 rounded font-bold"
                    style={{ backgroundColor: "#D1FAE5", color: "#065F46" }}
                  >
                    {id}
                  </span>
                  {i < metadata.path.length - 1 && (
                    <span className="text-muted-foreground">→</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Frontier — queue (BFS) or stack (DFS) */}
        {(showQueue || showStack) && metadata.frontier.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {showStack ? "Stack (top → bottom)" : "Queue (front → back)"}
            </h3>
            <div className="flex flex-wrap gap-1">
              {metadata.frontier.map((id) => (
                <span
                  key={id}
                  className="px-2 py-0.5 rounded text-xs font-mono"
                  style={{ backgroundColor: "#FEF3C7", color: "#78350F" }}
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Distance table — Dijkstra / A* / Bellman-Ford */}
        {showDistances && (
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Distances from source
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
              {graphData.nodes.map((node) => {
                const dist = metadata.distances[node.id];
                const inPath = metadata.path.includes(node.id);
                return (
                  <div
                    key={node.id}
                    className={cn(
                      "p-1.5 rounded border text-center text-xs",
                      inPath
                        ? "bg-emerald-50 border-emerald-200"
                        : dist === undefined || dist >= INF
                          ? "bg-muted border-border text-muted-foreground"
                          : "bg-blue-50 border-blue-200",
                    )}
                  >
                    <div className="font-bold">{node.id}</div>
                    <div className="font-mono">
                      {dist === undefined || dist >= INF ? "∞" : dist}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
