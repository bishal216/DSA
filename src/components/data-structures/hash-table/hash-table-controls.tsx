// HashTableControls.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import type { HashTableType } from "@/data-structures/hash-table";
import type { HashOperation } from "@/hooks/use-hash-table";

interface Props {
  inputValue: string;
  setInputValue: (v: string) => void;
  isRunning: boolean;
  tableType: HashTableType;
  onStart: (op: HashOperation) => void;
  onReset: () => void;
}

const COMPLEXITY: Record<HashTableType, [string, string, string][]> = {
  linear: [
    ["insert", "O(1)*", "O(n) worst"],
    ["search", "O(1)*", "O(n) worst"],
    ["delete", "O(1)*", "tombstone"],
  ],
  quadratic: [
    ["insert", "O(1)*", "O(n) worst"],
    ["search", "O(1)*", "O(n) worst"],
    ["delete", "O(1)*", "tombstone"],
  ],
  double: [
    ["insert", "O(1)*", "O(n) worst"],
    ["search", "O(1)*", "O(n) worst"],
    ["delete", "O(1)*", "tombstone"],
  ],
  chaining: [
    ["insert", "O(1)*", "O(n) worst"],
    ["search", "O(1)*", "O(n) worst"],
    ["delete", "O(1)*", "O(n) worst"],
  ],
};

export function HashTableControls({
  inputValue,
  setInputValue,
  isRunning,
  tableType,
  onStart,
  onReset,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium">Key (integer)</label>
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g. 42"
          className="font-mono"
          disabled={isRunning}
          type="number"
          min="0"
        />
      </div>

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
            variant="info"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("search")}
          >
            Search
          </Button>
          <Button
            variant="destructive"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("delete")}
          >
            Delete
          </Button>
          <Button
            variant="secondary"
            size="sm"
            disabled={isRunning}
            onClick={() => onStart("rehash")}
          >
            Rehash
          </Button>
        </div>
      </div>

      <Button variant="outline" onClick={onReset} disabled={isRunning}>
        Reset Table
      </Button>

      <Separator />

      <div className="rounded-md border border-border divide-y divide-border">
        {COMPLEXITY[tableType].map(([op, avg, worst]) => (
          <div key={op} className="flex items-center justify-between px-3 py-2">
            <span className="text-xs font-mono text-muted-foreground">
              {op}
            </span>
            <div className="flex flex-col items-end">
              <span className="text-xs font-mono font-semibold text-success">
                {avg}
              </span>
              <span className="text-xs font-mono text-muted-foreground/60">
                {worst}
              </span>
            </div>
          </div>
        ))}
        <div className="px-3 py-2">
          <span className="text-xs text-muted-foreground">
            * amortised average case
          </span>
        </div>
      </div>
    </div>
  );
}
