// src/pages/algorithms/StringMatchingPage.tsx

import StringMatchingMetadataDisplay from "@/components/algorithms/string-matching-metadata-display";
import StringMatchingVisualizer from "@/components/algorithms/string-matching-visualizer";
import StringMatchingControls from "@/components/controls/string-matching-controls";
import { useStringMatchingVisualization } from "@/hooks/use-string-matching-visualization";

interface StringMatchingPageProps {
  title: string;
}

export default function StringMatchingPage({ title }: StringMatchingPageProps) {
  const {
    text,
    pattern,
    handleTextChange,
    handlePatternChange,
    algorithm,
    setAlgorithm,
    steps,
    currentStep,
    isRunning,
    isPaused,
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,
    currentStepData,
    startVisualization,
    handlePauseResume,
    stepForward,
    stepBackward,
  } = useStringMatchingVisualization();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <StringMatchingControls
          text={text}
          pattern={pattern}
          onTextChange={handleTextChange}
          onPatternChange={handlePatternChange}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          steps={steps}
          currentStep={currentStep}
          isRunning={isRunning}
          isPaused={isPaused}
          speed={speed}
          setSpeed={setSpeed}
          isStepMode={isStepMode}
          setIsStepMode={setIsStepMode}
          onStart={startVisualization}
          onPauseResume={handlePauseResume}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
        />

        <div className="lg:col-span-3 space-y-4">
          <StringMatchingVisualizer
            text={text}
            pattern={pattern}
            step={currentStepData}
          />
          <StringMatchingMetadataDisplay
            step={currentStepData}
            algorithm={algorithm}
            pattern={pattern}
          />
        </div>
      </div>
    </div>
  );
}
