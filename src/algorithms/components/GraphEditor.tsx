import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2 } from "lucide-react";
import { GraphEditorProps } from "../types/graph";
import { Slider } from "@/components/ui/slider";
import RadixCollapsibleCard from "@/components/ui/collapsible-card";

const GraphEditor: React.FC<GraphEditorProps> = ({
  graphData,
  addNode,
  addEdge,
  clearGraph,
  edgeFromNode,
  setEdgeFromNode,
  edgeToNode,
  setEdgeToNode,
  edgeWeight,
  setEdgeWeight,
  nodeCount,
  setNodeCount,
  edgeCount,
  setEdgeCount,
}) => {
  const [isRandomMode, setIsRandomMode] = useState(false);

  const maxEdges = (nodeCount * (nodeCount - 1)) / 2;

  const [isEdgeValid, setIsEdgeValid] = useState(true);

  useEffect(() => {
    const isValid: boolean =
      Boolean(edgeFromNode) &&
      Boolean(edgeToNode) &&
      edgeFromNode !== edgeToNode &&
      Number(edgeWeight) > 0 &&
      !graphData.edges.some(
        (edge) =>
          (edge.from === edgeFromNode && edge.to === edgeToNode) ||
          (edge.from === edgeToNode && edge.to === edgeFromNode),
      );

    setIsEdgeValid(isValid);
  }, [edgeFromNode, edgeToNode, edgeWeight, graphData.edges]);

  return (
    <RadixCollapsibleCard title="Graph Editor" className="w-full">
      <CardContent className="space-y-4 p-4">
        {/* Mode toggle */}
        <div className="flex w-full rounded-lg p-1">
          <Button
            onClick={() => setIsRandomMode(false)}
            className={`flex-1 py-1 rounded-none ${
              !isRandomMode ? "font-bold" : "font-extralight"
            }`}
            variant="outline"
          >
            Custom
          </Button>
          <Button
            onClick={() => setIsRandomMode(true)}
            className={`flex-1 py-1 rounded-none ${
              isRandomMode ? "font-bold" : "font-extralight"
            }`}
            variant={"outline"}
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

              {/* Add Edge Section */}
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Add Edge</h3>
                <div className="grid grid-cols-3 gap-2">
                  <Select
                    value={edgeFromNode}
                    onValueChange={(value) => setEdgeFromNode(value)}
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
                    value={edgeToNode}
                    onValueChange={(value) => setEdgeToNode(value)}
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
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(Number(e.target.value))}
                    min="1"
                    step="1"
                    className="h-8 text-xs"
                  />
                </div>
                {!isEdgeValid && (
                  <p className="text-xs text-red-500">
                    Invalid edge. Ensure both nodes are selected and weight is a
                    positive number.
                  </p>
                )}
                <Button
                  onClick={() => {
                    addEdge();
                  }}
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
              {/* Node Slider */}
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

              {/* Edge Slider */}
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

          {/* Clear Button */}
          <Button
            onClick={clearGraph}
            variant="outline"
            size="sm"
            className="w-full gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <Trash2 className="size-4" />
            Clear Graph
          </Button>

          {/* Help Text */}
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
