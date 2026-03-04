// src/components/search/SearchVisualizer.tsx

import type { SearchStep } from "@/algorithms/types/searching";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/helpers";

// ── Cell state ────────────────────────────────────────────────────────────────
type CellState = "found" | "current" | "visited" | "eliminated" | "default";

function getCellState(
  index: number,
  step: SearchStep | undefined,
  algorithm: string,
): CellState {
  if (!step) return "default";
  if (step.foundIndex === index) return "found";
  if (step.currentIndex === index && step.foundIndex === -1) return "current";
  if (step.visitedIndices.includes(index) && step.foundIndex === -1)
    return "visited";
  if (
    algorithm === "binary" &&
    step.eliminatedIndices.includes(index) &&
    step.foundIndex === -1
  )
    return "eliminated";
  return "default";
}

const CELL_CLASSES: Record<CellState, string> = {
  found: "bg-emerald-500 border-emerald-600 text-white scale-110",
  current: "bg-yellow-400  border-yellow-500  text-black scale-105",
  visited: "bg-red-200     border-red-300     text-red-800",
  eliminated: "bg-gray-300    border-gray-400    text-gray-500 opacity-50",
  default: "bg-card        border-border      text-foreground",
};

// ── Legend ────────────────────────────────────────────────────────────────────
const BASE_LEGEND = [
  { label: "Current", className: "bg-yellow-400 border-yellow-500" },
  { label: "Visited", className: "bg-red-200 border-red-300" },
  { label: "Found", className: "bg-emerald-500 border-emerald-600" },
];

const BINARY_LEGEND = [
  { label: "Eliminated", className: "bg-gray-300 border-gray-400 opacity-50" },
];

// ── Props ─────────────────────────────────────────────────────────────────────
interface SearchVisualizerProps {
  array: number[];
  steps: SearchStep[];
  currentStep: number;
  algorithm: string;
  searchValue: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function SearchVisualizer({
  array,
  steps,
  currentStep,
  algorithm,
  searchValue,
}: SearchVisualizerProps) {
  const step = steps[currentStep];
  const legendItems =
    algorithm === "binary" ? [...BASE_LEGEND, ...BINARY_LEGEND] : BASE_LEGEND;

  const statusMessage =
    step?.message ?? `Searching for ${searchValue} using ${algorithm} search`;

  // Binary search window indicator
  const showWindow =
    algorithm === "binary" &&
    step?.low !== undefined &&
    step?.high !== undefined;

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Visualization</CardTitle>
        <p className="text-sm text-muted-foreground min-h-[1.25rem]">
          {statusMessage}
        </p>
      </CardHeader>

      <CardContent>
        {/* ── Binary search window label ── */}
        {showWindow && (
          <p className="text-xs text-center text-muted-foreground mb-3">
            Window: [{step.low}..{step.high}]
            {step.mid !== undefined && (
              <span className="ml-2 text-yellow-500 font-medium">
                mid = {step.mid}
              </span>
            )}
          </p>
        )}

        {/* ── Array cells ── */}
        <div className="flex flex-wrap gap-2 justify-center">
          {array.map((value, index) => {
            const state = getCellState(index, step, algorithm);
            // Highlight active binary search window
            const inWindow =
              showWindow &&
              index >= (step.low ?? 0) &&
              index <= (step.high ?? array.length - 1) &&
              state === "default";

            return (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2",
                  "transition-all duration-300 font-mono font-semibold",
                  CELL_CLASSES[state],
                  inWindow && "ring-2 ring-inset ring-teal-400",
                )}
              >
                <span className="text-sm font-bold">{value}</span>
                <span className="text-xs opacity-70">{index}</span>
              </div>
            );
          })}
        </div>

        {/* ── Search target ── */}
        <p className="text-center text-lg font-semibold mt-4">
          Searching for:{" "}
          <span className="text-primary font-mono">{searchValue}</span>
        </p>

        {/* ── Legend ── */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {legendItems.map(({ label, className }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={cn("size-3.5 rounded-sm border", className)} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
          {showWindow && (
            <div className="flex items-center gap-1.5">
              <div className="size-3.5 rounded-sm border ring-2 ring-inset ring-teal-400 bg-card" />
              <span className="text-muted-foreground">Active window</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
