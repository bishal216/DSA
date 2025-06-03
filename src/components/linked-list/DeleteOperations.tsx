import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";

interface DeleteOperationsProps {
  deleteValue: string;
  setDeleteValue: (value: string) => void;
  deletePosition: string;
  setDeletePosition: (value: string) => void;
  onDelete: () => void;
  onDeleteAtPosition: () => void;
  onDeleteFirst: () => void;
  onDeleteLast: () => void;
  isTraversing: boolean;
}

const DeleteOperations: React.FC<DeleteOperationsProps> = ({
  deleteValue,
  setDeleteValue,
  deletePosition,
  setDeletePosition,
  onDelete,
  onDeleteAtPosition,
  onDeleteFirst,
  onDeleteLast,
  isTraversing,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trash2 className="w-5 h-5" />
          Delete Operations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Delete by value */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Input
            placeholder="Delete value"
            aria-label="Delete value"
            value={deleteValue}
            onChange={(e) => setDeleteValue(e.target.value)}
            type="number"
            disabled={isTraversing}
            className="sm:basis-2/3"
          />
          <Button
            onClick={onDelete}
            variant="outline"
            className="sm:basis-1/3"
            disabled={isTraversing}
          >
            Delete
          </Button>
        </div>

        {/* Delete by position */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Input
            placeholder="Delete at position"
            aria-label="Delete at position"
            value={deletePosition}
            onChange={(e) => setDeletePosition(e.target.value)}
            type="number"
            disabled={isTraversing}
            className="sm:basis-2/3"
          />
          <Button
            onClick={onDeleteAtPosition}
            variant="outline"
            className="sm:basis-1/3"
            disabled={isTraversing}
          >
            Delete
          </Button>
        </div>

        {/* Delete First/Last */}
        <p className="text-md font-semibold mt-2 mb-2">Delete First/Last</p>
        <div className="flex gap-2">
          <Button
            onClick={onDeleteFirst}
            variant="outline"
            className="flex-1"
            disabled={isTraversing}
          >
            Delete First
          </Button>
          <Button
            onClick={onDeleteLast}
            variant="outline"
            className="flex-1"
            disabled={isTraversing}
          >
            Delete Last
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeleteOperations;
