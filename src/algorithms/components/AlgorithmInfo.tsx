import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraphAlgorithmStep } from "../types/graph";
interface AlgorithmInfoProps {
  algorithm: string;
  currentStep?: GraphAlgorithmStep;
}

export const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({
  algorithm,
  currentStep,
}) => {
  const algorithmDescriptions = {
    topological: {
      title: "Topological Sort",
      description:
        "Orders vertices in a directed acyclic graph such that for every directed edge (u,v), vertex u comes before v in the ordering.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCase: "Task scheduling, dependency resolution",
    },
    kosaraju: {
      title: "Kosaraju's Algorithm",
      description:
        "Finds strongly connected components using two DFS passes - one on the original graph and one on the transpose.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCase: "Social network analysis, web crawling",
    },
    tarjan: {
      title: "Tarjan's Algorithm",
      description:
        "Finds strongly connected components using a single DFS pass with low-link values and a stack.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCase: "Circuit design, software modularity",
    },
    dfs: {
      title: "Depth First Search",
      description:
        "Explores as far as possible along each branch before backtracking.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCase: "Pathfinding, cycle detection",
    },
    bfs: {
      title: "Breadth First Search",
      description:
        "Explores all vertices at the current depth before moving to vertices at the next depth.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCase: "Shortest path, level-order traversal",
    },
    cycleDirected: {
      title: "Cycle Detection (Directed)",
      description:
        "Detects cycles in directed graphs using DFS with recursion stack. Uses white-gray-black coloring to identify back edges.",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCase: "Deadlock detection, dependency validation",
    },
    cycleUndirected: {
      title: "Cycle Detection (Undirected)",
      description:
        "Detects cycles in undirected graphs using DFS. A cycle exists if there's a back edge to a visited vertex (excluding parent).",
      timeComplexity: "O(V + E)",
      spaceComplexity: "O(V)",
      useCase: "Network loop detection, connectivity analysis",
    },
  };

  const info =
    algorithmDescriptions[algorithm as keyof typeof algorithmDescriptions];

  return (
    <Card className="p-4 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
      <h3 className="text-lg font-semibold text-white mb-3">{info?.title}</h3>

      <div className="space-y-3">
        <p className="text-sm text-slate-300">{info?.description}</p>

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="border-blue-500 text-blue-400">
            Time: {info?.timeComplexity}
          </Badge>
          <Badge variant="outline" className="border-green-500 text-green-400">
            Space: {info?.spaceComplexity}
          </Badge>
        </div>

        <div>
          <p className="text-xs text-slate-400 mb-1">Use Case:</p>
          <p className="text-sm text-slate-300">{info?.useCase}</p>
        </div>

        {currentStep && (
          <div className="mt-4 p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-300">
              <span className="font-semibold text-blue-400">Current Step:</span>{" "}
              {currentStep.description}
            </p>
            {currentStep.details && (
              <p className="text-xs text-slate-400 mt-1">
                {currentStep.details}
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};
