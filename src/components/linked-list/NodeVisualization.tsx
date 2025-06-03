import React from "react";
import { Badge } from "@/components/ui/badge";
import { AnyListNode, ListType } from "@/utils/LinkedListNode";

// Arrow subcomponent
const Arrow: React.FC<{ double?: boolean }> = ({ double = false }) => {
  if (double) {
    return (
      <div className="flex flex-col items-center mx-2">
        {/* Forward arrow */}
        <div className="flex items-center mb-1">
          <div className="w-8 h-0.5 bg-black"></div>
          <div className="w-0 h-0 border-t-4 border-b-4 border-l-6 border-transparent border-l-black"></div>
        </div>
        {/* Backward arrow */}
        <div className="flex items-center">
          <div className="w-0 h-0 border-t-4 border-b-4 border-r-6 border-transparent border-r-black"></div>
          <div className="w-8 h-0.5 bg-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center mx-2">
      <div className="w-8 h-0.5 bg-black"></div>
      <div className="w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-black"></div>
    </div>
  );
};

interface NodeVisualizationProps {
  node: AnyListNode;
  isHighlighted?: boolean;
  isSearchResult?: boolean;
  index: number;
  isHead?: boolean; // Indicates if this is the head node
  headTitle?: string; // Title for the head node badge
  isTail?: boolean; // Indicates if this is the tail node
  tailTitle?: string; // Title for the tail node badge
  listType: ListType;
}

const NodeVisualization: React.FC<NodeVisualizationProps> = ({
  node,
  isHighlighted = false,
  isSearchResult = false,
  index,
  isHead = false,
  headTitle = "HEAD",
  isTail = false,
  tailTitle = "TAIL",
  listType,
}) => {
  const nodeStyles = isSearchResult
    ? "bg-green-100 border-green-400 shadow-green-200 shadow-lg text-green-700"
    : isHighlighted
      ? "bg-yellow-100 border-yellow-400 shadow-yellow-200 shadow-lg text-yellow-700"
      : "bg-white border-blue-300 shadow-md hover:shadow-lg text-black";

  return (
    <div className="flex items-center animate-fade-in">
      <div className="relative flex flex-col items-center justify-center">
        <div
          className={`flex items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${nodeStyles}`}
        >
          <span className="font-bold text-lg">{node.value}</span>

          {/* Index badge on top */}
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <Badge variant="secondary" className="text-xs">
              {index}
            </Badge>
          </div>
        </div>

        {/* Absolute-positioned HEAD/TAIL badges under the node */}
        {(isHead || isTail) && (
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1">
            {isHead && (
              <Badge
                variant="outline"
                className="text-xs font-semibold text-black border-black"
              >
                {headTitle}
              </Badge>
            )}
            {isTail && (
              <Badge
                variant="outline"
                className="text-xs font-semibold text-black border-black"
              >
                {tailTitle}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Arrows */}
      {listType === "singly" && <Arrow />}
      {listType === "circular" && <Arrow />}
      {listType === "doubly" && <Arrow double />}
    </div>
  );
};

export default NodeVisualization;
