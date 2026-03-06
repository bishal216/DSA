import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HashStep,
  HashTableType,
  SlotState,
} from "@/data-structures/hash-table";
import { cn } from "@/utils/helpers";

interface Props {
  step: HashStep;
  message?: string;
}

const TYPE_LABELS: Record<HashTableType, string> = {
  linear: "Linear Probing",
  quadratic: "Quadratic Probing",
  double: "Double Hashing",
  chaining: "Separate Chaining",
};

// ── Slot state styling ────────────────────────────────────────────────────────

const SLOT_STYLES: Record<
  SlotState,
  { cell: string; text: string; ring: string }
> = {
  idle: { cell: "bg-muted", text: "text-muted-foreground", ring: "" },
  occupied: {
    cell: "bg-card",
    text: "text-foreground",
    ring: "ring-1 ring-border",
  },
  deleted: {
    cell: "bg-muted",
    text: "text-muted-foreground line-through",
    ring: "ring-1 ring-dashed ring-border",
  },
  probing: {
    cell: "bg-warning/15",
    text: "text-warning",
    ring: "ring-1 ring-warning",
  },
  found: {
    cell: "bg-success/15",
    text: "text-success",
    ring: "ring-2 ring-success",
  },
  notFound: {
    cell: "bg-destructive/10",
    text: "text-destructive",
    ring: "ring-2 ring-destructive",
  },
  inserted: {
    cell: "bg-success/15",
    text: "text-success",
    ring: "ring-2 ring-success",
  },
  rehashing: {
    cell: "bg-info/15",
    text: "text-info",
    ring: "ring-1 ring-info",
  },
  hashed: {
    cell: "bg-primary-light",
    text: "text-primary",
    ring: "ring-1 ring-primary",
  },
};

const LEGEND: [SlotState, string][] = [
  ["occupied", "Occupied"],
  ["probing", "Probing"],
  ["found", "Found"],
  ["notFound", "Not Found"],
  ["inserted", "Inserted"],
  ["deleted", "Deleted"],
  ["rehashing", "Rehashing"],
];

const LEGEND_STYLES: Record<string, { bg: string; border: string }> = {
  occupied: { bg: "bg-card", border: "border-border" },
  probing: { bg: "bg-warning/15", border: "border-warning" },
  found: { bg: "bg-success/15", border: "border-success" },
  notFound: { bg: "bg-destructive/10", border: "border-destructive" },
  inserted: { bg: "bg-success/15", border: "border-success" },
  deleted: { bg: "bg-muted", border: "border-border" },
  rehashing: { bg: "bg-info/15", border: "border-info" },
};

// ── Open addressing view ──────────────────────────────────────────────────────

function OpenView({ step }: { step: HashStep }) {
  const slots = step.slots ?? [];
  const isHash = (i: number) => i === step.hashIndex;

  return (
    <div className="flex flex-col gap-1 w-full max-w-xs mx-auto">
      {slots.map((slot) => {
        const s = SLOT_STYLES[slot.state];
        const highlight = isHash(slot.index);
        return (
          <div key={slot.index} className="flex items-center gap-2">
            {/* Index */}
            <span
              className={cn(
                "w-8 text-right text-xs font-mono font-semibold shrink-0",
                highlight ? "text-primary" : "text-muted-foreground",
              )}
            >
              {slot.index}
            </span>

            {/* Hash arrow */}
            <span
              className={cn(
                "w-4 text-center text-xs shrink-0 transition-opacity",
                highlight ? "opacity-100 text-primary" : "opacity-0",
              )}
            >
              →
            </span>

            {/* Slot cell */}
            <div
              className={cn(
                "flex-1 flex items-center justify-center h-8 rounded font-mono text-sm font-semibold transition-all duration-300",
                s.cell,
                s.ring,
                highlight && slot.state === "idle"
                  ? "ring-2 ring-primary ring-offset-1"
                  : "",
              )}
            >
              <span className={s.text}>
                {slot.key === null ? (
                  <span className="text-xs font-normal opacity-40">empty</span>
                ) : slot.state === "deleted" ? (
                  <span className="text-xs">DEL</span>
                ) : (
                  slot.key
                )}
              </span>
            </div>

            {/* Probe badge */}
            {slot.state === "probing" && (
              <span className="text-xs text-warning font-mono w-4 shrink-0">
                ↓
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Chaining view ─────────────────────────────────────────────────────────────

function ChainingView({ step }: { step: HashStep }) {
  const buckets = step.buckets ?? [];
  const isHash = (i: number) => i === step.hashIndex;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {buckets.map((bucket) => {
        const highlight = isHash(bucket.index);
        const bucketS = SLOT_STYLES[bucket.state];
        return (
          <div key={bucket.index} className="flex items-center gap-2">
            {/* Index */}
            <span
              className={cn(
                "w-8 text-right text-xs font-mono font-semibold shrink-0",
                highlight ? "text-primary" : "text-muted-foreground",
              )}
            >
              {bucket.index}
            </span>

            {/* Arrow */}
            <span
              className={cn(
                "w-4 text-center text-xs shrink-0 transition-opacity",
                highlight ? "opacity-100 text-primary" : "opacity-0",
              )}
            >
              →
            </span>

            {/* Bucket head */}
            <div
              className={cn(
                "w-8 h-8 flex items-center justify-center rounded border-2 shrink-0 transition-all duration-300",
                bucket.chain.length > 0
                  ? bucketS.cell
                  : "bg-muted border-dashed border-border",
                highlight
                  ? "border-primary"
                  : bucket.chain.length === 0
                    ? ""
                    : "border-border",
              )}
            >
              <span className="text-xs font-mono text-muted-foreground">
                {bucket.chain.length > 0 ? "▸" : "∅"}
              </span>
            </div>

            {/* Chain nodes */}
            <div className="flex items-center gap-1 flex-wrap">
              {bucket.chain.map((node, j) => {
                const ns = SLOT_STYLES[node.state];
                return (
                  <div key={j} className="flex items-center gap-1">
                    {j > 0 && (
                      <span className="text-xs text-muted-foreground">→</span>
                    )}
                    <div
                      className={cn(
                        "h-8 min-w-[2rem] px-2 flex items-center justify-center rounded font-mono text-sm font-semibold transition-all duration-300",
                        ns.cell,
                        ns.ring,
                      )}
                    >
                      <span className={ns.text}>{node.key}</span>
                    </div>
                  </div>
                );
              })}
              {bucket.chain.length === 0 && (
                <span className="text-xs text-muted-foreground font-mono ml-1">
                  null
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Stats bar ─────────────────────────────────────────────────────────────────

function StatsBar({ step }: { step: HashStep }) {
  const loadFactor = step.count / step.tableSize;
  const threshold = step.tableType === "chaining" ? 1.0 : 0.7;
  const pct = Math.min(loadFactor / threshold, 1);

  return (
    <div className="flex items-center gap-3 text-xs font-mono text-muted-foreground">
      <span>
        size: <strong className="text-foreground">{step.tableSize}</strong>
      </span>
      <span>
        keys: <strong className="text-foreground">{step.count}</strong>
      </span>
      <span>
        λ:{" "}
        <strong
          className={cn(
            pct > 0.85
              ? "text-destructive"
              : pct > 0.6
                ? "text-warning"
                : "text-success",
          )}
        >
          {loadFactor.toFixed(2)}
        </strong>
      </span>
      <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            pct > 0.85
              ? "bg-destructive"
              : pct > 0.6
                ? "bg-warning"
                : "bg-success",
          )}
          style={{ width: `${pct * 100}%` }}
        />
      </div>
      <span className="text-muted-foreground/60">rehash @ λ={threshold}</span>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function HashTableVisualizer({ step, message }: Props) {
  const isChaining = step.tableType === "chaining";

  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>{TYPE_LABELS[step.tableType]}</CardTitle>
        {message && (
          <p className="text-sm text-muted-foreground min-h-[1.25rem]">
            {message}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <StatsBar step={step} />

        <div className="bg-muted rounded-lg p-4 overflow-auto">
          {isChaining ? <ChainingView step={step} /> : <OpenView step={step} />}
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-3">
          {LEGEND.map(([state, label]) => {
            const c = LEGEND_STYLES[state];
            return (
              <div key={state} className="flex items-center gap-1.5">
                <div
                  className={cn("w-3 h-3 rounded border-2", c.bg, c.border)}
                />
                <span className="text-xs text-muted-foreground">{label}</span>
              </div>
            );
          })}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-primary font-mono">→</span>
            <span className="text-xs text-muted-foreground">Hash target</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
