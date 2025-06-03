import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import ReduxCollapsible from "@/components/ui/collapsible-card";

interface InsertOperationsProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  insertPosition: string;
  setInsertPosition: (value: string) => void;
  onInsert: () => void;
  onAppend: () => void;
  isTraversing: boolean;
}

const InsertOperations: React.FC<InsertOperationsProps> = ({
  inputValue,
  setInputValue,
  insertPosition,
  setInsertPosition,
  onInsert,
  onAppend,
  isTraversing,
}) => {
  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handlePositionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInsertPosition(e.target.value);
  };

  return (
    <ReduxCollapsible title="Insert Operations">
      <CardContent className="space-y-4">
        <div className="flex flex-col">
          <p className="text-sm text-gray-400">Use append to add to end.</p>
          <div className="flex items-center gap-2 mb-2">
            <Input
              placeholder="Enter Value"
              value={inputValue}
              onChange={handleValueChange}
              type="number"
              disabled={isTraversing}
              className="w-full"
              aria-label="Value to insert"
            />
            <Button
              onClick={onAppend}
              variant="outline"
              className="flex-1"
              disabled={isTraversing}
              aria-label="Append value to the end"
            >
              Append
            </Button>
          </div>
          <hr className="border-magenta-600 my-8 h-[2px]" />

          <p className="text-sm text-gray-400">
            Use insert to insert at given index.
          </p>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Value"
              value={inputValue}
              onChange={handleValueChange}
              type="number"
              disabled={isTraversing}
              className="w-full"
              aria-label="Value to insert"
            />

            <Input
              placeholder="0"
              value={insertPosition}
              onChange={handlePositionChange}
              type="number"
              disabled={isTraversing}
              aria-label="Position to insert at"
            />
            <Button
              onClick={onInsert}
              className="flex-1"
              disabled={isTraversing}
              variant="outline"
              aria-label="Insert value at position"
            >
              Insert
            </Button>
          </div>
        </div>
      </CardContent>
    </ReduxCollapsible>
  );
};

export default InsertOperations;
