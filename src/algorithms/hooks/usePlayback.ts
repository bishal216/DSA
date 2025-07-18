import { useState, useEffect, useCallback, useRef } from "react";

export function usePlayback(totalSteps: number) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const stepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
  }, [totalSteps]);

  const stepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const play = useCallback(() => {
    if (intervalRef.current !== null) return; // prevent double play
    setIsPlaying(true);
    intervalRef.current = window.setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < totalSteps - 1) return prev + 1;
        else {
          stop(); // Stop when last step reached
          return prev;
        }
      });
    }, 800); // change speed if needed
  }, [totalSteps, stop]);

  const reset = useCallback(() => {
    stop();
    setCurrentStep(0);
  }, [stop]);

  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    currentStep,
    setCurrentStep,
    isPlaying,
    setIsPlaying,
    play,
    stop,
    reset,
    stepForward,
    stepBackward,
  };
}
