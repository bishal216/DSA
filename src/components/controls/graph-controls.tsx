// src/components/controls/graph-controls.tsx
//
// Thin wrapper that composes:
//   - Algorithm selector (graph-specific)
//   - Additional selects (start node, end node, etc.)
//   - Shared PlaybackControls (same as sort/search)

import { PlaybackControls } from "@/components/controls/playback-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AdditionalSelect {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  disabled?: boolean;
}

interface GraphControlsProps {
  // Algorithm selector
  algorithms: { value: string; label: string }[];
  selectedAlgorithm: string;
  setSelectedAlgorithm: (key: string) => void;

  // Optional per-algorithm selects (start node, end node, etc.)
  additionalSelects?: AdditionalSelect[];

  // Playback
  speed: number[];
  setSpeed: (speed: number[]) => void;
  isStepMode: boolean;
  setIsStepMode: (val: boolean) => void;
  steps: unknown[];
  currentStep: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  onPauseResume: () => void;
  onStepForward: (count?: number) => void;
  onStepBackward: (count?: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const GraphControls: React.FC<GraphControlsProps> = ({
  algorithms,
  selectedAlgorithm,
  setSelectedAlgorithm,
  additionalSelects = [],
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
  onStepBackward,
}) => {
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
            value={selectedAlgorithm}
            onValueChange={setSelectedAlgorithm}
            disabled={isBusy}
          >
            <SelectTrigger className="h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {algorithms.map(({ value, label }) => (
                <SelectItem key={value} value={value} className="text-xs">
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Additional selects (start/end node, etc.) */}
        {additionalSelects.map((select) => (
          <div key={select.label} className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">
              {select.label}
            </Label>
            <Select
              value={select.value}
              onValueChange={select.onChange}
              disabled={isBusy || (select.disabled ?? false)}
            >
              <SelectTrigger className="h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {select.options.map((opt) => (
                  <SelectItem
                    key={opt.value}
                    value={opt.value}
                    className="text-xs"
                  >
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

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
          disabled={false}
        />
      </CardContent>
    </Card>
  );
};

export default GraphControls;
