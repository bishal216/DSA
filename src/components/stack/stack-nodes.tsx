import { ListNode } from "@/utils/data-structures/LinkedListNode";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/utils/iconmap";

const StackNodes = ({
  nodes,
  highlightedNode,
  searchResult,
}: {
  nodes: ListNode[];
  highlightedNode: string | null;
  searchResult: string | null;
}) => {
  if (nodes.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-gray-500 text-center">
        <div>
          <div className="text-4xl mb-2">📚</div>
          <p>Empty stack</p>
          <p className="text-sm">Push some elements to get started!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 p-6">
      {nodes.map((node, index) => (
        <div key={node.id} className="flex flex-col items-center">
          <div
            className={`relative flex items-center justify-center w-20 h-12 rounded-lg border-2 transition-all duration-300
              ${
                searchResult === node.id
                  ? "bg-green-100 border-green-400 shadow-green-200 shadow-lg"
                  : highlightedNode === node.id
                    ? "bg-yellow-100 border-yellow-400 shadow-yellow-200 shadow-lg"
                    : index === 0
                      ? "bg-orange-100 border-orange-400 shadow-md"
                      : "bg-white border-gray-300 shadow-md"
              }`}
          >
            <span
              className={`font-bold text-lg ${
                searchResult === node.id
                  ? "text-green-700"
                  : highlightedNode === node.id
                    ? "text-yellow-700"
                    : index === 0
                      ? "text-orange-700"
                      : "text-gray-700"
              }`}
            >
              {node.value}
            </span>
            {index === 0 && (
              <Badge
                variant="outline"
                className="absolute -right-12 text-xs font-semibold text-orange-600 border-orange-300"
              >
                TOP
              </Badge>
            )}
          </div>
          {index < nodes.length - 1 && (
            <iconMap.ArrowDown className="w-4 h-4 text-gray-400 my-1" />
          )}
        </div>
      ))}
    </div>
  );
};

export default StackNodes;
