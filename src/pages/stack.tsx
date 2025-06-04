import StackVisualizer from "@/components/stack/StackVisualizer";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
const Stack = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <Button asChild variant="outline" className="mb-4">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Stack</h1>
        </div>
        <StackVisualizer />
      </div>
    </div>
  );
};

export default Stack;
