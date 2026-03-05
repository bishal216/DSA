import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LinkedListNode,
  LinkedListNodeState,
} from "@/data-structures/linked-list";
import type { ListType } from "@/types/types";
import { cn } from "@/utils/helpers";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface Props {
  nodes: LinkedListNode[];
  listType: ListType;
  message?: string;
}

const STATE_CLASSES: Record<
  LinkedListNodeState,
  { bg: string; border: string; text: string; ring: string }
> = {
  idle: {
    bg: "bg-muted",
    border: "border-border",
    text: "text-foreground",
    ring: "",
  },
  head: {
    bg: "bg-primary-light",
    border: "border-primary",
    text: "text-dark",
    ring: "ring-2 ring-primary/40",
  },
  tail: {
    bg: "bg-secondary",
    border: "border-primary",
    text: "text-dark",
    ring: "ring-2 ring-primary/20",
  },
  traversing: {
    bg: "bg-warning/10",
    border: "border-warning",
    text: "text-warning",
    ring: "ring-2 ring-warning/30",
  },
  inserting: {
    bg: "bg-success/10",
    border: "border-success",
    text: "text-success",
    ring: "ring-2 ring-success/30",
  },
  deleting: {
    bg: "bg-destructive/10",
    border: "border-destructive",
    text: "text-destructive",
    ring: "ring-2 ring-destructive/30",
  },
  found: {
    bg: "bg-success/10",
    border: "border-success",
    text: "text-success",
    ring: "ring-2 ring-success/40",
  },
  notFound: {
    bg: "bg-muted",
    border: "border-border",
    text: "text-muted-foreground",
    ring: "",
  },
};

const LEGEND: [LinkedListNodeState, string][] = [
  ["head", "Head"],
  ["tail", "Tail"],
  ["traversing", "Traversing"],
  ["inserting", "Inserting"],
  ["deleting", "Deleting"],
  ["found", "Found"],
];

const TYPE_LABELS: Record<ListType, string> = {
  singly: "Singly Linked List",
  doubly: "Doubly Linked List",
  circular: "Circular Linked List",
};

export function LinkedListVisualizer({ nodes, listType, message }: Props) {
  const nodeCount = nodes.length;
  const isDoubly = listType === "doubly";
  const isCircular = listType === "circular";

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{TYPE_LABELS[listType]}</CardTitle>
        {message && (
          <p className="text-sm text-muted-foreground min-h-[1.25rem]">
            {message}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="min-h-48 flex flex-col items-center justify-center bg-muted rounded-lg p-6 overflow-x-auto select-none">
          {nodeCount === 0 ? (
            <p className="text-sm font-mono text-muted-foreground px-8 py-4 rounded-lg border-2 border-dashed border-border">
              empty list
            </p>
          ) : (
            <div className="relative flex items-center min-w-max mx-auto py-8">
              {nodes.map((node, index) => {
                const s = STATE_CLASSES[node.state];
                const isFirst = index === 0;
                const isLast = index === nodeCount - 1;
                const isAnimated =
                  node.state === "inserting" || node.state === "deleting";

                return (
                  <div key={node.id} className="flex items-center">
                    {/* Prev arrow for doubly (except first node) */}
                    {isDoubly && !isFirst && (
                      <ArrowLeft className="w-4 h-4 text-muted-foreground -mr-1 flex-shrink-0" />
                    )}

                    <div className="relative flex flex-col items-center">
                      {/* HEAD / TAIL badge */}
                      {isFirst && (
                        <span className="absolute -top-7 text-[10px] font-bold tracking-widest text-primary border border-primary/40 bg-primary-light/60 px-2 py-0.5 rounded-full whitespace-nowrap">
                          HEAD
                        </span>
                      )}
                      {isLast && nodeCount > 1 && (
                        <span className="absolute -bottom-7 text-[10px] font-bold tracking-widest text-muted-foreground border border-border bg-muted px-2 py-0.5 rounded-full whitespace-nowrap">
                          TAIL
                        </span>
                      )}

                      {/* Node box */}
                      <div
                        className={cn(
                          "w-14 h-14 flex items-center justify-center",
                          "rounded-lg border-2 font-mono font-bold text-base",
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
                    </div>

                    {/* Next arrow (except after last node) */}
                    {!isLast && (
                      <>
                        <ArrowRight className="w-5 h-5 text-muted-foreground mx-1 flex-shrink-0" />
                        {isDoubly && (
                          <ArrowLeft className="w-4 h-4 text-muted-foreground -ml-1 mr-1 flex-shrink-0" />
                        )}
                      </>
                    )}

                    {/* NULL pointer after last node (non-circular) */}
                    {isLast && !isCircular && (
                      <div className="flex items-center ml-2 gap-1">
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-xs font-mono text-muted-foreground border border-dashed border-border px-2 py-1 rounded">
                          null
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Circular arc from tail back to head */}
              {isCircular && nodeCount > 0 && (
                <div
                  className="absolute pointer-events-none"
                  style={{
                    inset: 0,
                    width: nodeCount * 80 + (nodeCount - 1) * 24,
                  }}
                >
                  <svg
                    width="100%"
                    height="100%"
                    className="overflow-visible absolute top-0 left-0"
                  >
                    <defs>
                      <marker
                        id="llCircArrow"
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
                      d={`
                        M ${56 + (nodeCount - 1) * 104} 28
                        L ${56 + (nodeCount - 1) * 104 + 20} 28
                        L ${56 + (nodeCount - 1) * 104 + 20} -20
                        L -20 -20
                        L -20 28
                        L 0 28
                      `}
                      stroke="var(--color-border)"
                      strokeWidth="1.5"
                      fill="none"
                      strokeDasharray="4 3"
                      markerEnd="url(#llCircArrow)"
                    />
                  </svg>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
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
