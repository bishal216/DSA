import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AnyLinkedList, AnyListNode, ListType } from "@/utils/LinkedListNode";
import NodeVisualization from "./NodeVisualization";

interface ListVisualizationProps {
  linkedList: AnyLinkedList;
  nodes: AnyListNode[];
  highlightedNode: string | null;
  searchResult: string | null;
  isTraversing: boolean;
  listType: ListType;
}

const ListVisualization: React.FC<ListVisualizationProps> = ({
  nodes,
  highlightedNode,
  searchResult,
  listType,
}) => {
  const getListTypeDisplay = () => {
    switch (listType) {
      case "singly":
        return "Singly Linked List";
      case "doubly":
        return "Doubly Linked List";
      case "circular":
        return "Circular Linked List";
      default:
        return "Unknown List Type";
    }
  };

  return (
    <Card className="min-h-[20vh] flex items-center justify-center">
      <CardContent className="w-full px-4 py-6 overflow-x-auto">
        <div className="flex justify-center items-center min-w-max">
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center text-gray-500 text-center">
              <div>
                <div className="text-4xl mb-2">🔗</div>
                <p>Empty {getListTypeDisplay().toLowerCase()}</p>
                <p className="text-sm">Add some nodes to get started!</p>
              </div>
            </div>
          ) : (
            <div className="relative w-fit">
              <div className="flex items-center gap-0 p-6">
                {listType == "doubly" && (
                  <div className="flex items-center justify-center w-16 h-16 ml-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
                    NULL
                  </div>
                )}
                {nodes.map((node, index) => (
                  <NodeVisualization
                    key={node.id}
                    node={node}
                    isHighlighted={highlightedNode === node.id}
                    isSearchResult={searchResult === node.id}
                    index={index}
                    isHead={index === 0}
                    headTitle="HEAD"
                    isTail={index === nodes.length - 1}
                    tailTitle={
                      listType === "doubly" && index === nodes.length - 1
                        ? "TAIL"
                        : undefined
                    }
                    listType={listType}
                  />
                ))}

                {listType !== "circular" && (
                  <div className="flex items-center justify-center w-16 h-16 ml-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
                    NULL
                  </div>
                )}
              </div>

              {listType === "circular" && nodes.length > 1 && (
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                  <svg
                    width={nodes.length * 100 + 100}
                    height="120"
                    className="overflow-visible"
                  >
                    <defs>
                      <marker
                        id="circularArrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                        markerUnits="strokeWidth"
                      >
                        <polygon points="0 0, 10 3, 0 6" fill="black" />
                      </marker>
                    </defs>
                    <path
                      d={`
      M ${24 + 64 + (nodes.length - 1) * 116} ${24 + 32}
      L ${24 + 64 + (nodes.length - 1) * 116 + 24} ${24 + 32}
      L ${24 + 64 + (nodes.length - 1) * 116 + 24} 0
      L 0 0
      L 0 ${24 + 32}
      L 24 ${24 + 32}
    `}
                      stroke="black"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#circularArrowhead)"
                    />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ListVisualization;
