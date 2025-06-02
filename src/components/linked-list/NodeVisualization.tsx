import React from "react";
import { Badge } from "@/components/ui/badge";
import { AnyListNode, ListType } from "@/utils/LinkedListNode";

interface NodeVisualizationProps {
  node: AnyListNode;
  isHighlighted?: boolean;
  isSearchResult?: boolean;
  index: number;
  isHead?: boolean;
  isTail?: boolean;
  listType: ListType;
}

const NodeVisualization: React.FC<NodeVisualizationProps> = ({
  node,
  isHighlighted = false,
  isSearchResult = false,
  index,
  isHead = false,
  isTail = false,
  listType,
}) => {
  return (
    <div className="flex items-center animate-fade-in">
      <div className="flex flex-col items-center">
        <div
          className={`
            relative flex items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-300 transform hover:scale-105
            ${
              isSearchResult
                ? "bg-green-100 border-green-400 shadow-green-200 shadow-lg"
                : isHighlighted
                  ? "bg-yellow-100 border-yellow-400 shadow-yellow-200 shadow-lg"
                  : "bg-white border-blue-300 shadow-md hover:shadow-lg"
            }
          `}
        >
          <span
            className={`font-bold text-lg ${isSearchResult ? "text-green-700" : isHighlighted ? "text-yellow-700" : "text-blue-700"}`}
          >
            {node.value}
          </span>
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary" className="text-xs">
              {index}
            </Badge>
          </div>
        </div>
        <div className="mt-2 flex gap-1">
          {isHead && (
            <Badge
              variant="outline"
              className="text-xs font-semibold text-blue-600 border-blue-300"
            >
              HEAD
            </Badge>
          )}
          {isTail && listType === "doubly" && (
            <Badge
              variant="outline"
              className="text-xs font-semibold text-purple-600 border-purple-300"
            >
              TAIL
            </Badge>
          )}
        </div>
      </div>

      {/* Forward arrow for singly and circular lists */}
      {node.next && listType === "singly" && (
        <div className="flex items-center mx-2">
          <div className="w-8 h-0.5 bg-gray-400"></div>
          <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-gray-400"></div>
        </div>
      )}

      {/* Forward arrow for circular lists (different color) */}
      {listType === "circular" && node.next && (
        <div className="flex items-center mx-2">
          <div className="w-8 h-0.5 bg-blue-400"></div>
          <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-blue-400"></div>
        </div>
      )}

      {/* Two-way arrows for doubly linked lists */}
      {listType === "doubly" && node.next && (
        <div className="flex flex-col items-center mx-2">
          {/* Forward arrow */}
          <div className="flex items-center mb-1">
            <div className="w-8 h-0.5 bg-purple-400"></div>
            <div className="w-0 h-0 border-t-2 border-b-2 border-l-3 border-transparent border-l-purple-400"></div>
          </div>
          {/* Backward arrow */}
          <div className="flex items-center">
            <div className="w-0 h-0 border-t-2 border-b-2 border-r-3 border-transparent border-r-purple-300"></div>
            <div className="w-8 h-0.5 bg-purple-300"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeVisualization;
