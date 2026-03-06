import type { GraphData } from "@/algorithms/types/graph";
import type {} from "@/data-structures/graph-ds";
import {
  buildAdjList,
  buildMatrix,
  EdgeState,
} from "@/data-structures/graph-ds";
import { cn } from "@/utils/helpers";
import { useState } from "react";

interface Props {
  graph: GraphData;
  edgeStates: Record<string, EdgeState>;
  directed: boolean;
  weighted: boolean;
}

type RepTab = "list" | "matrix" | "edges";

const STATE_COLOR: Record<EdgeState, string> = {
  idle: "text-foreground",
  active: "text-warning",
  adding: "text-success",
  removing: "text-destructive line-through",
  highlight: "text-primary",
};

// ── Adjacency List ─────────────────────────────────────────────────────────────

function AdjList({ graph, edgeStates, directed, weighted }: Props) {
  const adjList = buildAdjList(graph, edgeStates, directed, weighted);
  if (graph.nodes.length === 0)
    return <p className="text-xs text-muted-foreground font-mono">{"{ }"}</p>;

  return (
    <div className="flex flex-col gap-1 font-mono text-xs">
      {Object.entries(adjList).map(([label, neighbors]) => (
        <div key={label} className="flex items-start gap-1 leading-5 flex-wrap">
          <span className="text-primary font-semibold w-5 shrink-0">
            {label}
          </span>
          <span className="text-muted-foreground">→ [</span>
          {neighbors.length === 0 ? (
            <span className="text-muted-foreground/50">∅</span>
          ) : (
            neighbors.map((n, i) => (
              <span key={i}>
                <span className={cn("font-semibold", STATE_COLOR[n.state])}>
                  {n.label}
                  {weighted && n.weight !== undefined ? `(${n.weight})` : ""}
                </span>
                {i < neighbors.length - 1 && (
                  <span className="text-muted-foreground">, </span>
                )}
              </span>
            ))
          )}
          <span className="text-muted-foreground">]</span>
        </div>
      ))}
    </div>
  );
}

// ── Adjacency Matrix ───────────────────────────────────────────────────────────

function AdjMatrix({ graph, edgeStates, directed, weighted }: Props) {
  const { labels, matrix, cellStates } = buildMatrix(
    graph,
    edgeStates,
    directed,
    weighted,
  );
  if (labels.length === 0)
    return <p className="text-xs text-muted-foreground font-mono">[ ]</p>;

  const cellW = Math.max(28, Math.floor(220 / (labels.length + 1)));

  return (
    <div className="overflow-auto">
      <table className="text-xs font-mono border-collapse">
        <thead>
          <tr>
            <th className="w-6" />
            {labels.map((l) => (
              <th
                key={l}
                className="text-primary text-center font-semibold pb-1"
                style={{ minWidth: cellW }}
              >
                {l}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {labels.map((rowLabel, ri) => (
            <tr key={rowLabel}>
              <td className="text-primary font-semibold pr-2">{rowLabel}</td>
              {labels.map((_, ci) => {
                const val = matrix[ri][ci];
                const state = cellStates[ri][ci];
                return (
                  <td
                    key={ci}
                    className={cn(
                      "text-center border border-border/40 transition-colors",
                      ri === ci ? "bg-muted/50" : "",
                      val !== null
                        ? cn("font-semibold", STATE_COLOR[state])
                        : "text-muted-foreground/30",
                    )}
                    style={{ minWidth: cellW, height: cellW }}
                  >
                    {val !== null ? val : "0"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── Edge List ──────────────────────────────────────────────────────────────────

function EdgeList({ graph, edgeStates, directed, weighted }: Props) {
  const byId = Object.fromEntries(graph.nodes.map((n) => [n.id, n.label]));
  if (graph.edges.length === 0)
    return <p className="text-xs text-muted-foreground font-mono">[ ]</p>;

  return (
    <div className="flex flex-col gap-1 font-mono text-xs">
      {graph.edges.map((e, i) => {
        const state = edgeStates[e.id] ?? "idle";
        return (
          <div key={e.id} className="flex items-center gap-1.5">
            <span className="text-muted-foreground w-5 text-right">{i}.</span>
            <span className={cn("font-semibold", STATE_COLOR[state])}>
              ({byId[e.from] ?? e.from}
              <span className="text-muted-foreground font-normal">
                {" "}
                {directed ? "→" : "—"}{" "}
              </span>
              {byId[e.to] ?? e.to}
              {weighted && (
                <span className="text-muted-foreground font-normal">
                  , w=<span className="font-semibold">{e.weight}</span>
                </span>
              )}
              )
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

const TABS: { id: RepTab; label: string }[] = [
  { id: "list", label: "Adj. List" },
  { id: "matrix", label: "Matrix" },
  { id: "edges", label: "Edge List" },
];

export function GraphRepresentation(props: Props) {
  const [tab, setTab] = useState<RepTab>("list");

  return (
    <div className="flex flex-col gap-3 h-full">
      <div className="flex gap-1 bg-muted rounded-md p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 text-xs font-medium py-1 rounded transition-colors",
              tab === t.id
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto bg-muted/50 rounded-md p-3 min-h-0">
        {tab === "list" && <AdjList {...props} />}
        {tab === "matrix" && <AdjMatrix {...props} />}
        {tab === "edges" && <EdgeList {...props} />}
      </div>

      <div className="flex gap-4 text-xs font-mono text-muted-foreground">
        <span>
          |V| ={" "}
          <strong className="text-foreground">
            {props.graph.nodes.length}
          </strong>
        </span>
        <span>
          |E| ={" "}
          <strong className="text-foreground">
            {props.graph.edges.length}
          </strong>
        </span>
        <span className="ml-auto">
          {props.directed ? "directed" : "undirected"}
          {props.weighted ? " · weighted" : ""}
        </span>
      </div>
    </div>
  );
}
