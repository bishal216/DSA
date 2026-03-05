import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QueueNode, QueueNodeState } from "@/data-structures/queue";
import type { QueueType } from "@/types/types";
import { cn } from "@/utils/helpers";
import { ArrowRight } from "lucide-react";

interface Props {
  nodes: QueueNode[];
  queueType: QueueType;
  message?: string;
}

const STATE_CLASSES: Record<
  QueueNodeState,
  { bg: string; border: string; text: string; ring: string }
> = {
  idle: {
    bg: "bg-muted",
    border: "border-border",
    text: "text-foreground",
    ring: "",
  },
  front: {
    bg: "bg-primary-light",
    border: "border-primary",
    text: "text-dark",
    ring: "ring-2 ring-primary/40",
  },
  rear: {
    bg: "bg-secondary",
    border: "border-primary",
    text: "text-dark",
    ring: "ring-2 ring-primary/20",
  },
  enqueuing: {
    bg: "bg-success/10",
    border: "border-success",
    text: "text-success",
    ring: "ring-2 ring-success/30",
  },
  dequeuing: {
    bg: "bg-destructive/10",
    border: "border-destructive",
    text: "text-destructive",
    ring: "ring-2 ring-destructive/30",
  },
  peeking: {
    bg: "bg-info/10",
    border: "border-info",
    text: "text-info",
    ring: "ring-2 ring-info/30",
  },
};

const LEGEND: [QueueNodeState, string][] = [
  ["front", "Front"],
  ["rear", "Rear"],
  ["enqueuing", "Enqueuing"],
  ["dequeuing", "Dequeuing"],
  ["peeking", "Peeking"],
];

export function QueueVisualizer({ nodes, queueType, message }: Props) {
  const nodeCount = nodes.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {queueType === "circular"
            ? "Circular Queue"
            : queueType === "deque"
              ? "Deque"
              : "Queue"}
        </CardTitle>
        {message && (
          <p className="text-sm text-muted-foreground min-h-[1.25rem]">
            {message}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="min-h-48 flex flex-col items-center justify-center bg-muted rounded-lg p-4 select-none overflow-x-auto">
          {/* Nodes */}
          <div className="flex justify-center items-center min-w-max mx-auto py-6">
            {nodeCount === 0 ? (
              <p className="text-sm font-mono text-muted-foreground px-8 py-4 rounded-lg border-2 border-dashed border-border">
                empty queue
              </p>
            ) : (
              <div className="relative flex items-center gap-0">
                {nodes.map((node, index) => {
                  const s = STATE_CLASSES[node.state];
                  const isFirst = index === 0;
                  const isLast = index === nodeCount - 1;
                  const isAnimated =
                    node.state === "enqueuing" || node.state === "dequeuing";

                  return (
                    <div key={node.id} className="flex items-center">
                      <div className="relative flex flex-col items-center">
                        {isFirst && (
                          <span className="absolute -top-7 text-[10px] font-bold tracking-widest text-primary border border-primary/40 bg-primary-light/60 px-2 py-0.5 rounded-full">
                            FRONT
                          </span>
                        )}
                        <div
                          className={cn(
                            "w-16 h-16 flex items-center justify-center",
                            "rounded-lg border-2 font-mono font-bold text-lg",
                            "transition-all duration-300",
                            s.bg,
                            s.border,
                            s.text,
                            s.ring,
                            isAnimated && "scale-110 shadow-lg",
                          )}
                        >
                          {node.value}
                        </div>
                        {isLast && (
                          <span className="absolute -bottom-7 text-[10px] font-bold tracking-widest text-muted-foreground border border-border bg-muted px-2 py-0.5 rounded-full">
                            REAR
                          </span>
                        )}
                      </div>

                      {index < nodeCount - 1 && (
                        <ArrowRight className="w-6 h-6 text-muted-foreground mx-2 flex-shrink-0" />
                      )}
                    </div>
                  );
                })}

                {/* Circular arc */}
                {queueType === "circular" && nodeCount > 1 && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{ width: nodeCount * 104 }}
                  >
                    <svg
                      width={nodeCount * 104}
                      height="120"
                      className="overflow-visible absolute top-0 left-0"
                    >
                      <defs>
                        <marker
                          id="circArrow"
                          markerWidth="8"
                          markerHeight="8"
                          refX="7"
                          refY="3"
                          orient="auto"
                        >
                          <polygon
                            points="0 0, 8 3, 0 6"
                            fill="var(--color-border)"
                          />
                        </marker>
                      </defs>
                      <path
                        d={`M ${40 + (nodeCount - 1) * 104} 24 L ${40 + (nodeCount - 1) * 104 + 32} 24 L ${40 + (nodeCount - 1) * 104 + 32} -16 L 0 -16 L 0 24 L 24 24`}
                        stroke="var(--color-border)"
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray="4 3"
                        markerEnd="url(#circArrow)"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {LEGEND.map(([state, label]) => {
              const s = STATE_CLASSES[state];
              return (
                <div key={state} className="flex items-center gap-1.5">
                  <div
                    className={cn("w-3 h-3 rounded border-2", s.bg, s.border)}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
