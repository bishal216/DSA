import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Shuffle } from "lucide-react";
import { GraphData } from "../types/graph";

interface GraphEditorProps {
  graphData: GraphData;
  addNode: () => void;
  addEdge: () => void;
  clearGraph: () => void;
  generateRandomGraph: () => void;
  edgeFromNode: string;
  setEdgeFromNode: (value: string) => void;
  edgeToNode: string;
  setEdgeToNode: (value: string) => void;
  edgeWeight: string;
  setEdgeWeight: (value: string) => void;
}

const GraphEditor: React.FC<GraphEditorProps> = ({
  graphData,
  addNode,
  addEdge,
  clearGraph,
  generateRandomGraph,
  edgeFromNode,
  setEdgeFromNode,
  edgeToNode,
  setEdgeToNode,
  edgeWeight,
  setEdgeWeight,
}) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Graph Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={addNode}
          variant="outline"
          className="w-full bg-green-600 hover:bg-green-700 border-gray-500 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Node
        </Button>

        <div className="space-y-3">
          <div className="text-sm font-medium text-gray-300">Add Edge</div>
          <div className="grid grid-cols-2 gap-2">
            <Select value={edgeFromNode} onValueChange={setEdgeFromNode}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="From" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {graphData.nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={edgeToNode} onValueChange={setEdgeToNode}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="To" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 border-gray-600">
                {graphData.nodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input
            type="number"
            placeholder="Weight"
            value={edgeWeight}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEdgeWeight(e.target.value)
            }
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
            min="1"
          />
          <Button
            onClick={addEdge}
            variant="outline"
            className="w-full bg-blue-600 hover:bg-blue-700 border-gray-500 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Edge
          </Button>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={generateRandomGraph}
            variant="outline"
            className="flex-1 bg-purple-600 hover:bg-purple-700 border-gray-500 text-white"
          >
            <Shuffle className="w-4 h-4 mr-1" />
            Random
          </Button>
          <Button
            onClick={clearGraph}
            variant="outline"
            className="flex-1 bg-red-600 hover:bg-red-700 border-red-500 text-white"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Clear
          </Button>
        </div>

        <div className="text-xs text-gray-400">
          <p>• Click +Node to add at center</p>
          <p>• Drag nodes to reposition</p>
          <p>• Use dropdowns and weight input to add edges</p>
          <p>• Random generates 5-7 nodes with connected edges</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GraphEditor;
