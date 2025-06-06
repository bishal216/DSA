import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/utils/iconmap";
import { toast } from "react-hot-toast";
import {
  ArrayElement,
  SortingStep,
  ComparisonSortingAlgorithm,
} from "@/types/types";

import {
  bubbleSort,
  selectionSort,
  insertionSort,
  cocktailSort,
  shellSort,
  gnomeSort,
  combSort,
  oddEvenSort,
  pancakeSort,
  stoogeSort,
} from "@/utils/sorts/comparison-sort";

const ComparisonSort = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [originalArray, setOriginalArray] = useState<ArrayElement[]>([]);
  const [arraySize, setArraySize] = useState([20]);
  const [speed, setSpeed] = useState([50]);
  const [algorithm, setAlgorithm] =
    useState<ComparisonSortingAlgorithm>("bubble");
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const isRunningRef = useRef(isRunning);
  const isPausedRef = useRef(isPaused);

  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = [];
    for (let i = 0; i < arraySize[0]; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 300) + 10,
        id: i,
      });
    }
    setArray(newArray);
    setOriginalArray([...newArray]);
    setSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setSwaps(0);
  }, [arraySize]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  const resetArray = () => {
    // Stop any running animation
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Create a fresh copy of the original array with clean state
    const resetArray = originalArray.map((element, index) => ({
      value: element.value,
      id: index, // Ensure consistent IDs
    }));

    setArray(resetArray);
    setSteps([]);
    setCurrentStep(0);
    setComparisons(0);
    setSwaps(0);
    setIsRunning(false);
    setIsPaused(false);
  };

  const generateSteps = (
    algorithm: ComparisonSortingAlgorithm
  ): SortingStep[] => {
    switch (algorithm) {
      case "bubble":
        return bubbleSort(array);
      case "selection":
        return selectionSort(array);
      case "insertion":
        return insertionSort(array);
      case "cocktail":
        return cocktailSort(array);
      case "shell":
        return shellSort(array);
      case "gnome":
        return gnomeSort(array);
      case "comb":
        return combSort(array);
      case "oddEven":
        return oddEvenSort(array);
      case "pancake":
        return pancakeSort(array);
      case "stooge":
        return stoogeSort(array);
      default:
        return bubbleSort(array);
    }
  };

  const startSorting = () => {
    if (isStepMode) {
      const newSteps = generateSteps(algorithm);
      setSteps(newSteps);
      setCurrentStep(0);
      toast.success("Step mode activated. Use step buttons to navigate.");
    } else {
      setIsRunning(true);
      setIsPaused(false);
      const newSteps = generateSteps(algorithm);
      setSteps(newSteps);
      setCurrentStep(0);
      executeSteps(newSteps, 0);
      toast.loading("Starting sorting...");
    }
  };

  const executeSteps = (steps: SortingStep[], stepIndex: number) => {
    if (stepIndex >= steps.length) {
      toast.success("Sorting completed!");
      setIsRunning(false);
      setIsPaused(false);
      return;
    }

    const step = steps[stepIndex];
    setArray([...step.array]);
    setCurrentStep(stepIndex);

    if (step.message) {
      if (step.comparing) setComparisons((prev) => prev + 1);
      if (step.swapping) setSwaps((prev) => prev + 1);
    }

    const delay = 1000 - speed[0] * 10;
    timeoutRef.current = setTimeout(() => {
      if (isRunningRef.current && !isPausedRef.current) {
        executeSteps(steps, stepIndex + 1);
      } else {
        if (!isRunningRef.current) {
          toast.error("Sorting stopped by user.");
        } else {
          toast.success(`Execution paused or stopped at step ${stepIndex + 1}`);
        }
      }
    }, delay);
  };

  const pauseResume = () => {
    if (isPaused) {
      setIsPaused(false);
      // Continue from the next step
      executeSteps(steps, currentStep + 1);
    } else {
      setIsPaused(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const stepForward = (stepCount: number = 1) => {
    if (steps.length === 0) {
      const newSteps = generateSteps(algorithm);
      setSteps(newSteps);
    }

    const newStep = Math.min(currentStep + stepCount, steps.length - 1);
    setCurrentStep(newStep);

    if (steps[newStep]) {
      setArray([...steps[newStep].array]);

      let newComparisons = 0;
      let newSwaps = 0;
      for (let i = 0; i <= newStep; i++) {
        if (steps[i].comparing) newComparisons++;
        if (steps[i].swapping) newSwaps++;
      }
      setComparisons(newComparisons);
      setSwaps(newSwaps);
    }
  };

  const getBarColor = (element: ArrayElement, index: number) => {
    // console.log(element);
    const step = steps[currentStep];
    if (!step) return "bg-blue-500";

    if (step.sorted?.includes(index)) return "bg-green-500";
    if (step.pivot === index) return "bg-purple-500";
    if (step.comparing?.includes(index)) return "bg-yellow-500";
    if (step.swapping?.includes(index)) return "bg-red-500";

    return "bg-blue-500";
  };

  const baseWidth: number = Math.max(1280, window.innerWidth);
  const itemWidth: number = Math.max(baseWidth / array.length - 2, 20);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Algorithm</label>
              <Select
                value={algorithm}
                onValueChange={(value: ComparisonSortingAlgorithm) =>
                  setAlgorithm(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bubble">Bubble Sort</SelectItem>
                  <SelectItem value="selection">Selection Sort</SelectItem>
                  <SelectItem value="insertion">Insertion Sort</SelectItem>
                  <SelectItem value="cocktail">Cocktail Sort</SelectItem>
                  <SelectItem value="shell">Shell Sort</SelectItem>
                  <SelectItem value="gnome">Gnome Sort</SelectItem>
                  <SelectItem value="comb">Comb Sort</SelectItem>
                  <SelectItem value="oddEven">Odd-Even Sort</SelectItem>
                  <SelectItem value="pancake">Pancake Sort</SelectItem>
                  <SelectItem value="stooge">Stooge Sort</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Array Size: {arraySize[0]}
              </label>
              <Slider
                value={arraySize}
                onValueChange={setArraySize}
                min={5}
                max={50}
                step={1}
                className="mt-2"
                disabled={isRunning}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Speed: {speed[0]}%</label>
              <Slider
                value={speed}
                onValueChange={setSpeed}
                min={1}
                max={100}
                step={1}
                className="mt-2"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="stepMode"
                checked={isStepMode}
                onChange={(e) => setIsStepMode(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="stepMode" className="text-sm font-medium">
                Step Mode
              </label>
            </div>

            <div className="space-y-2">
              {!isStepMode ? (
                <div className="flex space-x-2">
                  <Button
                    onClick={startSorting}
                    disabled={isRunning && !isPaused}
                    className="flex-1"
                    variant="outline"
                  >
                    <iconMap.Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                  {(isRunning || isPaused) && (
                    <Button onClick={pauseResume} variant="outline">
                      {isPaused ? (
                        <iconMap.Play className="w-4 h-4" />
                      ) : (
                        <iconMap.Pause className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <Button
                    onClick={startSorting}
                    className="w-full"
                    variant={"outline"}
                  >
                    <iconMap.Play className="w-4 h-4 mr-2" />
                    Prepare Steps
                  </Button>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => stepForward(1)}
                      disabled={currentStep >= steps.length - 1}
                      variant="outline"
                      className="flex-1"
                    >
                      +1 Step
                    </Button>
                    <Button
                      onClick={() => stepForward(10)}
                      disabled={currentStep >= steps.length - 1}
                      variant="outline"
                      className="flex-1"
                    >
                      +10 Steps
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <Button
                  onClick={resetArray}
                  variant="outline"
                  className="flex-1"
                >
                  <iconMap.RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
                <Button
                  onClick={generateArray}
                  variant="outline"
                  className="flex-1"
                >
                  <iconMap.Shuffle className="w-4 h-4 mr-2" />
                  Shuffle
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Comparisons:</span>
                <Badge variant="secondary">{comparisons}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Swaps:</span>
                <Badge variant="secondary">{swaps}</Badge>
              </div>
              {isStepMode && steps.length > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm">Step:</span>
                  <Badge variant="secondary">
                    {currentStep + 1}/{steps.length}
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

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
              {array.map((element, index) => (
                <div
                  key={`${element.id}-${index}`}
                  className={`transition-all duration-300 rounded-t-sm ${getBarColor(element, index)}`}
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
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Unsorted</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                <span>Comparing</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-500 rounded"></div>
                <span>Swapping</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span>Sorted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ComparisonSort;
