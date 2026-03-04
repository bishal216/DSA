// src/hooks/use-mst-visualization.ts

import type {
  GraphAlgorithmOptions,
  GraphStep,
  MSTStepMetadata,
} from "@/algorithms/types/graph";
import { useGraphEngine } from "@/hooks/use-graph-engine";
import { useGraphManipulation } from "@/hooks/use-graph-manipulation";
import { useCallback, useMemo, useState } from "react";

export const useMSTVisualization = () => {
  const manipulation = useGraphManipulation();
  const [speed, setSpeed] = useState<number[]>([50]);
  const [isStepMode, setIsStepMode] = useState(false);
  const [startNodeId, setStartNodeId] = useState<string | undefined>(undefined);

  const engine = useGraphEngine("mst");

  // ── Options ───────────────────────────────────────────────────────────────
  // startNodeId only matters for Prim — other algorithms ignore it

  const options: GraphAlgorithmOptions = useMemo(
    () => ({ startNodeId: startNodeId ?? manipulation.graphData.nodes[0]?.id }),
    [startNodeId, manipulation.graphData.nodes],
  );

  // ── Actions ───────────────────────────────────────────────────────────────

  const startVisualization = useCallback(() => {
    engine.clearTimeouts();
    engine.setIsPaused(false);
    const newSteps = engine.generateSteps(manipulation.graphData, options);
    if (!isStepMode) {
      engine.startExecuting(newSteps, speed);
    } else {
      engine.setIsRunning(false);
    }
  }, [engine, manipulation.graphData, options, isStepMode, speed]);

  const handlePauseResume = useCallback(() => {
    engine.pauseResume(speed);
  }, [engine, speed]);

  const handleStop = useCallback(() => {
    engine.clearTimeouts();
    engine.setIsRunning(false);
    engine.setIsPaused(false);
  }, [engine]);

  const handleReset = useCallback(() => {
    handleStop();
    engine.generateSteps(manipulation.graphData, options);
  }, [handleStop, engine, manipulation.graphData, options]);

  // ── Derived state maps for GraphCanvas ───────────────────────────────────

  const currentStepData: GraphStep | undefined =
    engine.steps[engine.currentStep];

  const nodeStates = currentStepData?.nodeStates ?? {};
  const edgeStates = currentStepData?.edgeStates ?? {};

  // ── MST metadata for StepDisplay ─────────────────────────────────────────

  const metadata = currentStepData?.metadata as MSTStepMetadata | undefined;

  return {
    // graph manipulation
    ...manipulation,

    // engine state
    algorithm: engine.algorithm,
    setAlgorithm: engine.setAlgorithm,
    steps: engine.steps,
    currentStep: engine.currentStep,
    isRunning: engine.isRunning,
    isPaused: engine.isPaused,

    // playback config
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,

    // prim start node
    startNodeId,
    setStartNodeId,

    // canvas
    nodeStates,
    edgeStates,

    // step display
    currentStepData,
    metadata,

    // actions
    startVisualization,
    handlePauseResume,
    handleStop,
    handleReset,
    stepForward: engine.stepForward,
    stepBackward: engine.stepBackward,
  };
};
