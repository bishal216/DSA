// src/components/algorithms/SortAlgorithmSelector.tsx
import {
  SORTING_ALGORITHMS,
  SortingAlgorithmKey,
} from "@/algorithms/types/sorting-algorithms-registry";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface SortAlgorithmSelectorProps {
  algorithm: SortingAlgorithmKey;
  setAlgorithm: (algo: SortingAlgorithmKey) => void;
  disabled?: boolean;
}

export const SortAlgorithmSelector: React.FC<SortAlgorithmSelectorProps> = ({
  algorithm,
  setAlgorithm,
  disabled = false,
}) => {
  return (
    <div>
      <label className="text-sm font-medium">Algorithm</label>
      <Select
        value={algorithm}
        onValueChange={setAlgorithm}
        disabled={disabled}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(SORTING_ALGORITHMS).map(([key, { name }]) => (
            <SelectItem key={key} value={key}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
