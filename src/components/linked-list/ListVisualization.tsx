import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnyLinkedList, AnyListNode, ListType } from "@/utils/LinkedListNode";
import NodeVisualization from "@/components/linked-list/NodeVisualization";

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
  const getHeadValue = () => {
    if ("head" in linkedList && linkedList.head) {
      return linkedList.head.value;
    }
    return "null";
  };

  const getTailValue = () => {
    if ("tail" in linkedList && linkedList.tail) {
      return linkedList.tail.value;
    }
    return "null";
  };

  const getListTypeDisplay = () => {
    switch (listType) {
      case "singly":
        return "Singly Linked List";
      case "doubly":
        return "Doubly Linked List";
      case "circular":
        return "Circular Linked List";
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
      <CardContent>
        {nodes.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-gray-500">
            <div className="text-center">
              <div className="text-4xl mb-2">🔗</div>
              <p>Empty {getListTypeDisplay().toLowerCase()}</p>
              <p className="text-sm">Add some nodes to get started!</p>
            </div>
          </div>
        ) : (
          <div className="relative">
            <div className="flex items-center justify-start gap-0 p-6 overflow-x-auto">
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

            {/* Circular connection visualization */}
            {listType === "circular" && nodes.length > 1 && (
              <div className="relative mt-4">
                <svg
                  className="absolute left-6 w-full h-16"
                  style={{ top: "-20px" }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#3b82f6" />
                    </marker>
                  </defs>
                  <path
                    d="M 85 50 Q 90 30, 85 10 Q 50 0, 15 10 Q 10 30, 15 50"
                    stroke="#3b82f6"
                    strokeWidth="2"
                    fill="none"
                    markerEnd="url(#arrowhead)"
                  />
                </svg>
                <div className="text-center text-sm text-blue-600 font-medium mt-8">
                  Last node connects back to HEAD
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
