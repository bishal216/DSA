import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StackOperation } from "@/hooks/use-stack";

interface Props {
  inputValue: string;
  setInputValue: (v: string) => void;
  isRunning: boolean;
  onStart: (op: StackOperation) => void;
  onReset: () => void;
}

export function StackControls({
  inputValue,
  setInputValue,
  isRunning,
  onStart,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Value</label>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value..."
          className="font-mono"
          disabled={isRunning}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !isRunning) onStart("push");
          }}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Operations</label>
        <div className="grid grid-cols-3 gap-2">
          <Button
            variant="success"
            disabled={isRunning}
            onClick={() => onStart("push")}
          >
            Push
          </Button>
          <Button
            variant="destructive"
            disabled={isRunning}
            onClick={() => onStart("pop")}
          >
            Pop
          </Button>
          <Button
            variant="info"
            disabled={isRunning}
            onClick={() => onStart("peek")}
          >
            Peek
          </Button>
        </div>
      </div>

      <Button variant="outline" onClick={onReset} disabled={isRunning}>
        Reset Stack
      </Button>
    </div>
  );
}
