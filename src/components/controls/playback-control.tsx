// src/components/controls/playback-control.tsx
import { SortingStep } from "@/algorithms/types/sorting";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Pause, Play } from "lucide-react";
import React from "react";

type PlaybackMode = "auto" | "step";

interface SortPlaybackControlsProps {
  speed: number[];
  setSpeed: (speed: number[]) => void;
  isStepMode: boolean;
  setIsStepMode: (val: boolean) => void;
  steps: SortingStep[];
  currentStep: number;
  isRunning: boolean;
  isPaused: boolean;
  comparisons: number;
  swaps: number;
  onStart: () => void;
  onPauseResume: () => void;
  onStepForward: (count?: number) => void;
  disabled?: boolean;
}

export const SortPlaybackControls: React.FC<SortPlaybackControlsProps> = ({
  speed,
  setSpeed,
  isStepMode,
  setIsStepMode,
  steps,
  currentStep,
  isRunning,
  isPaused,
  onStart,
  onPauseResume,
  onStepForward,
  disabled = false,
}) => {
  const isAtLastStep = currentStep >= steps.length - 1 && steps.length > 0;
  const isBusy = isRunning && !isPaused;
  const activeMode: PlaybackMode = isStepMode ? "step" : "auto";
  const stepsReady = steps.length > 0;

  const handleModeChange = (mode: PlaybackMode) => {
    if (!isBusy) setIsStepMode(mode === "step");
  };

  return (
    <div className="space-y-4">
      {/* Mode tab switcher */}
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">
          Playback Mode
        </label>
        <div className="flex rounded-md border border-border overflow-hidden">
          {(["auto", "step"] as PlaybackMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleModeChange(mode)}
              disabled={isBusy || disabled}
              className={`
                flex-1 py-1.5 text-xs font-medium capitalize transition-colors
                ${
                  activeMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground"
                }
                disabled:opacity-50 disabled:cursor-not-allowed
              `}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Mode-specific controls */}
      {activeMode === "auto" ? (
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Speed</span>
              <span className="text-xs font-mono font-medium">{speed[0]}%</span>
            </div>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              min={1}
              max={100}
              step={1}
              disabled={isBusy || disabled}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onStart}
              disabled={isBusy || disabled}
              className="flex-1"
              variant="outline"
              size="sm"
            >
              <Play className="size-3.5 mr-1.5" />
              Sort
            </Button>
            {(isRunning || isPaused) && (
              <Button onClick={onPauseResume} variant="outline" size="sm">
                {isPaused ? (
                  <Play className="size-3.5" />
                ) : (
                  <Pause className="size-3.5" />
                )}
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Button
            onClick={onStart}
            disabled={disabled}
            className="w-full"
            variant="outline"
            size="sm"
          >
            <Play className="size-3.5 mr-1.5" />
            {stepsReady ? "Regenerate Steps" : "Prepare Steps"}
          </Button>

          <div className="flex gap-2">
            {([1, 10, 50] as const).map((count) => (
              <Button
                key={count}
                onClick={() => onStepForward(count)}
                disabled={!stepsReady || isAtLastStep || disabled}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                +{count}
              </Button>
            ))}
          </div>

          {isAtLastStep && (
            <p className="text-xs text-center text-muted-foreground pt-1">
              Algorithm complete
            </p>
          )}
        </div>
      )}
    </div>
  );
};
