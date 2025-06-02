import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  linkedList,
  nodes,
  highlightedNode,
  searchResult,
  isTraversing,
  listType,
}) => {
  const getHeadValue = () =>
    "head" in linkedList && linkedList.head ? linkedList.head.value : "null";
  const getTailValue = () =>
    "tail" in linkedList && linkedList.tail ? linkedList.tail.value : "null";

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
    <Card>
      <CardHeader>
        <CardTitle>{getListTypeDisplay()} Visualization</CardTitle>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Size: {linkedList.size}</span>
          <span>Head: {getHeadValue()}</span>
          {listType === "doubly" && <span>Tail: {getTailValue()}</span>}
          <span>Empty: {linkedList.isEmpty() ? "Yes" : "No"}</span>
          {isTraversing && (
            <span className="text-blue-600 font-medium">Traversing...</span>
          )}
        </div>
      </CardHeader>

      <CardContent className="overflow-x-auto">
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🔗</div>
              <p>Empty {getListTypeDisplay().toLowerCase()}</p>
              <p className="text-sm">Add some nodes to get started!</p>
            </div>
          </div>
        ) : (
          <div className="relative w-fit min-w-full">
            <div className="w-fit min-w-full overflow-x-auto">
              <div className="flex items-center gap-0 p-6 w-fit min-w-fit">
                {nodes.map((node, index) => (
                  <NodeVisualization
                    key={node.id}
                    node={node}
                    isHighlighted={highlightedNode === node.id}
                    isSearchResult={searchResult === node.id}
                    index={index}
                    isHead={index === 0}
                    isTail={index === nodes.length - 1}
                    listType={listType}
                  />
                ))}
                {listType !== "circular" && (
                  <div className="flex items-center justify-center w-16 h-16 ml-4 rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
                    NULL
                  </div>
                )}
              </div>
            </div>

            {/* Circular connection arc */}
            {listType === "circular" && nodes.length > 1 && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <svg
                  width={nodes.length * 100 + 100}
                  height="140"
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
                      <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
                    </marker>
                  </defs>
                  <path
                    d={`
                      M ${100 + (nodes.length - 1) * 96} 40
                      C ${100 + (nodes.length - 1) * 96 + 100} -40,
                        ${60 - 100} -40,
                        ${50} 20
                    `}
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#circularArrowhead)"
                  />
                </svg>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-sm text-blue-600 font-medium">
                  Tail → Head (Circular)
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ListVisualization;
