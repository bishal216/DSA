// src/hooks/use-string-matching-visualization.ts

import type { StringMatchingStep } from "@/algorithms/types/string-matching";
import { useStringMatchingEngine } from "@/hooks/use-string-matching-engine";
import { useCallback, useEffect, useState } from "react";

const DEFAULT_TEXT = "AABAACAADAABAABA";
const DEFAULT_PATTERN = "AABA";

export const useStringMatchingVisualization = () => {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [pattern, setPattern] = useState(DEFAULT_PATTERN);
  const [speed, setSpeed] = useState<number[]>([50]);
  const [isStepMode, setIsStepMode] = useState(false);

  const engine = useStringMatchingEngine();

  // ── Eager generation on mount and algorithm change ────────────────────────
  useEffect(() => {
    if (engine.isRunning) return;
    engine.generateSteps({ text, pattern });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engine.algorithm]);

  // ── Actions ───────────────────────────────────────────────────────────────

  const startVisualization = useCallback(() => {
    engine.clearTimeouts();
    engine.setIsPaused(false);
    const newSteps = engine.generateSteps({ text, pattern });
    if (!isStepMode) {
      engine.startExecuting(newSteps, speed);
    } else {
      engine.setIsRunning(false);
    }
  }, [engine, text, pattern, isStepMode, speed]);

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
    engine.generateSteps({ text, pattern });
  }, [handleStop, engine, text, pattern]);

  // Regenerate when text/pattern change (but not while running)
  const handleTextChange = useCallback(
    (val: string) => {
      setText(val);
      if (!engine.isRunning) {
        engine.generateSteps({ text: val, pattern });
      }
    },
    [engine, pattern],
  );

  const handlePatternChange = useCallback(
    (val: string) => {
      setPattern(val);
      if (!engine.isRunning) {
        engine.generateSteps({ text, pattern: val });
      }
    },
    [engine, text],
  );

  const currentStepData: StringMatchingStep | undefined =
    engine.steps[engine.currentStep];

  return {
    text,
    pattern,
    handleTextChange,
    handlePatternChange,
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
    currentStepData,
    startVisualization,
    handlePauseResume,
    handleStop,
    handleReset,
    stepForward: engine.stepForward,
    stepBackward: engine.stepBackward,
  };
};
