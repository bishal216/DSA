import { StackNode, StackNodeState } from "@/data-structures/stack";
import { cn } from "@/utils/helpers";

interface Props {
  nodes: StackNode[];
}

const STATE_STYLES: Record<
  StackNodeState,
  { bg: string; border: string; text: string; label: string }
> = {
  idle: { bg: "#F8FAFC", border: "#CBD5E1", text: "#334155", label: "" },
  top: { bg: "#FAF5FF", border: "#A855F7", text: "#6B21A8", label: "TOP" },
  active: { bg: "#FFFBEB", border: "#F59E0B", text: "#92400E", label: "→" },
  pushing: { bg: "#F0FDF4", border: "#22C55E", text: "#14532D", label: "PUSH" },
  popping: { bg: "#FFF1F2", border: "#F43F5E", text: "#9F1239", label: "POP" },
  peeking: { bg: "#EFF6FF", border: "#3B82F6", text: "#1E40AF", label: "PEEK" },
};

export function StackVisualizer({ nodes }: Props) {
  const reversed = [...nodes].reverse();

  return (
    <div className="flex flex-col items-center w-full h-full min-h-[400px] select-none">
      {/* Stack container */}
      <div className="relative flex flex-col items-center w-full max-w-[280px] flex-1">
        {/* Side rails */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] pointer-events-none"
          style={{ height: "calc(100% - 2px)" }}
        >
          {/* Left rail */}
          <div
            className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #CBD5E1 20%)",
            }}
          />
          {/* Right rail */}
          <div
            className="absolute right-0 top-0 bottom-0 w-[3px] rounded-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent, #CBD5E1 20%)",
            }}
          />
          {/* Base plate */}
          <div
            className="absolute bottom-0 left-0 right-0 h-[6px] rounded-full"
            style={{ background: "#CBD5E1" }}
          />
        </div>

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-end pb-8 gap-2">
            <div
              className="text-sm font-mono text-slate-400 px-8 py-4 rounded-lg border-2 border-dashed"
              style={{ borderColor: "#CBD5E1" }}
            >
              empty stack
            </div>
          </div>
        )}

        {/* Nodes — rendered bottom-to-top */}
        {nodes.length > 0 && (
          <div className="flex-1 flex flex-col items-center justify-end w-full pb-2 gap-[3px]">
            {reversed.map((node) => {
              const style = STATE_STYLES[node.state];
              const isAnimated =
                node.state === "pushing" || node.state === "popping";

              return (
                <div
                  key={node.id}
                  className={cn(
                    "w-[200px] h-[48px] flex items-center justify-between px-4",
                    "rounded-md border-2 font-mono font-semibold text-base",
                    "transition-all duration-300",
                    isAnimated && "scale-105 shadow-lg",
                  )}
                  style={{
                    backgroundColor: style.bg,
                    borderColor: style.border,
                    color: style.text,
                    boxShadow:
                      node.state !== "idle"
                        ? `0 0 0 3px ${style.border}22, 0 4px 12px ${style.border}33`
                        : undefined,
                  }}
                >
                  <span className="text-lg">{node.value}</span>
                  {style.label && (
                    <span
                      className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded"
                      style={{
                        backgroundColor: `${style.border}22`,
                        color: style.border,
                      }}
                    >
                      {style.label}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-6">
        {(
          [
            ["top", "Top"],
            ["pushing", "Pushing"],
            ["popping", "Popping"],
            ["peeking", "Peeking"],
          ] as [StackNodeState, string][]
        ).map(([state, label]) => {
          const s = STATE_STYLES[state];
          return (
            <div key={state} className="flex items-center gap-1.5">
              <div
                className="w-3 h-3 rounded border-2"
                style={{ backgroundColor: s.bg, borderColor: s.border }}
              />
              <span className="text-xs text-slate-500">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
