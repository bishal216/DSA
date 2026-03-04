// src/hooks/use-scc-visualization.ts

import type { GraphStep, SCCStepMetadata } from "@/algorithms/types/graph";
import { useGraphEngine } from "@/hooks/use-graph-engine";
import { useGraphManipulation } from "@/hooks/use-graph-manipulation";
import { useCallback, useState } from "react";

export const useSCCVisualization = () => {
  const manipulation = useGraphManipulation();
  const [speed, setSpeed] = useState<number[]>([50]);
  const [isStepMode, setIsStepMode] = useState(false);

  const engine = useGraphEngine("scc");

  // SCC takes no start/end options — runs on the whole graph
  const startVisualization = useCallback(() => {
    engine.clearTimeouts();
    engine.setIsPaused(false);
    const newSteps = engine.generateSteps(manipulation.graphData);
    if (!isStepMode) {
      engine.startExecuting(newSteps, speed);
    } else {
      engine.setIsRunning(false);
    }
  }, [engine, manipulation.graphData, isStepMode, speed]);

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
    engine.generateSteps(manipulation.graphData);
  }, [handleStop, engine, manipulation.graphData]);

  const currentStepData: GraphStep | undefined =
    engine.steps[engine.currentStep];
  const nodeStates = currentStepData?.nodeStates ?? {};
  const edgeStates = currentStepData?.edgeStates ?? {};
  const metadata = currentStepData?.metadata as SCCStepMetadata | undefined;

  return {
    ...manipulation,
    algorithm: engine.algorithm,
    setAlgorithm: engine.setAlgorithm,
    steps: engine.steps,
    currentStep: engine.currentStep,
    isRunning: engine.isRunning,
    isPaused: engine.isPaused,
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,
    nodeStates,
    edgeStates,
    currentStepData,
    metadata,
    startVisualization,
    handlePauseResume,
    handleStop,
    handleReset,
    stepForward: engine.stepForward,
    stepBackward: engine.stepBackward,
  };
};
