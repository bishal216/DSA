import React from "react";
import { Button } from "@/components/ui/button";
import { RotateCcw, Play, Hash, CheckCircle } from "lucide-react";

interface ActionButtonsProps {
  onTraverse: () => void;
  onGetLength: () => void;
  onCheckEmpty: () => void;
  onClear: () => void;
  isTraversing: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onTraverse,
  onGetLength,
  onCheckEmpty,
  onClear,
  isTraversing,
}) => {
  return (
    <div className="flex justify-center gap-4 flex-wrap">
      <Button
        onClick={onTraverse}
        disabled={isTraversing}
        variant="outline"
        className="flex items-center gap-2"
      >
        <Play className="w-4 h-4" />
        {isTraversing ? "Traversing..." : "Traverse"}
      </Button>
      <Button
        onClick={onGetLength}
        variant="outline"
        className="flex items-center gap-2"
        disabled={isTraversing}
      >
        <Hash className="w-4 h-4" />
        Get Length
      </Button>
      <Button
        onClick={onCheckEmpty}
        variant="outline"
        className="flex items-center gap-2"
        disabled={isTraversing}
      >
        <CheckCircle className="w-4 h-4" />
        Check Empty
      </Button>
      <Button
        onClick={onClear}
        variant="outline"
        className="flex items-center gap-2"
        disabled={isTraversing}
      >
        <RotateCcw className="w-4 h-4" />
        Clear All
      </Button>
    </div>
  );
};

export default ActionButtons;
