import { useState } from "react";
import { StringMatchingVisualizer } from "@/algorithms/components/StringMatchingVisualizer";
import { AlgorithmSelector } from "@/algorithms/components/AlgorithmSelector";
import { InputControls } from "@/algorithms/components/InputControls";
import { AlgorithmInfo } from "@/algorithms/components/AlgorithmInfoStr";

const StringMatchingPage = () => {
  const [text, setText] = useState("ABABDABACDABABCABCABCABCABC");
  const [pattern, setPattern] = useState("ABABCABC");
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "naive" | "kmp" | "boyer-moore"
  >("naive");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 mb-4">
            String Matching Algorithm Visualizer
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Explore how different string matching algorithms work with
            interactive step-by-step visualization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <InputControls
              text={text}
              pattern={pattern}
              onTextChange={setText}
              onPatternChange={setPattern}
              speed={speed}
              onSpeedChange={setSpeed}
            />

            <StringMatchingVisualizer
              text={text}
              pattern={pattern}
              algorithm={selectedAlgorithm}
              isPlaying={isPlaying}
              speed={speed}
              onPlayingChange={setIsPlaying}
            />
          </div>

          <div className="space-y-6">
            <AlgorithmSelector
              selectedAlgorithm={selectedAlgorithm}
              onAlgorithmChange={setSelectedAlgorithm}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />

            <AlgorithmInfo algorithm={selectedAlgorithm} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StringMatchingPage;
