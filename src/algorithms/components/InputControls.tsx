import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface InputControlsProps {
  text: string;
  pattern: string;
  onTextChange: (text: string) => void;
  onPatternChange: (pattern: string) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const InputControls = ({
  text,
  pattern,
  onTextChange,
  onPatternChange,
  speed,
  onSpeedChange,
}: InputControlsProps) => {
  const presetTexts = [
    { name: "Default", text: "ABABDABACDABABCABCABCABCABC" },
    { name: "DNA Sequence", text: "ATCGATCGATCGATCGATCGATCG" },
    { name: "Lorem Ipsum", text: "LOREMIPSUMDOLORSITAMET" },
    { name: "Binary", text: "1010110101011010101101" },
  ];

  const presetPatterns = [
    { name: "Default", pattern: "ABABCABC" },
    { name: "Short", pattern: "ABC" },
    { name: "Long", pattern: "ABCABC" },
    { name: "Single", pattern: "A" },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold text-slate-800 mb-4">
        Input Controls
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="text-input" className="text-sm font-medium">
              Text to Search In
            </Label>
            <Input
              id="text-input"
              value={text}
              onChange={(e) => onTextChange(e.target.value.toUpperCase())}
              className="mt-1 font-mono"
              placeholder="Enter text..."
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {presetTexts.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => onTextChange(preset.text)}
                  className="text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="pattern-input" className="text-sm font-medium">
              Pattern to Find
            </Label>
            <Input
              id="pattern-input"
              value={pattern}
              onChange={(e) => onPatternChange(e.target.value.toUpperCase())}
              className="mt-1 font-mono"
              placeholder="Enter pattern..."
            />
            <div className="flex flex-wrap gap-1 mt-2">
              {presetPatterns.map((preset) => (
                <Button
                  key={preset.name}
                  variant="outline"
                  size="sm"
                  onClick={() => onPatternChange(preset.pattern)}
                  className="text-xs"
                >
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">
              Animation Speed: {1100 - speed}ms delay
            </Label>
            <Slider
              value={[speed]}
              onValueChange={(value) => onSpeedChange(value[0])}
              max={1000}
              min={100}
              step={100}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-1">
              <span>Fast</span>
              <span>Slow</span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-lg">
            <h4 className="font-medium text-slate-700 mb-2">Legend</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-200 border border-green-400 rounded"></div>
                <span>Found matches</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-200 border border-blue-400 rounded"></div>
                <span>Current match</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-200 border border-red-400 rounded"></div>
                <span>Mismatch</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-100 border border-slate-400 rounded"></div>
                <span>Current window</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
