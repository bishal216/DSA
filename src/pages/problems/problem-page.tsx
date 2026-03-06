import { PlaybackControls } from "@/components/controls/playback-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ProblemParadigm } from "@/problems/types/problem-step";
import { cn } from "@/utils/helpers";

import type { useProblemPlayer } from "@/hooks/use-problem-player";

type Player = ReturnType<typeof useProblemPlayer>;

interface ProblemPageProps {
  title: string;
  paradigm: "dp" | "backtracking" | "greedy" | "divide-conquer";
  description: string;
  recurrence?: string;
  /** Left column — the visualizer */
  visualizer: React.ReactNode;
  /** Right column top — problem inputs / controls */
  controls: React.ReactNode;
  player: Player;
  /** Additional complexity info rows */
  complexity?: { label: string; value: string }[];
}

const PARADIGM_STYLES: Record<
  ProblemParadigm,
  { label: string; classes: string }
> = {
  dp: {
    label: "Dynamic Programming",
    classes: "bg-info/10 text-info border-info/30",
  },
  backtracking: {
    label: "Backtracking",
    classes: "bg-warning/10 text-warning border-warning/30",
  },
  greedy: {
    label: "Greedy",
    classes: "bg-success/10 text-success border-success/30",
  },
  "divide-conquer": {
    label: "Divide & Conquer",
    classes: "bg-primary/10 text-primary border-primary/30",
  },
};

export function ProblemPage({
  title,
  paradigm,
  description,
  recurrence,
  visualizer,
  controls,
  player,
  complexity,
}: ProblemPageProps) {
  const ps = PARADIGM_STYLES[paradigm];
  const {
    steps,
    currentStep,
    isRunning,
    isPaused,
    isStepMode,
    setIsStepMode,
    speed,
    setSpeed,
    onPauseResume,
    onStepForward,
    onStepBackward,
    reset,
  } = player;

  const step = player.displayStep;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{title}</h1>
          <span
            className={cn(
              "text-xs font-medium px-2 py-0.5 rounded-full border",
              ps.classes,
            )}
          >
            {ps.label}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
        {recurrence && (
          <code className="text-xs bg-muted px-3 py-1.5 rounded font-mono w-fit">
            {recurrence}
          </code>
        )}
      </div>

      {/* Step message bar */}
      {step && (
        <div
          className={cn(
            "flex flex-col gap-0.5 px-4 py-2.5 rounded-lg border transition-colors",
            step.isMajorStep
              ? "bg-primary/5 border-primary/20"
              : "bg-muted border-transparent",
          )}
        >
          <p className="text-sm font-medium">{step.message}</p>
          {step.subMessage && (
            <p className="text-xs text-muted-foreground font-mono">
              {step.subMessage}
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:items-start">
        {/* Left — visualizer */}
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="pt-4">{visualizer}</CardContent>
          </Card>
        </div>

        {/* Right — controls + playback */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {controls}

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
              onStart={() => {
                reset();
              }}
              onPauseResume={onPauseResume}
              onStepForward={onStepForward}
              onStepBackward={onStepBackward}
            />

            {complexity && complexity.length > 0 && (
              <>
                <Separator />
                <div className="rounded-md border border-border divide-y divide-border">
                  {complexity.map(({ label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between px-3 py-2"
                    >
                      <span className="text-xs font-mono text-muted-foreground">
                        {label}
                      </span>
                      <span className="text-xs font-mono font-semibold text-info">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
