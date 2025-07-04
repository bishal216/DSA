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
    <Card>
      <CardHeader>
        <CardTitle>Algorithm Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Algorithm</label>
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="kruskal">Kruskal's Algorithm</SelectItem>
              <SelectItem value="prim">Prim's Algorithm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex space-x-2">
          <Button onClick={handlePlay} variant="outline" className="flex-1 ">
            {isPlaying ? (
              <Pause className="size-4" />
            ) : (
              <Play className="size-4" />
            )}
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="size-4" />
          </Button>
        </div>

        <div className="text-sm ">
          Step: {currentStep + 1} / {totalSteps}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlgorithmControls;
