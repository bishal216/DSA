import { cn } from "@/utils/helpers";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ArrayDisplayProps {
  array: number[];
  currentIndex: number;
  foundIndex: number;
  visitedIndices: number[];
  searchValue: number;
  eliminatedIndices?: number[];
  algorithm?: "linear" | "binary";
}

// ── Helpers ───────────────────────────────────────────────────────────────────

type CellState = "found" | "current" | "visited" | "eliminated" | "default";

function getCellState(
  index: number,
  currentIndex: number,
  foundIndex: number,
  visitedIndices: number[],
  eliminatedIndices: number[],
  algorithm: "linear" | "binary",
): CellState {
  // Priority order matters — check most specific first
  if (foundIndex === index) return "found";
  if (currentIndex === index && foundIndex === -1) return "current";
  if (visitedIndices.includes(index) && foundIndex === -1) return "visited";
  if (
    algorithm === "binary" &&
    eliminatedIndices.includes(index) &&
    foundIndex === -1
  )
    return "eliminated";
  return "default";
}

const CELL_CLASSES: Record<CellState, string> = {
  found: "bg-green-500  border-green-600  text-white  scale-110",
  current: "bg-yellow-400 border-yellow-500 text-black  scale-105",
  visited: "bg-red-200    border-red-300    text-red-800",
  eliminated: "bg-gray-300   border-gray-400   text-gray-500 opacity-50",
  default: "bg-card       border-border     text-foreground",
};

// ── Component ─────────────────────────────────────────────────────────────────

export const ArrayDisplay = ({
  array,
  currentIndex,
  foundIndex,
  visitedIndices,
  searchValue,
  eliminatedIndices = [],
  algorithm = "linear",
}: ArrayDisplayProps) => {
  return (
    <div className="space-y-4">
      {/* Array cells */}
      <div className="flex flex-wrap gap-2 justify-center">
        {array.map((value, index) => {
          const state = getCellState(
            index,
            currentIndex,
            foundIndex,
            visitedIndices,
            eliminatedIndices,
            algorithm,
          );
          return (
            <div
              key={index}
              className={cn(
                "flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2",
                "transition-all duration-300 font-mono font-semibold",
                CELL_CLASSES[state],
              )}
            >
              <span className="text-sm font-bold">{value}</span>
              <span className="text-xs opacity-70">{index}</span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
        <LegendItem color="bg-yellow-400 border-yellow-500" label="Current" />
        <LegendItem color="bg-red-200 border-red-300" label="Visited" />
        {algorithm === "binary" && (
          <LegendItem
            color="bg-gray-300 border-gray-400 opacity-50"
            label="Eliminated"
          />
        )}
        <LegendItem color="bg-green-500 border-green-600" label="Found" />
      </div>

      {/* Search target */}
      <p className="text-center text-lg font-semibold">
        Searching for:{" "}
        <span className="text-primary font-mono">{searchValue}</span>
      </p>
    </div>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

interface LegendItemProps {
  color: string;
  label: string;
}

const LegendItem = ({ color, label }: LegendItemProps) => (
  <div className="flex items-center gap-2">
    <div className={cn("size-4 rounded border", color)} />
    <span>{label}</span>
  </div>
);
