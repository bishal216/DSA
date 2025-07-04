import { SortingAlgorithmKey } from "@/algorithms/types/sortingAlgorithms";
import { SortingStep } from "@/algorithms/types/sorting";
export interface SortingControlsProps {
  // Set Algorithm
  algorithm: SortingAlgorithmKey;
  setAlgorithm: (val: SortingAlgorithmKey) => void;
  // Generate a new random array on array size change
  arraySize: number;
  setArraySize: (val: number) => void;
  //   Speed control
  speed: number[];
  setSpeed: (val: number[]) => void;
  // Toggle step mode
  isStepMode: boolean;
  setIsStepMode: (val: boolean) => void;

  //   start Sorting on start button click
  startSorting: () => void;
  //   Toggle pause/resume
  handlePauseResume: () => void;
  //   Reset the array and steps
  resetArray: () => void;

  //  Generate a new random array
  generateArray: () => void;

  //   Counters
  comparisons: number;
  swaps: number;

  //   For step mode
  steps: SortingStep[];
  setSteps: (steps: SortingStep[]) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  //   Engine state
  isRunning: boolean;
  setIsRunning: (val: boolean) => void;
  isPaused: boolean;
  stepForward: (steps: number) => void;
}
