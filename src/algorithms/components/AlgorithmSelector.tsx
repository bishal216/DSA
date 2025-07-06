import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface AlgorithmSelectorProps {
  selectedAlgorithm: "naive" | "kmp" | "boyer-moore";
  onAlgorithmChange: (algorithm: "naive" | "kmp" | "boyer-moore") => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const AlgorithmSelector = ({
  selectedAlgorithm,
  onAlgorithmChange,
  isPlaying,
  onTogglePlay,
}: AlgorithmSelectorProps) => {
  const algorithms = [
    {
      id: "naive" as const,
      name: "Naive Algorithm",
      complexity: "O(nm)",
      description: "Simple brute-force approach",
    },
    {
      id: "kmp" as const,
      name: "Knuth-Morris-Pratt",
      complexity: "O(n+m)",
      description: "Uses preprocessing to avoid redundant comparisons",
    },
    {
      id: "boyer-moore" as const,
      name: "Boyer-Moore",
      complexity: "O(nm) worst, O(n/m) average",
      description: "Skips characters using bad character and good suffix rules",
    },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        Algorithm Selection
      </h3>

      <RadioGroup
        value={selectedAlgorithm}
        onValueChange={onAlgorithmChange}
        className="space-y-4"
      >
        {algorithms.map((algorithm) => (
          <div key={algorithm.id} className="space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value={algorithm.id} id={algorithm.id} />
              <Label htmlFor={algorithm.id} className="font-medium">
                {algorithm.name}
              </Label>
            </div>
            <div className="ml-6 space-y-1">
              <div className="text-sm text-blue-600 font-mono">
                {algorithm.complexity}
              </div>
              <div className="text-sm text-slate-600">
                {algorithm.description}
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>

      <div className="mt-6 pt-4 border-t">
        <Button
          onClick={onTogglePlay}
          className="w-full flex items-center justify-center gap-2"
          size="lg"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
          {isPlaying ? "Pause Visualization" : "Start Visualization"}
        </Button>
      </div>
    </Card>
  );
};
