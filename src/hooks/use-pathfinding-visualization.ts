// src/hooks/use-pathfinding-visualization.ts

import type {
  GraphAlgorithmOptions,
  GraphStep,
  PathfindingStepMetadata,
} from "@/algorithms/types/graph";
import { useGraphEngine } from "@/hooks/use-graph-engine";
import { useGraphManipulation } from "@/hooks/use-graph-manipulation";
import { useCallback, useMemo, useState } from "react";

export const usePathfindingVisualization = () => {
  const manipulation = useGraphManipulation();
  const [speed, setSpeed] = useState<number[]>([50]);
  const [isStepMode, setIsStepMode] = useState(false);
  const [startNodeId, setStartNodeId] = useState<string | undefined>(undefined);
  const [endNodeId, setEndNodeId] = useState<string | undefined>(undefined);

  const engine = useGraphEngine("pathfinding");

  const options: GraphAlgorithmOptions = useMemo(
    () => ({
      startNodeId: startNodeId ?? manipulation.graphData.nodes[0]?.id,
      endNodeId: endNodeId ?? manipulation.graphData.nodes.at(-1)?.id,
    }),
    [startNodeId, endNodeId, manipulation.graphData.nodes],
  );

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

  const currentStepData: GraphStep | undefined =
    engine.steps[engine.currentStep];
  const nodeStates = currentStepData?.nodeStates ?? {};
  const edgeStates = currentStepData?.edgeStates ?? {};
  const metadata = currentStepData?.metadata as
    | PathfindingStepMetadata
    | undefined;

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
    startNodeId,
    setStartNodeId,
    endNodeId,
    setEndNodeId,
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
