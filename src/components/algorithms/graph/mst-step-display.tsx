// src/components/graph/MSTStepDisplay.tsx

import type {
  GraphData,
  GraphStep,
  MSTStepMetadata,
} from "@/algorithms/types/graph";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/helpers";

// ── State styles ──────────────────────────────────────────────────────────────
// Light tint background + colored left border — keeps text readable at all states

type EdgeStateKey = "tree" | "current" | "candidate" | "rejected" | "default";

const EDGE_STATE_STYLE: Record<
  EdgeStateKey,
  { icon: string; border: string; bg: string; text: string }
> = {
  tree: { icon: "✓", border: "#10B981", bg: "#F0FDF4", text: "#065F46" },
  current: { icon: "→", border: "#F59E0B", bg: "#FFFBEB", text: "#78350F" },
  candidate: { icon: "·", border: "#60A5FA", bg: "#EFF6FF", text: "#1E3A5F" },
  rejected: { icon: "✗", border: "#F87171", bg: "#FEF2F2", text: "#991B1B" },
  default: { icon: "○", border: "#E5E7EB", bg: "#F9FAFB", text: "#374151" },
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface MSTStepDisplayProps {
  step: GraphStep;
  metadata: MSTStepMetadata | undefined;
  algorithm: string;
  graphData: GraphData;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getStepTitle(step: GraphStep, algorithm: string): string {
  switch (step.stepType) {
    case "initial":
      return algorithm === "prim"
        ? `Starting from node ${Object.keys(step.nodeStates).find((id) => step.nodeStates[id] === "visited") ?? "?"}`
        : "Starting Algorithm";
    case "check":
      return algorithm === "prim"
        ? "Evaluating frontier edges"
        : "Checking Edge";
    case "decision":
      return Object.values(step.edgeStates).includes("tree")
        ? "Edge Added to MST"
        : "Edge Rejected";
    case "summary":
      return "Progress Update";
    case "complete":
      return "MST Complete";
    default:
      return "Algorithm Step";
  }
}

function getStepStyle(step: GraphStep): {
  bg: string;
  border: string;
  text: string;
} {
  const neutral = { bg: "#F9FAFB", border: "#E5E7EB", text: "#374151" };
  const blue = { bg: "#EFF6FF", border: "#93C5FD", text: "#1E3A5F" };
  const green = { bg: "#F0FDF4", border: "#6EE7B7", text: "#065F46" };
  const red = { bg: "#FEF2F2", border: "#FCA5A5", text: "#991B1B" };
  const amber = { bg: "#FFFBEB", border: "#FCD34D", text: "#78350F" };

  switch (step.stepType) {
    case "initial":
      return neutral;
    case "check":
      return blue;
    case "decision":
      return Object.values(step.edgeStates).includes("tree")
        ? green
        : Object.values(step.edgeStates).includes("current")
          ? amber
          : red;
    case "summary":
      return neutral;
    case "complete":
      return green;
    default:
      return neutral;
  }
}

// ── Edge list item ────────────────────────────────────────────────────────────

function EdgeItem({
  from,
  to,
  weight,
  state,
}: {
  from: string;
  to: string;
  weight: number;
  state: EdgeStateKey;
}) {
  const { icon, border, bg, text } = EDGE_STATE_STYLE[state];

  return (
    <div
      className={cn(
        "px-2 py-1.5 rounded text-xs flex items-center gap-1.5 border-l-[3px]",
        state === "current" && "ring-1 ring-amber-300",
      )}
      style={{ backgroundColor: bg, borderLeftColor: border, color: text }}
    >
      <span className="font-bold w-3 shrink-0">{icon}</span>
      <span className="font-medium truncate">
        {from}–{to}
      </span>
      <span className="ml-auto font-mono shrink-0">{weight}</span>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function MSTStepDisplay({
  step,
  metadata,
  algorithm,
  graphData,
}: MSTStepDisplayProps) {
  if (!metadata) return null;

  const displayEdges =
    algorithm === "reverseDelete"
      ? [...graphData.edges].sort((a, b) => b.weight - a.weight)
      : algorithm === "prim"
        ? metadata.frontierEdges?.length
          ? metadata.frontierEdges
          : metadata.mstEdges
        : [...graphData.edges].sort((a, b) => a.weight - b.weight);

  const edgeListLabel =
    algorithm === "prim"
      ? "Frontier Edges"
      : algorithm === "reverseDelete"
        ? "Edges (heaviest first)"
        : algorithm === "boruvka"
          ? "Component Edges This Round"
          : "Edges (sorted by weight)";

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">
          {getStepTitle(step, algorithm)}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4 text-sm">
        {/* Step description */}
        {(() => {
          const s = getStepStyle(step);
          return (
            <div
              className="p-3 rounded-lg border-l-[3px]"
              style={{
                backgroundColor: s.bg,
                borderLeftColor: s.border,
                color: s.text,
              }}
            >
              <p className="font-medium">{step.message}</p>
              {step.subMessage && (
                <p
                  className="text-xs mt-0.5"
                  style={{ color: s.text, opacity: 0.75 }}
                >
                  {step.subMessage}
                </p>
              )}
            </div>
          );
        })()}

        {/* Stats row */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <span>
            MST edges:{" "}
            <strong className="text-foreground">
              {metadata.mstEdges.length}
            </strong>
          </span>
          <span>
            Total weight:{" "}
            <strong className="text-foreground">{metadata.totalWeight}</strong>
          </span>
          {algorithm === "boruvka" && metadata.boruvkaRound !== undefined && (
            <span>
              Round:{" "}
              <strong className="text-foreground">
                {metadata.boruvkaRound}
              </strong>
            </span>
          )}
          {(algorithm === "kruskal" || algorithm === "reverseDelete") && (
            <span>
              Rejected:{" "}
              <strong className="text-foreground">
                {metadata.rejectedEdges.length}
              </strong>
            </span>
          )}
        </div>

        {/* Edge list */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {edgeListLabel}
          </h3>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground pb-1">
            {(
              Object.entries(EDGE_STATE_STYLE) as [
                EdgeStateKey,
                (typeof EDGE_STATE_STYLE)[EdgeStateKey],
              ][]
            )
              .filter(([k]) => k !== "default")
              .map(([k, s]) => (
                <span key={k} className="flex items-center gap-1">
                  <span className="font-bold" style={{ color: s.border }}>
                    {s.icon}
                  </span>
                  <span className="capitalize">{k}</span>
                </span>
              ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
            {displayEdges.map((edge) => {
              const raw = step.edgeStates[edge.id] ?? "default";
              const state: EdgeStateKey =
                raw === "tree" ||
                raw === "current" ||
                raw === "candidate" ||
                raw === "rejected"
                  ? raw
                  : "default";

              return (
                <EdgeItem
                  key={edge.id}
                  from={edge.from}
                  to={edge.to}
                  weight={edge.weight}
                  state={state}
                />
              );
            })}
          </div>
        </div>

        {/* Boruvka component breakdown */}
        {algorithm === "boruvka" && metadata.components && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Components
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.entries(metadata.components).map(([root, members]) => (
                <div
                  key={root}
                  className="text-xs bg-muted px-2 py-1 rounded border font-mono"
                >
                  {"{" + members.join(", ") + "}"}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
