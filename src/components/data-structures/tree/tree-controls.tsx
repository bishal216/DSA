import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type {
  AVLOperation,
  BSTOperation,
  HeapOperation,
  TreeType,
} from "@/hooks/use-binary-tree";

interface Props {
  inputValue: string;
  setInputValue: (v: string) => void;
  isRunning: boolean;
  treeType: TreeType;
  onStart: (op: BSTOperation | AVLOperation | HeapOperation) => void;
  onReset: () => void;
}

export function TreeControls({
  inputValue,
  setInputValue,
  isRunning,
  treeType,
  onStart,
  onReset,
}: Props) {
  const isBST = treeType === "bst";
  const isAVL = treeType === "avl";
  const isHeap = treeType === "minHeap" || treeType === "maxHeap";
  const heapLabel = treeType === "minHeap" ? "Min" : "Max";

  const showTraversals = isBST || isAVL;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Value</label>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. 42"
          className="font-mono"
          disabled={isRunning}
          type="number"
        />
      </div>

      {/* BST / AVL modify + search */}
      {(isBST || isAVL) && (
        <>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Modify</label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="success"
                size="sm"
                disabled={isRunning}
                onClick={() => onStart("insert")}
              >
                Insert
              </Button>
              <Button
                variant="destructive"
                size="sm"
                disabled={isRunning}
                onClick={() => onStart("delete")}
              >
                Delete
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Search</label>
            <Button
              variant="info"
              disabled={isRunning}
              onClick={() => onStart("search")}
            >
              Search
            </Button>
          </div>
        </>
      )}

      {/* Traversals — BST and AVL */}
      {showTraversals && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Traversal</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={isRunning}
              onClick={() => onStart("inorder")}
            >
              Inorder
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isRunning}
              onClick={() => onStart("preorder")}
            >
              Preorder
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isRunning}
              onClick={() => onStart("postorder")}
            >
              Postorder
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isRunning}
              onClick={() => onStart("levelOrder")}
            >
              Level-order
            </Button>
          </div>
        </div>
      )}

      {/* DFS — BST only */}
      {isBST && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Graph Search</label>
          <Button
            variant="secondary"
            disabled={isRunning}
            onClick={() => onStart("dfs" as BSTOperation)}
          >
            DFS
          </Button>
        </div>
      )}

      {/* Heap operations */}
      {isHeap && (
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Operations</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="success"
              size="sm"
              disabled={isRunning}
              onClick={() => onStart("insert")}
            >
              Insert
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isRunning}
              onClick={() => onStart("extract")}
            >
              Extract {heapLabel}
            </Button>
          </div>
        </div>
      )}

      <Button variant="outline" onClick={onReset} disabled={isRunning}>
        Reset Tree
      </Button>
    </div>
  );
}
