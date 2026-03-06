import type { Edge, Node } from "@/algorithms/types/graph";
import {
  EMPTY_GRAPH_DS_STEP,
  GraphDSStep,
  GraphDSSteps,
  GraphVariant,
} from "@/data-structures/graph-ds";
import { useGraph } from "@/hooks/use-graph";
import { useCallback, useEffect, useRef, useState } from "react";

export type GraphDSOperation =
  | "addNode"
  | "addEdge"
  | "removeNode"
  | "removeEdge";

let _nodeSeq = 0;
function nextNodeId() {
  return `n${++_nodeSeq}`;
}

function nextLabel(existing: string[]): string {
  const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (const c of alpha) if (!existing.includes(c)) return c;
  return `V${existing.length}`;
}

// Place new node on a circle around canvas centre
function circlePosition(count: number, W = 500, H = 340) {
  if (count === 0) return { x: W / 2, y: H / 2 };
  const cx = W / 2,
    cy = H / 2;
  const r = Math.min(W, H) * 0.36;
  const total = Math.max(count + 1, 6);
  const angle = -Math.PI / 2 + (2 * Math.PI * count) / total;
  return {
    x: Math.round(cx + r * Math.cos(angle)),
    y: Math.round(cy + r * Math.sin(angle)),
  };
}

export function useGraphDS(variant: GraphVariant = "undirected") {
  const directed = variant !== "undirected";
  const weighted = variant === "weighted";

  // Reuse existing graph state hook — it owns all mutations
  const {
    graphData,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    clearGraph,
    updateNodePosition,
  } = useGraph();

  // Form state
  const [nodeLabel, setNodeLabel] = useState("A");
  const [fromLabel, setFromLabel] = useState("");
  const [toLabel, setToLabel] = useState("");
  const [weightValue, setWeightValue] = useState("1");

  // Playback state
  const [steps, setSteps] = useState<GraphDSStep[]>([
    EMPTY_GRAPH_DS_STEP(directed, weighted),
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [speed, setSpeed] = useState([600]);
  const [currentOp, setCurrentOp] = useState<GraphDSOperation | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const graphRef = useRef(graphData);
  graphRef.current = graphData;

  // Pending mutation to commit after animation ends
  const pendingRef = useRef<{
    op: GraphDSOperation;
    node?: Node;
    edge?: Edge;
  } | null>(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const findNodeByLabel = useCallback(
    (label: string) =>
      graphRef.current.nodes.find((n) => n.label === label.trim()),
    [],
  );

  const findEdge = useCallback(
    (fromId: string, toId: string) =>
      graphRef.current.edges.find(
        (e) =>
          (e.from === fromId && e.to === toId) ||
          (!directed && e.from === toId && e.to === fromId),
      ),
    [directed],
  );

  // ── Apply committed mutation ──────────────────────────────────────────────────

  const applyPending = useCallback(() => {
    const p = pendingRef.current;
    if (!p) return;
    if (p.op === "addNode" && p.node) addNode(p.node);
    if (p.op === "addEdge" && p.edge) addEdge(p.edge);
    if (p.op === "removeNode" && p.node) removeNode(p.node.id);
    if (p.op === "removeEdge" && p.edge) removeEdge(p.edge.id);
    pendingRef.current = null;
  }, [addNode, addEdge, removeNode, removeEdge]);

  // ── Animation runner ─────────────────────────────────────────────────────────

  const runAnimation = useCallback(
    (newSteps: GraphDSStep[]) => {
      setIsRunning(true);
      setIsPaused(false);
      let step = 0;
      intervalRef.current = setInterval(() => {
        step++;
        if (step >= newSteps.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(newSteps.length - 1);
          applyPending();
          return;
        }
        setCurrentStep(step);
      }, speed[0]);
    },
    [speed, clearTimer, applyPending],
  );

  // ── Start operation ──────────────────────────────────────────────────────────

  const onStart = useCallback(
    (op: GraphDSOperation) => {
      clearTimer();
      const g = graphRef.current;
      let newSteps: GraphDSStep[] = [];

      if (op === "addNode") {
        const label =
          nodeLabel.trim() || nextLabel(g.nodes.map((n) => n.label));
        const id = nextNodeId();
        const pos = circlePosition(g.nodes.length);
        const node: Node = { id, label, ...pos };
        pendingRef.current = { op, node };
        newSteps = GraphDSSteps.addNode(g, directed, weighted, node);
      }

      if (op === "removeNode") {
        const node = findNodeByLabel(nodeLabel);
        if (!node) {
          newSteps = [
            {
              ...EMPTY_GRAPH_DS_STEP(directed, weighted),
              message: `Vertex "${nodeLabel}" not found`,
              isMajorStep: true,
            },
          ];
        } else {
          pendingRef.current = { op, node };
          newSteps = GraphDSSteps.removeNode(g, directed, weighted, node.id);
        }
      }

      if (op === "addEdge") {
        const from = findNodeByLabel(fromLabel);
        const to = findNodeByLabel(toLabel);
        if (!from || !to) {
          newSteps = [
            {
              ...EMPTY_GRAPH_DS_STEP(directed, weighted),
              message: `Vertex not found`,
              isMajorStep: true,
            },
          ];
        } else {
          const w = weighted ? Number(weightValue) || 1 : 1;
          const edge: Edge = {
            id: `${from.id}-${to.id}`,
            from: from.id,
            to: to.id,
            weight: w,
          };
          pendingRef.current = { op, edge };
          newSteps = GraphDSSteps.addEdge(g, directed, weighted, edge);
        }
      }

      if (op === "removeEdge") {
        const from = findNodeByLabel(fromLabel);
        const to = findNodeByLabel(toLabel);
        const edge = from && to ? findEdge(from.id, to.id) : undefined;
        if (!edge) {
          newSteps = [
            {
              ...EMPTY_GRAPH_DS_STEP(directed, weighted),
              message: `Edge not found`,
              isMajorStep: true,
            },
          ];
        } else {
          pendingRef.current = { op, edge };
          newSteps = GraphDSSteps.removeEdge(g, directed, weighted, edge.id);
        }
      }

      setSteps(newSteps);
      setCurrentStep(0);
      setCurrentOp(op);
      if (!isStepMode) runAnimation(newSteps);
    },
    [
      nodeLabel,
      fromLabel,
      toLabel,
      weightValue,
      directed,
      weighted,
      clearTimer,
      isStepMode,
      runAnimation,
      findNodeByLabel,
      findEdge,
    ],
  );

  // ── Playback controls ────────────────────────────────────────────────────────

  const onPauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      let step = currentStep;
      intervalRef.current = setInterval(() => {
        step++;
        if (step >= stepsRef.current.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(stepsRef.current.length - 1);
          applyPending();
          return;
        }
        setCurrentStep(step);
      }, speed[0]);
    } else {
      clearTimer();
      setIsPaused(true);
      setIsRunning(false);
    }
  }, [isPaused, currentStep, speed, clearTimer, applyPending]);

  const onStepForward = useCallback(() => {
    const total = stepsRef.current.length;
    if (currentStep < total - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === total - 1) applyPending();
    }
  }, [currentStep, applyPending]);

  const onStepBackward = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const reset = useCallback(() => {
    clearTimer();
    _nodeSeq = 0;
    clearGraph();
    setSteps([EMPTY_GRAPH_DS_STEP(directed, weighted)]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentOp(null);
    pendingRef.current = null;
  }, [clearTimer, clearGraph, directed, weighted]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  // Auto-advance node label suggestion
  useEffect(() => {
    const existing = graphData.nodes.map((n) => n.label);
    setNodeLabel(nextLabel(existing));
  }, [graphData.nodes]);

  const displayStep =
    steps[currentStep] ?? EMPTY_GRAPH_DS_STEP(directed, weighted);
  const nodeLabels = graphData.nodes.map((n) => n.label);

  return {
    graphData,
    nodeLabel,
    setNodeLabel,
    fromLabel,
    setFromLabel,
    toLabel,
    setToLabel,
    weightValue,
    setWeightValue,
    steps,
    currentStep,
    isRunning,
    isPaused,
    isStepMode,
    setIsStepMode,
    speed,
    setSpeed,
    currentOp,
    displayStep,
    nodeLabels,
    onStart,
    onPauseResume,
    onStepForward,
    onStepBackward,
    reset,
    onNodeMove: updateNodePosition,
  };
}
