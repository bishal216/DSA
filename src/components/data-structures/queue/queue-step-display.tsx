import { QueueStep } from "@/data-structures/queue";
import { cn } from "@/utils/helpers";

interface Props {
  step: QueueStep;
  currentStep: number;
  totalSteps: number;
}

const OP_CLASSES = {
  enqueue: {
    badge: "bg-success/10 text-success border-success",
    result: "bg-success/10 border-success text-success",
    label: "ENQUEUE",
  },
  dequeue: {
    badge: "bg-destructive/10 text-destructive border-destructive",
    result: "bg-destructive/10 border-destructive text-destructive",
    label: "DEQUEUE",
  },
  peek: {
    badge: "bg-info/10 text-info border-info",
    result: "bg-info/10 border-info text-info",
    label: "PEEK",
  },
  init: {
    badge: "bg-muted text-muted-foreground border-border",
    result: "bg-muted border-border text-muted-foreground",
    label: "IDLE",
  },
};

export function QueueStepDisplay({ step, currentStep, totalSteps }: Props) {
  const meta = step.metadata;
  const opStyle = meta ? OP_CLASSES[meta.operation] : OP_CLASSES.init;

  return (
    <div className="rounded-md border border-border divide-y divide-border">
      {/* Badge + step counter */}
      <div className="flex items-center justify-between px-3 py-2">
        <span
          className={cn(
            "text-[11px] font-bold tracking-widest px-2 py-0.5 rounded-full border",
            opStyle.badge,
          )}
        >
          {opStyle.label}
        </span>
        {totalSteps > 1 && (
          <span className="text-xs font-mono text-muted-foreground">
            {currentStep + 1} / {totalSteps}
          </span>
        )}
      </div>

      {/* Message */}
      <div className="px-3 py-2">
        <p className="text-sm font-semibold font-mono text-foreground">
          {step.message}
        </p>
        {step.subMessage && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {step.subMessage}
          </p>
        )}
      </div>

      {meta && (
        <>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-muted-foreground">Size</span>
            <span className="text-xs font-mono font-semibold tabular-nums">
              {meta.size}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-muted-foreground">Front</span>
            <span className="text-xs font-mono font-semibold tabular-nums">
              {meta.frontValue !== undefined ? meta.frontValue : "—"}
            </span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-xs text-muted-foreground">Rear</span>
            <span className="text-xs font-mono font-semibold tabular-nums">
              {meta.rearValue !== undefined ? meta.rearValue : "—"}
            </span>
          </div>
          {meta.result !== undefined && (
            <div
              className={cn(
                "px-3 py-2 flex items-center justify-between rounded-b-md",
                opStyle.result,
              )}
            >
              <span className="text-xs font-semibold">Return value</span>
              <span className="text-xs font-mono font-bold">{meta.result}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
}
