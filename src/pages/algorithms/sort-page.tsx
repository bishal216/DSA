// src/pages/algorithms/sort-page.tsx
import { SortingStep } from "@/algorithms/types/sorting";
import { SortingControls } from "@/components/algorithms/sorting-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSortVisualization } from "@/hooks/use-sort-visualization";
import { useCallback, useMemo } from "react";

const BAR_COLORS = {
  unsorted: "bg-blue-500",
  comparing: "bg-yellow-500",
  swapping: "bg-red-500",
  merging: "bg-orange-500",
  sorted: "bg-green-500",
  activeSublistLeft: "border-4 border-pink-700 mb-12",
  activeSublistRight: "border-4 border-amber-700 mb-12",
} as const;

const LEGEND_ITEMS = [
  { label: "Unsorted", color: BAR_COLORS.unsorted },
  { label: "Comparing", color: BAR_COLORS.comparing },
  { label: "Swapping", color: BAR_COLORS.swapping },
  { label: "Merging", color: BAR_COLORS.merging },
  { label: "Sorted", color: BAR_COLORS.sorted },
  { label: "Active Sublist Left", color: BAR_COLORS.activeSublistLeft },
  { label: "Active Sublist Right", color: BAR_COLORS.activeSublistRight },
];

function getBarBackground(
  index: number,
  step: SortingStep | undefined,
): string {
  if (!step) return BAR_COLORS.unsorted;
  if (step.sorted?.includes(index)) return BAR_COLORS.sorted;
  if (step.comparing?.includes(index)) return BAR_COLORS.comparing;
  if (step.swapping?.includes(index)) return BAR_COLORS.swapping;
  if (step.merging?.includes(index)) return BAR_COLORS.merging;
  return BAR_COLORS.unsorted;
}

function getBarBorder(index: number, step: SortingStep | undefined): string {
  if (!step) return "";
  if (step.activeSublistLeft?.includes(index))
    return BAR_COLORS.activeSublistLeft;
  if (step.activeSublistRight?.includes(index))
    return BAR_COLORS.activeSublistRight;
  return "";
}

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

  const currentStepData = steps[currentStep];

  const barWidthStyle = useMemo(
    () => ({ width: `${Math.max(100 / array.length - 0.25, 0.5)}%` }),
    [array.length],
  );

  const getBackground = useCallback(
    (index: number) => getBarBackground(index, currentStepData),
    [currentStepData],
  );

  const getBorder = useCallback(
    (index: number) => getBarBorder(index, currentStepData),
    [currentStepData],
  );

  // Compose reset/shuffle here so SortingControls stays generic
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

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
            {currentStepData?.message && (
              <p className="text-sm text-muted-foreground">
                {currentStepData.message}
              </p>
            )}
          </CardHeader>

          <CardContent>
            <div className="h-96 flex items-end justify-center gap-px p-4 bg-muted rounded-lg">
              {array.length === 0 ? (
                <p className="text-center text-muted-foreground self-center">
                  Generate an array to begin visualization.
                </p>
              ) : (
                array.map((element, index) => (
                  <div
                    key={`${element.id}-${index}`}
                    className={`transition-all duration-300 ease-in-out rounded-t-sm ${getBackground(index)} ${getBorder(index)}`}
                    style={{
                      height: `${Math.max((element.value / 320) * 100, 5)}%`,
                      ...barWidthStyle,
                    }}
                    title={`Value: ${element.value}, Index: ${index}`}
                  >
                    {array.length <= 20 && (
                      <div className="text-xs text-white font-bold text-center pt-1">
                        {element.value}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              {LEGEND_ITEMS.map(({ label, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`size-4 ${color} rounded`} />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SortPage;
