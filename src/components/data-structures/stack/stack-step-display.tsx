import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StackStep } from "@/data-structures/stack";

interface Props {
  step: StackStep;
  currentStep: number;
  totalSteps: number;
}

export function StackStepDisplay({ step, currentStep, totalSteps }: Props) {
  const meta = step.metadata;

  return (
    <Card className="border-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          {meta?.operation?.toUpperCase() || "IDLE"}
          {totalSteps > 1 && (
            <span className="text-xs font-mono text-slate-400">
              Step {currentStep + 1} of {totalSteps}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0 flex flex-col gap-4">
        {/* Message */}
        <div>
          <p className="text-sm font-semibold text-slate-700 font-mono">
            {step.message}
          </p>
          {step.subMessage && (
            <p className="text-xs text-slate-500 mt-0.5">{step.subMessage}</p>
          )}
        </div>

        {/* Metadata grid */}
        {meta && (
          <div className="grid grid-cols-2 gap-2">
            {meta.result !== undefined && (
              <div className="col-span-2 rounded-lg p-2.5 flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  Return value
                </span>
                <span className="text-base font-bold font-mono">
                  {meta.result}
                </span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
