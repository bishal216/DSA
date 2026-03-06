import type { GraphData } from "@/algorithms/types/graph";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { GraphDSOperation } from "@/hooks/use-graph-ds";

interface ControlsProps {
  nodeLabel: string;
  setNodeLabel: (v: string) => void;
  fromLabel: string;
  setFromLabel: (v: string) => void;
  toLabel: string;
  setToLabel: (v: string) => void;
  weightValue: string;
  setWeightValue: (v: string) => void;
  isRunning: boolean;
  weighted: boolean;
  directed: boolean;
  graphData: GraphData;
  onStart: (op: GraphDSOperation) => void;
  onReset: () => void;
}

export function GraphDSControls({
  nodeLabel,
  setNodeLabel,
  fromLabel,
  setFromLabel,
  toLabel,
  setToLabel,
  weightValue,
  setWeightValue,
  isRunning,
  weighted,
  directed,
  graphData,
  onStart,
  onReset,
}: ControlsProps) {
  const nodeLabels = graphData.nodes.map((n) => n.label);
  const hasNodes = nodeLabels.length > 0;

  // Build label → id map
  const labelToId = Object.fromEntries(
    graphData.nodes.map((n) => [n.label, n.id]),
  );

  // IDs that already have an edge from fromLabel's node
  const fromId = labelToId[fromLabel];
  const connectedIds = new Set(
    graphData.edges
      .filter((e) => {
        if (!fromId) return false;
        if (directed) return e.from === fromId;
        return e.from === fromId || e.to === fromId;
      })
      .map((e) => (e.from === fromId ? e.to : e.from)),
  );

  // Convert back to labels for the dropdown check
  const idToLabel = Object.fromEntries(
    graphData.nodes.map((n) => [n.id, n.label]),
  );
  const connectedLabels = new Set(
    Array.from(connectedIds).map((id) => idToLabel[id]),
  );

  const edgeButtonsDisabled = isRunning || !fromLabel || !toLabel;

  return (
    <div className="flex flex-col gap-4">
      {/* Vertex */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Vertex</label>
        <div className="flex gap-2">
          <Input
            value={nodeLabel}
            onChange={(e) => setNodeLabel(e.target.value)}
            placeholder="Label e.g. A"
            className="font-mono"
            disabled={isRunning}
            maxLength={4}
          />
          {hasNodes && (
            <Select
              value={nodeLabel}
              onValueChange={setNodeLabel}
              disabled={isRunning}
            >
              <SelectTrigger className="w-20 shrink-0">
                <SelectValue placeholder="Pick" />
              </SelectTrigger>
              <SelectContent>
                {nodeLabels.map((l) => (
                  <SelectItem key={l} value={l} className="font-mono">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="success"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("addNode")}
          >
            Add Vertex
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isRunning || !hasNodes}
            onClick={() => onStart("removeNode")}
          >
            Remove Vertex
          </Button>
        </div>
      </div>

      <Separator />

      {/* Edge */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Edge</label>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">From</span>
            <Select
              value={fromLabel}
              onValueChange={(v) => {
                setFromLabel(v);
                setToLabel("");
              }}
              disabled={isRunning || !hasNodes}
            >
              <SelectTrigger className="font-mono">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent>
                {nodeLabels.map((l) => (
                  <SelectItem key={l} value={l} className="font-mono">
                    {l}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">To</span>
            <Select
              value={toLabel}
              onValueChange={setToLabel}
              disabled={isRunning || !hasNodes || !fromLabel}
            >
              <SelectTrigger className="font-mono">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent>
                {nodeLabels.map((l) => {
                  const isSelf = l === fromLabel;
                  const isConnected = connectedLabels.has(l);
                  return (
                    <SelectItem
                      key={l}
                      value={l}
                      className="font-mono"
                      disabled={isSelf || isConnected}
                    >
                      {l}
                      {isConnected && (
                        <span className="ml-1 text-muted-foreground/60 text-xs">
                          edge exists
                        </span>
                      )}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </div>

        {weighted && (
          <Input
            value={weightValue}
            onChange={(e) => setWeightValue(e.target.value)}
            placeholder="Weight"
            className="font-mono"
            disabled={isRunning}
            type="number"
            min="1"
          />
        )}

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="info"
            size="sm"
            disabled={edgeButtonsDisabled || connectedLabels.has(toLabel)}
            onClick={() => onStart("addEdge")}
          >
            Add Edge
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={edgeButtonsDisabled || !connectedLabels.has(toLabel)}
            onClick={() => onStart("removeEdge")}
          >
            Remove Edge
          </Button>
        </div>
      </div>

      <Button variant="outline" onClick={onReset} disabled={isRunning}>
        Reset Graph
      </Button>

      <Separator />

      <div className="rounded-md border border-border divide-y divide-border">
        {[
          ["addVertex", "O(1)"],
          ["removeVertex", "O(V+E)"],
          ["addEdge", "O(1)"],
          ["removeEdge", "O(E)"],
        ].map(([op, c]) => (
          <div key={op} className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-mono text-muted-foreground">
              {op}
            </span>
            <span className="text-xs font-mono font-semibold text-info">
              {c}
            </span>
          </div>
        ))}
        <div className="px-3 py-2">
          <span className="text-xs text-muted-foreground">
            Adjacency list representation
          </span>
        </div>
      </div>
    </div>
  );
}
