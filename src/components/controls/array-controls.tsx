// src/components/algorithms/ArrayControls.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { RotateCcw, Shuffle } from "lucide-react";
import React, { useState } from "react";

type Tab = "random" | "custom";

interface ArrayControlsProps {
  arraySize: number;
  setArraySize: (size: number) => void;
  onReset: () => void;
  onShuffle: () => void;
  onCustomArray: (values: number[]) => void;
  disabled?: boolean;
}

export const ArrayControls: React.FC<ArrayControlsProps> = ({
  arraySize,
  setArraySize,
  onReset,
  onShuffle,
  onCustomArray,
  disabled = false,
}) => {
  const [activeTab, setActiveTab] = useState<Tab>("random");
  const [customInput, setCustomInput] = useState("");
  const [inputError, setInputError] = useState<string | null>(null);

  const handleCustomSubmit = () => {
    const parts = customInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length === 0) {
      setInputError("Enter at least one number.");
      return;
    }

    const parsed = parts.map(Number);

    if (parsed.some(isNaN)) {
      setInputError("Only numbers separated by commas.");
      return;
    }

    if (parsed.some((n) => n <= 0)) {
      setInputError("All values must be positive.");
      return;
    }

    setInputError(null);
    setCustomInput("");
    onCustomArray(parsed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCustomSubmit();
  };

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Array Input</label>

      {/* Tab switcher */}
      <div className="flex rounded-md border border-border overflow-hidden">
        {(["random", "custom"] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            disabled={disabled}
            className={`
              flex-1 py-1.5 text-xs font-medium capitalize transition-colors
              ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-primary-foreground hover:bg-muted"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "random" ? (
        <div className="space-y-3">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-xs text-muted-foreground">Size</span>
              <span className="text-xs font-mono font-medium">{arraySize}</span>
            </div>
            <Slider
              value={[arraySize]}
              onValueChange={([val]) => setArraySize(val)}
              min={5}
              max={50}
              step={1}
              disabled={disabled}
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={onShuffle}
              variant="primary"
              size="sm"
              className="flex-1"
              disabled={disabled}
            >
              <Shuffle className="size-3.5 mr-1.5" />
              Shuffle
            </Button>
            <Button
              onClick={onReset}
              variant="dark"
              size="sm"
              className="flex-1"
              disabled={disabled}
            >
              <RotateCcw className="size-3.5 mr-1.5" />
              Reset
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              placeholder="5, 3, 8, 1, 9"
              value={customInput}
              onChange={(e) => {
                setCustomInput(e.target.value);
                setInputError(null);
              }}
              onKeyDown={handleKeyDown}
              disabled={disabled}
              className="text-sm h-8"
            />
            <Button
              onClick={handleCustomSubmit}
              disabled={disabled || !customInput.trim()}
              variant="primary"
              size="sm"
              className="shrink-0"
            >
              Set
            </Button>
          </div>
          {inputError ? (
            <p className="text-xs text-destructive">{inputError}</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Comma-separated positive integers
            </p>
          )}
        </div>
      )}
    </div>
  );
};
