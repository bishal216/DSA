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

    // Set canvas size to match container
    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const canvasWidth = canvas.width / dpr;
    const canvasHeight = canvas.height / dpr;
    graphData.nodes.forEach((node) => {
      const clampedX = clamp(node.x, NODE_RADIUS, canvasWidth - NODE_RADIUS);
      const clampedY = clamp(node.y, NODE_RADIUS, canvasHeight - NODE_RADIUS);

      if (node.x !== clampedX || node.y !== clampedY) {
        node.x = clampedX;
        node.y = clampedY;
        onNodeMove(node.id, clampedX, clampedY); // Persist corrected position
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

      // Determine edge color
      if (currentEdge && edge.id === currentEdge.id) {
        ctx.strokeStyle = "#FCD34D"; // Yellow for current edge
        ctx.lineWidth = 4;
      } else if (mstEdges.includes(edge)) {
        ctx.strokeStyle = "#10B981"; // Green for MST edges
        ctx.lineWidth = 3;
      } else if (rejectedEdges.includes(edge)) {
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
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);

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
    onNodeMove,
  ]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let timeout: number;
    const resizeObserver = new ResizeObserver(() => {
      clearTimeout(timeout);
      timeout = window.setTimeout(() => drawGraph(), 50);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [drawGraph]);

  const getMousePosition = useCallback(
    (event: MouseEvent | React.MouseEvent) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    },
    [],
  );

  const getNodeAtPosition = (x: number, y: number): Node | null => {
    return (
      graphData.nodes.find((node) => {
        const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
        return distance <= NODE_RADIUS;
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
        const boundedX = Math.max(
          NODE_RADIUS,
          Math.min(canvas.width - NODE_RADIUS, newX),
        );
        const boundedY = Math.max(
          NODE_RADIUS,
          Math.min(canvas.height - NODE_RADIUS, newY),
        );
        onNodeMove(dragNodeId, boundedX, boundedY);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  // Utility function to get touch position relative to canvas
  const getTouchPosition = useCallback((touch: React.Touch) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }, []);

  const handleTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const touch = event.touches[0];
    if (!touch) return;
    const { x, y } = getTouchPosition(touch);
    const touchedNode = getNodeAtPosition(x, y);
    if (touchedNode) {
      setIsDragging(true);
      setDragNodeId(touchedNode.id);
      setDragOffset({ x: x - touchedNode.x, y: y - touchedNode.y });
    }
  };

  const handleTouchMove = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDragging || !dragNodeId) return;
    event.preventDefault(); // Prevent scrolling

    const touch = event.touches[0];
    if (!touch) return;
    const { x, y } = getTouchPosition(touch);
    const canvas = canvasRef.current;
    if (canvas) {
      const newX = x - dragOffset.x;
      const newY = y - dragOffset.y;
      const boundedX = Math.max(
        20,
        Math.min(canvas.width / (window.devicePixelRatio || 1) - 20, newX),
      );
      const boundedY = Math.max(
        20,
        Math.min(canvas.height / (window.devicePixelRatio || 1) - 20, newY),
      );
      onNodeMove(dragNodeId, boundedX, boundedY);
    }
  };

  const handleTouchEnd = () => {
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
          const boundedX = Math.max(
            NODE_RADIUS,
            Math.min(canvas.width - NODE_RADIUS, newX),
          );
          const boundedY = Math.max(
            NODE_RADIUS,
            Math.min(canvas.height - NODE_RADIUS, newY),
          );
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
  }, [isDragging, dragNodeId, dragOffset, onNodeMove, getMousePosition]);

  useEffect(() => {
    if (isDragging) {
      document.body.style.cursor = "grabbing";
    } else {
      document.body.style.cursor = "default";
    }
    return () => {
      document.body.style.cursor = "default";
    };
  }, [isDragging]);

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
