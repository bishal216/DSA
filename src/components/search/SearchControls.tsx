import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Play, Square, RotateCcw, Shuffle } from "lucide-react";

interface SearchControlsProps {
  array: number[];
  setArray: (array: number[]) => void;
  searchValue: number;
  setSearchValue: (value: number) => void;
  searchAlgorithm: "linear" | "binary";
  setSearchAlgorithm: (algorithm: "linear" | "binary") => void;
  speed: number;
  setSpeed: (speed: number) => void;
  isSearching: boolean;
  onStartSearch: () => void;
  onResetVisualization: () => void;
  comparisons: number;
  found: boolean;
}

export const SearchControls = ({
  setArray,
  searchValue,
  setSearchValue,
  searchAlgorithm,
  setSearchAlgorithm,
  speed,
  setSpeed,
  isSearching,
  onStartSearch,
  onResetVisualization,
  comparisons,
  found,
}: SearchControlsProps) => {
  const generateRandomArray = () => {
    const newArray = Array.from(
      { length: 15 },
      () => Math.floor(Math.random() * 50) + 1,
    ).sort((a, b) => a - b);
    setArray(newArray);
    onResetVisualization();
  };

  const generateSequentialArray = () => {
    const newArray = Array.from({ length: 15 }, (_, i) => (i + 1) * 3);
    setArray(newArray);
    onResetVisualization();
  };

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Search Controls</h2>

      <div className="space-y-4">
        <div>
          <Label htmlFor="searchValue">Search Value</Label>
          <Input
            id="searchValue"
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(Number(e.target.value))}
            disabled={isSearching}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="algorithm">Algorithm</Label>
          <Select
            value={searchAlgorithm}
            onValueChange={(value: "linear" | "binary") =>
              setSearchAlgorithm(value)
            }
            disabled={isSearching}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="linear">Linear Search</SelectItem>
              <SelectItem value="binary">Binary Search</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="speed">Animation Speed: {speed}ms</Label>
          <Slider
            id="speed"
            min={100}
            max={2000}
            step={100}
            value={[speed]}
            onValueChange={(value) => setSpeed(value[0])}
            disabled={isSearching}
            className="mt-2"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Button
          onClick={onStartSearch}
          disabled={isSearching}
          variant="outline"
          className="w-full"
          size="lg"
        >
          <Play className="size-4 mr-2" />
          Start Search
        </Button>

        <Button
          onClick={onResetVisualization}
          variant="outline"
          className="w-full"
        >
          <RotateCcw className="size-4 mr-2" />
          Reset
        </Button>

        <div className="flex space-x-2">
          <Button
            onClick={generateRandomArray}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isSearching}
          >
            <Shuffle className="size-4 mr-1" />
            Random
          </Button>
          <Button
            onClick={generateSequentialArray}
            variant="outline"
            size="sm"
            className="flex-1"
            disabled={isSearching}
          >
            <Square className="size-4 mr-1" />
            Sequential
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-sm font-medium">Comparisons Made:</span>
        <span className="font-mono text-primary font-bold">{comparisons}</span>
      </div>

      {found && !isSearching && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Result:</span>
          <Badge variant="default" className="bg-green-500">
            Found!
          </Badge>
        </div>
      )}
    </Card>
  );
};
