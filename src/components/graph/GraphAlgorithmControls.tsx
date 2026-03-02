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
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  RotateCcw,
} from "lucide-react";
import { useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AlgorithmOption {
  value: string;
  label: string;
}

// No generic needed — the component only ever reads .id from these values.
// Callers (MSTPage, PathFindingPage) pass Node objects which satisfy { id: string }.
export interface AdditionalSelect {
  label: string;
  value: { id: string } | undefined;
  onChange: (value: string) => void;
  options: { value: { id: string }; label: string }[];
}

export interface AlgorithmControlsProps {
  algorithms: AlgorithmOption[];
  selectedAlgorithm: string;
  setSelectedAlgorithm: (value: string) => void;
  additionalSelects?: AdditionalSelect[];
  isPlaying: boolean;
  handlePlay: () => void;
  handleReset: () => void;
  handleStepForward: () => void;
  handleStepBackward: () => void;
  currentStep: number;
  totalSteps: number;
}

// ── Component ─────────────────────────────────────────────────────────────────

const AlgorithmControls = ({
  algorithms,
  selectedAlgorithm,
  setSelectedAlgorithm,
  additionalSelects,
  isPlaying,
  handlePlay,
  handleReset,
  handleStepForward,
  handleStepBackward,
  currentStep,
  totalSteps,
}: AlgorithmControlsProps) => {
  const [isManual, setIsManual] = useState(false);

  return (
    <RadixCollapsibleCard title="Algorithm Controls">
      <CardContent className="flex flex-col gap-4 p-4">
        {/* Algorithm Picker */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">
            Algorithm
          </label>
          <Select
            value={selectedAlgorithm}
            onValueChange={setSelectedAlgorithm}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent className="max-h-(--radix-select-content-available-height)">
              {algorithms.map((algo) => (
                <SelectItem key={algo.value} value={algo.value}>
                  {algo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional Selects (e.g. Start Node for Prim) */}
        {additionalSelects && additionalSelects.length > 0 && (
          <div className="space-y-2">
            {additionalSelects.map((select) => (
              <div key={select.label} className="space-y-1">
                <label className="block text-sm font-medium text-foreground">
                  {select.label}
                </label>
                <Select
                  // Spread conditionally — exactOptionalPropertyTypes means we
                  // cannot pass value={undefined}, we must omit the prop entirely
                  {...(select.value !== undefined && {
                    value: select.value.id,
                  })}
                  onValueChange={select.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={`Select ${select.label}`} />
                  </SelectTrigger>
                  <SelectContent className="max-h-(--radix-select-content-available-height)">
                    {select.options.map((option) => (
                      <SelectItem key={option.value.id} value={option.value.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        )}

        {/* Auto / Manual toggle */}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => setIsManual((prev) => !prev)}
        >
          {isManual ? "Switch to Auto Play" : "Switch to Step-by-Step"}
        </Button>

        {/* Playback controls */}
        <div className="flex items-center gap-2">
          {isManual ? (
            <>
              <Button
                onClick={handleStepBackward}
                variant="outline"
                size="icon"
                disabled={currentStep <= 0}
                className="grow"
                aria-label="Previous step"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                onClick={handleStepForward}
                variant="outline"
                size="icon"
                disabled={currentStep >= totalSteps - 1}
                className="grow"
                aria-label="Next step"
              >
                <ChevronRight className="size-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handlePlay}
              variant={isPlaying ? "primary" : "outline"}
              className="flex-1 gap-2"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4" /> Play
                </>
              )}
            </Button>
          )}

          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="size-4" />
            Reset
          </Button>
        </div>

        {/* Step counter */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Progress</span>
          <span className="font-medium tabular-nums">
            {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </CardContent>
    </RadixCollapsibleCard>
  );
};

export default AlgorithmControls;
