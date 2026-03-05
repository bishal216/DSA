import { StackControls } from "@/components/data-structures/stack/stack-controls";
import { StackStepDisplay } from "@/components/data-structures/stack/stack-step-display";
import { StackVisualizer } from "@/components/data-structures/stack/stack-visualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStack } from "@/hooks/use-stack";
import { Separator } from "../../components/ui/separator";

export default function StackPage() {
  const {
    inputValue,
    setInputValue,
    steps,
    currentStep,
    isRunning,
    displayStep,
    onStart,
    reset,
  } = useStack();

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      {/* Page header */}
      <div className="flex flex-col gap-2 text-center text-dark">
        <h1 className="text-2xl font-bold ">Stack</h1>
        <p className="text-smmt-1">
          A Last-In, First-Out (LIFO) data structure. Elements are pushed onto
          and popped from the top.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Left — visualizer */}
        <Card className="flex flex-col">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Stack Visualizer</CardTitle>
          </CardHeader>
          <CardContent>
            <StackVisualizer nodes={displayStep.nodes} />
          </CardContent>
        </Card>

        {/* Right — controls */}
        <Card className="flex flex-col gap-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <StackControls
              inputValue={inputValue}
              setInputValue={setInputValue}
              isRunning={isRunning}
              onStart={onStart}
              onReset={reset}
            />
            <Separator> </Separator>
            <StackStepDisplay
              step={displayStep}
              currentStep={currentStep}
              totalSteps={steps.length}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
