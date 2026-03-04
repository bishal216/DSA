// src/pages/algorithms/sort-page.tsx

import { SortVisualizer } from "@/components/algorithms/sort-visualizer";
import { SortingControls } from "@/components/controls/sorting-control";
import { useSortVisualization } from "@/hooks/use-sort-visualization";
import { useCallback } from "react";

interface SortPageProps {
  title: string;
}

const SortPage = ({ title }: SortPageProps) => {
  const {
    array,
    generateArray,
    resetArray,
    comparisons,
    swaps,
    setCustomArray,
    arraySize,
    setArraySize,
    algorithm,
    setAlgorithm,
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,
    steps,
    currentStep,
    isRunning,
    isPaused,
    startSorting,
    handlePauseResume,
    handleStopSorting,
    stepForward,
  } = useSortVisualization(20);

  const handleReset = useCallback(() => {
    handleStopSorting();
    resetArray();
  }, [handleStopSorting, resetArray]);

  const handleShuffle = useCallback(() => {
    handleStopSorting();
    generateArray();
  }, [handleStopSorting, generateArray]);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SortingControls
          arraySize={arraySize}
          setArraySize={setArraySize}
          onReset={handleReset}
          onShuffle={handleShuffle}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          speed={speed}
          setSpeed={setSpeed}
          isStepMode={isStepMode}
          setIsStepMode={setIsStepMode}
          steps={steps}
          currentStep={currentStep}
          isRunning={isRunning}
          isPaused={isPaused}
          comparisons={comparisons}
          swaps={swaps}
          startSorting={startSorting}
          handlePauseResume={handlePauseResume}
          stepForward={stepForward}
          setCustomArray={setCustomArray}
        />

        <SortVisualizer array={array} steps={steps} currentStep={currentStep} />
      </div>
    </div>
  );
};

export default SortPage;
