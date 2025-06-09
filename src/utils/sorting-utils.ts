import { SortingStep, StepType } from "@/types/sorting";
export const stepCount = (steps: SortingStep[], stepType: StepType): number => {
  return steps.reduce((count, step) => {
    if (step.stepType === stepType) {
      if (step.comparing) {
        count += step.comparing.length;
      }
      if (step.swapping) {
        count += step.swapping.length;
      }
    }
    return count;
  }, 0);
};
