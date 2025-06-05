import React from "react";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/context/iconmap";

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
        <iconMap.Play className="w-4 h-4" />
        {isTraversing ? "Traversing..." : "Traverse"}
      </Button>
      <Button
        onClick={onGetLength}
        variant="outline"
        className="flex items-center gap-2"
        disabled={isTraversing}
      >
        <iconMap.Hash className="w-4 h-4" />
        Get Length
      </Button>
      <Button
        onClick={onCheckEmpty}
        variant="outline"
        className="flex items-center gap-2"
        disabled={isTraversing}
      >
        <iconMap.CheckCircle className="w-4 h-4" />
        Check Empty
      </Button>
      <Button
        onClick={onClear}
        variant="outline"
        className="flex items-center gap-2"
        disabled={isTraversing}
      >
        <iconMap.RotateCcw className="w-4 h-4" />
        Clear All
      </Button>
    </div>
  );
};

export default ActionButtons;
