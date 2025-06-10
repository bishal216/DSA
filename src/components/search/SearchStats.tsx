import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Target } from "lucide-react";

interface SearchStatsProps {
  algorithm: "linear" | "binary";
  comparisons: number;
  arrayLength: number;
  found: boolean;
  isSearching: boolean;
}

export const SearchStats = ({
  algorithm,
  comparisons,
  arrayLength,
  found,
  isSearching,
}: SearchStatsProps) => {
  const getTimeComplexity = () => {
    return algorithm === "linear" ? "O(n)" : "O(log n)";
  };

  const getWorstCase = () => {
    return algorithm === "linear"
      ? arrayLength
      : Math.ceil(Math.log2(arrayLength));
  };

  const getBestCase = () => {
    return 1;
  };

  const getAverageCase = () => {
    return algorithm === "linear"
      ? Math.ceil(arrayLength / 2)
      : Math.ceil(Math.log2(arrayLength) / 2);
  };

  return (
    <Card className="p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center">
        <Target className="w-5 h-5 mr-2" />
        Search Statistics
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Algorithm:</span>
          <Badge variant="outline">
            {algorithm === "linear" ? "Linear Search" : "Binary Search"}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Time Complexity:</span>
          <Badge variant="secondary" className="font-mono">
            {getTimeComplexity()}
          </Badge>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Array Length:</span>
          <span className="font-mono">{arrayLength}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Comparisons Made:</span>
          <span className="font-mono text-primary font-bold">
            {comparisons}
          </span>
        </div>

        {found && !isSearching && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Result:</span>
            <Badge variant="default" className="bg-green-500">
              Found!
            </Badge>
          </div>
        )}
      </div>

      <div className="border-t pt-4 space-y-2">
        <h3 className="font-semibold text-sm flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          Complexity Analysis
        </h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold">Best</div>
            <div className="font-mono">{getBestCase()}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Average</div>
            <div className="font-mono">{getAverageCase()}</div>
          </div>
          <div className="text-center">
            <div className="font-semibold">Worst</div>
            <div className="font-mono">{getWorstCase()}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
