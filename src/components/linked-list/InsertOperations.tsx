import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

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
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Insert Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="number"
            disabled={isTraversing}
            className="flex-grow-[2]"
          />
          <Input
            placeholder="Position (optional)"
            value={insertPosition}
            onChange={(e) => setInsertPosition(e.target.value)}
            type="number"
            disabled={isTraversing}
            className="flex-grow"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={onInsert}
            className="flex-1"
            disabled={isTraversing}
            variant="outline"
          >
            Insert
          </Button>
          <Button
            onClick={onAppend}
            variant="outline"
            className="flex-1"
            disabled={isTraversing}
          >
            Append
          </Button>
        </div>
        <p className="text-sm text-gray-400">
          Leave position blank to insert at start. Use append to add to end.
        </p>
      </CardContent>
    </Card>
  );
};

export default InsertOperations;
