import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PathfindingStep } from "@/algorithms/types/graph";
import { cn } from "@/utils/helpers";

interface PathfindingStepDisplayProps {
  step?: PathfindingStep; // Make step optional
}

const PathfindingStepDisplay: React.FC<PathfindingStepDisplayProps> = ({
  step,
}) => {
  // Provide default empty step if undefined
  const safeStep = step || {
    stepType: "initial",
    description: "Algorithm not started",
    currentNode: null,
    visitedNodes: [],
    frontierNodes: [],
    path: [],
    distances: {},
    previousNodes: {},
  };

  const getStepColor = () => {
    switch (safeStep.stepType) {
      case "initial":
        return "bg-gray-50 border-gray-200";
      case "explore":
        return "bg-blue-50 border-blue-200";
      case "visit":
        return "bg-green-50 border-green-200";
      case "path":
        return "bg-yellow-50 border-yellow-200";
      case "complete":
        return "bg-purple-50 border-purple-200";
      default:
        return "bg-gray-100 border-gray-200";
    }
  };

  const getStepIcon = () => {
    switch (safeStep.stepType) {
      case "initial":
        return "⚙️";
      case "explore":
        return "🔍";
      case "visit":
        return "✅";
      case "path":
        return "📍";
      case "complete":
        return "🏁";
      default:
        return "●";
    }
  };

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="text-base font-semibold capitalize">
          {safeStep.stepType} Step
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Main description */}
        <div
          className={cn(
            "p-3 rounded-lg border flex items-center gap-3",
            getStepColor(),
          )}
        >
          <span className="text-lg">{getStepIcon()}</span>
          <div>
            <p className="font-medium">{safeStep.description}</p>
            {safeStep.subDescription && (
              <p className="text-xs text-muted-foreground">
                {safeStep.subDescription}
              </p>
            )}
          </div>
        </div>

        {/* Current Node Info */}
        {safeStep.currentNode && (
          <div className="p-3 border rounded bg-blue-50 text-sm">
            <strong>Current Node:</strong> {safeStep.currentNode.id}
            <div className="text-xs text-gray-600">
              Distance: {safeStep.distances[safeStep.currentNode.id] ?? "N/A"}
            </div>
          </div>
        )}

        {/* Visited Nodes */}
        {safeStep.visitedNodes.length > 0 && (
          <div>
            <h4 className="font-medium">Visited Nodes</h4>
            <div className="flex flex-wrap gap-1 text-xs">
              {safeStep.visitedNodes.map((id) => (
                <span
                  key={id}
                  className="px-2 py-1 bg-green-100 rounded font-mono"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Frontier Nodes */}
        {safeStep.frontierNodes.length > 0 && (
          <div>
            <h4 className="font-medium">Frontier Nodes</h4>
            <div className="flex flex-wrap gap-1 text-xs">
              {safeStep.frontierNodes.map((id) => (
                <span
                  key={id}
                  className="px-2 py-1 bg-blue-100 rounded font-mono"
                >
                  {id}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Final Path */}
        {safeStep.path.length > 0 && (
          <div>
            <h4 className="font-medium">Path</h4>
            <div className="flex flex-wrap items-center gap-1 mt-1 text-sm">
              {safeStep.path.map((nodeId, i) => (
                <React.Fragment key={nodeId}>
                  <span className="px-2 py-1 bg-yellow-100 rounded font-mono">
                    {nodeId}
                  </span>
                  {i < safeStep.path.length - 1 && (
                    <span className="text-gray-400">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total distance:{" "}
              {safeStep.distances[safeStep.path[safeStep.path.length - 1]] ??
                "N/A"}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PathfindingStepDisplay;
