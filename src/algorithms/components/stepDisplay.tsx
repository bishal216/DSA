import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MSTAlgorithmStep, GraphData } from "../types/graph";
import { colors } from "@/algorithms/utils/helpers";
import { cn } from "@/utils/helpers";

interface StepDisplayProps {
  graphData: GraphData;
  step: MSTAlgorithmStep;
  algorithm: string;
}

const StepDisplay: React.FC<StepDisplayProps> = ({
  graphData,
  step,
  algorithm,
}) => {
  const allEdges = useMemo(() => {
    return [...graphData.edges].sort((a, b) => a.weight - b.weight);
  }, [graphData.edges]);

  const allEdgesReversed = useMemo(() => {
    return [...graphData.edges].sort((a, b) => b.weight - a.weight);
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

  const getEdgeIcon = () => {
    if (step.stepType === "check") return "?";
    if (step.stepType === "decision")
      return algorithm === "prim" || step.currentEdgeAccepted ? "✓" : "✗";
    return "○";
  };

  const getStepColor = () => {
    if (step.stepType === "initial") return "bg-gray-50 border-gray-200";
    if (step.stepType === "check") return "bg-blue-50 border-blue-200";
    if (
      step.stepType === "decision" &&
      (algorithm === "prim" || step.currentEdgeAccepted)
    )
      return "bg-green-50 border-green-200";
    if (
      step.stepType === "decision" &&
      algorithm === "kruskal" &&
      !step.currentEdgeAccepted
    )
      return "bg-red-50 border-red-200";
    return "bg-gray-100 border-gray-200";
  };

  const getIconColor = () => {
    if (step.stepType === "check") return colors.candidateEdge;
    if (
      step.stepType === "decision" &&
      (algorithm === "prim" || step.currentEdgeAccepted)
    )
      return colors.visitedEdge;
    if (
      step.stepType === "decision" &&
      algorithm === "kruskal" &&
      !step.currentEdgeAccepted
    )
      return colors.rejectedEdge;
    return colors.defaultEdge;
  };
  const displayEdges =
    algorithm === "reverse-delete" ? allEdgesReversed : allEdges;
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
            getStepColor(),
          )}
        >
          <span className="text-lg" style={{ color: getIconColor() }}>
            {getEdgeIcon()}
          </span>
          <div>
            <p className="font-medium">{step.description}</p>
            <p className="text-xs text-muted-foreground">
              {step.subDescription}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-medium">
            Edges
            {algorithm === "prim" ? " (Candidate)" : " (Sorted)"}
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
            {displayEdges.map((edge) => {
              const isAccepted = step.mstEdges.some((e) => e.id === edge.id);
              const isRejected = step.rejectedEdges.some(
                (e) => e.id === edge.id,
              );
              const isCurrent = step.currentEdge?.id === edge.id;
              const connectsVisited = step.frontierEdges?.some(
                (e) => e.id === edge.id,
              );

              let bgColor = colors.text;
              const textColor = colors.defaultNode;
              let borderColor = colors.defaultNode;
              if (isCurrent) {
                bgColor = colors.currentEdge;
                borderColor = colors.currentNode;
              } else if (isAccepted) {
                bgColor = colors.visitedEdge;
                borderColor = colors.visitedNode;
              } else if (isRejected) {
                bgColor = colors.rejectedEdge;
                borderColor = colors.rejectedNode;
              } else if (connectsVisited) {
                bgColor = colors.currentEdge;
                borderColor = colors.currentNode;
              }

              return (
                <div
                  key={edge.id}
                  className={cn(
                    "p-2 rounded border text-sm flex items-center gap-2",
                    isCurrent && "ring-2 ring-offset-1 ring-yellow-400 z-10",
                  )}
                  style={{
                    backgroundColor: bgColor,
                    color: textColor,
                    borderColor,
                  }}
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
      </CardContent>
    </Card>
  );
};

export default StepDisplay;
