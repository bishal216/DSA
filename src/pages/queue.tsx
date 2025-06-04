import QueueVisualizer from "@/components/queue/QueueVisualizer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface QueuePageProps {
  title: string;
  queueType: "linear" | "deque" | "circular";
}
const Queue = ({ title, queueType }: QueuePageProps) => {
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
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        </div>
        <QueueVisualizer queueType={queueType} />
      </div>
    </div>
  );
};

export default Queue;
