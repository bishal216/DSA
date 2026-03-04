// src/components/algorithms/SortVisualizer.tsx

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCallback, useMemo } from "react";

// ── Bar color priority (first match wins) ─────────────────────────────────────
// Order matters: sorted > pivot > comparing > swapping > merging > flip >
//                partition > divide > insert > bucket-assign > unsorted

function getBarColor(index: number, step: SortingStep | undefined): string {
  if (!step) return "bg-blue-500";
  if (step.sorted?.includes(index)) return "bg-emerald-500";
  if (step.pivot === index) return "bg-purple-500";
  if (step.comparing?.includes(index)) return "bg-yellow-400";
  if (step.swapping?.includes(index)) return "bg-red-500";
  if (step.merging?.includes(index)) return "bg-orange-400";

  if (step.stepType === "flip" && step.swapping?.includes(index))
    return "bg-pink-500";

  if (
    (step.stepType === "partition" || step.stepType === "divide") &&
    step.activeSublistLeft?.includes(index)
  )
    return "bg-teal-400";

  if (step.stepType === "bucket-assign" && step.comparing?.includes(index))
    return "bg-amber-400";

  if (step.stepType === "count" && step.comparing?.includes(index))
    return "bg-cyan-400";

  if (step.stepType === "insert" && step.comparing?.includes(index))
    return "bg-sky-400";

  return "bg-blue-500";
}

function getBarRing(index: number, step: SortingStep | undefined): string {
  if (!step) return "";
  if (step.activeSublistLeft?.includes(index))
    return "ring-2 ring-inset ring-pink-500";
  if (step.activeSublistRight?.includes(index))
    return "ring-2 ring-inset ring-amber-500";
  return "";
}

// ── Legend ────────────────────────────────────────────────────────────────────
const LEGEND_ITEMS = [
  { label: "Unsorted", bg: "bg-blue-500", ring: "" },
  { label: "Comparing", bg: "bg-yellow-400", ring: "" },
  { label: "Swapping", bg: "bg-red-500", ring: "" },
  { label: "Merging", bg: "bg-orange-400", ring: "" },
  { label: "Pivot", bg: "bg-purple-500", ring: "" },
  { label: "Flip", bg: "bg-pink-500", ring: "" },
  { label: "Insert", bg: "bg-sky-400", ring: "" },
  { label: "Sorted", bg: "bg-emerald-500", ring: "" },
  {
    label: "Active (left)",
    bg: "bg-blue-500",
    ring: "ring-2 ring-inset ring-pink-500",
  },
  {
    label: "Active (right)",
    bg: "bg-blue-500",
    ring: "ring-2 ring-inset ring-amber-500",
  },
];

// ── Bucket display ────────────────────────────────────────────────────────────
function BucketDisplay({ step }: { step: SortingStep | undefined }) {
  if (!step?.buckets || step.buckets.length === 0) return null;

  const allValues = step.buckets.flat();
  if (allValues.length === 0) return null;
  const localMax = Math.max(...allValues, 1);

  return (
    <div className="mt-4 rounded-lg bg-muted p-3">
      <p className="text-xs text-muted-foreground mb-2 font-medium">
        Buckets
        {step.bucketIndex !== undefined && (
          <span className="ml-2 text-amber-500">
            (active: bucket {step.bucketIndex})
          </span>
        )}
      </p>
      <div className="flex gap-1 items-end h-16">
        {step.buckets.map((bucket, bIdx) => (
          <div
            key={bIdx}
            className="flex-1 flex flex-col gap-px items-center justify-end"
          >
            <div
              className={`w-full rounded-t-sm transition-all duration-200 ${
                bIdx === step.bucketIndex ? "bg-amber-400" : "bg-slate-400"
              }`}
              style={{
                height:
                  bucket.length > 0
                    ? `${Math.max((bucket.length / localMax) * 100, 10)}%`
                    : "2px",
              }}
            />
            <span className="text-[10px] text-muted-foreground">{bIdx}</span>
          </div>
        ))}
      </div>
      <p className="text-[11px] text-muted-foreground mt-1">
        {step.buckets.map((b, i) => `${i}:[${b.join(",")}]`).join("  ")}
      </p>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface SortVisualizerProps {
  array: ArrayElement[];
  steps: SortingStep[];
  currentStep: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export function SortVisualizer({
  array,
  steps,
  currentStep,
}: SortVisualizerProps) {
  const currentStepData = steps[currentStep];

  const maxValue = useMemo(
    () => Math.max(...array.map((e) => e.value), 1),
    [array],
  );

  const barWidthStyle = useMemo(
    () => ({ width: `${Math.max(100 / array.length - 0.25, 0.5)}%` }),
    [array.length],
  );

  const getColor = useCallback(
    (index: number) => getBarColor(index, currentStepData),
    [currentStepData],
  );

  const getRing = useCallback(
    (index: number) => getBarRing(index, currentStepData),
    [currentStepData],
  );

  return (
    <Card className="lg:col-span-3">
      <CardHeader>
        <CardTitle>Visualization</CardTitle>
        {currentStepData?.message && (
          <p className="text-sm text-muted-foreground min-h-[1.25rem]">
            {currentStepData.message}
          </p>
        )}
      </CardHeader>

      <CardContent>
        {/* ── Main bar chart ── */}
        <div className="h-96 flex items-end justify-center gap-px p-4 bg-muted rounded-lg">
          {array.length === 0 ? (
            <p className="text-center text-muted-foreground self-center">
              Generate an array to begin visualization.
            </p>
          ) : (
            array.map((element, index) => (
              <div
                key={element.id}
                className={`
                  transition-all duration-150 ease-in-out rounded-t-sm
                  ${getColor(index)}
                  ${getRing(index)}
                `}
                style={{
                  height: `${Math.max((element.value / maxValue) * 100, 2)}%`,
                  ...barWidthStyle,
                }}
                title={`Value: ${element.value}, Index: ${index}`}
              >
                {array.length <= 20 && (
                  <div className="text-xs text-white font-bold text-center pt-1 select-none">
                    {element.value}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* ── Bucket display (bucket / radix / counting sort) ── */}
        <BucketDisplay step={currentStepData} />

        {/* ── Legend ── */}
        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm">
          {LEGEND_ITEMS.map(({ label, bg, ring }) => (
            <div key={label} className="flex items-center gap-1.5">
              <div className={`size-3.5 rounded-sm ${bg} ${ring}`} />
              <span className="text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
