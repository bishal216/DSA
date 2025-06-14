import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { SortingControls } from "../components/sortingControls";

import { useSortVisualization } from "../hooks/useSORTvisualizations";
const SortPage = () => {
  const {
    array,
    generateArray,
    resetArray,
    comparisons,
    swaps,
    arraySize,
    setArraySize,
    algorithm,
    setAlgorithm,
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,
    steps,
    setSteps,
    currentStep,
    setCurrentStep,
    isRunning,
    setIsRunning,
    isPaused,
    startSorting,
    handlePauseResume,
    stepForward,
  } = useSortVisualization(20);

  const baseWidth = useMemo(() => Math.max(1280, window.innerWidth), []);
  const itemWidth = useMemo(
    () => Math.max(baseWidth / array.length - 2, 20),
    [array.length, baseWidth]
  );

  const BarColors = {
    unsorted: "bg-blue-500",
    comparing: "bg-yellow-500",
    swapping: "bg-red-500",
    sorted: "bg-green-500",
  };

  const legendItems = [
    { label: "Unsorted", color: BarColors.unsorted },
    { label: "Comparing", color: BarColors.comparing },
    { label: "Swapping", color: BarColors.swapping },
    { label: "Sorted", color: BarColors.sorted },
  ];

  const getBarColor = (index: number): string => {
    const step = steps[currentStep];
    if (!step) return BarColors.unsorted;

    if (step.sorted?.includes(index)) return BarColors.sorted;
    if (step.comparing?.includes(index)) return BarColors.comparing;
    if (step.swapping?.includes(index)) return BarColors.swapping;

    return BarColors.unsorted;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Sorting Algorithms</h1>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <SortingControls
          generateArray={generateArray}
          resetArray={resetArray}
          comparisons={comparisons}
          swaps={swaps}
          arraySize={arraySize}
          setArraySize={setArraySize}
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          speed={speed}
          setSpeed={setSpeed}
          isStepMode={isStepMode}
          setIsStepMode={setIsStepMode}
          steps={steps}
          setSteps={setSteps}
          currentStep={currentStep}
          setCurrentStep={setCurrentStep}
          isRunning={isRunning}
          setIsRunning={setIsRunning}
          isPaused={isPaused}
          startSorting={startSorting}
          handlePauseResume={handlePauseResume}
          stepForward={stepForward}
        />

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Visualization</CardTitle>
            {steps[currentStep]?.message && (
              <p className="text-sm text-muted-foreground">
                {steps[currentStep].message}
              </p>
            )}
          </CardHeader>
          <CardContent>
            <div className="h-96 flex items-end justify-center space-x-1 p-4 bg-gray-50 rounded-lg">
              {array.length === 0 ? (
                <p className="text-center text-gray-400">
                  Generate an array to begin visualization.
                </p>
              ) : (
                array.map((element, index) => (
                  <div
                    key={`${element.id}-${index}`}
                    className={`transition-all duration-300 ease-in-out rounded-t-sm ${getBarColor(index)}`}
                    style={{
                      height: `${Math.max((element.value / 320) * 100, 5)}%`,
                      width: `${itemWidth}px`,
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
              {legendItems.map(({ label, color }) => (
                <div key={label} className="flex items-center space-x-2">
                  <div className={`w-4 h-4 ${color} rounded`} />
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
