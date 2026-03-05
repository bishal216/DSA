import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TreeNodeState, VisNode } from "@/data-structures/binary-tree";
import type { TreeType } from "@/hooks/use-binary-tree";
import { cn } from "@/utils/helpers";
import { useMemo } from "react";

interface Props {
  nodes: VisNode[];
  rootId: string | null;
  treeType: TreeType;
  message?: string;
}

const STATE_STYLES: Record<
  TreeNodeState,
  { fill: string; stroke: string; text: string }
> = {
  idle: {
    fill: "var(--color-muted)",
    stroke: "var(--color-border)",
    text: "var(--color-foreground)",
  },
  comparing: {
    fill: "var(--color-warning-muted)",
    stroke: "var(--color-warning)",
    text: "var(--color-warning)",
  },
  inserting: {
    fill: "var(--color-success-muted)",
    stroke: "var(--color-success)",
    text: "var(--color-success)",
  },
  deleting: {
    fill: "var(--color-destructive-muted)",
    stroke: "var(--color-destructive)",
    text: "var(--color-destructive)",
  },
  found: {
    fill: "var(--color-success-muted)",
    stroke: "var(--color-success)",
    text: "var(--color-success)",
  },
  notFound: {
    fill: "var(--color-muted)",
    stroke: "var(--color-border)",
    text: "var(--color-muted-foreground)",
  },
  traversing: {
    fill: "var(--color-info-muted)",
    stroke: "var(--color-info)",
    text: "var(--color-info)",
  },
  swapping: {
    fill: "var(--color-primary-light)",
    stroke: "var(--color-primary)",
    text: "var(--color-dark)",
  },
  successor: {
    fill: "var(--color-info-muted)",
    stroke: "var(--color-info)",
    text: "var(--color-info)",
  },
  unbalanced: {
    fill: "var(--color-destructive-muted)",
    stroke: "var(--color-destructive)",
    text: "var(--color-destructive)",
  },
  rotating: {
    fill: "var(--color-primary-light)",
    stroke: "var(--color-primary)",
    text: "var(--color-dark)",
  },
};

const TREE_LABELS: Record<TreeType, string> = {
  bst: "Binary Search Tree",
  avl: "AVL Tree",
  minHeap: "Min Heap",
  maxHeap: "Max Heap",
};

const LEGEND: [TreeNodeState, string][] = [
  ["comparing", "Comparing"],
  ["traversing", "Traversing"],
  ["inserting", "Inserting"],
  ["deleting", "Deleting"],
  ["found", "Found"],
  ["swapping", "Swapping"],
  ["unbalanced", "Unbalanced"],
  ["rotating", "Rotating"],
];

const LEGEND_COLORS: Record<string, { bg: string; border: string }> = {
  comparing: { bg: "bg-warning/10", border: "border-warning" },
  traversing: { bg: "bg-info/10", border: "border-info" },
  inserting: { bg: "bg-success/10", border: "border-success" },
  deleting: { bg: "bg-destructive/10", border: "border-destructive" },
  found: { bg: "bg-success/10", border: "border-success" },
  swapping: { bg: "bg-primary-light", border: "border-primary" },
  unbalanced: { bg: "bg-destructive/10", border: "border-destructive" },
  rotating: { bg: "bg-primary-light", border: "border-primary" },
};

// ── Layout ────────────────────────────────────────────────────────────────────

const NODE_R = 22;
const LEVEL_H = 72;
const MIN_SEP = 56;

interface LayoutNode {
  id: string;
  x: number;
  y: number;
}

function computeLayout(
  nodes: VisNode[],
  rootId: string | null,
): Record<string, LayoutNode> {
  if (!rootId || nodes.length === 0) return {};
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const offsets: Record<string, number> = {};
  let counter = 0;

  function assignX(id: string | null): void {
    if (!id || !byId[id]) return;
    const node = byId[id];
    assignX(node.left);
    offsets[id] = counter++;
    assignX(node.right);
  }
  assignX(rootId);

  const pos: Record<string, LayoutNode> = {};
  function assignY(id: string | null, depth: number): void {
    if (!id || !byId[id]) return;
    const node = byId[id];
    pos[id] = {
      id,
      x: offsets[id] * MIN_SEP,
      y: depth * LEVEL_H + NODE_R + 10,
    };
    assignY(node.left, depth + 1);
    assignY(node.right, depth + 1);
  }
  assignY(rootId, 0);

  const xs = Object.values(pos).map((p) => p.x);
  const minX = Math.min(...xs);
  Object.values(pos).forEach((p) => (p.x -= minX - NODE_R));
  return pos;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function TreeVisualizer({ nodes, rootId, treeType, message }: Props) {
  const layout = useMemo(() => computeLayout(nodes, rootId), [nodes, rootId]);

  const svgWidth = useMemo(() => {
    const xs = Object.values(layout).map((p) => p.x);
    return xs.length > 0 ? Math.max(...xs) + NODE_R + 10 : 0;
  }, [layout]);

  const svgHeight = useMemo(() => {
    const ys = Object.values(layout).map((p) => p.y);
    return ys.length > 0 ? Math.max(...ys) + NODE_R + 20 : 0;
  }, [layout]);

  const showAVL = treeType === "avl";

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{TREE_LABELS[treeType]}</CardTitle>
        {message && (
          <p className="text-sm text-muted-foreground min-h-[1.25rem]">
            {message}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="min-h-64 flex flex-col items-center justify-start bg-muted rounded-lg p-4 overflow-auto select-none">
          {nodes.length === 0 ? (
            <div className="flex-1 flex items-center justify-center w-full">
              <p className="text-sm font-mono text-muted-foreground px-8 py-4 rounded-lg border-2 border-dashed border-border">
                empty tree
              </p>
            </div>
          ) : (
            <svg
              width={Math.max(svgWidth, 200)}
              height={Math.max(svgHeight, 100)}
              className="overflow-visible"
            >
              {/* Edges */}
              {nodes.map((node) => {
                const p = layout[node.id];
                if (!p) return null;
                return [node.left, node.right]
                  .filter(Boolean)
                  .map((childId) => {
                    const c = layout[childId!];
                    if (!c) return null;
                    return (
                      <line
                        key={`${node.id}-${childId}`}
                        x1={p.x}
                        y1={p.y}
                        x2={c.x}
                        y2={c.y}
                        stroke="var(--color-border)"
                        strokeWidth={1.5}
                        style={{ transition: "all 0.4s ease" }}
                      />
                    );
                  });
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const p = layout[node.id];
                if (!p) return null;
                const s = STATE_STYLES[node.state];
                const isAnimated =
                  node.state === "inserting" ||
                  node.state === "deleting" ||
                  node.state === "rotating" ||
                  node.state === "unbalanced";

                return (
                  <g
                    key={node.id}
                    style={{
                      transform: `translate(${p.x}px, ${p.y}px)`,
                      transition:
                        node.state === "rotating" || node.state === "unbalanced"
                          ? "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)"
                          : "transform 0.35s ease",
                    }}
                  >
                    <circle
                      r={NODE_R}
                      fill={s.fill}
                      stroke={s.stroke}
                      strokeWidth={node.state !== "idle" ? 2.5 : 1.5}
                      style={{
                        transition: "all 0.3s",
                        transform: isAnimated ? "scale(1.15)" : "scale(1)",
                        transformOrigin: "center",
                      }}
                    />
                    <text
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize={node.value > 99 ? 10 : 13}
                      fontFamily="monospace"
                      fontWeight="600"
                      fill={s.text}
                      style={{ userSelect: "none" }}
                    >
                      {node.value}
                    </text>

                    {/* Balance factor label for AVL */}
                    {showAVL && node.extra && (
                      <text
                        y={NODE_R + 12}
                        textAnchor="middle"
                        fontSize={9}
                        fontFamily="monospace"
                        fontWeight="600"
                        fill={
                          node.state === "unbalanced"
                            ? "var(--color-destructive)"
                            : "var(--color-muted-foreground)"
                        }
                        style={{ userSelect: "none" }}
                      >
                        {node.extra}
                      </text>
                    )}

                    {/* Root / heap label */}
                    {node.id === rootId && (
                      <text
                        y={-NODE_R - 6}
                        textAnchor="middle"
                        fontSize={9}
                        fontFamily="monospace"
                        fontWeight="700"
                        fill="var(--color-primary)"
                        letterSpacing="0.05em"
                      >
                        {treeType === "bst"
                          ? "ROOT"
                          : treeType === "avl"
                            ? "ROOT"
                            : treeType === "minHeap"
                              ? "MIN"
                              : "MAX"}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}

          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            {LEGEND.filter(([state]) => {
              if (state === "unbalanced" || state === "rotating")
                return showAVL;
              if (state === "swapping")
                return treeType === "minHeap" || treeType === "maxHeap";
              return true;
            }).map(([state, label]) => {
              const c = LEGEND_COLORS[state];
              return (
                <div key={state} className="flex items-center gap-1.5">
                  <div
                    className={cn(
                      "w-3 h-3 rounded-full border-2",
                      c.bg,
                      c.border,
                    )}
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
