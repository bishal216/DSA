import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QueueOperation } from "@/hooks/use-queue";
import type { QueueType } from "@/types/types";

interface Props {
  inputValue: string;
  setInputValue: (v: string) => void;
  isRunning: boolean;
  queueType: QueueType;
  onStart: (op: QueueOperation) => void;
  onReset: () => void;
}

export function QueueControls({
  inputValue,
  setInputValue,
  isRunning,
  queueType,
  onStart,
  onReset,
}: Props) {
  const isDeque = queueType === "deque";

  return (
    <div className="flex flex-col gap-4">
      {/* Input */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Value</label>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number..."
          className="font-mono"
          disabled={isRunning}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isRunning) onStart("enqueueRear");
          }}
        />
      </div>

      {/* Enqueue */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Enqueue</label>
        <div className={isDeque ? "grid grid-cols-2 gap-2" : ""}>
          <Button
            variant="success"
            disabled={isRunning}
            onClick={() => onStart("enqueueRear")}
            className={isDeque ? "" : "w-full"}
          >
            {isDeque ? "Add Rear" : "Enqueue"}
          </Button>
          {isDeque && (
            <Button
              variant="success"
              disabled={isRunning}
              onClick={() => onStart("enqueueFront")}
            >
              Add Front
            </Button>
          )}
        </div>
      </div>

      {/* Dequeue */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Dequeue</label>
        <div className={isDeque ? "grid grid-cols-2 gap-2" : ""}>
          <Button
            variant="destructive"
            disabled={isRunning}
            onClick={() => onStart("dequeueFront")}
            className={isDeque ? "" : "w-full"}
          >
            {isDeque ? "Remove Front" : "Dequeue"}
          </Button>
          {isDeque && (
            <Button
              variant="destructive"
              disabled={isRunning}
              onClick={() => onStart("dequeueRear")}
            >
              Remove Rear
            </Button>
          )}
        </div>
      </div>

      {/* Peek */}
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Peek</label>
        <div className={isDeque ? "grid grid-cols-2 gap-2" : ""}>
          <Button
            variant="info"
            disabled={isRunning}
            onClick={() => onStart("peekFront")}
            className={isDeque ? "" : "w-full"}
          >
            Peek Front
          </Button>
          {isDeque && (
            <Button
              variant="info"
              disabled={isRunning}
              onClick={() => onStart("peekRear")}
            >
              Peek Rear
            </Button>
          )}
        </div>
      </div>

      <Button variant="outline" onClick={onReset} disabled={isRunning}>
        Reset Queue
      </Button>
    </div>
  );
}
