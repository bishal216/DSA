import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw } from "lucide-react";

interface AlgorithmControlsProps {
  algorithm: "kruskal" | "prim";
  setAlgorithm: (algorithm: "kruskal" | "prim") => void;
  isPlaying: boolean;
  handlePlay: () => void;
  handleReset: () => void;
  currentStep: number;
  totalSteps: number;
}

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  algorithm,
  setAlgorithm,
  isPlaying,
  handlePlay,
  handleReset,
  currentStep,
  totalSteps,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Algorithm Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Algorithm
          </label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-700 border-gray-600">
              <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
              <SelectItem value="prim">Prim's Algorithm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={handlePlay}
            variant="outline"
            className="flex-1 bg-blue-600 hover:bg-blue-700 border-blue-500 text-white"
          >
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="bg-gray-600 hover:bg-gray-700 border-gray-500 text-white"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>

        <div className="text-sm text-gray-300">
          Step: {currentStep + 1} / {totalSteps}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmControls;
