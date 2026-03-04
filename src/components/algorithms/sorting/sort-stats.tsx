// src/components/algorithms/SortStats.tsx
import { SortingStep } from "@/algorithms/types/sorting";
import React from "react";

interface SortStatsProps {
  comparisons: number;
  swaps: number;
  // Optional — only shown in step mode
  steps?: SortingStep[];
  currentStep?: number;
}

export const SortStats: React.FC<SortStatsProps> = ({
  comparisons,
  swaps,
  steps,
  currentStep,
}) => {
  const showStepCounter =
    steps !== undefined && currentStep !== undefined && steps.length > 0;

  return (
    <div className="rounded-md border border-border divide-y divide-border">
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs text-muted-foreground">Comparisons</span>
        <span className="text-xs font-mono font-semibold tabular-nums">
          {comparisons.toLocaleString()}
        </span>
      </div>
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs text-muted-foreground">Swaps</span>
        <span className="text-xs font-mono font-semibold tabular-nums">
          {swaps.toLocaleString()}
        </span>
      </div>
      {showStepCounter && (
        <div className="flex items-center justify-between px-3 py-2">
          <span className="text-xs text-muted-foreground">Step</span>
          <span className="text-xs font-mono font-semibold tabular-nums">
            {currentStep + 1}
            <span className="text-muted-foreground font-normal">
              {" "}
              / {steps.length}
            </span>
          </span>
        </div>
      )}
    </div>
  );
};
