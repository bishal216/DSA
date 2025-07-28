import React, { useRef, useEffect, useState, useCallback } from "react";
import { Node, GraphCanvasProps } from "@/algorithms/types/graph";
import { colors } from "@/algorithms/utils/helpers";

const GraphCanvas: React.FC<
  GraphCanvasProps & { algorithm?: "kruskal" | "prim" }
> = ({
  graph,
  candidateEdges,
  candidateNodes,
  currentNode,
  currentEdge,
  visitedNodes,
  visitedEdges,
  rejectedNodes,
  rejectedEdges,
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

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    graph.nodes.forEach((node) => {
      const clampedX = clamp(node.x, NODE_RADIUS, width - NODE_RADIUS);
      const clampedY = clamp(node.y, NODE_RADIUS, height - NODE_RADIUS);
      if (node.x !== clampedX || node.y !== clampedY) {
        node.x = clampedX;
        node.y = clampedY;
        onNodeMove(node.id, clampedX, clampedY);
      }
    });

    // Draw edges
    graph.edges.forEach((edge) => {
      const fromNode = graph.nodes.find((n) => n.id === edge.from);
      const toNode = graph.nodes.find((n) => n.id === edge.to);
      if (!fromNode || !toNode) return;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);

      let strokeStyle = colors.defaultEdge;
      let lineWidth = 2;

      if (currentEdge?.id === edge.id) {
        strokeStyle = colors.currentEdge;
        lineWidth = 4;
      } else if (visitedEdges?.some((e) => e.id === edge.id)) {
        strokeStyle = colors.visitedEdge;
        lineWidth = 3;
      } else if (rejectedEdges?.some((e) => e.id === edge.id)) {
        strokeStyle = colors.rejectedEdge;
      } else if (candidateEdges?.some((e) => e.id === edge.id)) {
        strokeStyle = colors.candidateEdge;
        lineWidth = 3;
      }

      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      const midX = (fromNode.x + toNode.x) / 2;
      const midY = (fromNode.y + toNode.y) / 2;

      ctx.fillStyle = colors.weightBg;
      ctx.fillRect(midX - 12, midY - 8, 24, 16);

      ctx.fillStyle = colors.text;
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(edge.weight.toString(), midX, midY);
    });

    // Draw nodes
    graph.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);

      let fillStyle = colors.defaultNode;

      if (dragNodeId === node.id) {
        fillStyle = colors.draggingNode;
      } else if (currentNode?.id === node.id) {
        fillStyle = colors.currentNode;
      } else if (visitedNodes?.includes(node.id)) {
        fillStyle = colors.visitedNode;
      } else if (candidateNodes?.includes(node.id)) {
        fillStyle = colors.candidateNode;
      } else if (rejectedNodes?.includes(node.id)) {
        fillStyle = colors.rejectedNode;
      }

      ctx.fillStyle = fillStyle;
      ctx.fill();
      ctx.strokeStyle = colors.text;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = colors.text;
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    });
  }, [
    graph,
    dragNodeId,
    onNodeMove,
    currentNode,
    currentEdge,
    visitedNodes,
    visitedEdges,
    rejectedNodes,
    rejectedEdges,
    candidateNodes,
    candidateEdges,
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
    graph.nodes.find(
      (node: Node) => Math.hypot(node.x - x, node.y - y) <= NODE_RADIUS,
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
      className="w-full h-96 rounded-lg border relative overflow-hidden bg-gray-50"
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
        role="img"
      />
    </div>
  );
};

export default GraphCanvas;
