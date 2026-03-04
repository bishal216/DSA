// src/components/string-matching/StringMatchingControls.tsx

import type { StringMatchingStep } from "@/algorithms/types/string-matching";
import { STRING_MATCHING_ALGORITHMS } from "@/algorithms/types/string-matching-registry";
import { PlaybackControls } from "@/components/controls/playback-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

const ALGORITHM_OPTIONS = Object.values(STRING_MATCHING_ALGORITHMS).map(
  (def) => ({
    value: def.key,
    label: def.name,
  }),
);

interface StringMatchingControlsProps {
  // Inputs
  text: string;
  pattern: string;
  onTextChange: (val: string) => void;
  onPatternChange: (val: string) => void;

  // Algorithm
  algorithm: string;
  setAlgorithm: (key: string) => void;

  // Playback
  steps: StringMatchingStep[];
  currentStep: number;
  isRunning: boolean;
  isPaused: boolean;
  speed: number[];
  setSpeed: (speed: number[]) => void;
  isStepMode: boolean;
  setIsStepMode: (val: boolean) => void;
  onStart: () => void;
  onPauseResume: () => void;
  onStepForward: (count?: number) => void;
  onStepBackward: (count?: number) => void;
}

export default function StringMatchingControls({
  text,
  pattern,
  onTextChange,
  onPatternChange,
  algorithm,
  setAlgorithm,
  steps,
  currentStep,
  isRunning,
  isPaused,
  speed,
  setSpeed,
  isStepMode,
  setIsStepMode,
  onStart,
  onPauseResume,
  onStepForward,
  onStepBackward,
}: StringMatchingControlsProps) {
  const isBusy = isRunning && !isPaused;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Algorithm selector */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Algorithm</Label>
          <Select
            value={algorithm}
            onValueChange={setAlgorithm}
            disabled={isBusy}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALGORITHM_OPTIONS.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Text input */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Text</Label>
          <Input
            value={text}
            onChange={(e) => onTextChange(e.target.value)}
            disabled={isBusy}
            className="h-8 text-xs font-mono"
            placeholder="Text to search in..."
          />
        </div>

        {/* Pattern input */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Pattern</Label>
          <Input
            value={pattern}
            onChange={(e) => onPatternChange(e.target.value)}
            disabled={isBusy}
            className="h-8 text-xs font-mono"
            placeholder="Pattern to find..."
          />
          <p className="text-[10px] text-muted-foreground">
            {text.length} chars · {pattern.length} char pattern · {steps.length}{" "}
            steps
          </p>
        </div>

        <Separator />

        <PlaybackControls
          speed={speed}
          setSpeed={setSpeed}
          isStepMode={isStepMode}
          setIsStepMode={setIsStepMode}
          steps={steps}
          currentStep={currentStep}
          isRunning={isRunning}
          isPaused={isPaused}
          comparisons={0}
          swaps={0}
          onStart={onStart}
          onPauseResume={onPauseResume}
          onStepForward={onStepForward}
          onStepBackward={onStepBackward}
        />
      </CardContent>
    </Card>
  );
}
