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
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Algorithm Picker */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Algorithm
          </label>
          <Select
            value={selectedAlgorithm}
            onValueChange={setSelectedAlgorithm}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent className="max-h-[var(--radix-select-content-available-height)]">
              {algorithms.map((algo) => (
                <SelectItem
                  key={algo.value}
                  value={algo.value}
                  className="hover:bg-gray-100 transition-colors"
                >
                  {algo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Toggle mode */}
        {setIsManual && (
          <Button
            variant="outline"
            className="w-full transition-colors"
            onClick={() => setIsManual(!isManual)}
          >
            {isManual ? "Switch to Auto Play" : "Switch to Step-by-Step"}
          </Button>
        )}

        {/* Controls */}
        <div className="flex items-center gap-2">
          {isManual ? (
            <>
              <Button
                onClick={handleStepBackward}
                variant="outline"
                size="icon"
                disabled={currentStep <= 0}
                className="grow-1"
              >
                <ChevronLeft className="size-4" />
                <span className="sr-only">Previous step</span>
              </Button>
              <Button
                onClick={handleStepForward}
                variant="outline"
                size="icon"
                disabled={currentStep >= totalSteps - 1}
                className="grow-1"
              >
                <ChevronRight className="size-4" />
                <span className="sr-only">Next step</span>
              </Button>
            </>
          ) : (
            <Button
              onClick={handlePlay}
              variant={isPlaying ? "default" : "outline"}
              className="flex-1 gap-2 hover:bg-primary/90"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-4" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  Play
                </>
              )}
            </Button>
          )}

          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 hover:bg-gray-50"
          >
            <RotateCcw className="size-4" />
            <span>Reset</span>
          </Button>
        </div>

        {/* Step counter */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Progress:</span>
          <span className="font-medium">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </CardContent>
    </RadixCollapsibleCard>
  );
};

export default AlgorithmControls;
