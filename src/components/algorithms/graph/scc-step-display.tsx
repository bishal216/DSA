// src/components/graph/SCCStepDisplay.tsx

import type {
  GraphData,
  GraphStep,
  SCCStepMetadata,
} from "@/algorithms/types/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/helpers";

interface SCCStepDisplayProps {
  step: GraphStep;
  metadata: SCCStepMetadata | undefined;
  algorithm: string;
  graphData: GraphData;
}

const SCC_COLORS = [
  { bg: "#D1FAE5", border: "#6EE7B7", text: "#065F46" },
  { bg: "#FEF3C7", border: "#FCD34D", text: "#78350F" },
  { bg: "#EDE9FE", border: "#C4B5FD", text: "#4C1D95" },
  { bg: "#FEE2E2", border: "#FCA5A5", text: "#991B1B" },
  { bg: "#DBEAFE", border: "#93C5FD", text: "#1E3A5F" },
];

function getStepTitle(step: GraphStep, algorithm: string): string {
  switch (step.stepType) {
    case "initial":
      return algorithm === "tarjan"
        ? "Initialising Tarjan's"
        : "Initialising Kosaraju's";
    case "discover":
      return "Discovering Node";
    case "finish":
      return algorithm === "kosaraju"
        ? "Node Finished — Push to Stack"
        : "Updating Low-Link";
    case "scc":
      return "SCC Found";
    case "process":
      return algorithm === "kosaraju"
        ? "Pass 1 Complete"
        : "Processing Iteration";
    case "complete":
      return "Algorithm Complete";
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
    case "discover":
      return blue;
    case "finish":
      return amber;
    case "scc":
    case "complete":
      return green;
    case "process":
      return neutral;
    default:
      return neutral;
  }
}

export default function SCCStepDisplay({
  step,
  metadata,
  algorithm,
  graphData,
}: SCCStepDisplayProps) {
  if (!metadata) return null;

  const isTarjan = algorithm === "tarjan";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {getStepTitle(step, algorithm)}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Step description */}
        <div
          className="p-3 rounded-lg border-l-[3px]"
          style={{
            backgroundColor: getStepStyle(step).bg,
            borderLeftColor: getStepStyle(step).border,
            color: getStepStyle(step).text,
          }}
        >
          <p className="font-medium">{step.message}</p>
          {step.subMessage && (
            <p className="text-xs mt-0.5 opacity-75">{step.subMessage}</p>
          )}
        </div>

        {/* SCCs found so far */}
        {metadata.components.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              SCCs Found ({metadata.components.length})
            </h3>
            <div className="flex flex-wrap gap-2">
              {metadata.components.map((component, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded border-l-[3px] text-xs font-mono"
                  style={{
                    backgroundColor: SCC_COLORS[i % SCC_COLORS.length].bg,
                    borderLeftColor: SCC_COLORS[i % SCC_COLORS.length].border,
                    color: SCC_COLORS[i % SCC_COLORS.length].text,
                  }}
                >
                  {"{" + component.join(", ") + "}"}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stack */}
        {metadata.stack.length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {isTarjan ? "DFS Stack" : "Finish Stack (top = last finished)"}
            </h3>
            <div className="flex flex-wrap gap-1">
              {[...metadata.stack].reverse().map((id, i) => (
                <span
                  key={id}
                  className={cn(
                    "px-2 py-0.5 rounded border text-xs font-mono",
                    i === 0 ? "font-bold" : "bg-gray-50 border-gray-200",
                  )}
                  style={
                    i === 0
                      ? {
                          backgroundColor: "#FEF3C7",
                          borderColor: "#FCD34D",
                          color: "#78350F",
                        }
                      : undefined
                  }
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Discovery / low-link table */}
        {Object.keys(metadata.discoveryTime).length > 0 && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              {isTarjan ? "disc / low values" : "Discovery / Finish times"}
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-1.5">
              {graphData.nodes
                .filter((n) => metadata.discoveryTime[n.id] !== undefined)
                .map((node) => {
                  const compIdx = metadata.componentIndex[node.id];
                  const inComponent = compIdx !== undefined;
                  return (
                    <div
                      key={node.id}
                      className="p-1.5 rounded border-l-[3px] text-center text-xs"
                      style={
                        inComponent
                          ? {
                              backgroundColor:
                                SCC_COLORS[compIdx % SCC_COLORS.length].bg,
                              borderLeftColor:
                                SCC_COLORS[compIdx % SCC_COLORS.length].border,
                              color:
                                SCC_COLORS[compIdx % SCC_COLORS.length].text,
                            }
                          : {
                              backgroundColor: "#EFF6FF",
                              borderLeftColor: "#93C5FD",
                              color: "#1E3A5F",
                            }
                      }
                    >
                      <div className="font-bold">{node.id}</div>
                      <div className="font-mono text-muted-foreground">
                        {isTarjan
                          ? `d:${metadata.discoveryTime[node.id]} l:${metadata.finishTime[node.id]}`
                          : `d:${metadata.discoveryTime[node.id]} f:${metadata.finishTime[node.id]}`}
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
