import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LinkedListOperation } from "@/hooks/use-linked-list";
import type { ListType } from "@/types/types";

interface Props {
  inputValue: string;
  setInputValue: (v: string) => void;
  positionInput: string;
  setPositionInput: (v: string) => void;
  isRunning: boolean;
  listType: ListType;
  onStart: (op: LinkedListOperation) => void;
  onReset: () => void;
}

export function LinkedListControls({
  inputValue,
  setInputValue,
  positionInput,
  setPositionInput,
  isRunning,
  listType,
  onStart,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Shared inputs */}
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Value</label>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="e.g. 42"
            className="font-mono"
            disabled={isRunning}
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium">Index</label>
          <Input
            value={positionInput}
            onChange={(e) => setPositionInput(e.target.value)}
            placeholder="e.g. 0"
            className="font-mono"
            disabled={isRunning}
            type="number"
            min={0}
          />
        </div>
      </div>

      {/* Insert */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Insert</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="success"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("insertHead")}
          >
            Head
          </Button>
          <Button
            variant="success"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("insertTail")}
          >
            Tail
          </Button>
          <Button
            variant="success"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("insertAt")}
          >
            At Index
          </Button>
        </div>
      </div>

      {/* Delete */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Delete</label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="destructive"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("deleteByValue")}
          >
            By Value
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("deleteAt")}
          >
            At Index
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Search</label>
        <Button
          variant="info"
          disabled={isRunning}
          onClick={() => onStart("search")}
        >
          Search by Value
        </Button>
      </div>

      {/* Traverse */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Traverse</label>
        <div className={listType === "doubly" ? "grid grid-cols-2 gap-2" : ""}>
          <Button
            variant="secondary"
            disabled={isRunning}
            onClick={() => onStart("traverse")}
            className={listType === "doubly" ? "" : "w-full"}
          >
            Head → Tail
          </Button>
          {listType === "doubly" && (
            <Button
              variant="secondary"
              disabled={isRunning}
              onClick={() => onStart("reverseTraverse")}
            >
              Tail → Head
            </Button>
          )}
        </div>
      </div>

      <Button variant="outline" onClick={onReset} disabled={isRunning}>
        Reset List
      </Button>
    </div>
  );
}
