import { cn } from "@/utils/helpers";

interface ArrayDisplayProps {
  array: number[];
  currentIndex: number;
  foundIndex: number;
  visitedIndices: number[];
  searchValue: number;
  eliminatedIndices?: number[];
  algorithm?: "linear" | "binary";
}

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
      <div className="flex flex-wrap gap-2 justify-center">
        {array.map((value, index) => (
          <div
            key={index}
            className={cn(
              "flex flex-col items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-300 font-mono font-semibold",
              {
                "bg-green-500 border-green-600 text-white scale-110":
                  foundIndex === index,
                "bg-yellow-400 border-yellow-500 text-black scale-105":
                  currentIndex === index && foundIndex === -1,
                "bg-red-200 border-red-300 text-red-800":
                  visitedIndices.includes(index) &&
                  currentIndex !== index &&
                  foundIndex === -1,
                "bg-gray-300 border-gray-400 text-gray-500 opacity-50":
                  algorithm === "binary" &&
                  eliminatedIndices.includes(index) &&
                  currentIndex !== index &&
                  foundIndex === -1,
                "bg-card border-border text-foreground":
                  currentIndex !== index &&
                  foundIndex !== index &&
                  !visitedIndices.includes(index) &&
                  (!eliminatedIndices.includes(index) ||
                    algorithm === "linear"),
              },
            )}
          >
            <span className="text-sm font-bold">{value}</span>
            <span className="text-xs opacity-70">{index}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center space-x-6 text-sm">
        <div className="flex items-center space-x-2">
          <div className="size-4 bg-yellow-400 border border-yellow-500 rounded"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="size-4 bg-red-200 border border-red-300 rounded"></div>
          <span>Visited</span>
        </div>
        {algorithm === "binary" && (
          <div className="flex items-center space-x-2">
            <div className="size-4 bg-gray-300 border border-gray-400 rounded opacity-50"></div>
            <span>Eliminated</span>
          </div>
        )}
        <div className="flex items-center space-x-2">
          <div className="size-4 bg-green-500 border border-green-600 rounded"></div>
          <span>Found</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold">
          Searching for:{" "}
          <span className="text-primary font-mono">{searchValue}</span>
        </p>
      </div>
    </div>
  );
};
