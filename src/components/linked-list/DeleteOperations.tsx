import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardContent } from "@/components/ui/card";
import ReduxCollapsible from "@/components/ui/collapsible-card";
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
    <ReduxCollapsible title="Delete Operations">
      <CardContent className="space-y-6">
        {/* Delete by value */}
        <p className="text-sm text-gray-400 mb-0">
          You can delete a node by its value.
        </p>
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
        <hr className="my-4" />
        {/* Delete by position */}
        <p className="text-sm text-gray-400 mb-0">
          You can delete a node at a specific index.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <Input
            placeholder="Delete at index"
            aria-label="Delete at index"
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
        <hr className="my-4" />
        {/* Delete First/Last */}
        <p className="text-sm text-gray-400 mb-0">
          You can delete the first or last node in the list.
        </p>
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
    </ReduxCollapsible>
  );
};

export default DeleteOperations;
