import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MSTAlgorithmStep } from "../types/graph";

interface StepDisplayProps {
  step: MSTAlgorithmStep;
}

const StepDisplay: React.FC<StepDisplayProps> = ({ step }) => {
  // Calculate number of components before and after this step if possible
  const componentCount = step.components
    ? Object.keys(step.components).length
    : 0;

  // Total MST weight so far
  const totalMSTWeight = step.mstEdges.reduce((sum, e) => sum + e.weight, 0);

  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle>{step.description}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 text-sm leading-relaxed">
        {/* Current Edge */}
        {step.currentEdge && (
          <div>
            <strong>Current Edge:</strong> {step.currentEdge.from} →{" "}
            {step.currentEdge.to} (weight: {step.currentEdge.weight})
            <p>
              This edge{" "}
              {step.currentEdgeAccepted
                ? "connects two separate components and is added to the MST."
                : "would form a cycle and is therefore rejected."}
            </p>
          </div>
        )}

        {/* MST Edges */}
        <div>
          <strong>
            MST Edges ({step.mstEdges.length} edges, total weight:{" "}
            {totalMSTWeight}):
          </strong>
          {step.mstEdges.length > 0 ? (
            <ul className="list-disc pl-5">
              {step.mstEdges.map((edge, idx) => (
                <li key={idx}>
                  {edge.from} → {edge.to} (weight: {edge.weight})
                </li>
              ))}
            </ul>
          ) : (
            <p>No edges added yet.</p>
          )}
        </div>

        {/* Rejected Edges */}
        <div className="text-red-600">
          <strong>Rejected Edges ({step.rejectedEdges.length}):</strong>
          {step.rejectedEdges.length > 0 ? (
            <ul className="list-disc pl-5">
              {step.rejectedEdges.map((edge, idx) => (
                <li key={idx}>
                  {edge.from} → {edge.to} (weight: {edge.weight})
                </li>
              ))}
            </ul>
          ) : (
            <p>No edges rejected yet.</p>
          )}
        </div>

        {/* Connected Components */}
        {step.components && (
          <div>
            <strong>Connected Components ({componentCount}):</strong>
            <ul className="list-disc pl-5">
              {Object.entries(step.components).map(([root, nodes]) => (
                <li key={root}>
                  Component rooted at <strong>{root}</strong>:{" "}
                  {nodes.join(", ")}
                </li>
              ))}
            </ul>
            <p>
              {componentCount === 1
                ? "All nodes are now connected in a single spanning tree."
                : `There are currently ${componentCount} disconnected components.`}
            </p>
          </div>
        )}

        {/* Remaining Edges */}
        {step.remainingEdges && step.remainingEdges.length > 0 && (
          <div>
            <strong>
              Edges Remaining to Check ({step.remainingEdges.length}):
            </strong>{" "}
            <p>
              {step.remainingEdges
                .map((e) => `${e.from}→${e.to} (${e.weight})`)
                .join(", ")}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StepDisplay;
