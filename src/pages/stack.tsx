import StackVisualizer from "@/components/stack/StackVisualizer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/utils/iconmap";
const Stack = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <Button asChild variant="outline" className="mb-4">
        <Link to="/">
          <iconMap.ArrowLeft className="size-4 mr-2" />
          Back to Home
        </Link>
      </Button>
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Stack</h1>
      </div>
      <StackVisualizer />
    </div>
  );
};

export default Stack;
