// src/components/graph/GraphCanvas.tsx

import type {
  EdgeState,
  GraphCanvasProps,
  NodeState,
} from "@/algorithms/types/graph";
import React, { useCallback, useEffect, useRef, useState } from "react";

// ── Color maps (inlined to avoid unsafe access on untyped colors object) ──────

const NODE_COLOR: Record<NodeState, string> = {
  default: "#374151",
  visited: "#10B981",
  current: "#F59E0B",
  candidate: "#FBBF24",
  rejected: "#EF4444",
  component: "#8B5CF6",
};

const EDGE_COLOR: Record<EdgeState, string> = {
  default: "rgba(107, 114, 128, 0.5)",
  tree: "#6EE7B7",
  current: "#FBBF24",
  candidate: "#F59E0B",
  rejected: "#F87171",
  back: "#EF4444",
  cross: "#8B5CF6",
  forward: "#F59E0B",
};

const C_WEIGHT_BG = "#1F2937";
const C_TEXT = "#F9FAFB";
const C_DRAGGING = "#A855F7";

const EDGE_WIDTH: Record<EdgeState, number> = {
  default: 2,
  tree: 3,
  current: 4,
  candidate: 3,
  rejected: 1,
  back: 2,
  cross: 2,
  forward: 2,
};

const NODE_RADIUS = 20;

// ── Component ─────────────────────────────────────────────────────────────────

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  nodeStates,
  edgeStates,
  onNodeMove,
  directed = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [dragNodeId, setDragNodeId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const clamp = (val: number, min: number, max: number) =>
    Math.max(min, Math.min(max, val));

  // ── Draw ───────────────────────────────────────────────────────────────────

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

    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.clearRect(0, 0, w, h);

    // Clamp nodes to canvas bounds
    for (const node of graph.nodes) {
      const cx = clamp(node.x, NODE_RADIUS, w - NODE_RADIUS);
      const cy = clamp(node.y, NODE_RADIUS, h - NODE_RADIUS);
      if (cx !== node.x || cy !== node.y) {
        node.x = cx;
        node.y = cy;
        onNodeMove(node.id, cx, cy);
      }
    }

    // ── Edges ────────────────────────────────────────────────────────────────
    for (const edge of graph.edges) {
      const from = graph.nodes.find((n) => n.id === edge.from);
      const to = graph.nodes.find((n) => n.id === edge.to);
      if (!from || !to) continue;

      const state: EdgeState = edgeStates[edge.id] ?? "default";
      const strokeStyle = EDGE_COLOR[state];
      const lineWidth = EDGE_WIDTH[state];

      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      // Stop line at node circumference so arrowhead sits cleanly
      const toX = to.x - Math.cos(angle) * NODE_RADIUS;
      const toY = to.y - Math.sin(angle) * NODE_RADIUS;
      const fromX = from.x + Math.cos(angle) * NODE_RADIUS;
      const fromY = from.y + Math.sin(angle) * NODE_RADIUS;

      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = lineWidth;
      ctx.stroke();

      // Arrowhead (directed graphs only)
      if (directed) {
        const arrowLen = 10;
        const arrowAngle = 0.45;
        ctx.beginPath();
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowLen * Math.cos(angle - arrowAngle),
          toY - arrowLen * Math.sin(angle - arrowAngle),
        );
        ctx.moveTo(toX, toY);
        ctx.lineTo(
          toX - arrowLen * Math.cos(angle + arrowAngle),
          toY - arrowLen * Math.sin(angle + arrowAngle),
        );
        ctx.strokeStyle = strokeStyle;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
      }

      // Weight label
      const midX = (from.x + to.x) / 2;
      const midY = (from.y + to.y) / 2;
      ctx.fillStyle = C_WEIGHT_BG;
      ctx.fillRect(midX - 12, midY - 8, 24, 16);
      ctx.fillStyle = C_TEXT;
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(edge.weight.toString(), midX, midY);
    }

    // ── Nodes ─────────────────────────────────────────────────────────────────
    for (const node of graph.nodes) {
      const state: NodeState =
        dragNodeId === node.id ? "current" : (nodeStates[node.id] ?? "default");

      ctx.beginPath();
      ctx.arc(node.x, node.y, NODE_RADIUS, 0, 2 * Math.PI);
      ctx.fillStyle = dragNodeId === node.id ? C_DRAGGING : NODE_COLOR[state];
      ctx.fill();
      ctx.strokeStyle = C_TEXT;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = C_TEXT;
      ctx.font = "bold 14px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.label, node.x, node.y);
    }
  }, [graph, nodeStates, edgeStates, dragNodeId, onNodeMove, directed]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => drawGraph());
    ro.observe(container);
    return () => ro.disconnect();
  }, [drawGraph]);

  // ── Position helpers ──────────────────────────────────────────────────────

  const getCanvasPos = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    return {
      x: ((clientX - rect.left) * (canvas.width / rect.width)) / dpr,
      y: ((clientY - rect.top) * (canvas.height / rect.height)) / dpr,
    };
  }, []);

  const getNodeAt = (x: number, y: number) =>
    graph.nodes.find((n) => Math.hypot(n.x - x, n.y - y) <= NODE_RADIUS) ??
    null;

  // ── Drag helpers ──────────────────────────────────────────────────────────

  const startDrag = (id: string, ox: number, oy: number) => {
    setIsDragging(true);
    setDragNodeId(id);
    setDragOffset({ x: ox, y: oy });
  };

  const stopDrag = () => {
    setIsDragging(false);
    setDragNodeId(null);
    setDragOffset({ x: 0, y: 0 });
  };

  const applyDrag = (clientX: number, clientY: number) => {
    if (!isDragging || !dragNodeId) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const { x, y } = getCanvasPos(clientX, clientY);
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    onNodeMove(
      dragNodeId,
      clamp(x - dragOffset.x, NODE_RADIUS, w - NODE_RADIUS),
      clamp(y - dragOffset.y, NODE_RADIUS, h - NODE_RADIUS),
    );
  };

  // ── Mouse events ──────────────────────────────────────────────────────────

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getCanvasPos(e.clientX, e.clientY);
    const node = getNodeAt(x, y);
    if (node) startDrag(node.id, x - node.x, y - node.y);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    applyDrag(e.clientX, e.clientY);
  };

  // ── Touch events ──────────────────────────────────────────────────────────

  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const t = e.touches[0];
    if (!t) return;
    const { x, y } = getCanvasPos(t.clientX, t.clientY);
    const node = getNodeAt(x, y);
    if (node) startDrag(node.id, x - node.x, y - node.y);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const t = e.touches[0];
    if (t) applyDrag(t.clientX, t.clientY);
  };

  // ── Global mouse events (drag outside canvas) ─────────────────────────────

  useEffect(() => {
    if (!isDragging) return;
    const move = (e: MouseEvent) => applyDrag(e.clientX, e.clientY);
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", stopDrag);
    return () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", stopDrag);
    };
  }, [isDragging, dragNodeId, dragOffset]); // eslint-disable-line react-hooks/exhaustive-deps

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
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={stopDrag}
        onTouchCancel={stopDrag}
        className="absolute inset-0 w-full h-full"
        role="img"
        aria-label="Graph visualization"
      />
    </div>
  );
};

export default GraphCanvas;
