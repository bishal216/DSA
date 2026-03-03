// src/components/search/SearchAlgorithmSelector.tsx

import {
  SEARCH_ALGORITHMS,
  type SearchAlgorithmKey,
} from "@/algorithms/types/searching-algorithms-registry";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchAlgorithmSelectorProps {
  algorithm: SearchAlgorithmKey;
  setAlgorithm: (algorithm: SearchAlgorithmKey) => void;
  disabled?: boolean;
}

export function SearchAlgorithmSelector({
  algorithm,
  setAlgorithm,
  disabled,
}: SearchAlgorithmSelectorProps) {
  return (
    <div>
      <Label htmlFor="algorithm">Algorithm</Label>
      <Select
        value={algorithm}
        onValueChange={setAlgorithm}
        disabled={disabled ?? false}
      >
        <SelectTrigger id="algorithm" className="mt-1">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(SEARCH_ALGORITHMS).map((def) => (
            <SelectItem key={def.key} value={def.key}>
              {def.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
