import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PushPopControls = ({
  inputValue,
  setInputValue,
  handlePush,
  handlePop,
  handlePeek,
  isAnimating,
}: {
  inputValue: string;
  setInputValue: (v: string) => void;
  handlePush: () => void;
  handlePop: () => void;
  handlePeek: () => void;
  isAnimating: boolean;
}) => (
  <div className="space-y-3">
    <div className="flex gap-2">
      <Input
        placeholder="Enter value"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={isAnimating}
      />
      <Button onClick={handlePush} disabled={isAnimating} variant="outline">
        Push
      </Button>
    </div>
    <Button
      onClick={handlePop}
      disabled={isAnimating}
      variant="outline"
      className="w-full"
    >
      Pop
    </Button>
    <Button
      onClick={handlePeek}
      disabled={isAnimating}
      variant="outline"
      className="w-full"
    >
      Peek
    </Button>
  </div>
);

export default PushPopControls;
