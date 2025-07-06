import React, { useRef, useEffect, useCallback } from "react";
import { GraphData } from "@/algorithms/types/graph";

interface GraphCanvasProps {
  graph: GraphData;
  nodeStates: Map<string, string>;
  edgeStates: Map<string, string>;
  onCanvasClick: (x: number, y: number) => void;
  onNodeClick: (nodeId: string) => void;
  selectedNodes: string[];
}

export const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  nodeStates,
  edgeStates,
  onCanvasClick,
  onNodeClick,
  selectedNodes,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const getNodeColor = useCallback(
    (nodeId: string) => {
      const state = nodeStates.get(nodeId);
      switch (state) {
        case "visited":
          return "#10b981";
        case "processing":
          return "#f59e0b";
        case "finished":
          return "#3b82f6";
        case "scc":
          return "#8b5cf6";
        default:
          return "#64748b";
      }
    },
    [nodeStates],
  );

  const getEdgeColor = useCallback(
    (edgeId: string) => {
      const state = edgeStates.get(edgeId);
      switch (state) {
        case "active":
          return "#10b981";
        case "tree":
          return "#3b82f6";
        case "back":
          return "#ef4444";
        case "forward":
          return "#f59e0b";
        case "cross":
          return "#8b5cf6";
        default:
          return "#475569";
      }
    },
    [edgeStates],
  );
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    graph.edges.forEach((edge) => {
      const sourceNode = graph.nodes.find((n) => n.id === edge.from);
      const targetNode = graph.nodes.find((n) => n.id === edge.to);

      if (!sourceNode || !targetNode) return;

      ctx.strokeStyle = getEdgeColor(edge.id);
      ctx.lineWidth = edgeStates.get(edge.id) ? 3 : 2;
      ctx.beginPath();
      ctx.moveTo(sourceNode.x, sourceNode.y);
      ctx.lineTo(targetNode.x, targetNode.y);
      ctx.stroke();

      // Draw arrow
      const angle = Math.atan2(
        targetNode.y - sourceNode.y,
        targetNode.x - sourceNode.x,
      );
      const arrowLength = 15;
      const arrowAngle = 0.5;
      const nodeRadius = 25;

      const endX = targetNode.x - Math.cos(angle) * nodeRadius;
      const endY = targetNode.y - Math.sin(angle) * nodeRadius;

      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle - arrowAngle),
        endY - arrowLength * Math.sin(angle - arrowAngle),
      );
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - arrowLength * Math.cos(angle + arrowAngle),
        endY - arrowLength * Math.sin(angle + arrowAngle),
      );
      ctx.stroke();
    });

    // Draw nodes
    graph.nodes.forEach((node) => {
      const isSelected = selectedNodes.includes(node.id);
      const nodeColor = getNodeColor(node.id);

      ctx.fillStyle = nodeColor;
      ctx.strokeStyle = isSelected ? "#ffffff" : nodeColor;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    });
  }, [graph, selectedNodes, edgeStates, getEdgeColor, getNodeColor]);

  useEffect(() => {
    draw();
  }, [draw]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Check if click is on a node
    const clickedNode = graph.nodes.find((node) => {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      return distance <= 25;
    });

    if (clickedNode) {
      onNodeClick(clickedNode.id);
    } else {
      onCanvasClick(x, y);
    }
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        className="border border-slate-600 rounded-lg bg-slate-900/50 cursor-pointer"
        onClick={handleCanvasClick}
      />
    </div>
  );
};
