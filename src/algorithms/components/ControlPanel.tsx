import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, RotateCcw, Zap } from "lucide-react";

interface ControlPanelProps {
  selectedAlgorithm: string;
  onAlgorithmChange: (algorithm: string) => void;
  algorithms: Record<string, string>;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
  onRun: () => void;
  speed: number[];
  onSpeedChange: (speed: number[]) => void;
  currentStep: number;
  totalSteps: number;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedAlgorithm,
  onAlgorithmChange,
  algorithms,
  isPlaying,
  onPlayPause,
  onReset,
  onRun,
  speed,
  onSpeedChange,
  currentStep,
  totalSteps,
}) => {
  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-4">
        Algorithm Controls
      </h3>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-slate-300 mb-2 block">
            Select Algorithm
          </label>
          <Select value={selectedAlgorithm} onValueChange={onAlgorithmChange}>
            <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600">
              {Object.entries(algorithms).map(([key, name]) => (
                <SelectItem key={key} value={key} className="text-white">
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={onRun}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            <Zap className="w-4 h-4 mr-1" />
            Run
          </Button>
          <Button
            onClick={onPlayPause}
            variant="outline"
            className="border-slate-600 text-white"
            disabled={totalSteps === 0}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="border-slate-600 text-white"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        <div>
          <label className="text-sm text-slate-300 mb-2 block">
            Speed: {speed[0]}ms
          </label>
          <Slider
            value={speed}
            onValueChange={onSpeedChange}
            min={100}
            max={1000}
            step={50}
            className="w-full"
          />
        </div>

        {totalSteps > 0 && (
          <div>
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Progress</span>
              <span>
                {currentStep} / {totalSteps}
              </span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
