import React, { useRef, useEffect, useState, useCallback } from "react";
import { Node, Edge, GraphData } from "@/algorithms/types/graph";

interface GraphCanvasProps {
  graphData: GraphData;
  mstEdges: string[];
  currentEdge: Edge | null;
  rejectedEdges: string[];
  selectedNodes: string[];
  onNodeClick: (nodeId: string) => void;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  mode: "view" | "add-node" | "add-edge";
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graphData,
  mstEdges,
  currentEdge,
  rejectedEdges,
  selectedNodes,
  onNodeMove,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw edges
    graphData.edges.forEach((edge) => {
      const fromNode = graphData.nodes.find((n) => n.id === edge.from);
      const toNode = graphData.nodes.find((n) => n.id === edge.to);

      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      // Determine edge color
      if (currentEdge && edge.id === currentEdge.id) {
        ctx.strokeStyle = "#FCD34D"; // Yellow for current edge
        ctx.lineWidth = 4;
      } else if (mstEdges.includes(edge.id)) {
        ctx.strokeStyle = "#10B981"; // Green for MST edges
        ctx.lineWidth = 3;
      } else if (rejectedEdges.includes(edge.id)) {
        ctx.strokeStyle = "#EF4444"; // Red for rejected edges
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "#6B7280"; // Gray for unprocessed edges
        ctx.lineWidth = 2;
      }

      ctx.stroke();

      // Draw weight label
      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;

      ctx.fillStyle = "#1F2937";
      ctx.fillRect(midX - 12, midY - 8, 24, 16);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(edge.weight.toString(), midX, midY);
    });

    // Draw nodes
    graphData.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);

      // Determine node color
      if (selectedNodes.includes(node.id)) {
        ctx.fillStyle = "#3B82F6"; // Blue for selected nodes
      } else if (dragNodeId === node.id) {
        ctx.fillStyle = "#8B5CF6"; // Purple for dragging node
      } else {
        ctx.fillStyle = "#374151"; // Gray for normal nodes
      }

      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    });
  }, [
    graphData,
    mstEdges,
    currentEdge,
    rejectedEdges,
    selectedNodes,
    dragNodeId,
  ]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const getMousePosition = (
    event: React.MouseEvent<HTMLCanvasElement> | MouseEvent,
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const getNodeAtPosition = (x: number, y: number): Node | null => {
    return (
      graphData.nodes.find((node) => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        return distance <= 20;
      }) || null
    );
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePosition(event);
    const clickedNode = getNodeAtPosition(x, y);

    if (clickedNode) {
      setIsDragging(true);
      setDragNodeId(clickedNode.id);
      setDragOffset({
        x: x - clickedNode.x,
        y: y - clickedNode.y,
      });
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging && dragNodeId) {
      const { x, y } = getMousePosition(event);
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;

      // Keep node within canvas bounds
      const canvas = canvasRef.current;
      if (canvas) {
        const boundedX = Math.max(20, Math.min(canvas.width - 20, newX));
        const boundedY = Math.max(20, Math.min(canvas.height - 20, newY));
        onNodeMove(dragNodeId, boundedX, boundedY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Add global mouse event listeners for better drag experience
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDragging && dragNodeId) {
        const { x, y } = getMousePosition(event);
        const newX = x - dragOffset.x;
        const newY = y - dragOffset.y;

        const canvas = canvasRef.current;
        if (canvas) {
          const boundedX = Math.max(20, Math.min(canvas.width - 20, newX));
          const boundedY = Math.max(20, Math.min(canvas.height - 20, newY));
          onNodeMove(dragNodeId, boundedX, boundedY);
        }
      }
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
      setDragNodeId(null);
      setDragOffset({ x: 0, y: 0 });
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
      document.addEventListener("mouseup", handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, dragNodeId, dragOffset, onNodeMove]);

  const getCursorStyle = () => {
    if (isDragging) return "grabbing";
    return "grab";
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-96  rounded-lg border  relative overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: getCursorStyle() }}
      />
    </div>
  );
};

export default GraphCanvas;
