import { SortingStep, StepType } from "@/algorithms/types/sorting";
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

// Color scheme
export const colors = {
  // General colors
  defaultNode: "#374151", // Slate gray
  defaultEdge: "rgba(107, 114, 128, 0.5)", // Muted slate gray

  candidateNode: "#FBBF24", // Amber-400
  candidateEdge: "#F59E0B", // Amber-500

  currentNode: "#F59E0B", // Amber-500
  currentEdge: "#FBBF24", // Amber-400

  visitedNode: "#10B981", // Emerald-500
  visitedEdge: "#6EE7B7", // Emerald-300

  rejectedNode: "#EF4444", // Red-500
  rejectedEdge: "#F87171", // Red-400

  // Extras
  draggingNode: "#A855F7", // Purple-500
  text: "#F9FAFB", // Gray-50 (soft white)
  weightBg: "#1F2937", // Gray-800 (dark background)
};
