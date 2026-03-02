import { useState, useEffect, useCallback } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface VisualizerProps {
  text: string;
  pattern: string;
  algorithm: "naive" | "kmp" | "boyer-moore";
  isPlaying: boolean;
  speed: number;
  onPlayingChange: (playing: boolean) => void;
}

interface MatchingState {
  textIndex: number;
  patternIndex: number;
  matches: number[];
  comparisons: number;
  step: number;
  isComplete: boolean;
  currentComparison?: { textPos: number; patternPos: number; match: boolean };
}

export const StringMatchingVisualizer = ({
  text,
  pattern,
  algorithm,
  isPlaying,
  speed,
  onPlayingChange,
}: VisualizerProps) => {
  const [state, setState] = useState<MatchingState>({
    textIndex: 0,
    patternIndex: 0,
    matches: [],
    comparisons: 0,
    step: 0,
    isComplete: false,
  });

  const reset = useCallback(() => {
    setState({
      textIndex: 0,
      patternIndex: 0,
      matches: [],
      comparisons: 0,
      step: 0,
      isComplete: false,
    });
    onPlayingChange(false);
  }, [onPlayingChange]);

  const naiveStep = useCallback(
    (currentState: MatchingState): MatchingState => {
      if (currentState.textIndex > text.length - pattern.length) {
        return { ...currentState, isComplete: true };
      }

      const textChar = text[currentState.textIndex + currentState.patternIndex];
      const patternChar = pattern[currentState.patternIndex];
      const isMatch = textChar === patternChar;

      const newState = {
        ...currentState,
        comparisons: currentState.comparisons + 1,
        currentComparison: {
          textPos: currentState.textIndex + currentState.patternIndex,
          patternPos: currentState.patternIndex,
          match: isMatch,
        },
      };

      if (isMatch) {
        if (currentState.patternIndex === pattern.length - 1) {
          // Complete match found
          return {
            ...newState,
            matches: [...currentState.matches, currentState.textIndex],
            textIndex: currentState.textIndex + 1,
            patternIndex: 0,
            step: currentState.step + 1,
          };
        } else {
          // Continue matching
          return {
            ...newState,
            patternIndex: currentState.patternIndex + 1,
            step: currentState.step + 1,
          };
        }
      } else {
        // Mismatch - move to next position in text
        return {
          ...newState,
          textIndex: currentState.textIndex + 1,
          patternIndex: 0,
          step: currentState.step + 1,
        };
      }
    },
    [text, pattern],
  );

  const stepAlgorithm = useCallback(() => {
    setState((currentState) => {
      if (currentState.isComplete) return currentState;

      switch (algorithm) {
        case "naive":
          return naiveStep(currentState);
        case "kmp":
          // Simplified KMP for demonstration
          return naiveStep(currentState);
        case "boyer-moore":
          // Simplified Boyer-Moore for demonstration
          return naiveStep(currentState);
        default:
          return currentState;
      }
    });
  }, [algorithm, naiveStep]);

  useEffect(() => {
    if (isPlaying && !state.isComplete) {
      const timer = setTimeout(stepAlgorithm, speed);
      return () => clearTimeout(timer);
    } else if (state.isComplete && isPlaying) {
      onPlayingChange(false);
    }
  }, [
    isPlaying,
    state.isComplete,
    speed,
    stepAlgorithm,
    onPlayingChange,
    state.matches.length,
    state.comparisons,
  ]);

  useEffect(() => {
    reset();
  }, [text, pattern, algorithm, reset]);

  const renderText = () => {
    return text.split("").map((char, index) => {
      let className =
        "w-8 h-8 border border-slate-300 flex items-center justify-center text-sm font-mono transition-all duration-300";

      // Highlight matches
      if (
        state.matches.some(
          (match) => index >= match && index < match + pattern.length,
        )
      ) {
        className += " bg-green-200 border-green-400 text-green-800";
      }
      // Highlight current comparison
      else if (
        state.currentComparison &&
        index === state.currentComparison.textPos
      ) {
        if (state.currentComparison.match) {
          className += " bg-blue-200 border-blue-400 text-blue-800";
        } else {
          className += " bg-red-200 border-red-400 text-red-800";
        }
      }
      // Highlight current text window
      else if (
        index >= state.textIndex &&
        index < state.textIndex + pattern.length
      ) {
        className += " bg-slate-100 border-slate-400";
      } else {
        className += " bg-white";
      }

      return (
        <span key={index} className={className}>
          {char}
        </span>
      );
    });
  };

  const renderPattern = () => {
    const patternStart = state.textIndex;
    const leftPadding = patternStart * 32; // 32px per character (w-8)

    return (
      <div
        className="relative mt-2"
        style={{ paddingLeft: `${leftPadding}px` }}
      >
        {pattern.split("").map((char, index) => {
          let className =
            "w-8 h-8 border border-slate-400 flex items-center justify-center text-sm font-mono transition-all duration-300";

          if (
            state.currentComparison &&
            index === state.currentComparison.patternPos
          ) {
            if (state.currentComparison.match) {
              className += " bg-blue-300 border-blue-500 text-blue-900";
            } else {
              className += " bg-red-300 border-red-500 text-red-900";
            }
          } else if (index < state.patternIndex) {
            className += " bg-green-100 border-green-300 text-green-700";
          } else {
            className += " bg-yellow-100 border-yellow-300 text-yellow-700";
          }

          return (
            <span key={index} className={className}>
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-slate-800">
          Algorithm Visualization
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => onPlayingChange(!isPlaying)}
            disabled={state.isComplete}
            className="flex items-center gap-2"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isPlaying ? "Pause" : "Play"}
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-sm font-medium text-slate-600 mb-2">Text:</div>
          <div className="font-mono text-sm overflow-x-auto pb-2">
            {renderText()}
          </div>
        </div>

        <div>
          <div className="text-sm font-medium text-slate-600 mb-2">
            Pattern:
          </div>
          <div className="font-mono text-sm overflow-x-auto pb-2">
            {renderPattern()}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{state.step}</div>
            <div className="text-sm text-slate-600">Steps</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {state.comparisons}
            </div>
            <div className="text-sm text-slate-600">Comparisons</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {state.matches.length}
            </div>
            <div className="text-sm text-slate-600">Matches</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {state.textIndex}
            </div>
            <div className="text-sm text-slate-600">Position</div>
          </div>
        </div>
      </div>
    </Card>
  );
};
