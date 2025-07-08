import React, { useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/utils/helpers";
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

  return (
    <RadixCollapsibleCard title="Graph Editor" className="w-full">
      <CardContent className="space-y-3">
        <div className="flex items-center justify-center gap-2 py-1">
          <span
            className={cn(
              "text-sm font-medium px-1.5 py-0.5 rounded transition-colors",
              !isRandomMode
                ? "bg-primary/20 text-primary font-semibold"
                : "text-muted-foreground",
            )}
          >
            Custom
          </span>
          <Switch
            variant="outline"
            size="sm"
            checked={isRandomMode}
            onCheckedChange={setIsRandomMode}
          />
          <span
            className={cn(
              "text-sm font-medium px-1.5 py-0.5 rounded transition-colors",
              isRandomMode
                ? "bg-primary/20 text-primary font-semibold"
                : "text-muted-foreground",
            )}
          >
            Random
          </span>
        </div>
        <div className="flex flex-col justify-between space-y-3 text-xs">
          {!isRandomMode && (
            <div className="space-y-3">
              <Button
                onClick={addNode}
                variant="outline"
                size="sm"
                className="w-full py-1.5"
              >
                <Plus className="size-4 mr-1" />
                Add Node
              </Button>

              <div className="space-y-1">
                <div className="font-semibold text-sm">Add Edge</div>

                <div className="grid grid-cols-3 gap-1">
                  <Select value={edgeFromNode} onValueChange={setEdgeFromNode}>
                    <SelectTrigger
                      className="h-7 text-xs"
                      aria-label="From node"
                    >
                      <SelectValue placeholder="From" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      {graphData.nodes.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={edgeToNode} onValueChange={setEdgeToNode}>
                    <SelectTrigger className="h-7 text-xs" aria-label="To node">
                      <SelectValue placeholder="To" />
                    </SelectTrigger>
                    <SelectContent className="text-xs">
                      {graphData.nodes.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    placeholder="Weight"
                    value={edgeWeight}
                    onChange={(e) => setEdgeWeight(e.target.value)}
                    min="1"
                    className="h-7 text-xs"
                  />
                </div>

                <Button
                  onClick={addEdge}
                  variant="outline"
                  size="sm"
                  className="w-full py-1.5"
                >
                  <Plus className="size-4 mr-1" />
                  Add
                </Button>
              </div>
            </div>
          )}

          {isRandomMode && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold mb-1 text-xs">
                  Number of Nodes:{" "}
                  <span className="font-semibold">{nodeCount}</span>
                </label>
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
                  className="h-5"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-xs">
                  Number of Edges:{" "}
                  <span className="font-semibold">{edgeCount}</span>{" "}
                  <span className="text-muted-foreground">
                    (max {maxEdges})
                  </span>
                </label>
                <Slider
                  value={[edgeCount]}
                  onValueChange={([val]) => setEdgeCount(val)}
                  min={Math.max(1, nodeCount - 1)}
                  max={maxEdges}
                  step={1}
                  className="h-5"
                />
              </div>
            </div>
          )}

          <Button
            onClick={clearGraph}
            variant="outline"
            size="sm"
            className="w-full py-1.5"
          >
            <Trash2 className="size-4 mr-1" />
            Clear Graph
          </Button>

          <div className="space-y-0.5 leading-tight text-muted-foreground">
            {!isRandomMode ? (
              <>
                <p>• Click +Node to add at center</p>
                <p>• Use dropdowns and weight to add edges</p>
                <p>• Drag nodes to reposition</p>
              </>
            ) : (
              <>
                <p>• Sliders control nodes & edges</p>
                <p>• Drag nodes to reposition</p>
                <p>• Click "Clear Graph" to reset</p>
                <p>• Switch to Custom mode to edit manually</p>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </RadixCollapsibleCard>
  );
};

export default GraphEditor;
