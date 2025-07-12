import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MSTAlgorithmStep, GraphData } from "../types/graph";
import { cn } from "@/utils/helpers";

interface StepDisplayProps {
  graphData: GraphData;
  step: MSTAlgorithmStep;
  algorithm: "kruskal" | "prim";
}

const StepDisplay: React.FC<StepDisplayProps> = ({
  graphData,
  step,
  algorithm,
}) => {
  // Combine all edges without duplicates
  const allEdges = useMemo(() => {
    // Start with all edges from the graph data

    return [...graphData.edges].sort((a, b) => a.weight - b.weight);
  }, [graphData.edges]);

  const getStepTitle = () => {
    switch (step.stepType) {
      case "initial":
        return algorithm === "prim"
          ? `Starting from node ${step.visitedNodes?.[0] || "?"}`
          : "Starting Algorithm";
      case "check":
        return algorithm === "prim"
          ? "Evaluating candidate edges"
          : "Checking Edge";
      case "decision":
        return algorithm === "prim"
          ? "Smallest Candidate Edge Added"
          : step.currentEdgeAccepted
            ? "Edge Added"
            : "Edge Rejected";
      case "summary":
        return "Progress Update";
      case "complete":
        return "Algorithm Complete";
      default:
        return "Algorithm Step";
    }
  };

  const getEdgeIcon = (step: MSTAlgorithmStep) => {
    if (step.stepType === "check") return "?";
    if (step.stepType === "decision")
      return algorithm === "prim" || step.currentEdgeAccepted ? "✓" : "✗";
    return "○";
  };
  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {getStepTitle()}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        <div
          className={cn(
            "p-3 rounded-lg border flex items-center gap-3",
            step.stepType === "initial" && "bg-gray-50 border-gray-200",
            step.stepType === "check" && "bg-blue-50 border-blue-200",
            step.stepType === "decision" &&
              (algorithm === "prim" || step.currentEdgeAccepted) &&
              "bg-green-50 border-green-200",
            step.stepType === "decision" &&
              algorithm === "kruskal" &&
              !step.currentEdgeAccepted &&
              "bg-red-50 border-red-200",
          )}
        >
          {/* Current edge highlight */}

          <span
            className={cn(
              "text-lg",
              step.stepType === "check" && "text-blue-600",
              step.stepType === "decision" &&
                (algorithm === "prim" || step.currentEdgeAccepted) &&
                "text-green-600",
              step.stepType === "decision" &&
                algorithm === "kruskal" &&
                !step.currentEdgeAccepted &&
                "text-red-600",
            )}
          >
            {getEdgeIcon(step)}
          </span>
          <div>
            <p className="font-medium">{step.description}</p>
            <p className="text-xs text-muted-foreground">
              {step.subDescription}
            </p>
          </div>
        </div>

        {/* All edges visualization */}
        {
          <div className="space-y-2">
            <h3 className="font-medium">
              Edges
              {algorithm === "prim" ? " (Candidate)" : "  (Sorted)"}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
              {allEdges.map((edge) => {
                const isAccepted = step.mstEdges.some((e) => e.id === edge.id);
                const isRejected = step.rejectedEdges.some(
                  (e) => e.id === edge.id,
                );
                const isCurrent = step.currentEdge?.id === edge.id;
                const connectsVisited = step.frontierEdges?.some(
                  (e) => e.id === edge.id,
                );

                return (
                  <div
                    key={edge.id}
                    className={cn(
                      "p-2 rounded border text-sm flex items-center gap-2",
                      isCurrent && "ring-2 ring-offset-1 ring-yellow-400",
                      isAccepted
                        ? "bg-green-50 border-green-200 text-green-700"
                        : isRejected
                          ? "bg-red-50 border-red-200 text-red-600"
                          : connectsVisited
                            ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                            : "bg-muted/50 border-muted text-muted-foreground",
                      isCurrent && "z-10", // Ensure current edge appears above others
                    )}
                  >
                    <span>
                      {isCurrent
                        ? "→"
                        : isAccepted
                          ? "✓"
                          : isRejected
                            ? "✗"
                            : connectsVisited
                              ? "→"
                              : "○"}
                    </span>
                    <span>
                      {edge.from} → {edge.to} (weight: {edge.weight})
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        }
      </CardContent>
    </Card>
  );
};

export default StepDisplay;
