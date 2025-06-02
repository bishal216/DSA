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
        <div className="flex gap-2">
          <Input
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            type="number"
            disabled={isTraversing}
          />
          <Input
            placeholder="Position (optional)"
            value={insertPosition}
            onChange={(e) => setInsertPosition(e.target.value)}
            type="number"
            className="w-32"
            disabled={isTraversing}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={onInsert} className="flex-1" disabled={isTraversing}>
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
      </CardContent>
    </Card>
  );
};

export default InsertOperations;
