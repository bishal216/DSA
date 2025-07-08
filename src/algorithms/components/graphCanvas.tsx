import React, { useRef, useEffect, useState, useCallback } from "react";
import { Node, GraphCanvasProps } from "@/algorithms/types/graph";

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
  const NODE_RADIUS = 20;

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Setup canvas scaling
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Clamp node positions to stay in bounds
    graphData.nodes.forEach((node) => {
      const clampedX = clamp(node.x, NODE_RADIUS, width - NODE_RADIUS);
      const clampedY = clamp(node.y, NODE_RADIUS, height - NODE_RADIUS);
      if (node.x !== clampedX || node.y !== clampedY) {
        node.x = clampedX;
        node.y = clampedY;
        onNodeMove(node.id, clampedX, clampedY);
      }
    });

    // Draw edges
    graphData.edges.forEach((edge) => {
      const fromNode = graphData.nodes.find((n) => n.id === edge.from);
      const toNode = graphData.nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      // Color & opacity
      if (currentEdge && edge.id === currentEdge.id) {
        ctx.strokeStyle = "rgba(252, 211, 77, 1)"; // Yellow
        ctx.lineWidth = 4;
      } else if (mstEdges.includes(edge)) {
        ctx.strokeStyle = "rgba(16, 185, 129, 1)"; // Green
        ctx.lineWidth = 3;
      } else if (rejectedEdges.includes(edge)) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.4)"; // Semi-red
        ctx.lineWidth = 2;
      } else {
        ctx.strokeStyle = "rgba(107, 114, 128, 0.3)"; // Faded gray
        ctx.lineWidth = 2;
      }

      ctx.stroke();

      // Weight label
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
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);

      ctx.fillStyle = selectedNodes.includes(node.id)
        ? "#3B82F6"
        : dragNodeId === node.id
          ? "#8B5CF6"
          : "#374151";

      ctx.fill();
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 2;
      ctx.stroke();

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
    onNodeMove,
  ]);

  useEffect(() => drawGraph(), [drawGraph]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      drawGraph();
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [drawGraph]);

  // --- Fixed Position Scaling ---
  const getMousePosition = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      return {
        x: ((event.clientX - rect.left) * (canvas.width / rect.width)) / dpr,
        y: ((event.clientY - rect.top) * (canvas.height / rect.height)) / dpr,
      };
    },
    [],
  );

  const getTouchPosition = useCallback((touch: React.Touch) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: ((touch.clientX - rect.left) * (canvas.width / rect.width)) / dpr,
      y: ((touch.clientY - rect.top) * (canvas.height / rect.height)) / dpr,
    };
  }, []);

  const getNodeAtPosition = (x: number, y: number): Node | null =>
    graphData.nodes.find(
      (node) => Math.hypot(node.x - x, node.y - y) <= NODE_RADIUS,
    ) || null;

  const startDrag = (id: string, offsetX: number, offsetY: number) => {
    setIsDragging(true);
    setDragNodeId(id);
    setDragOffset({ x: offsetX, y: offsetY });
  };

  const stopDrag = () => {
    setIsDragging(false);
    setDragNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // --- Mouse Events ---
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePosition(e);
    const node = getNodeAtPosition(x, y);
    if (node) startDrag(node.id, x - node.x, y - node.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragNodeId) return;
    const { x, y } = getMousePosition(e);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const boundedX = clamp(x - dragOffset.x, NODE_RADIUS, width - NODE_RADIUS);
    const boundedY = clamp(y - dragOffset.y, NODE_RADIUS, height - NODE_RADIUS);
    onNodeMove(dragNodeId, boundedX, boundedY);
  };

  const handleMouseUp = stopDrag;

  // --- Touch Events ---
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    const { x, y } = getTouchPosition(touch);
    const node = getNodeAtPosition(x, y);
    if (node) startDrag(node.id, x - node.x, y - node.y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragNodeId) return;
    e.preventDefault();
    const touch = e.touches[0];
    if (!touch) return;
    const { x, y } = getTouchPosition(touch);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    const boundedX = clamp(x - dragOffset.x, NODE_RADIUS, width - NODE_RADIUS);
    const boundedY = clamp(y - dragOffset.y, NODE_RADIUS, height - NODE_RADIUS);
    onNodeMove(dragNodeId, boundedX, boundedY);
  };

  const handleTouchEnd = stopDrag;

  // Global mouse move
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (!isDragging || !dragNodeId) return;
      const { x, y } = getMousePosition(e);
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.width / dpr;
      const height = canvas.height / dpr;
      const boundedX = clamp(
        x - dragOffset.x,
        NODE_RADIUS,
        width - NODE_RADIUS,
      );
      const boundedY = clamp(
        y - dragOffset.y,
        NODE_RADIUS,
        height - NODE_RADIUS,
      );
      onNodeMove(dragNodeId, boundedX, boundedY);
    };

    const handleUp = stopDrag;

    if (isDragging) {
      document.addEventListener("mousemove", handleMove);
      document.addEventListener("mouseup", handleUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMove);
      document.removeEventListener("mouseup", handleUp);
    };
  }, [isDragging, dragNodeId, dragOffset, onNodeMove, getMousePosition]);

  useEffect(() => {
    document.body.style.cursor = isDragging ? "grabbing" : "default";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="w-full h-96 rounded-lg border relative overflow-hidden"
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
        className="absolute inset-0 w-full h-full"
        aria-label="Graph canvas"
        role="img"
      />
    </div>
  );
};

export default GraphCanvas;
