import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import RadixCollapsibleCard from "@/components/ui/collapsible-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { AlgorithmControlsProps } from "../types/graph";

const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  algorithms,
  selectedAlgorithm,
  setSelectedAlgorithm,
  isPlaying,
  handlePlay,
  handleReset,
  handleStepForward,
  handleStepBackward,
  currentStep,
  totalSteps,
  isManual = false,
  setIsManual,
}) => {
  return (
    <RadixCollapsibleCard title="Algorithm Controls">
      <CardContent className="flex flex-col gap-2">
        {/* Algorithm Picker */}
        <div>
          <label className="block text-sm font-medium mb-2">Algorithm</label>
          <Select
            value={selectedAlgorithm}
            onValueChange={setSelectedAlgorithm}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map((algo) => (
                <SelectItem key={algo.value} value={algo.value}>
                  {algo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toggle mode (optional) */}
        {setIsManual && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setIsManual(!isManual)}
          >
            {isManual ? "Switch to Auto" : "Switch to Step-by-Step"}
          </Button>
        )}

        {/* Controls */}
        <div className="flex space-x-2">
          {isManual ? (
            <>
              <Button
                onClick={handleStepBackward}
                variant="outline"
                disabled={currentStep <= 0}
                className="flex-1"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                onClick={handleStepForward}
                variant="outline"
                disabled={currentStep >= totalSteps - 1}
                className="flex-1"
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          ) : (
            <Button onClick={handlePlay} variant="outline" className="flex-1">
              {isPlaying ? (
                <Pause className="size-4" />
              ) : (
                <Play className="size-4" />
              )}
            </Button>
          )}

          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="size-4" />
          </Button>
        </div>

        <div className="text-sm">
          Step: {currentStep + 1} / {totalSteps}
        </div>
      </CardContent>
    </RadixCollapsibleCard>
  );
};

export default AlgorithmControls;
