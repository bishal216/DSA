// src/components/string-matching/StringMatchingVisualizer.tsx
//
// Renders two rows:
//   Row 1 — full text, each character colored by textStates
//   Row 2 — pattern sliding underneath, aligned at patternOffset

import type {
  CharState,
  StringMatchingStep,
} from "@/algorithms/types/string-matching";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// ── Char state styles ─────────────────────────────────────────────────────────

const CHAR_STYLE: Record<
  CharState,
  { bg: string; border: string; text: string }
> = {
  default: { bg: "#F9FAFB", border: "#E5E7EB", text: "#374151" },
  active: { bg: "#FFFBEB", border: "#F59E0B", text: "#78350F" },
  matched: { bg: "#F0FDF4", border: "#10B981", text: "#065F46" },
  mismatch: { bg: "#FEF2F2", border: "#F87171", text: "#991B1B" },
  candidate: { bg: "#EFF6FF", border: "#93C5FD", text: "#1E3A5F" },
};

// ── Single character cell ─────────────────────────────────────────────────────

function CharCell({
  char,
  index,
  state,
  showIndex = false,
}: {
  char: string;
  index: number;
  state: CharState;
  showIndex?: boolean;
}) {
  const { bg, border, text } = CHAR_STYLE[state];
  return (
    <div className="flex flex-col items-center gap-0.5">
      {showIndex && (
        <span className="text-[9px] text-muted-foreground font-mono w-6 text-center">
          {index}
        </span>
      )}
      <div
        className="w-6 h-6 flex items-center justify-center rounded text-xs font-mono font-bold border"
        style={{ backgroundColor: bg, borderColor: border, color: text }}
      >
        {char}
      </div>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

const LEGEND: { state: CharState; label: string }[] = [
  { state: "active", label: "Comparing" },
  { state: "candidate", label: "In window" },
  { state: "matched", label: "Matched" },
  { state: "mismatch", label: "Mismatch" },
  { state: "default", label: "Default" },
];

// ── Main component ────────────────────────────────────────────────────────────

interface StringMatchingVisualizerProps {
  text: string;
  pattern: string;
  step: StringMatchingStep | undefined;
}

export default function StringMatchingVisualizer({
  text,
  pattern,
  step,
}: StringMatchingVisualizerProps) {
  const offset = step?.patternOffset ?? 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Visualizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* ── Legend ────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {LEGEND.map(({ state, label }) => {
            const { bg, border, text: textColor } = CHAR_STYLE[state];
            return (
              <span key={state} className="flex items-center gap-1.5 text-xs">
                <span
                  className="w-4 h-4 rounded border flex-shrink-0"
                  style={{ backgroundColor: bg, borderColor: border }}
                />
                <span style={{ color: textColor }}>{label}</span>
              </span>
            );
          })}
        </div>

        {/* ── Text + pattern rows ───────────────────────────────────────── */}
        <div className="overflow-x-auto pb-2">
          <div className="inline-flex flex-col gap-2 min-w-max">
            {/* Text row */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                Text
              </span>
              <div className="flex gap-0.5">
                {text.split("").map((char, i) => (
                  <CharCell
                    key={i}
                    char={char}
                    index={i}
                    state={step?.textStates[i] ?? "default"}
                    showIndex
                  />
                ))}
              </div>
            </div>

            {/* Pattern row — indented by patternOffset */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                Pattern
              </span>
              <div
                className="flex gap-0.5"
                style={{ paddingLeft: `${offset * 26}px` }}
              >
                {pattern.split("").map((char, i) => (
                  <CharCell
                    key={i}
                    char={char}
                    index={i}
                    state={step?.patternStates[i] ?? "default"}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Step description ──────────────────────────────────────────── */}
        {step &&
          (() => {
            const styles: Record<
              StringMatchingStep["stepType"],
              { bg: string; border: string; text: string }
            > = {
              initial: { bg: "#F9FAFB", border: "#E5E7EB", text: "#374151" },
              compare: { bg: "#EFF6FF", border: "#93C5FD", text: "#1E3A5F" },
              match: { bg: "#F0FDF4", border: "#6EE7B7", text: "#065F46" },
              mismatch: { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B" },
              shift: { bg: "#FFFBEB", border: "#FCD34D", text: "#78350F" },
              preprocess: { bg: "#F5F3FF", border: "#C4B5FD", text: "#4C1D95" },
              complete: { bg: "#F0FDF4", border: "#6EE7B7", text: "#065F46" },
            };
            const s = styles[step.stepType];
            return (
              <div
                className="p-3 rounded-lg border-l-[3px]"
                style={{
                  backgroundColor: s.bg,
                  borderLeftColor: s.border,
                  color: s.text,
                }}
              >
                <p className="font-medium text-sm">{step.message}</p>
                {step.subMessage && (
                  <p className="text-xs mt-0.5 opacity-75">{step.subMessage}</p>
                )}
              </div>
            );
          })()}

        {/* ── Matches found so far ──────────────────────────────────────── */}
        {step && step.matches.length > 0 && (
          <div className="space-y-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Matches Found ({step.matches.length})
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {step.matches.map((idx, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded border-l-[3px] text-xs font-mono"
                  style={{
                    backgroundColor: "#F0FDF4",
                    borderLeftColor: "#10B981",
                    color: "#065F46",
                  }}
                >
                  index {idx}
                </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
