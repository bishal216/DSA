// src/components/graph/GraphEditor.tsx
import type { GraphData } from "@/algorithms/types/graph";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import RadixCollapsibleCard from "@/components/ui/collapsible-card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Plus, Trash2 } from "lucide-react";
import React, { useMemo, useState } from "react";

// ── Props ─────────────────────────────────────────────────────────────────────

interface EdgeForm {
  from: string;
  to: string;
  weight: string;
}

interface GraphEditorProps {
  graphData: GraphData;
  addNode: () => void;
  addEdge: () => void;
  clearGraph: () => void;
  edgeForm: EdgeForm;
  handleEdgeFormChange: (field: keyof EdgeForm, value: string) => void;
  nodeCount: number;
  setNodeCount: (count: number) => void;
  edgeCount: number;
  setEdgeCount: (count: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

const GraphEditor: React.FC<GraphEditorProps> = ({
  graphData,
  addNode,
  addEdge,
  clearGraph,
  edgeForm,
  handleEdgeFormChange,
  nodeCount,
  setNodeCount,
  edgeCount,
  setEdgeCount,
}) => {
  const [isRandomMode, setIsRandomMode] = useState(false);

  const maxEdges = (nodeCount * (nodeCount - 1)) / 2;

  const isEdgeValid = useMemo(() => {
    const { from, to, weight } = edgeForm;
    const weightNum = Number(weight);
    return (
      Boolean(from) &&
      Boolean(to) &&
      from !== to &&
      weightNum > 0 &&
      !isNaN(weightNum) &&
      !graphData.edges.some(
        (edge) =>
          (edge.from === from && edge.to === to) ||
          (edge.from === to && edge.to === from),
      )
    );
  }, [edgeForm, graphData.edges]);

  return (
    <RadixCollapsibleCard title="Graph Editor" className="w-full">
      <CardContent className="space-y-4 p-4">
        {/* Mode toggle */}
        <div className="flex w-full rounded-lg p-1">
          <Button
            onClick={() => setIsRandomMode(false)}
            className={`flex-1 py-1 rounded-none ${!isRandomMode ? "font-bold" : "font-extralight"}`}
            variant="outline"
          >
            Custom
          </Button>
          <Button
            onClick={() => setIsRandomMode(true)}
            className={`flex-1 py-1 rounded-none ${isRandomMode ? "font-bold" : "font-extralight"}`}
            variant="outline"
          >
            Random
          </Button>
        </div>

        <div className="space-y-4">
          {!isRandomMode ? (
            <div className="space-y-4">
              {/* Add Node */}
              <Button
                onClick={addNode}
                variant="outline"
                className="w-full gap-2"
                size="sm"
              >
                <Plus className="size-4" />
                Add Node
              </Button>

              {/* Add Edge */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Add Edge</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={edgeForm.from}
                    onValueChange={(v) => handleEdgeFormChange("from", v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent>
                      {graphData.nodes.map((node) => (
                        <SelectItem
                          key={node.id}
                          value={node.id}
                          className="text-xs"
                        >
                          {node.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={edgeForm.to}
                    onValueChange={(v) => handleEdgeFormChange("to", v)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent>
                      {graphData.nodes.map((node) => (
                        <SelectItem
                          key={node.id}
                          value={node.id}
                          className="text-xs"
                        >
                          {node.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Weight"
                    value={edgeForm.weight}
                    onChange={(e) =>
                      handleEdgeFormChange("weight", e.target.value)
                    }
                    min="1"
                    step="1"
                    className="h-8 text-xs"
                  />
                </div>

                {!isEdgeValid &&
                  (edgeForm.from || edgeForm.to || edgeForm.weight) && (
                    <p className="text-xs text-destructive">
                      Invalid edge. Ensure both nodes are selected, weight is a
                      positive number, and the edge doesn't already exist.
                    </p>
                  )}

                <Button
                  onClick={addEdge}
                  disabled={!isEdgeValid}
                  variant="outline"
                  className="w-full gap-2"
                  size="sm"
                >
                  <Plus className="size-4" />
                  Add Edge
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Node slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Number of Nodes</label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {nodeCount}
                  </span>
                </div>
                <Slider
                  value={[nodeCount]}
                  onValueChange={([val]) => {
                    setNodeCount(val);
                    const max = (val * (val - 1)) / 2;
                    if (edgeCount > max) setEdgeCount(max);
                  }}
                  min={2}
                  max={15}
                  step={1}
                />
              </div>

              {/* Edge slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Number of Edges</label>
                  <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {edgeCount}{" "}
                    <span className="text-muted-foreground">/ {maxEdges}</span>
                  </span>
                </div>
                <Slider
                  value={[edgeCount]}
                  onValueChange={([val]) => setEdgeCount(val)}
                  min={Math.max(1, nodeCount - 1)}
                  max={maxEdges}
                  step={1}
                />
              </div>
            </div>
          )}

          {/* Clear */}
          <Button
            onClick={clearGraph}
            variant="outline"
            size="sm"
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            Clear Graph
          </Button>

          {/* Help text */}
          <div className="text-xs text-muted-foreground space-y-1.5">
            {!isRandomMode ? (
              <>
                <p>
                  • Click <span className="font-medium">Add Node</span> to add
                  at center
                </p>
                <p>• Select nodes and weight to add edges</p>
                <p>• Drag nodes to reposition them</p>
              </>
            ) : (
              <>
                <p>• Use sliders to control graph size</p>
                <p>• Drag nodes to reposition them</p>
                <p>• Switch to Custom mode for manual editing</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </RadixCollapsibleCard>
  );
};

export default GraphEditor;
