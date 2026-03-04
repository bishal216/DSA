import { Button } from "@/components/ui/button";

const UtilityControls = ({
  handleClear,
  handleGetLength,
  handleCheckEmpty,
  isAnimating,
}: {
  handleClear: () => void;
  handleGetLength: () => void;
  handleCheckEmpty: () => void;
  isAnimating: boolean;
}) => (
  <div className="space-y-3">
    <Button
      onClick={handleGetLength}
      variant="outline"
      className="w-full"
      disabled={isAnimating}
    >
      Get Size
    </Button>
    <Button
      onClick={handleCheckEmpty}
      variant="outline"
      className="w-full"
      disabled={isAnimating}
    >
      Check Empty
    </Button>
    <Button
      onClick={handleClear}
      variant="outline"
      className="w-full"
      disabled={isAnimating}
    >
      Clear
    </Button>
  </div>
);

export default UtilityControls;
